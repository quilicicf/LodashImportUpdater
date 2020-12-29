// Copyright whateva

import _ from 'lodash';
import {
  get, map,
} from 'lodash';

const main = () => {
  _.map([ 1, 2, 3, 4, 5 ], (number) => number ** 2);

  _([ 1, 2, 3, 4, 5 ])
    .filter((number) => number % 2 === 0)
    .map((evenNumber) => evenNumber ** 2)
    .take(1)
    .value();
};

main();
