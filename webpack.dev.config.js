"use strict";

const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

module.exports = function(env, argv) {
  process.env["NODE_ENV"] = "development";

  return {
    mode: "development",
    entry: path.resolve(__dirname, "src/index.tsx"),
    output: {
      path: path.resolve(__dirname, "build"),
      // change the origin of source maps to local machine
      devtoolModuleFilenameTemplate: info =>
        path.resolve(info.absoluteResourcePath).replace(/\\/g, "/")
    },
    // loaders
    module: {
      rules: [
        {
          // typescript / javascript
          test: /\.(jsx?|tsx?)$/,
          exclude: /node_modules/,
          loader: "babel-loader"
        },
        {
          // css
          test: /\.css$/i,
          use: ["style-loader", "css-loader"]
        },
        {
          // assets
          test: /\.(png|svg|jpe?g|gif|woff2?|eot|ttf|otf)$/i,
          loader: "file-loader"
        }
      ]
    },
    resolve: {
      // add `.ts` and `.tsx` as resolvable extensions
      extensions: [".tsx", ".ts", ".js"],
      // allow for imports starting from baseUrl
      plugins: [new TsconfigPathsPlugin({ configFile: "tsconfig.json" })]
    },
    plugins: [
      // clean output directory when watching
      argv.watch && new CleanWebpackPlugin(),
      // load template html and inject main css and js
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, "src/index.html")
      }),
      // type check typescript synchronously to feed error log into overlay
      new ForkTsCheckerWebpackPlugin({ configFile: "tsconfig.json", async: false })
    ].filter(Boolean),
    // create source maps for development
    devtool: "cheap-module-source-map",
    // webpack-dev-server settings
    devServer: {
      // write output to disk when also watching
      writeToDisk: argv.watch,
      // overlay build errors in browser
      overlay: true,
      port: 3000,
      proxy: {
        "/api": "http://huppel.de.pup"
      }
    },
    watchOptions: {
      // ignore directories while watching for file changes
      ignored: /node_modules|build|dist/
    }
  };
};
