const _ = require('lodash');

const getFirstNode = (j, ast) => ast.find(j.Program).get('body', 0).node;

const saveLeadingComment = (j, ast) => _.get(getFirstNode(j, ast), [ 'comments' ]);

const reApplyLeadingComment = (j, ast, leadingComment) => {
  const firstNode = getFirstNode(j, ast);
  firstNode.comments = leadingComment;
};

const removeLodashImports = (j, ast) => {
  ast.find(j.ImportDeclaration, { source: { value: 'lodash' } })
    .forEach((importDeclaration) => j(importDeclaration).remove());
};

const replaceSimpleLodashCalls = (j, ast) => {
  const lodashUsages = _.get(ast.find(j.Identifier, { name: '_' }), [ '__paths' ]);
  return _(lodashUsages)
    .filter((usage) => usage.parent.value.type === 'MemberExpression')
    .reduce(
      (seed, usage) => {
        const member = usage.parent.value; // _.map
        const lodashMethod = member.property; // map
        const call = usage.parent.parent.value; // _.map(array, iteratee)
        call.callee = lodashMethod; // replace _.map => map
        return { ...seed, [ lodashMethod.name ]: `lodash/${lodashMethod.name}` };
      },
      {},
    );
};

const addLodashMethodImports = (j, ast, replacements) => {
  const firstDeclarationStatement = j(ast.find(j.Declaration).at(0).get());
  _.forEach(replacements, (value, key) => {
    firstDeclarationStatement.insertBefore(
      j.importDeclaration(
        [ j.importDefaultSpecifier(j.identifier(key)) ],
        j.stringLiteral(value),
        'value',
      ),
    );
  });
};

module.exports = function replaceLodashMethodPackages (fileInfo, api) {
  const j = api.jscodeshift;
  const ast = api.jscodeshift(fileInfo.source);

  // eslint-disable-next-line no-underscore-dangle
  const hasLodashImports = ast.find(j.ImportDeclaration, { source: { value: 'lodash' } }).size() > 0;

  if (!hasLodashImports) { return ast.toSource(); }

  const leadingComment = saveLeadingComment(j, ast);
  removeLodashImports(j, ast);
  const replacements = replaceSimpleLodashCalls(j, ast);
  addLodashMethodImports(j, ast, replacements);
  reApplyLeadingComment(j, ast, leadingComment);

  // const chainedCalls = lodashUsages.filter((usage) => usage.parent.value.type === 'CallExpression')

  console.log(replacements);

  return ast.toSource();
};
