import config from './config'
export const versionObj = () => {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: `${moli_host}/spider/checkUpdate.wb?vs=1`,
      success(res) {
        resolve(res);
      },
      faile(err) {
        reject(err)
      }
    })
  })
}
let moli_host, frontEndHost;
if (process.env.NODE_ENV == "production") {
  moli_host = config.backEndHost_pro
  // frontEndHost = config.frontEndHost_pro
  frontEndHost = config.tbPlatform
} else {
  moli_host = config.backEndHost_dev
  // frontEndHost = config.frontEndHost_dev
  frontEndHost = config.tbPlatform;
}

export {
  moli_host,
  // frontEndHost
}