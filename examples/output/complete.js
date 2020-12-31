/*
 * Copyright whateva
 */

/* eslint-disable */
// Another comment, much useful, very wow

import each from 'lodash/each';

import filter from 'lodash/filter';
import flow from 'lodash/flow';
import map from 'lodash/map';
import reverse from 'lodash/reverse';
import sortBy from 'lodash/sortBy';
import take from 'lodash/take';

const main = () => {
  const singleCall = map([ 1, 2, 3, 4, 5 ], (number) => number ** 2);
  map([ 1, 2, 3, 4, 5 ], (number) => number ** 2);

  // Explicit chained call to variable
  const explicit = flow([
    _ => filter(_, (number) => number % 2 === 0),
    _ => map(_, (evenNumber) => evenNumber ** 2),
    _ => sortBy(_),
    _ => take(_, 1),
  ])([ 1, 2, 3, 4, 5 ]);

  // Explicit chained call
  flow([
    _ => filter(_, (number) => number % 2 === 0),
    _ => map(_, (evenNumber) => evenNumber ** 2),
    _ => sortBy(_),
    _ => take(_, 1),
  ])(explicit);

  // Standalone chained call
  flow([
    _ => filter(_, (number) => number % 2 === 0),
    _ => map(_, (evenNumber) => evenNumber ** 2),
    _ => take(_, 1),
    _ => reverse(_),
    _ => each(_, item => console.log(item)),
  ])([ 1, 2, 3, 4, 5 ]);

  // Chained call in variable declaration
  const whateva = flow([
    _ => filter(_, (number) => number % 2 === 0),
    _ => map(_, (evenNumber) => evenNumber ** 2),
    _ => take(_, 1),
  ])([ 1, 2, 3, 4, 5 ]);

  // Chained call in multiple variable declarations
  const toto = 1, whateva2 = flow([
    _ => filter(_, (number) => number % 2 === 0),
    _ => map(_, (evenNumber) => evenNumber ** 2),
    _ => take(_, 1),
  ])([ 1, 2, 3, 4, 5 ]), tata = 2;
};

main();
