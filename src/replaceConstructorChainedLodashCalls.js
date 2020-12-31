const _ = require('lodash');

const toLodashReplacement = require('./toLodashReplacement');
const replaceAnyChainedLodashCall = require('./replaceAnyChainedLodashCall');

module.exports = (j, ast) => {
  const lodashUsages = _.get(ast.find(j.Identifier, { name: '_' }), [ '__paths' ]);
  return _(lodashUsages)
    .filter((usage) => usage.parent.value.type === 'CallExpression')
    .reduce(
      (seed, usage) => {
        const replacements = replaceAnyChainedLodashCall(j, usage);
        return { ...seed, ...replacements };
      },
      toLodashReplacement('flow'), // Always used to replace chaining by constructor
    );
};
