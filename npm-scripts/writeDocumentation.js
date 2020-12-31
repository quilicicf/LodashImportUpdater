// const { minify } = require('uglify-es');
const Bundler = require('parcel-bundler');
const { default: fileSize } = require('filesize.js');
const { resolve: resolvePath } = require('path');
const { readFileSync, writeFileSync } = require('fs');

const ROOT_DIRECTORY = resolvePath(__dirname, '..');
const OUTPUT_FILE = resolvePath(ROOT_DIRECTORY, 'dist', 'output.js');
const EXAMPLES_DIRECTORY = resolvePath(ROOT_DIRECTORY, 'examples');
const EXAMPLES_INPUT_DIRECTORY = resolvePath(EXAMPLES_DIRECTORY, 'input');
const EXAMPLES_OUTPUT_DIRECTORY = resolvePath(EXAMPLES_DIRECTORY, 'output');

const BUNDLER_OPTIONS = {
  // outDir: EXAMPLES_OUTPUT_DIRECTORY,
  outFile: OUTPUT_FILE, // The name of the outputFile
  watch: false,
  contentHash: false, // Disable content hash from being included on the filename
  minify: true, // Minify files, enabled if process.env.NODE_ENV === 'production'
  // bundleNodeModules: true, // By default, package.json dependencies are not included when using 'node' or 'electron' with 'target' option above. Set to true to adds them to the bundle, false by default
  sourceMaps: false, // Enable or disable sourcemaps, defaults to enabled
  detailedReport: false,
};

const codeSize = (string) => {
  const bytesNumber = (new TextEncoder().encode(string)).length;
  return `\`${fileSize(bytesNumber)}\``;
};

const substituteInReadme = (input, values) => {
  const getStartMark = (key) => `<!-- 🔁: ${key} -->`;
  const endMark = '<!-- 🔁 -->';
  return Object.entries(values)
    .reduce(
      (seed, [ key, value ]) => {
        const startMark = getStartMark(key);
        const regex = new RegExp(`${startMark}.*?${endMark}`, 'g');
        return seed.replace(regex, `${startMark}${value}${endMark}`);
      },
      input,
    );
};

const getMinifiedSize = async (sourceCodePath, additionalOptions) => {
  const bundler = new Bundler(sourceCodePath, { ...BUNDLER_OPTIONS, ...additionalOptions });
  await bundler.bundle();
  const minifiedCode = readFileSync(OUTPUT_FILE, 'utf8');
  return codeSize(minifiedCode);
};

const main = async () => {

  const baseFile = resolvePath(EXAMPLES_INPUT_DIRECTORY, 'complete.js');
  const transformedFile = resolvePath(EXAMPLES_OUTPUT_DIRECTORY, 'complete.js');

  const minifiedInputSize = await getMinifiedSize(baseFile, { scopeHoist: false });
  const minifiedOutputSize = await getMinifiedSize(transformedFile, { scopeHoist: false });
  const minifiedInputSizeTreeShaken = await getMinifiedSize(baseFile, { scopeHoist: true });
  const minifiedOutputSizeTreeShaken = await getMinifiedSize(transformedFile, { scopeHoist: true });

  const readmeFile = resolvePath(ROOT_DIRECTORY, 'README.md');
  const readme = readFileSync(readmeFile, 'utf8');
  const substitutions = {
    minifiedInputSize,
    minifiedOutputSize,
    minifiedInputSizeTreeShaken,
    minifiedOutputSizeTreeShaken,
  };
  const updatedReadme = substituteInReadme(readme, substitutions);
  writeFileSync(readmeFile, updatedReadme, 'utf8');
};

main();
