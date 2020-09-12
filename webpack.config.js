const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const SassLintPlugin = require('sass-lint-webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const PugLintPlugin = require('puglint-webpack-plugin');
const networkInterfaces = require('os').networkInterfaces();

const config = {
  entry: {
    app: './src/app.ts'
  },
  output: {
    filename: "[name].[hash].bundle.js",
    path: path.resolve(__dirname, 'docs')
  },
  devServer: {
    host: '0.0.0.0',
    port: 8080,
    overlay: {
      warnings: false,
      errors: true
    },
    after: function(app, server, compiler) {
      // Iterate over interfaces ...
      for (var dev in networkInterfaces) {
        const iface = networkInterfaces[dev].filter(details => details.family === 'IPv4' && details.internal === false);
        if (iface.length > 0) console.log(`LAN access: ${iface[0].address}:${server.options.port}`);
      }
    }
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.pug',
      inject: true
    }),
    new MiniCssExtractPlugin({
      filename: '[name].[hash].css',
    }),
    new CleanWebpackPlugin(),
    new SassLintPlugin(),
    new PugLintPlugin({
      context: 'src',
      files: '**/*.pug',
      config: Object.assign({ emitError: true }, require('./.pug-lintrc'))
    })
  ],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          "ts-loader",
          {
            loader: "tslint-loader",
            options: {
              emitErrors: false,
              fix: true,
            }
          }
        ]
      },
      {
        test: /\.pug$/,
        loader: 'pug-loader?pretty=true'
      },
      {
        //IMAGE LOADER
        test: /\.(jpe?g|png|gif|svg|mp3)$/i,
        loader: 'file-loader',
        options: {
          name: '[name].[contenthash].[ext]'
        }
      },
      {
        test : /.css$|.scss$/,
        use: [
          // 'style-loader',
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader',
        ]
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[contenthash].[ext]',
          outputPath: 'fonts'
        }
      }
    ]
  }
};

module.exports = (env, argv) => {
  if (argv.mode === 'development') {}
  if (argv.mode === 'production') {
    // config.plugins[1] = new HtmlWebpackPlugin({ template: './src/index.pug', inject: false });
  }
  return config;
}
