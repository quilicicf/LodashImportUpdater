module.exports = (j, ast) => ast.find(j.Program).get('body', 0).node;
