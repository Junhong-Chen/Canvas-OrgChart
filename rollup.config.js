import babel from 'rollup-plugin-babel'
import serve from 'rollup-plugin-serve'

export default {
  input: 'src/canvas-orgchart.js',
  output: {
    file: 'packages/canvas-orgchart.js',
    format: 'esm',
    name: 'canvas-orgchart'
  },
  plugins: [
    babel({
      exclude: 'node_modules/**'
    }),
    serve({
      open: true,
      host: 'localhost',
      port: 3000,
    })
  ]
}