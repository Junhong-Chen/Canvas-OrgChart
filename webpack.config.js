const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const webpack = require('webpack')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')

module.exports = {
  mode: 'development', // 默认 production
  entry: './src/index.js',
  // entry: './src/canvas-orgchart.js',
  output: {
    filename: 'bundle.js',
    // filename: 'canvas-orgchart.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '',
    // library: "canvas-orgchart",
    // libraryTarget: "umd",
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
      // {
      //   test: /\.js$/,
      //   enforce: 'pre',
      //   exclude: /node_modules/,
      //   loader: 'eslint-loader',
      // },
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
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader'
        ]
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
    new MiniCssExtractPlugin({
      filename: 'css/index.css',
    }),
    new CleanWebpackPlugin(),
    new CopyPlugin([
      {
        from: 'public/images',
        to: 'images/',
      }
    ]),
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
  // devtool: 'source-map', // 这个配置('source-map')会将整个 source map 作为一个单独的文件生成，在生成环境中不建议使用
  watch: false, // 编译时监听文件变化，实时更新编译后的文件
  watchOptions: {
    poll: 1000,
    aggregateTimeout: 500,
    ignored: /node_modules/
  }
}