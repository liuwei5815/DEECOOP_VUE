'use strict'
const chalk = require('chalk')
const path = require('path')
/*
 * 环境列表，第一个环境为默认环境
 * envName: 指明现在使用的环境
 * dirName: 打包的路径，只在build的时候有用
 * baseUrl: 这个环境下面的api 请求的域名
 * assetsPublicPath: 静态资源存放的域名，未指定则使用相对路径
 * */
/*
 使用方法示例：
 打包：
 打包dev环境：npm run build --dev
 打包test环境：npm run build --test
 打包pro环境：npm run build --pro
 本地运行：
 本地运行dev环境：npm run dev --dev
 本地运行test环境：npm run dev --test
 无【--xxx】参数，则默认为dev环境：npm run dev
 */
const ENV_LIST = [
  {
    //开发环境
    envName: 'dev',
    projectName: '开发环境',
    projectEnName: 'pro',
    dirName: 'dev',
    baseUrl: '/api/',
    assetsPublicPath:'/',
  },
  {
    //瓯海眼睛行业环境
    envName: 'ouhaiglasses',
    projectName: '瓯海眼睛行业',
    dirName: path.resolve(__dirname, '../dist'),
    baseUrl: 'https://web.ouhaicloud.com/',
    assetsPublicPath: '/',
    title: '瓯海眼镜行业云平台',
    favicon: '/src/views/login/ouhaiglasses/favicon.ico',
  },
  {
    //基础环境
    envName: 'pro',
    projectName: '瓯海云上企业',
    dirName: path.resolve(__dirname, '../dist'),
    baseUrl: 'https://web.ouhaicloud.com/',
    assetsPublicPath:'/',
    title: '瓯海云上企业',
    favicon: '/src/views/login/pro/favicon.ico',
  },
  {
    //洞头企业云管家
    envName: 'dongtou',
    projectName: '企业云管家',
    dirName: path.resolve(__dirname, '../dist'),
    baseUrl: 'https://web.ouhaicloud.com/',
    assetsPublicPath:'/',
    title: '企业云管家',
    favicon: '/src/views/login/dongtou/favicon.ico',
  },

]
const argv = JSON.parse(process.env.npm_config_argv).original || process.argv
console.log(argv)
const HOST_ENV = argv[2] ? argv[2].replace(/[^a-z]+/ig,"") : ''
const HOST_CONF = HOST_ENV  ? ENV_LIST.find(item => item.envName === HOST_ENV) : ENV_LIST[0]
process.env.BASE_API = HOST_CONF.baseUrl
process.env.ENV_NAME = HOST_CONF.projectEnName || HOST_CONF.envName
process.env.TITLE = HOST_CONF.title || '云上企业'
process.env.FAVICON_PATH = HOST_CONF.favicon || 'favicon.ico'
console.log(chalk.green('当前环境：<'+HOST_ENV+'>'))
console.log(chalk.green('当前环境对应的常量：'))
console.log(chalk.green('envName: '+HOST_CONF.envName))
console.log(chalk.green('projectName: '+HOST_CONF.projectName))
console.log(chalk.green('dirName: '+HOST_CONF.dirName))
console.log(chalk.green('baseUrl: '+HOST_CONF.baseUrl))
console.log(chalk.green('assetsPublicPath: '+HOST_CONF.assetsPublicPath))

module.exports.HOST_CONF = HOST_CONF
module.exports.ENV_LIST = ENV_LIST
