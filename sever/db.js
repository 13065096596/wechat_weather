/*
 * @Descripttion: 
 * @version: 
 * @Author: 937bb
 * @Date: 2022-04-14 22:49:38
 * @LastEditors: 937bb
 * @LastEditTime: 2022-08-26 09:13:12
 */
// db.js
// 数据库连接配置
const mysql = require('mysql')
const pool = mysql.createPool({
  host: '127.0.0.1', // 新建数据库连接时的 主机名或ID地址 内容
  user: 'root',
  password: 'root', // root 密码
  database: 'wechatWeather', // 数据库名
  port: '3306',
  timezone: "08:00",
  multipleStatements: true
})
const query = (sql, values) => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, conn) => {
      if (err) {
        reject(err)
      } else {
        conn.query(sql, values, (err, results, fields) => {
          if (err) {
            reject(err)
          } else {
            //释放连接  

            conn.release();
            //事件驱动回调    
            resolve(results);
          }
        });
      }
    });
  })
};

module.exports = query;