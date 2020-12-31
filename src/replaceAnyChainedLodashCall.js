const findParent = require('./findParent');
const findParents = require('./findParents');
const processChainedCalls = require('./processChainedCalls');

module.exports = (j, usage) => {
  const chainCall = findParent(usage, (type) => type === 'CallExpression'); // _(array) || _.chain(array)
  const array = chainCall.value.arguments;

  const fullLodashExpressionPredicate = (type) => type === 'ExpressionStatement' || type === 'VariableDeclarator';
  const fullLodashExpression = findParent(usage, fullLodashExpressionPredicate);
  const chainedCalls = findParents(usage, (type) => type === 'CallExpression', fullLodashExpressionPredicate);

  const { calls, replacements } = processChainedCalls(j, chainedCalls);
  const flowCall = j.callExpression(
    j.callExpression(
      j.identifier('flow'),
      [ j.arrayExpression(calls) ],
    ),
    array,
  );
  if (fullLodashExpression.value.type === 'ExpressionStatement') {
    fullLodashExpression.value.expression = flowCall;
  } else if (fullLodashExpression.value.type === 'VariableDeclarator') {
    fullLodashExpression.value.init = flowCall;
  } else {
    throw Error(`Lodash chained call found in an unsupported statement type: ${fullLodashExpression.value.type}`);
  }

  return replacements;
};
