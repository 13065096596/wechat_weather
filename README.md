<!--
 * @Descripttion: 
 * @version: 
 * @Author: 937bb
 * @Date: 2022-08-23 08:37:37
 * @LastEditors: 937bb
 * @LastEditTime: 2022-08-23 14:25:45
-->
# wechat_weather

#### 介绍

0.  已添加定时任务（每天早上8点） 可以自己修改时间 

*    *    *    *    *    *
┬    ┬    ┬    ┬    ┬    ┬
│    │    │    │    │    |
│    │    │    │    │    └ 一周的星期 (0 - 7) (0 or 7 is Sun)
│    │    │    │    └───── 月份 (1 - 12)
│    │    │    └────────── 月份中的日子 (1 - 31)
│    │    └─────────────── 小时 (0 - 23)
│    └──────────────────── 分钟 (0 - 59)
└───────────────────────── 秒 (0 - 59, OPTIONAL)


百度搜索 node schedule 即可


1.  已添加全国城市天气查询（公众号中输入地级市名称加天气，如："济南天气"，"北京天气"，"深圳天气"等）

#### 软件架构
软件架构说明


#### 安装教程

0.  欢迎使用937bb的微信推送项目，本项目使用了node开发，仅供测试使用
1.  另需第三方软件（内网穿透工具，将本地网络开放至公网），自行下载。
作者使用的是花生壳（开通了6元HTTPS功能）
2.  文件夹根目录中 shift + 鼠标右键 打开cmd窗口 输入 npm install 并回车
3.  文件夹根目录中 shift + 鼠标右键 打开cmd窗口 输入 npm run start 并回车 可以看到 本地IPV4地址与端口443 并使用内网穿透工具进行解析
4.  

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

#### 参与贡献

1.  Fork 本仓库
2.  新建 Feat_xxx 分支
3.  提交代码
4.  新建 Pull Request


#### 特技

1.  使用 Readme\_XXX.md 来支持不同的语言，例如 Readme\_en.md, Readme\_zh.md
2.  Gitee 官方博客 [blog.gitee.com](https://blog.gitee.com)
3.  你可以 [https://gitee.com/explore](https://gitee.com/explore) 这个地址来了解 Gitee 上的优秀开源项目
4.  [GVP](https://gitee.com/gvp) 全称是 Gitee 最有价值开源项目，是综合评定出的优秀开源项目
5.  Gitee 官方提供的使用手册 [https://gitee.com/help](https://gitee.com/help)
6.  Gitee 封面人物是一档用来展示 Gitee 会员风采的栏目 [https://gitee.com/gitee-stars/](https://gitee.com/gitee-stars/)
