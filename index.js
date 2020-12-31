const getLeadingComment = require('./src/getLeadingComment');
const setLeadingComment = require('./src/setLeadingComment');
const removeLodashImports = require('./src/removeLodashImports');
const addLodashMethodImports = require('./src/addLodashMethodImports');
const replaceSimpleLodashCalls = require('./src/replaceSimpleLodashCalls');
const replaceExplicitChainedLodashCalls = require('./src/replaceExplicitChainedLodashCalls');
const replaceConstructorChainedLodashCalls = require('./src/replaceConstructorChainedLodashCalls');

module.exports = function replaceLodashMethodPackages (fileInfo, api) {
  const j = api.jscodeshift;
  const ast = api.jscodeshift(fileInfo.source);

  const hasLodashImports = ast.find(j.ImportDeclaration, { source: { value: 'lodash' } }).size() > 0;
  if (!hasLodashImports) { return ast.toSource(); }

  const leadingComment = getLeadingComment(j, ast);
  removeLodashImports(j, ast);
  const simpleMethods = replaceSimpleLodashCalls(j, ast);
  const constructorChainedMethods = replaceConstructorChainedLodashCalls(j, ast); // _(array)
  const explicitChainedMethods = replaceExplicitChainedLodashCalls(j, ast); // _.chain(array)
  const replacements = {
    ...simpleMethods,
    ...constructorChainedMethods,
    ...explicitChainedMethods,
  };
  addLodashMethodImports(j, ast, replacements);
  setLeadingComment(j, ast, leadingComment);

  return ast.toSource();
};
