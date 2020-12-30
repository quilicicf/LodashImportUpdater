const recursiveFindParents = (ast, gatherPredicate, stopPredicate, seed) => {
  if (stopPredicate(ast.value.type)) { return seed; }
  if (gatherPredicate(ast.value.type)) { seed.push(ast); }
  return recursiveFindParents(ast.parentPath, gatherPredicate, stopPredicate, seed);
};

module.exports = (ast, gatherPredicate, stopPredicate) => recursiveFindParents(ast, gatherPredicate, stopPredicate, []);
