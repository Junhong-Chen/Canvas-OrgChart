const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const webpack = require('webpack')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')

module.exports = {
  mode: 'production', // 默认 production
  // entry: './src/index.js',
  entry: './src/canvas-orgchart.js',
  output: {
    // filename: 'bundle.js',
    filename: 'canvas-orgchart.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '',
    library: "CanvasOrgChart",
    libraryTarget: "umd",
  },
  module: {
    rules: [
      // {
      //   test: /\.html$/,
      //   use: 'html-loader'
      // },
      // {
      //   test: /\.(png|jpg|gif)$/,
      //   use: {
      //     loader: 'url-loader',
      //     options: {
      //       esModule: false,
      //       limit: 100 * 1024,
      //       outputPath: 'img/',
      //       publicPath: ''
      //     }
      //   }
      // },
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
      // {
      //   test: /\.css$/,
      //   use: [
      //     MiniCssExtractPlugin.loader,
      //     'css-loader'
      //   ]
      // },
    ]
  },
  plugins: [
    // new HtmlWebpackPlugin({
    //   template: './src/index.html',
    //   filename: 'index.html',
    //   hash: true,
    //   minify: {
    //     removeAttributeQuotes: true,
    //     collapseWhitespace: true
    //   },
    // }),
    // new MiniCssExtractPlugin({
    //   filename: 'css/index.css',
    // }),
    new CleanWebpackPlugin(),
    // new CopyPlugin([
    //   {
    //     from: 'public/images',
    //     to: 'images/',
    //   }
    // ]),
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