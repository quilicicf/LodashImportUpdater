const _ = require('lodash');

const findParentOfType = require('./findParentOfType');
const toLodashReplacement = require('./toLodashReplacement');

const processChainedCalls = (j, chainedCalls) => _(chainedCalls)
  .dropRight(1) // Remove constructor call
  .reverse() // Calls will be in an array in flow => natural order
  .filter((callExpression) => callExpression.value.callee.property.name !== 'value') // Chain call ending, un-necessary in flow expression
  .reduce(
    (seed, callExpression) => { // Example: .map(({ age }) => age)
      const lodashMethod = callExpression.value.callee.property; // Identifier, here: map
      const methodArguments = callExpression.value.arguments; // Array of Node, here: [ { age } => age ]
      const call = j.arrowFunctionExpression(
        [ j.identifier('_') ],
        j.callExpression(lodashMethod, [ j.identifier('_'), ...methodArguments ]),
      );

      return {
        calls: [ ...seed.calls, call ],
        replacements: { ...seed.replacements, ...toLodashReplacement(lodashMethod.name) },
      };
    },
    { calls: [], replacements: {} },
  );

module.exports = (j, ast) => {
  const lodashUsages = _.get(ast.find(j.Identifier, { name: '_' }), [ '__paths' ]);
  return _(lodashUsages)
    .filter((usage) => usage.parent.value.type === 'CallExpression')
    .reduce(
      (seed, usage) => {
        const constructorCall = usage.parent; // _(array)
        const array = constructorCall.value.arguments;

        const fullLodashExpression = findParentOfType(usage, 'ExpressionStatement');
        const chainedCalls = _.get(j(fullLodashExpression).find(j.CallExpression), [ '__paths' ]);

        const { calls, replacements } = processChainedCalls(j, chainedCalls);
        const flowCall = j.callExpression(
          j.callExpression(
            j.identifier('flow'),
            [ j.arrayExpression(calls) ],
          ),
          array,
        );
        j(fullLodashExpression).replaceWith(j.expressionStatement(flowCall));

        return { ...seed, ...replacements };
      },
      toLodashReplacement('flow'), // Always used to replace chaining by constructor
    );
};
