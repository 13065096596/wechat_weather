<!--
 * @Descripttion: 
 * @version: 
 * @Author: 937bb
 * @Date: 2022-08-23 08:37:37
 * @LastEditors: 937bb
<<<<<<< HEAD
 * @LastEditTime: 2022-08-23 14:45:04
=======
 * @LastEditTime: 2022-08-23 14:33:26
>>>>>>> 822fbf2deb29be99f90e27b9d7c2a99d4d211931
-->
# wechat_weather

#### 介绍

0.  已添加定时任务（每天早上8点） 可以自己修改时间 <Br/>
    如要修改 百度搜索 node schedule 即可


1.  已添加全国城市天气查询（公众号中输入地级市名称加天气，如："济南天气"，"北京天气"，"深圳天气"等）

#### 软件架构
软件架构说明


#### 安装教程

0.  欢迎使用937bb的微信推送项目，本项目使用了node开发，仅供测试使用
1.  另需第三方软件（内网穿透工具，将本地网络开放至公网），自行下载。
作者使用的是花生壳（开通了6元HTTPS功能）
2.  文件夹根目录中 shift + 鼠标右键 打开cmd窗口 输入 npm install 并回车
3.  文件夹根目录中 shift + 鼠标右键 打开cmd窗口 输入 npm run start 并回车 可以看到 本地IPV4地址与端口443 并使用内网穿透工具进行解析


#### wechat.js 使用说明 

1.  找到 sever/wechat.js 中 config 进行配置个人信息
2.  微信测试号管理 添加URL时，将 243行 router.post 改为 router.get

3.  49行 data{} 中的数据可以自己添加 格式如实例， 
    week:{
      value:'xxxxxx', 
      color:'#xxxxxx'       
    }
    week: 对应微信测试号管理中 模板参数名，即： {{week.DATA}}
    value: 对应week的数据内容
    color: 对应week数据内容的颜色 （rgb格式）

4.  项目如有bug问题，请留言管理员

