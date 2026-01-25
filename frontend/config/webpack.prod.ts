import * as path from 'path';
import * as webpack from 'webpack';
import { merge } from 'webpack-merge';
import common from './webpack.common';

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

const configuration: webpack.Configuration = {
  mode: 'production',
  devtool: 'cheap-module-source-map',
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: '[name].[contenthash].js',
    publicPath: '/',
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
    ],
  },
  plugins: [new MiniCssExtractPlugin()],
  optimization: {
    usedExports: true,
    minimize: true,

    minimizer: [new CssMinimizerPlugin()],
    splitChunks: {
      chunks: 'all',
    },
  },
};

export default merge(common, configuration);
