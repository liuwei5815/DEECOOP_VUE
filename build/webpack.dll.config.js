'use strict'
const path = require("path")
const webpack = require("webpack")
const CleanWebpackPlugin = require('clean-webpack-plugin')
const AssetsPlugin = require('assets-webpack-plugin')
const packages = require('../package.json')
const vendorList = Object.keys(packages.dependencies).filter((item) => {
  return item.indexOf('normalize') < 0 && item != 'vue'
})
vendorList.unshift('vue/dist/vue.js')

console.log(vendorList)


module.exports = {
  // 你想要打包的模块的数组
  entry: {
    vendor: vendorList
  },
  output: {
    path: path.join(__dirname, '../static/js'), // 打包后文件输出的位置
    filename: 'dll.[name]_[chunkhash].js',
    library: '[name]_[chunkhash]'
  },
  plugins: [
    new webpack.DllPlugin({
      path: path.join(__dirname, '.', '[name]-manifest.json'),
      name: '[name]_[chunkhash]',
      context: __dirname
    }),
    new AssetsPlugin({  //
      filename: 'bundle-conf.json',
      path: __dirname
    }),
    // 压缩打包的文件
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
    new CleanWebpackPlugin(['static/js/*.js'],{root: __dirname,verbose: true,dry: false})
  ]
}
