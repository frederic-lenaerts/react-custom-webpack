"use strict";

const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const WorkboxPlugin = require("workbox-webpack-plugin");

module.exports = function(env, argv) {
  process.env["NODE_ENV"] = "production";

  return {
    mode: "production",
    entry: path.resolve(__dirname, "src/index.tsx"),
    output: {
      path: path.resolve(__dirname, "build"),
      filename: "js/[name].[contenthash:8].js",
      chunkFilename: "js/[name].[contenthash:8].chunk.js"
    },
    // loaders
    module: {
      rules: [
        {
          // typescript
          test: /\.tsx?$/,
          exclude: /node_modules/,
          loader: "babel-loader"
        },
        {
          // css
          test: /\.css$/i,
          use: ["style-loader", MiniCssExtractPlugin.loader, "css-loader"]
        },
        {
          // images
          test: /\.(png|svg|jpe?g|jpeg|gif)$/i,
          loader: "file-loader",
          options: { name: "/images/[name].[contenthash:8].[ext]" }
        },
        {
          // fonts
          test: /\.(woff2?|eot|ttf|otf)$/i,
          loader: "file-loader",
          options: { name: "/fonts/[name].[contenthash:8].[ext]" }
        }
      ]
    },
    resolve: {
      // add `.ts` and `.tsx` as resolvable extensions
      extensions: [".tsx", ".ts", ".js"],
      // allow for imports starting from baseUrl
      plugins: [new TsconfigPathsPlugin({ configFile: "tsconfig.json" })],
      // better profiling with ReactDevTools
      alias: {
        "react-dom$": "react-dom/profiling",
        "scheduler/tracing": "scheduler/tracing-profiling"
      }
    },
    plugins: [
      // clean output directory
      new CleanWebpackPlugin(),
      // load template html, inject main css and js, and minify
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, "src/index.html"),
        minify: { collapseWhitespace: true }
      }),
      // extract css into seperate files
      new MiniCssExtractPlugin({
        filename: "css/[name].[contenthash:8].css",
        chunkFilename: "css/[name].[contenthash:8].chunk.css"
      }),
      // type check typescript
      new ForkTsCheckerWebpackPlugin({ configFile: "tsconfig.json" }),
      // generate a service worker to prefetch and cache assets
      new WorkboxPlugin.GenerateSW({
        clientsClaim: true,
        skipWaiting: true,
        importWorkboxFrom: "local",
        importsDirectory: "js",
      })
    ],
    // code splitting + minification
    optimization: {
      // decouple filename from load order => no changes == same filename
      moduleIds: "hashed",
      minimize: true,
      minimizer: [new TerserPlugin(), new OptimizeCSSAssetsPlugin()],
      // automatically split vendor and commons
      splitChunks: { chunks: "all" },
      // keep the runtime chunk separated to enable long term caching
      runtimeChunk: "single"
    }
  };
};
