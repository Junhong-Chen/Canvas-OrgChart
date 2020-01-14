const path = require('path')
const webpack = require('webpack')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = {
  mode: 'production',
  entry: './src/canvas-orgchart.js',
  output: {
    filename: 'canvas-orgchart.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '',
    library: "CanvasOrgChart",
    libraryTarget: "umd",
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        enforce: 'pre',
        exclude: [
          /node_modules/,
          path.resolve(__dirname, 'canvas-orgchart.js')
        ],
        loader: 'eslint-loader',
      },
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env'
            ],
            plugins: [
              '@babel/plugin-transform-runtime',
              '@babel/plugin-proposal-class-properties'
            ]
          }
        },
        include: path.resolve(__dirname, 'src'),
        exclude: /node_modules/
      },
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new webpack.BannerPlugin('author: Junhong-Chen')
  ],
  devServer: {
    contentBase: './dist',
    port: 3000,
    progress: true,
    compress: false,
    open: false
  }
}