const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetWebpackPlugin = require('optimize-css-assets-webpack-plugin')
const TerserWebpackPlugin = require('terser-webpack-plugin')

module.exports = {
  context: path.resolve(__dirname, 'layout'),
  mode: 'development',
  entry: './js/index.js',
  output: {
    filename: 'js/bundle.js',
    path: path.resolve(__dirname, 'layout'),
  },
  optimization: {
    minimize: false,
    minimizer: [
      new OptimizeCssAssetWebpackPlugin(),
      new TerserWebpackPlugin()
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'styles/bundle.css'
    })
  ],
  module: {
    rules: [
      {
        test: /\.sass$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              url: false
            },
          },
          {
            loader: "sass-loader",
            options: {},
          },
        ],
      },
    ]
  }
}