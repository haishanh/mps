import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import json from 'rollup-plugin-json';
import pkg from './package.json';

export default [
  {
    input: 'index.js',
    output: [
      {
        name: 'mps',
        format: 'esm',
        file: pkg['module']
      },
      {
        name: 'mps',
        format: 'cjs',
        file: pkg['main']
      }
    ],
    plugins: [json(), resolve(), commonjs()]
  }
];
