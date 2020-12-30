const getLeadingComment = require('./src/getLeadingComment');
const setLeadingComment = require('./src/setLeadingComment');
const removeLodashImports = require('./src/removeLodashImports');
const addLodashMethodImports = require('./src/addLodashMethodImports');
const replaceSimpleLodashCalls = require('./src/replaceSimpleLodashCalls');
const replaceChainedLodashCalls = require('./src/replaceChainedLodashCalls');

module.exports = function replaceLodashMethodPackages (fileInfo, api) {
  const j = api.jscodeshift;
  const ast = api.jscodeshift(fileInfo.source);

  const hasLodashImports = ast.find(j.ImportDeclaration, { source: { value: 'lodash' } }).size() > 0;
  if (!hasLodashImports) { return ast.toSource(); }

  const leadingComment = getLeadingComment(j, ast);
  removeLodashImports(j, ast);
  const simpleMethods = replaceSimpleLodashCalls(j, ast);
  const chainedMethods = replaceChainedLodashCalls(j, ast);
  const replacements = { ...simpleMethods, ...chainedMethods };
  addLodashMethodImports(j, ast, replacements);
  setLeadingComment(j, ast, leadingComment);

  return ast.toSource();
};
