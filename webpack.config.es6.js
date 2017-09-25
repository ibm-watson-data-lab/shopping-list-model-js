"use strict";

const path = require("path");

module.exports = {
  entry: "./src/index.js",
  output: {
    filename: "bundle.es6.js",
    path: path.resolve(__dirname, "dist"),
    library: "ShoppingListModel"
  }
};
