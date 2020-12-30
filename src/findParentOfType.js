const recursiveFindParentOfType = (ast, type) => (
  ast.value.type === type ? ast : recursiveFindParentOfType(ast.parentPath, type)
);

module.exports = recursiveFindParentOfType;
