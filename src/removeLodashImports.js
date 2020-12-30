module.exports = (j, ast) => {
  ast.find(j.ImportDeclaration, { source: { value: 'lodash' } })
    .forEach((importDeclaration) => j(importDeclaration).remove());
};
