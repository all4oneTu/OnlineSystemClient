'use strict'
const path = require('path')

function resolve (dir) {
  return path.join(__dirname, '.', dir)
}

module.exports = {
  module: {
    rules: [
      {
        test: /\.svg$/,
        use: [
          'vue-loader',
          'vue-svg-loader',
        ],
      },
    ],
  },
  context: path.resolve(__dirname, './'),
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      '@': resolve('src')
      },
    fallback: {
        "timers": require.resolve("timers-browserify"), // Thêm cấu hình fallback cho timers
    },
  }
}