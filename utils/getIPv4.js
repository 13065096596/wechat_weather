/*
 * @Descripttion: 
 * @version: 
 * @Author: 王家豪
 * @Date: 2022-03-19 17:45:32
 * @LastEditors: 王家豪
 * @LastEditTime: 2022-03-19 17:55:17
 */
const os = require('os');

function getIPv4() {
  //同一接口可能有不止一个IP4v地址，所以用数组存
  let ipv4s = [];
  //获取网络接口列表对象
  let interfaces = os.networkInterfaces();
  Object.keys(interfaces).forEach(function (key) {
    interfaces[key].forEach(function (item) {
      //跳过IPv6 和 '127.0.0.1'
      if ('IPv4' !== item.family || item.internal !== false) return;
      ipv4s.push(item.address); //可用的ipv4s加入数组
      // console.log(key + '--' + item.address);
    })
  })
  return ipv4s[0]; //返回一个可用的即可
}

module.exports = {
  getIPv4
}