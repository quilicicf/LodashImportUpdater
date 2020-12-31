const _ = require('lodash');

const replaceAnyChainedLodashCall = require('./replaceAnyChainedLodashCall');

module.exports = (j, ast) => {
  const lodashUsages = _.get(ast.find(j.Identifier, { name: '_' }), [ '__paths' ]);
  return _(lodashUsages)
    .filter((usage) => usage.parent.value.type === 'MemberExpression')
    .filter((usage) => usage.parent.value.property.name === 'chain')
    .reduce(
      (seed, usage) => {
        const replacements = replaceAnyChainedLodashCall(j, usage);
        return { ...seed, ...replacements };
      },
      {},
    );
};
