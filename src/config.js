let config = {

  //只要修改这两个参数就可以
  // backEndHost_dev: 'http://molitest.willbe.net.cn/spider', //DEV 用于接收数据的后台接口域名
  backEndHost_dev: 'http://spider.ittun.com/spider', //DEV 用于接收数据的后台接口域名
  // backEndHost_sit: 'http://molitest.willbe.net.cn/spider', //DEV 用于接收数据的后台接口域名
  backEndHost_pro: 'http://47.107.35.8:8281/spider', //PRO 用于接收数据的后台接口域名
  //请求淘宝接口的时间间隔
  max_interval: 1000,
  min_interval: 350,
}



export const app_version = '1.3.1'; //全量数据-视频、直播
export const app_vs = 6;



export default config;