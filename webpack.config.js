const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    options: path.join(__dirname, 'src', 'options', 'index.tsx'),
    content: path.join(__dirname, 'src', 'content.ts'),
    search: path.join(__dirname, 'src', 'search.ts'),
    storage: path.join(__dirname, 'src', 'storage.ts'),
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist')
  },
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.ts(x)?$/,
        loader: "ts-loader",
        exclude: /node_modules/,
      },
    ]
  },
  resolve: {
    extensions: [".js", ".tsx", ".ts"],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/options/options.html',
      filename: 'options.html'
    }),
  ],
  devtool: 'cheap-module-source-map' // これがないとUncaught EvalErrorになる
};
