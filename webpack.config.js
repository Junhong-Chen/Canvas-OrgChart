const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = {
  mode: 'development', // 默认 production
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: ''
  },
  module: {
    rules: [
      {
        test: /\.html$/,
        use: 'html-loader'
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: {
          loader: 'url-loader',
          options: {
            esModule: false,
            limit: 100 * 1024,
            outputPath: 'img/',
            publicPath: ''
          }
        }
      },
      {
        test: /\.js$/,
        enforce: 'pre',
        exclude: /node_modules/,
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
              "@babel/plugin-transform-runtime"
            ]
          }
        },
        include: path.resolve(__dirname, 'src'),
        exclude: /node_modules/
      },
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html',
      hash: true,
      minify: {
        removeAttributeQuotes: true,
        collapseWhitespace: true
      },
    }),
    new CleanWebpackPlugin(),
    new webpack.BannerPlugin('author: Junhong-Chen')
  ],
  devServer: {
    contentBase: './dist',
    port: 8080,
    progress: true,
    compress: false,
    open: false
  },
  // 此选项控制是否生成，以及如何生成 source-map。reference-link: https://www.webpackjs.com/configuration/devtool/
  devtool: 'source-map', // 这个配置('source-map')会将整个 source map 作为一个单独的文件生成，在生成环境中不建议使用
  watch: false, // 编译时监听文件变化，实时更新编译后的文件
  watchOptions: {
    poll: 1000,
    aggregateTimeout: 500,
    ignored: /node_modules/
  }
}