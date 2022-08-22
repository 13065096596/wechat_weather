/*
 * @Descripttion: 
 * @version: 
 * @Author: 王家豪
 * @Date: 2022-08-21 23:34:40
 * @LastEditors: 王家豪
 * @LastEditTime: 2022-08-22 16:44:57
 */
// node项目 index.js 文件
// const userApi = require('./api/userApi');
const port = 443;
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
// require('body-parser-xml')(bodyParser);
const express = require('express');
const app = express();
const {
  getIPv4
} = require('./utils/getIPv4')
let ipv4s = getIPv4()
// const xmlparser = require('express-xml-bodyparser'); // 解析 xml
const wechat = require('./sever/wechat')
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());




app.all('*', function (req, res, next) {
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






// 监听端口
app.listen(port, function (err) {
  if (err) {
    console.log(err)
    return
  } else {
    console.log('Listening at http://localhost:' + port + '\n' + 'or at http://' + ipv4s + ':' + port)
  }
})