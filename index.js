/*
 * @Descripttion: 
 * @version: 
 * @Author: 王家豪
 * @Date: 2022-08-21 23:34:40
 * @LastEditors: 王家豪
 * @LastEditTime: 2022-08-21 23:46:03
 */
// node项目 index.js 文件
// const userApi = require('./api/userApi');
const port = 5000;
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const {
  getIPv4
} = require('./utils/getIPv4')
let ipv4s = getIPv4()
app.use(bodyParser.urlencoded({
  extended: true
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