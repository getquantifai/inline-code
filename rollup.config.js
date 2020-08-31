import typescript from '@rollup/plugin-typescript';
import postcss from 'rollup-plugin-postcss';
import { terser } from 'rollup-plugin-terser';
import svg from 'rollup-plugin-svg-import';

export default {
  input: 'src/index.ts',
  output: {
    dir: 'dist',
    format: 'cjs',
    exports: 'auto',
  },
  plugins: [
    svg({
      stringify: true,
    }),
    typescript({
      declaration: true,
      declarationDir: 'dist/',
      rootDir: 'src/',
    }),
    postcss({ plugins: [] }),
    terser(),
  ],
};
