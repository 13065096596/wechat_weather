/*
 * @Descripttion: 
 * @version: 
 * @Author: 937bb
 * @Date: 2022-08-24 22:14:10
 * @LastEditors: 937bb
 * @LastEditTime: 2022-08-25 21:38:37
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
      backups: 5
    },
    schedule: { //schedule日志
      type: 'file',
      filename: 'logs/schedule_logs/schedule.log', // 首先手动建好目录，写入日志文件的路径
      maxLogSize: 1024 * 10 * 1024,
      backups: 5
    },
    keyword: { //  关键词
      type: 'dateFile',
      filename: 'logs/keyword_logs/keyword',
      pattern: 'yyyy-MM-dd.log',
      encoding: 'utf8',
      alwaysIncludePattern: true,
      backups: 5
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
      appenders: ['out', 'all'],
      level: 'debug'
    },
    err: {
      appenders: ['out', 'all'],
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
      appenders: ['all'],
      level: 'all'
    },
    schedule: {
      appenders: ['schedule'],
      level: 'trace'
    },
    keyword: {
      appenders: ['keyword'],
      level: 'trace'
    }
  }
})

const logFunction = (title, msg, fun) => {
  let log = log4js.getLogger(title)
  if (!fun) {
    log.all(msg)
  } else if (fun == 'trace') {
    log.trace(msg);
  } else if (fun == 'debug') {
    log.debug(msg);
  } else if (fun == 'info') {
    log.info(msg);
  } else if (fun == 'warn') {
    log.warn(msg);
  } else if (fun == 'error') {
    log.error(msg);
  } else if (fun == 'fatal') {
    log.fatal(msg);
  }
}

module.exports = {
  logFunction
}