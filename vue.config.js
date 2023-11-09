const { defineConfig } = require('@vue/cli-service')
const webpack = require('webpack')
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin")

module.exports = defineConfig({
  chainWebpack: config => {
    config.module.rules.delete("svg");
  },
  transpileDependencies: true,
  configureWebpack: {
    plugins: [
      new NodePolyfillPlugin(),
      // new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
      new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery'
      })
    ],
    module: {
      rules: [
        {
          test: /\.svg$/, 
          loader: 'vue-svg-loader', 
        },
      ],
    }     
  },

  devServer: {
    // development server port 8000
    port: 8080,
    proxy: 'http://localhost:9527'
  },
  css: {
    loaderOptions: {
      less: {
        lessOptions: {
          modifyVars: {
            // 'primary-color': '#F5222D',
            // 'link-color': '#F5222D',
            // 'border-radius-base': '4px',
          },
          javascriptEnabled: true
        }
      }
    }
  },
 
    // disable source map in production
    productionSourceMap: false,
    lintOnSave: undefined,
    // babel-loader no-ignore node_modules/*
    // eslint-disable-next-line no-dupe-keys
    transpileDependencies: []
})

