const recursiveFindParent = (ast, predicate) => (
  predicate(ast.value.type) ? ast : recursiveFindParent(ast.parentPath, predicate)
);

module.exports = recursiveFindParent;
