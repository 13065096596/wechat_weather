/*
 * @Descripttion: 
 * @version: 
 * @Author: 937bb
 * @Date: 2022-08-22 09:21:23
 * @LastEditors: 937bb
 * @LastEditTime: 2022-08-23 09:39:44
 */

const query = require('./db.js');
const express = require('express')
const sha1 = require('sha1');
const request = require('request');
const router = express.Router()
const {
  getUserDataAsync,
  parseXMLAsync,
  formatMessage
} = require('../utils/getWechatData.js')
const schedule = require('node-schedule');



let config = { //配置信息
  appID: "wx204b87a72dbd27d9",
  appsecret: "be10c100d5d9c6e24286548bc2c5427a",
  //这里你得填写你自己设置的Token值
  token: "wangjiahao",
  grant_type: 'client_credential', //默认
  access_token: '',
  openid: '',
  city: '济南',
  cityNum: '370100',
  touser: 'oHQaO5xNbT7xDIaytwv-9Cd7Cv_I', //接受信息的用OpenId
  template_id: 'UIMsOvjq_O9OeuLA1lYRym37-KwvqPXvTkLJuepWuoY' //模板编号
};

class Wechat {
  constructor(touser, template_id) {
    this.requestData = { //发送模板消息的数据
      touser: touser,
      template_id: template_id, //模板编号
      data: {
        week: {
          value: '',
          color: '#173177'
        },
        date: {
          value: '',
          color: '#273177'
        },
        city: {
          value: '',
          color: '#373177'
        },
        dayweather: { //白天天气
          value: '',
          color: '#473177'
        },
        nightweather: { //晚上天气
          value: '',
          color: '#473177'
        },
        daytemp: { //今日白天温度
          value: '',
          color: '#573177'
        },
        nighttemp: { //今日夜间温度
          value: '',
          color: '#573177'
        },
        daywind: { //今日白天风向
          value: '',
          color: '#673177'
        },
        nightwind: { //今日夜间风向
          value: '',
          color: '#673177'
        },
        daypower: { //今日白天风力
          value: '',
          color: '#773177'
        },
        nightpower: { //今日夜间风力
          value: '',
          color: '#773177'
        },
        // 已经结婚几天
        marriage: {
          value: '',
          color: '#873177'
        },
        // 距离下次结婚纪念日
        nextdays: {
          value: '',
          color: '#873177'
        }
      }
    }
  }
  getWeather() {
    return new Promise((resolve, reject) => {
      request({
          url: 'https://restapi.amap.com/v3/weather/weatherInfo',
          method: 'GET',
          json: true,
          qs: {
            key: 'a7f29b747354aa3dd8680cc8b3207288',
            city: config.cityNum,
            extensions: 'all',
            output: 'JSON'
          }
        },
        (err, rep, body) => {
          console.log(err);
          if (body.status == 1) {
            console.log(body.forecasts[0].casts)

            // 今日日期 yy-mm-dd
            var date = new Date();
            var year = date.getFullYear();
            var month = date.getMonth() + 1;
            var day = date.getDate();
            if (month < 10) {
              month = "0" + month;
            }
            if (day < 10) {
              day = "0" + day;
            }
            this.requestData.data.date.value = year + "-" + month + "-" + day;

            // 今天星期几
            this.requestData.data.week.value = "星期" + "日一二三四五六".charAt(new Date().getDay());

            // 获取今天的天气
            body.forecasts[0].casts.map((v, i) => {
              if (v.date == this.requestData.data.date.value) {
                this.requestData.data.city.value = config.city
                this.requestData.data.dayweather.value = body.forecasts[0].casts[i].dayweather //白天天气
                this.requestData.data.nightweather.value = body.forecasts[0].casts[i].nightweather //晚上天气
                this.requestData.data.daytemp.value = body.forecasts[0].casts[i].daytemp + '℃' //今日白天温度
                this.requestData.data.nighttemp.value = body.forecasts[0].casts[i].nighttemp + '℃' //今日夜间温度
                this.requestData.data.daywind.value = body.forecasts[0].casts[i].daywind + '风'
                this.requestData.data.nightwind.value = body.forecasts[0].casts[i].nightwind + '风'
                this.requestData.data.daypower.value = body.forecasts[0].casts[i].daypower + '级' //今日白天风力
                this.requestData.data.nightpower.value = body.forecasts[0].casts[i].nightpower + '级' //今日夜间风力
              }
            })

            // 开始时间
            let startDate = Date.parse('2021-11-19');
            // 今天
            let endDate = Date.parse(year + "-" + month + "-" + day);
            // 明年11月19日
            // 今年
            let thisYear = new Date().getFullYear();
            let nextDate = new Date(thisYear + 1, 11, 19)
            // 今天距离明年11月19日的天数
            this.requestData.data.nextdays.value = Math.ceil((nextDate.getTime() - endDate) / (24 * 60 * 60 * 1000)) + 1
            // 已经结婚几天
            this.requestData.data.marriage.value = (endDate - startDate) / (1 * 24 * 60 * 60 * 1000) + 1
            // console.log(this.requestData.data);
            resolve(true)
          } else {
            reject(false)
          }
        })
    })
  }

