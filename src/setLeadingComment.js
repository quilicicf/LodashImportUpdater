const getFirstNode = require('./getFirstNode');

module.exports = (j, ast, leadingComment) => {
  const firstNode = getFirstNode(j, ast);
  firstNode.comments = leadingComment;
};
