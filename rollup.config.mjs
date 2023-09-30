import copyfiles from 'copyfiles';
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';

const demoDir = 'build';
const tsconfig = {
  paths: {
    '@app/*': ['src/app/*'],
    '@core/*': ['src/core/*'],
    '@web/*': ['src/web/*'],
  },
};

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
        }
      },
    },
  ],
};

const getConfig = ({output = {}, plugins = [], dir = './'}) => {
  return {
    input: {
      'app/index': 'src/app/index.ts',
      'core/boundaries/index': 'src/core/boundaries/index.ts',
      'core/domain/index': 'src/core/domain/index.ts',
      'core/useCases/index': 'src/core/useCases/index.ts',
      'web/index': 'src/web/index.ts',
    },
    output: {
      dir,
      extend: output.format === 'iife',
      name: output.format === 'iife' ? 'window' : undefined,
      exports: 'named',
      ...output,
    },
    plugins: [resolve(), typescript(tsconfig), ...plugins],
  };
};

const configs = ['cjs', 'esm'].map((format) => {
  return {
    output: {
      entryFileNames: (file) =>
        file.name.replace('index', `${format}/index.js`),
      format,
      sourcemap: true,
    },
  };
});

export default [demoSiteConfig, ...configs.map((c) => getConfig(c))];
