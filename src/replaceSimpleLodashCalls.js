const _ = require('lodash');

const toLodashReplacement = require('./toLodashReplacement');

module.exports = (j, ast) => {
  const lodashUsages = _.get(ast.find(j.Identifier, { name: '_' }), [ '__paths' ]);
  return _(lodashUsages)
    .filter((usage) => usage.parent.value.type === 'MemberExpression')
    .reduce(
      (seed, usage) => {
        const member = usage.parent.value; // _.map
        const lodashMethod = member.property; // map
        const call = usage.parent.parent.value; // _.map(array, iteratee)
        call.callee = lodashMethod; // replace _.map => map
        return { ...seed, ...toLodashReplacement(lodashMethod.name) };
      },
      {},
    );
};
