/*
 * @Descripttion: 
 * @version: 
 * @Author: 王家豪
 * @Date: 2022-08-21 23:34:40
 * @LastEditors: 937bb
 * @LastEditTime: 2022-08-25 15:43:17
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
  logFunction
} = require('./utils/log4js.js')



app.all('*', function (req, res, next) {
  // res.send(req)
  let msg = {
    method: req.method,
    url: req.url,
    body: req.body,
    params: req.params,
    query: req.query
  }

  logFunction('http', msg)
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
  if (req.method == 'OPTIONS') {
    res.send(200);
  } else {
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