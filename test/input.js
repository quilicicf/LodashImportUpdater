/*
 * Copyright whateva
 */

// Another comment, much useful, very wow

import _ from 'lodash';
import {
  get, map,
} from 'lodash';

const main = () => {
  const singleCall = _.map([ 1, 2, 3, 4, 5 ], (number) => number ** 2);
  _.map([ 1, 2, 3, 4, 5 ], (number) => number ** 2);

  // Explicit chained call to variable
  const explicit = _.chain([ 1, 2, 3, 4, 5 ])
    .filter((number) => number % 2 === 0)
    .map((evenNumber) => evenNumber ** 2)
    .sortBy()
    .take(1)
    .value();

  // Explicit chained call
  _.chain(explicit)
    .filter((number) => number % 2 === 0)
    .map((evenNumber) => evenNumber ** 2)
    .sortBy()
    .take(1)
    .value();

  // Standalone chained call
  _([ 1, 2, 3, 4, 5 ])
    .filter((number) => number % 2 === 0)
    .map((evenNumber) => evenNumber ** 2)
    .take(1)
    .reverse()
    .each(item => console.log(item));

  // Chained call in variable declaration
  const whateva = _([ 1, 2, 3, 4, 5 ])
    .filter((number) => number % 2 === 0)
    .map((evenNumber) => evenNumber ** 2)
    .take(1)
    .value();

  // Chained call in multiple variable declarations
  const toto = 1, whateva2 = _([ 1, 2, 3, 4, 5 ])
    .filter((number) => number % 2 === 0)
    .map((evenNumber) => evenNumber ** 2)
    .take(1)
    .value(), tata = 2;
};

main();
