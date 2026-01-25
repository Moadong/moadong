import * as path from 'path';
import * as webpack from 'webpack';
import { merge } from 'webpack-merge';
import 'webpack-dev-server';
import detectPort from 'detect-port';
import common from './webpack.common';

const RefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

const DEFAULT_PORT = 3000;

async function getAvailablePort(defaultPort: number): Promise<number> {
  return await detectPort(defaultPort);
}

function createBuildLogger(port: number) {
  return {
    apply: (compiler) => {
      compiler.hooks.done.tap('done', (stats) => {
        if (stats.hasErrors()) {
          console.error('❌ Webpack Build Failed! Please check errors above.');
          console.error(stats.toJson().errors);
        } else if (stats.hasWarnings()) {
          console.warn('⚠️ Webpack Build Completed with Warnings.');
        } else {
          console.log(`
--------------------------------------------------------
🎉  WEBPACK BUILD SUCCESSFULLY COMPLETED!
✅  Files Generated: ${stats
            .toJson()
            .assets.map((asset) => asset.name)
            .join(', ')}
⏱️  Build Time: ${stats.endTime - stats.startTime} ms
🌐  Server Running at: http://localhost:${port}
--------------------------------------------------------
              `);
        }
      });
    },
  };
}

export default getAvailablePort(DEFAULT_PORT).then((port) => {
  console.log(`🚀 Using available port: ${port}`);

  const configuration: webpack.Configuration = {
    mode: 'development',
    devtool: 'inline-source-map',
    output: {
      path: path.resolve(__dirname, '../dist'),
      filename: '[name].bundle.js',
      publicPath: '/',
    },
    module: {
      rules: [
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
          include: [
            path.resolve(__dirname, '../node_modules/react-datepicker/dist'),
            path.resolve(__dirname, '../node_modules/swiper'),
          ],
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
          exclude: /node_modules/,
        },
      ],
    },
    plugins: [new RefreshWebpackPlugin(), createBuildLogger(port)],
    devServer: {
      port,
      open: true,
      historyApiFallback: true,
    },
    watchOptions: {
      ignored: /node_modules/,
    },
    stats: {
      all: false,
    },
  };

  return merge(common, configuration);
});
