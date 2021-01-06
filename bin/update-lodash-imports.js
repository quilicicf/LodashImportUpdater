#!/usr/bin/env node

const { sync } = require('fast-glob');
const jsCodeShift = require('jscodeshift');
const { SingleBar, Presets } = require('cli-progress');
const { resolve: resolvePath } = require('path');
const { readFileSync, writeFileSync } = require('fs');

const script = require('../index');

const main = () => {
  const cwd = process.cwd();
  const [ glob ] = process.argv.slice(2);

  const filePaths = sync(glob);
  process.stdout.write(`Running on ${filePaths.length} file(s):\n * ${filePaths.join('\n * ')}\n\n`);

  const progressBar = new SingleBar({}, Presets.shades_classic);
  progressBar.start(filePaths.length, 0);

  filePaths.forEach((fileRelativePath, index) => {
    const filePath = resolvePath(cwd, fileRelativePath);
    const source = readFileSync(filePath, 'utf8');

    const newSource = script({ source, path: filePath }, { jscodeshift: jsCodeShift });
    progressBar.update(index + 1);
    writeFileSync(filePath, newSource, 'utf8');
  });

  progressBar.stop();
  process.stdout.write('\n');
};

try {
  main();
  process.stdout.write('All the files were updated!\n');
} catch (error) {
  process.stderr.write(`The script ended with error '${error.message}:'\n${error.stack}\n`);
}
