const path = require('path');
const webpack = require('webpack');
const { VueLoaderPlugin } = require('vue-loader');

module.exports = {
  context: path.resolve(__dirname, 'src'),
  entry: './main.js',
  module: {
    rules: [
      // ... other rules
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              modules: {
                localIdentName: '[local]'
              }
            }
          }
        ]
      }
    ]
  },
  resolve: {
    alias: {
      vue: 'vue/dist/vue.esm-bundler'
    }
  },
  devServer: {
    static: path.join(__dirname, 'src'),
    compress: true,
    port: 8080
  },
  plugins: [
    new webpack.DefinePlugin({
      VUE_OPTIONS_API: true,
      VUE_PROD_DEVTOOLS: false
    }),
    new VueLoaderPlugin()
  ]
};
