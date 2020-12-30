const _ = require('lodash');

const getFirstNode = require('./getFirstNode');

module.exports = (j, ast) => _.get(getFirstNode(j, ast), [ 'comments' ]);
