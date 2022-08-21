/*
 * @Descripttion: 
 * @version: 
 * @Author: 王家豪
 * @Date: 2022-08-21 23:34:40
 * @LastEditors: 王家豪
 * @LastEditTime: 2022-08-21 23:40:40
 */
// node项目 index.js 文件
// const userApi = require('./api/userApi');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const express = require('express');
const app = express();

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

// 后端api路由
// app.use('/api/user', userApi);

// 监听端口
app.listen(5000);
console.log('success listen at port:3000......');