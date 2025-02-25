import * as path from 'path';
import * as webpack from 'webpack';
import { merge } from 'webpack-merge';
const RefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
import 'webpack-dev-server';
import common from './webpack.common';
import detectPort from 'detect-port';

const DEFAULT_PORT = 3000;

async function getAvailablePort(defaultPort: number): Promise<number> {
  return await detectPort(defaultPort);
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
          exclude: /node_modules/,
        },
      ],
    },
    plugins: [
      new RefreshWebpackPlugin(),
      {
        apply: (compiler) => {
          compiler.hooks.done.tap('done', (stats) => {
            if (stats.hasErrors()) {
              console.error(
                '❌ Webpack Build Failed! Please check errors above.',
              );
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
      },
    ],
    devServer: {
      port, // 동적으로 설정된 포트 사용
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
