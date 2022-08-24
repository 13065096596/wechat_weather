/*
 * @Descripttion: 
 * @version: 
 * @Author: 937bb
 * @Date: 2022-08-24 22:14:10
 * @LastEditors: 937bb
 * @LastEditTime: 2022-08-24 23:32:18
 */
const log4js = require('log4js');

log4js.configure({
  replaceConsole: true,
  appenders: {
    out: {
      type: 'console'
    }, //控制台输出
    all: {
      type: 'dateFile',
      filename: 'logs/all_logs/all',
      pattern: 'yyyy-MM-dd.log',
      encoding: 'utf8',
      alwaysIncludePattern: true,
      // daysToKeep: 10
    },
    debug: { //debug日志
      type: 'dateFile',
      filename: 'logs/debug_logs/debug', // 首先手动建好目录，写入日志文件的路径
      //maxLogSize: 1024,
      // 只在 type: 'file' 中才支持
      // 指定pattern后无限备份,pattern精确到ss(秒)就是一秒一个文件,精确到mm(分)就是一分一个文件,hh(小时),dd(天),MM(月),yyyy(年)
      pattern: 'yyyy-MM-dd.log',
      encoding: 'utf-8', //文件的编码
      alwaysIncludePattern: true, // 不指定pattern时若为true会使用 默认值'.yyyy-MM-dd'
      // daysToKeep: 10, //时间文件 保存多少天，以前的log将被删除
      //compress : true,//（默认为false） - 在滚动期间压缩备份文件（备份文件将具有.gz扩展名）
    },
    err: { //err日志
      type: 'dateFile',
      filename: 'logs/error_logs/err',
      pattern: 'yyyy-MM-dd.log',
      alwaysIncludePattern: true
    },
    info: { //info日志
      type: 'dateFile',
      filename: 'logs/info_logs/info',
      pattern: 'yyyy-MM-dd.log',
      alwaysIncludePattern: true
    },
    fatal: { //fatal日志
      type: 'dateFile',
      filename: 'logs/fatal_logs/fatal',
      pattern: 'yyyy-MM-dd.log',
      alwaysIncludePattern: true
    }
  },
  categories: {
    //appenders:采用的appender,取appenders项,level:设置级别
    debug: {
      appenders: ['out', 'debug', 'all'],
      level: 'debug'
    },
    err: {
      appenders: ['out', 'err', 'all'],
      level: 'error'
    },
    info: {
      appenders: ['out', 'info', 'all'],
      level: 'info'
    },
    fatal: {
      appenders: ['out', 'fatal', 'all'],
      level: 'fatal'
    },
    default: {
      appenders: ['out', 'all'],
      level: 'all'
    }
  }
})


const logFunction = (title, fun, msg) => {
  let log = log4js.getLogger(title)
  if (fun == 'all') {
    log.all(msg);
  }
}

module.exports = {
  logFunction
}