  getToken() {
    return new Promise((resolve, reject) => {
      request(`https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${config.appID}&secret=${config.appsecret}`, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          // console.log(body) // 请求成功的处理逻辑
          config.access_token = JSON.parse(body).access_token;
          resolve(true)
        } else {
          reject(false)
        }
      })
    })
  }

  sendTemplateMsg(msg) {
    const url = `https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=${config.access_token}`; //发送模板消息的接口
    if (msg) {
      this.requestData.template_id = '9i-HmP3ievEeNPpX0o8kJRzc9PxcSpgN0yWKkh1kI8U' //msg存在切换指定模板
    }
    return new Promise((resolve, reject) => {
      request({
        url: url,
        method: 'POST',
        body: this.requestData,
        json: true
      }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          console.log('模板消息推送成功');
          resolve(true)
        } else {
          reject(false)
        }
      });
    })
  }
}

let wechatFun = new Wechat(config.touser, config.template_id)


let scheduleCronstyle = () => {
  // console.log('scheduleCronstyle:', new Date())
  //每分钟的第30秒定时执行一次:
  schedule.scheduleJob('10 0 8 * * *', async () => {
    console.log('scheduleCronstyle:', new Date())
    try {
      await wechatFun.getWeather()
      await wechatFun.getToken()
      await wechatFun.sendTemplateMsg()
    } catch (e) {
      console.log(e)
    }
  });
}

scheduleCronstyle()

// 验证url时 post改为get，验证通过后再改回post
router.post('/wechatData', async (req, res) => {
  // console.log(req.method, 2222)
  if (req.method == 'POST') {
    const xmlData = await getUserDataAsync(req)
    const jsData = await parseXMLAsync(xmlData)
    const message = await formatMessage(jsData)
    if (message.MsgType == 'text' && message.Content == '我爱你' && !message.Status) {
      wechatFun.requestData.touser = message.FromUserName
      try {
        await wechatFun.getWeather()
        await wechatFun.getToken()
        await wechatFun.sendTemplateMsg('我爱你')
      } catch (err) {
        console.log(err)
      }
      res.send(``)
    }
  } else {
    const token = config.token; //获取配置的token
    const signature = req.query.signature; //获取微信发送请求参数signature
    const nonce = req.query.nonce; //获取微信发送请求参数nonce
    const timestamp = req.query.timestamp; //获取微信发送请求参数timestamp
    const str = [token, timestamp, nonce].sort().join(''); //排序token、timestamp、nonce后转换为组合字符串
    const sha = sha1(str); //加密组合字符串
    if (sha === signature) {
      const echostr = req.query.echostr; //获取微信请求参数echostr
      res.send(echostr + ''); //正常返回请求参数echostr
    } else {
      res.send('验证失败');
    }
  }
})





module.exports = router;