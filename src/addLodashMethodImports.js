const _ = require('lodash');

module.exports = (j, ast, replacements) => {
  const firstDeclarationStatement = j(ast.find(j.Declaration).at(0).get());
  _(replacements)
    .toPairs()
    .sortBy()
    .forEach(([ key, value ]) => {
      firstDeclarationStatement.insertBefore(
        j.importDeclaration(
          [ j.importDefaultSpecifier(j.identifier(key)) ],
          j.stringLiteral(value),
          'value',
        ),
      );
    });
};
