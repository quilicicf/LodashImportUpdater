# LodashImportUpdater

> A script that updates JS files to use lighter lodash imports and reduce the bundle's size

<!-- TOC START -->

* [What it does](#what-it-does)
* [How to use it](#how-to-use-it)
* [How it does its thing](#how-it-does-its-thing)
* [Bundle size improvement](#bundle-size-improvement)
* [Support](#support)

<!-- TOC END -->

## What it does

It changes default lodash imports like:

```js
import _ from 'lodash';

_(array)
  .filter(predicate)
  .map(transformer)
  .value();
```

To method imports like:

```js
import filter from 'lodash/filter';
import flow from 'lodash/flow';
import map from 'lodash/map';

flow([
  (_) => filter(_, predicate),
  (_) => map(_, predicate),
])(array);
```

This allows tree-shaking to work efficiently and to shave off a good part of lodash from your app bundle, read [this article](https://www.blazemeter.com/blog/the-correct-way-to-import-lodash-libraries-a-benchmark) for more details.

## How to use it

```shell
npm install --global lodash-import-updater
update-lodash-imports "$GLOB_FOR_YOUR_SOURCE_CODE"
```

The glob is interpreted by [fast-glob](https://www.npmjs.com/package/fast-glob) if quoted, by your shell if not. This has impacts on how `**` is interpreted.

In your shell, `**` probably strictly means one folder of any name in the current location, this means that `update-lodash-imports folder/**/*.js` matches `folder/whatever/file.js` but not `folder/whatever.js` or `folder/subfolder/subsubfolder/whatever.js`.

With `fast-glob`, `**` means any directory recursively. This means that `update-lodash-imports 'folder/**/*/js'` matches all the following files `folder/whatever/file.js`, `folder/whatever.js`, and `folder/subfolder/subsubfolder/whatever.js`.

For more information on how the globs work, search for documentation on your shell's globbing system. For `fast-glob`, [the documentation is here](https://www.npmjs.com/package/fast-glob#pattern-syntax).

__:warning: Beware__ the transformed code probably won't follow your formatter/linter's rules. You should re-apply them afterwards with your usual tools (ex: `npx eslint --fix .`).

Example:

```shell
update-lodash-imports 'src/**/*.js'
```

## How it does its thing

It uses [JSCodeshift](https://github.com/facebook/jscodeshift) to parse your code to an AST, then applies a transformation and re-generates the source code from the new AST.

## Bundle size improvement

|                      | Legacy imports                                               | Method imports                                                |
| -------------------- | ------------------------------------------------------------ | ------------------------------------------------------------- |
| Without tree shaking | <!-- 🔁: minifiedInputSize -->`94.1 Kb`<!-- 🔁 -->           | <!-- 🔁: minifiedOutputSize -->`61.8 Kb`<!-- 🔁 -->           |
| With tree shaking    | <!-- 🔁: minifiedInputSizeTreeShaken -->`92.4 Kb`<!-- 🔁 --> | <!-- 🔁: minifiedOutputSizeTreeShaken -->`24.0 Kb`<!-- 🔁 --> |

## Support

This tool has been written with minimal effort, this means that no effort went into building a comprehensive test suite or checking compatibility for use in other OSes than the author's.

This tool therefore should work seamlessly on UNIX systems but there is no guarantee that it works on Windows.

PRs are welcome if someone intends to fix this.
