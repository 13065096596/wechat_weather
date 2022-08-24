/*
 * @Descripttion: 
 * @version: 
 * @Author: 王家豪
 * @Date: 2022-08-21 23:34:40
 * @LastEditors: 937bb
 * @LastEditTime: 2022-08-24 23:29:51
 */
const port = 443;
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const wechat = require('./sever/wechat')
const {
  getIPv4
} = require('./utils/getIPv4')
let ipv4s = getIPv4()
const {
  debugLog,
  log,
  logFunction
} = require('./utils/log4js.js')




app.all('*', function (req, res, next) {
  // res.send(req)
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
  if (req.method == 'OPTIONS') {
    res.send(200);
  } else {
 
    logFunction('http','all',{method:req.method,url:req.url})
    res.send(req.method);

    next();
  }
});


app.use('/api', wechat)


app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());

// 监听端口
app.listen(port, function (err) {
  if (err) {
    console.log(err)
    return
  } else {
    console.log('Listening at http://localhost:' + port + '\n' + 'or at http://' + ipv4s + ':' + port)
  }
})