const _ = require('lodash');

const toLodashReplacement = require('./toLodashReplacement');

module.exports = (j, chainedCalls) => _(chainedCalls)
  .drop(1) // Remove constructor call
  .filter((callExpression) => (
    _.get(callExpression, [ 'value', 'callee', 'property', 'name' ]) !== 'value'
  )) // Chain call ending, un-necessary in flow expression
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
