import * as path from 'path';
import * as webpack from 'webpack';
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

const configuration: webpack.Configuration = {
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    alias: {
      '@': path.resolve(__dirname, '../src'),
    },
  },

  entry: './src/index',

  module: {
    rules: [
      {
        test: /\.(ts|tsx|js|jsx)$/,
        loader: 'esbuild-loader',
        options: {
          loader: 'tsx',
          target: 'es2015',
        },
        exclude: /node_modules/,
      },
      {
        test: /\.(png|jpe?g|svg)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'images/[hash][ext][query]',
        },
      },
    ],
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '..', 'public', 'index.html'),
    }),
    new Dotenv({
      path: './.env',
      systemvars: true,
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, '..', 'public'),
          to: path.resolve(__dirname, '..', 'dist'),
          globOptions: {
            ignore: ['**/index.html'],
          },
        },
      ],
    }),
    new ForkTsCheckerWebpackPlugin(),
  ],
};

export default configuration;
