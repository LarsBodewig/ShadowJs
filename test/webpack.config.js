const glob_entries = require("webpack-glob-entries");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const entries = glob_entries("./src/pages/**/*.js");
const pages = Object.keys(entries).map(
  (name) =>
    new HtmlWebpackPlugin({
      template: "./src/pages/" + name + "/template.html",
      filename: name + "/index.html",
      title: "[Test] " + name,
      chunks: [name],
    })
);
pages.push(
  new HtmlWebpackPlugin({
    template: "./src/overview.html",
    inject: false,
    filename: "index.html",
    templateParameters: { pages: Object.keys(entries) },
  })
);

module.exports = {
  mode: "development",
  entry: entries,
  output: {
    filename: "[name]/index.js",
    clean: true,
  },
  plugins: pages,
  devServer: {
    watchFiles: ["./src/**/*", "./public/**/*"],
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
};
