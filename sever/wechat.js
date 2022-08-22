/*
 * @Descripttion: 
 * @version: 
 * @Author: 王家豪
 * @Date: 2022-08-22 09:21:23
 * @LastEditors: 王家豪
 * @LastEditTime: 2022-08-22 17:40:28
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

let config = {
  appID: "wx204b87a72dbd27d9",
  appsecret: "be10c100d5d9c6e24286548bc2c5427a",
  //这里你得填写你自己设置的Token值
  token: "wangjiahao",
  grant_type: 'client_credential', //默认
  access_token: '',
};



router.post('/wechatData', async (req, res) => {
  console.log(req.method, 2222)
  if (req.method == 'POST') {
    const xmlData = await getUserDataAsync(req)
    const jsData = await parseXMLAsync(xmlData)
    const message = await formatMessage(jsData)
    console.log(message);
    if (message.MsgType == 'text' && message.Content == '天气' && !message.Status) {

      getWeather()
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



const requestData = { //发送模板消息的数据
  touser: 'oHQaO5xNbT7xDIaytwv-9Cd7Cv_I',
  template_id: 'IiMnns0J6Hcz8Jjdg5qUHoFN4uf-W8loAlttgJPtWCE',
  // topcolor: '#FF0000',
  data: {
    week: {
      value: '',
      // color 随机颜色
      color: '#173177'
    },
    date: {
      value: '',
      // color 随机颜色
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
};

// router.get('/wechat', function (req, res) {
//   console.log(req, 2)
//   const code = req.query;
//   console.log(code)
// });

function getWeather() {
  //获取天气
  request({
      url: 'https://restapi.amap.com/v3/weather/weatherInfo',
      method: 'GET',
      json: true,
      qs: {
        key: 'a7f29b747354aa3dd8680cc8b3207288',
        city: '370100',
        extensions: 'all',
        output: 'JSON'
      }
    },
    (err, rep, body) => {

      if (body.status == 1) {
        console.log(body.forecasts[0].casts[0])
        // 今日日期 yy-mm-dd
        requestData.data.date.value = body.forecasts[0].casts[0].date

        // 今天星期几
        switch (body.forecasts[0].casts[0].week) {
          case '1':
            requestData.data.week.value = '星期一'
            break;
          case '2':
            requestData.data.week.value = '星期二'
            break;
          case '3':
            requestData.data.week.value = '星期三'
            break;
          case '4':
            requestData.data.week.value = '星期四'
            break;
          case '5':
            requestData.data.week.value = '星期五'
            break;
          case '6':
            requestData.data.week.value = '星期六'
            break;
          case '7':
            requestData.data.week.value = '星期日'
            break;
        }

        // 今天天气
        requestData.data.city.value = '济南市'
        requestData.data.dayweather.value = body.forecasts[0].casts[0].dayweather //白天天气
        requestData.data.nightweather.value = body.forecasts[0].casts[0].nightweather //晚上天气
        requestData.data.daytemp.value = body.forecasts[0].casts[0].daytemp + '℃' //今日白天温度
        requestData.data.nighttemp.value = body.forecasts[0].casts[0].nighttemp + '℃' //今日夜间温度
        requestData.data.daywind.value = body.forecasts[0].casts[0].daywind + '风'
        requestData.data.nightwind.value = body.forecasts[0].casts[0].nightwind + '风'
        requestData.data.daypower.value = body.forecasts[0].casts[0].daypower + '级' //今日白天风力
        requestData.data.nightpower.value = body.forecasts[0].casts[0].nightpower + '级' //今日夜间风力

        // 开始时间
        let startDate = Date.parse('2021-11-19');
        // 今天
        let endDate = Date.parse(body.forecasts[0].casts[0].date);
        // 明年11月19日
        // 今年
        let thisYear = new Date().getFullYear();
        let nextDate = new Date(thisYear + 1, 11, 19)
        // 今天距离明年11月19日的天数
        requestData.data.nextdays.value = Math.ceil((nextDate.getTime() - endDate) / (24 * 60 * 60 * 1000)) + 1

        // 
        requestData.data.marriage.value = (endDate - startDate) / (1 * 24 * 60 * 60 * 1000) + 1

        console.log(requestData.data)
        getToken()
      }
    })

}


function getToken() {
  request(`https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${config.appID}&secret=${config.appsecret}`, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log(body) // 请求成功的处理逻辑
      config.access_token = JSON.parse(body).access_token;
      sendTemplateMsg()
    }
  })

}


function sendTemplateMsg(openid, access_token) {

  const url = `https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=${config.access_token}`; //发送模板消息的接口

  console.log('发送！')
  request({
    url: url,
    method: 'POST',
    body: requestData,
    json: true
  }, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log('模板消息推送成功');
    } else {

    }
    console.log(body)
  });
}
module.exports = router;