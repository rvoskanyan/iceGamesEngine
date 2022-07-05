import path from 'path';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CssMinimizerWebpackPlugin from 'css-minimizer-webpack-plugin';
import TerserWebpackPlugin from 'terser-webpack-plugin';
import {__dirname} from "./rootPathes.js";

export default {
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
      new CssMinimizerWebpackPlugin(),
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