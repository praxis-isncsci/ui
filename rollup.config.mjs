import copyfiles from 'copyfiles';
import dts from 'rollup-plugin-dts';
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';

const demoDir = 'build';
const tsconfig = {
  paths: {
    '@app/*': ['src/app/*'],
    '@core/*': ['src/core/*'],
    '@testHelpers/*': ['src/testHelpers/*'],
    '@web/*': ['src/web/*'],
  },
};
const libraryInputs = {
  'app/index': 'src/app/index.ts',
  'app/providers/index': 'src/app/providers/index.ts',
  'app/providers/externalMessagePort.provider/index':
    'src/app/providers/externalMessagePort.provider/index.ts',
  'app/store/index': 'src/app/store/index.ts',
  'core/boundaries/index': 'src/core/boundaries/index.ts',
  'core/domain/index': 'src/core/domain/index.ts',
  'core/helpers/index': 'src/core/helpers/index.ts',
  'core/useCases/index': 'src/core/useCases/index.ts',
  'web/index': 'src/web/index.ts',
};
const formats = ['cjs', 'esm'];

const demoSiteConfig = {
  input: 'src/index.ts',
  output: {
    dir: `${demoDir}/scripts`,
    entryFileNames: 'bundle.js',
    format: 'esm',
    sourcemap: true,
  },
  plugins: [
    resolve(),
    typescript(tsconfig),
    {
      name: 'copy-assets',
      buildEnd(error) {
        if (error) {
          console.error(error);
        } else {
          copyfiles(['assets/**/*', demoDir], {up: 1}, (err) => {
            if (err) {
              console.error(err);
            } else {
              console.log(
                '\x1b[32m' +
                  `assets/**/* were copied to ${demoDir}` +
                  '\x1b[0m',
              );
            }
          });
          copyfiles(['assets/css/**/*.css', './dist/css'], {up: 2}, (err) => {
            if (err) {
              console.error(err);
            } else {
              console.log(
                '\x1b[32m' + `assets/**/* were copied to dist/css` + '\x1b[0m',
              );
            }
          });
          copyfiles(
            ['assets/icons/**/*.svg', './dist/icons'],
            {up: 2},
            (err) => {
              if (err) {
                console.error(err);
              } else {
                console.log(
                  '\x1b[32m' + `icons were copied to dist/icons/` + '\x1b[0m',
                );
              }
            },
          );
        }
      },
    },
  ],
};

const templateConfig = {
  input: 'src/web/praxisIsncsciAppLayout/appLayoutTemplate.ts',
  output: {
    dir: `${demoDir}/scripts`,
    entryFileNames: 'appLayoutTemplate.js',
    format: 'cjs',
    sourcemap: true,
  },
  plugins: [resolve(), typescript(tsconfig)],
};

const getConfig = ({output = {}, plugins = [], dir = './'}) => {
  return {
    input: Object.assign({}, libraryInputs),
    output: {
      dir,
      extend: output.format === 'iife',
      name: output.format === 'iife' ? 'window' : undefined,
      exports: 'named',
      sourcemap: true,
      ...output,
    },
    plugins: [resolve(), typescript(tsconfig), ...plugins],
  };
};

const getMappings = ({output = {}, plugins = [], dir = './'}) => {
  return {
    input: Object.assign({}, libraryInputs),
    plugins: [dts(), typescript(tsconfig), ...plugins],
    output: {
      dir,
      format: 'es',
      sourcemap: false,
      ...output,
    },
  };
};

const configs = formats.map((format) => {
  return {
    dir: `./dist/${format}`,
    output: {
      format,
      sourcemap: true,
    },
  };
});

// Generating the TS mappings is resource intensive, so we separate that work and from the rest of the build
export default process.env.MAPPINGS
  ? [
      ...formats.map((f) =>
        getMappings({
          dir: `./dist/${f}`,
        }),
      ),
    ]
  : [demoSiteConfig, ...configs.map((c) => getConfig(c)), templateConfig];
