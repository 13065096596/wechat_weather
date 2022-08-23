/*
 * @Descripttion: 
 * @version: 
 * @Author: 937bb
 * @Date: 2022-08-22 09:21:23
 * @LastEditors: 937bb
 * @LastEditTime: 2022-08-23 13:45:13
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
const cityNumList = require('../utils/cityNum.js');
const {
  resolve
} = require('path');

// console.log(cityNumList);

let config = { //配置信息
  appID: "wx204b87a72dbd27d9",
  appsecret: "be10c100d5d9c6e24286548bc2c5427a",
  //这里你得填写你自己设置的Token值
  token: "wangjiahao",
  grant_type: 'client_credential', //默认不用修改
  access_token: '', //不用管
  city: '济南', //（必填）
  cityNum: '370100', // 在utils/cityNum中找到自己的城市编码（必填,）
  touser: 'oHQaO5xNbT7xDIaytwv-9Cd7Cv_I',  //接受信息的用OpenId 输入 微信公众测试号中 微信扫码后的编码 （必填）
  template_id: 'UIMsOvjq_O9OeuLA1lYRym37-KwvqPXvTkLJuepWuoY' // 消息模板编号 （必填）
};

class Wechat {
  constructor(city, cityNum, touser, template_id) {
    this.city = city
    this.cityNum = cityNum
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
      // console.log(this.cityNum)
      // return false
      request({
          url: 'https://restapi.amap.com/v3/weather/weatherInfo',
          method: 'GET',
          json: true,
          qs: {
            key: 'a7f29b747354aa3dd8680cc8b3207288',
            city: this.cityNum,
            extensions: 'all',
            output: 'JSON'
          }
        },
        (err, rep, body) => {
          console.log(err);
          if (body.status == 1) {
            // console.log(body.forecasts[0].casts)

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
                this.requestData.data.city.value = this.city
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
    if (msg == '我爱你') {
      this.requestData.template_id = '9i-HmP3ievEeNPpX0o8kJRzc9PxcSpgN0yWKkh1kI8U' //msg存在切换指定模板
    } else if (msg == '天气') {
      this.requestData.template_id = '2dkJhlBv7PYUbQnPnRuLz8vJCI2nhbdz4-Su-h8keew' //msg
    }else{
      this.requestData.template_id = config.template_id
    }
    console.log()
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

let wechatFun = new Wechat(config.city, config.cityNum, config.touser, config.template_id)


let scheduleCronstyle = () => {
  // console.log('scheduleCronstyle:', new Date())
  //每天早上8点0分10秒开始推送 （最新天气是8点更新 晚10秒可获取最新数据）
  schedule.scheduleJob('10 0 8 * * *', async () => {
    console.log('scheduleCronstyle:', new Date())
    try {
      wechatFun.city = config.city
      wechatFun.cityNum = config.cityNum
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

  if (req.method == 'POST') {
    const xmlData = await getUserDataAsync(req)
    const jsData = await parseXMLAsync(xmlData)
    const message = await formatMessage(jsData)
    console.log(message)
    if (message.MsgType == 'text' && !message.Status) {

      wechatFun.requestData.touser = message.FromUserName

      let msg = ''

      if (message.Content == '我爱你') {

        msg = '我爱你'
        wechatFun.city = config.city
        wechatFun.cityNum = config.cityNum
      } else if (message.Content.indexOf('天气') > -1) {
        let foryes = false
        msg = '天气'

        wechatFun.city = message.Content.slice(0, message.Content.indexOf('天气'))

        await cityNumList.map((v) => {
          if (v.name == wechatFun.city) {
            wechatFun.cityNum = v.adcode
            foryes = true
          }
        })

        if (!foryes) {
          let send = `<xml>
          <ToUserName><![CDATA[${message.FromUserName}]]></ToUserName>
          <FromUserName><![CDATA[${message.ToUserName}]]></FromUserName>
          <CreateTime>${Date.now()}</CreateTime>
          <MsgType><![CDATA[text]]></MsgType>
          <Content><![CDATA[请输入地级市名称加天气，如："济南天气"，"北京天气"，"深圳天气"等]]></Content>
          </xml>`
          res.send(send)
          return false
        }
      } else {
        res.send(`success`)
        return false
      }
      try {
        
        await wechatFun.getWeather()
        await wechatFun.getToken()
        await wechatFun.sendTemplateMsg(msg)
        res.send(`success`)
      } catch (err) {
        console.log(err)
      }
    } else {}
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