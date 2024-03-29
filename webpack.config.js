const path = require("path");

console.log(__dirname);

module.exports = {
  entry: {
    lobby: "./frontend/lobby/index.js",
    chat: "./frontend/chat/index.js",
    games: "./frontend/games/index.js",
  },
  output: {
    path: path.join(__dirname, "backend", "static", "scripts"),
    publicPath: "/backend/static/scripts",
    filename: "[name].js",
  },
  mode: "production",
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: { loader: "babel-loader" },
      },
    ],
  },
  resolve: {
    alias: {
      "@constants": path.resolve(__dirname, "constants"),
    },
  },
};
