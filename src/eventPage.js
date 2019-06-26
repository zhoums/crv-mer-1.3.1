// 入口

import config from './config'
import util from './util'
import {
  getDateRange
} from './util'
import {
  app_version,
  app_vs
} from './config'
import {
  // versionObj,
  moli_host,
} from './checkVersion'



let headerObj = {
  version: app_version,
  vs: app_vs,
  tk: null
}
let currentTab;
let isPostShopData = false;
//设置refer
chrome.webRequest.onBeforeSendHeaders.addListener(
  function(details) {
    if (details.type === 'xmlhttprequest') {
      var exists = false;
      for (var i = 0; i < details.requestHeaders.length; ++i) {
        if (details.requestHeaders[i].name === 'Referer') {
          exists = true;
          details.requestHeaders[i].value = 'https://we.taobao.com/';
          break;
        }
      }
      if (!exists) {
        details.requestHeaders.push({
          name: 'Referer',
          value: 'https://we.taobao.com/'
        });
      }
      return {
        requestHeaders: details.requestHeaders
      };
    }
  }, {
    urls: ['https://*.taobao.com/*']
  }, ["blocking", "requestHeaders", "extraHeaders"]
);
let configRes = null;
let mainUserId, loginUserId;
let tempUser;

const checkLogin = (tabId) => {
  //触发插件运行提示
  chrome.tabs.sendRequest(tabId, {
    greeting: "checkLogin"
  });
  return new Promise((resolve, reject) => {
    if (tempUser) {
      resolve(tempUser);
      return;
    }
    $.ajax({
      url: 'https://sycm.taobao.com/custom/menu/getPersonalView.json?token=' + util.generatTk(9),
      success(res) {
        if (res.code === 0) {
          tempUser = res.data;
          resolve(res.data)
        } else {
          reject(res.msg)
        }
      },
      faile() {
        reject('获取用户信息失败')
      }
    })
  })
}
//从淘宝取回需要爬的数据
const getDataFromSycm = (contentId, title, dateFrom, dateTo) => {
  let tk = util.generatTk(9);
  return new Promise((resolve, reject) => {
    $.ajax({
      url: `https://sycm.taobao.com/xsite/content/single/detail/result.json?dateType=range&dateRange=${dateFrom}%7C${dateTo}&indexCode=&contentId=${contentId}&_=1541740203285&token=${tk}`,
      async: false,
      success(res) {
        if (!res.hasError) {
          resolve({
            tit: title,
            data: res.content.data
          })
        } else {
          reject(res.content.message)
        }
      },
      faile() {
        isPostShopData = false;
        tempUser=null;
        getContentIdTotalPages=0;
        currentPage=1
        reject('系统出错，未知异常')
      }
    })
  })
}
let getContentIdTotalPages = 0; //取ContentId时的总页数
let currentPage = 1; //当前处理的页数
let bDay=-1,eDay=-1;
const getT=async function (token){
  await getDate(30,1,token);
  if(bDay>-1&&eDay>-1) return;
  await getDate(30,2,token);
  if(bDay>-1&&eDay>-1) return;
  await getDate(31,2,token);
  if(bDay>-1&&eDay>-1) return;
}
const getDate=(bd=30,ed=1,token)=>{
  let beginDay = getDateRange(bd);
  let endDay = getDateRange(ed);
  $.ajax({
    url: `https://sycm.taobao.com/xsite/content/single/text/all.json`,
    async: false,
    headers: headerObj,
    data: {
      contentRelation: 'ALL',
      dateRange: `${beginDay}|${endDay}`,
      dateType: 'recent30',
      pageSize:20,
      page:1,
      order: 'desc',
      orderBy: 'browsePv',
      parentContentTypeId: '1000',
      contentTypeId: '',
      containH: true,
      keyword: '',
      startDate: '',
      endDate: '',
      indexCode: 'contentRelation,browsePv',
      _: parseInt(Math.random() * 1000000000000000),
      token
    },
    success(res) {
      if (!res.hasError) {
        bDay=bd;
        eDay=ed;
      }
    }
  })
}
let categoryMap = {
  text: {
    orderBy: "browsePv",
    parentContentTypeId: 1000,
    contentTypeId: "",
    indexCode: "contentRelation,browsePv"
  },
  video: {
    orderBy: "playActualMbrCnt",
    contentTypeId: 2000,
    indexCode: "contentRelation,playActualMbrCnt"
  },
  live: {
    orderBy: "watchPv",
    contentTypeId: 3000,
    indexCode: "contentRelation,watchPv"
  }
}
let categoryFlag = "text"

const getContentId = (category, tabId, loginUserId, mainUserId, token, page = 1, pageSize = 20) => {
  let beginDay = getDateRange(bDay);
  let endDay = getDateRange(eDay);
  let baseParam = {
    contentRelation: 'ALL',
    dateRange: `${beginDay}|${endDay}`,
    dateType: 'recent30',
    pageSize,
    page,
    order: 'desc',
    orderBy: '',
    contentTypeId: '',
    containH: true,
    keyword: '',
    startDate: '',
    endDate: '',
    indexCode: '',
    _: parseInt(Math.random() * 1000000000000000),
    token
  }

  headerObj.tk = token;

  //触发插件运行提示
  let ty = "图文"
  if (categoryFlag == "video") {
    ty = "短视频"
  } else if (categoryFlag == "live") {
    ty = "直播"
  }

  chrome.tabs.sendRequest(tabId, {
    greeting: "showRuning",
    content: ty + "数据第" + page + "页"
  });

  util.sleep(parseInt(Math.random() * (config.max_interval - config.min_interval) + config.min_interval, 10));
  $.ajax({
    url: `https://sycm.taobao.com/xsite/content/single/${category}/all.json`,
    async: false,
    headers: headerObj,
    data: Object.assign(baseParam, categoryMap[category]),
    success(res) {
      if (!res.hasError) {
        if (!getContentIdTotalPages) {
          getContentIdTotalPages = Math.ceil(res.content.data.recordCount ? res.content.data.recordCount / pageSize : 0);
        }
        res.content.data.data.forEach((item, key) => {
          let isPageLast = (key + 1 == res.content.data.data.length);
          getDataFromSycm(item.contentId, item.title, beginDay, endDay).then((data) => {
            postContentData(loginUserId, mainUserId, data, token, isPageLast, item.publisherName);
          })
        })
      } else {
        if (currentPage < getContentIdTotalPages) {
          currentPage++;
          chrome.tabs.sendRequest(tabId, {
            greeting: "turnPage"
          });
          return;
        }
        isPostShopData = false;
        tempUser=null;
        getContentIdTotalPages=0;
        currentPage=1
      }
    }
  })
}
const postShopData = (tabId, param, token) => {
  headerObj.tk = token;
  return new Promise((resolve, reject) => {
    if (isPostShopData) {
      resolve();
      return;
    }
    $.ajax({
      url: `${moli_host}/mer/syncPersonalInfo.wb`,
      type: 'post',
      headers: headerObj,
      data: param,
      success(response) {
        if (response.status === 0) {
          isPostShopData = true;
          resolve()
        } else {
          chrome.tabs.sendRequest(tabId, {
            greeting: "errorTips",
            message: response.msg
          });
          reject(response.msg)
        }
      }
    })
  })
}
//不是最后一页，但是最后一条，需要通知content.js触发读取下一页contentId
// 最后一页，并且是最后一条，需要通知content.js已经完成
const postContentData = (loginUserId, mainUserId, dataList, token, isPageLast, publisherName) => {
  let _itemList = [];
  _itemList.push(dataList.data)
  headerObj.tk = token;
  $.ajax({
    url: `${moli_host}/mer/syncMerEffect.wb`,
    contentType: 'application/json',
    headers: headerObj,
    async: false,
    type: 'post',
    data: JSON.stringify({
      loginUserId,
      mainUserId,
      contentTitle: dataList.tit,
      darenName: publisherName,
      itemList: _itemList
    }),
    success(res) {
      if (currentPage < getContentIdTotalPages && isPageLast) {
        // // 通知content.js触发读取下一页contentId
        currentPage++;
        chrome.tabs.sendRequest(currentTab, {
          greeting: "turnPage"
        });

      } else if (currentPage == getContentIdTotalPages && isPageLast) {
        console.log('categoryFlag',categoryFlag,currentTab)
        getContentIdTotalPages=0;
        currentPage=1;
        if (categoryFlag == "text") {
          categoryFlag = "video";
          currentPage = 1;
          chrome.tabs.sendRequest(currentTab, {
            greeting: "turnPage"
          });
        } else if (categoryFlag == "video") {
          categoryFlag = "live";
          currentPage = 1;
          chrome.tabs.sendRequest(currentTab, {
            greeting: "turnPage"
          });
        } else {
          isPostShopData = false;
          tempUser=null;
          categoryFlag = "text"
          // 通知content.js已经完成
          chrome.tabs.sendRequest(currentTab, {
            greeting: "finish"
          });
        }
      }
    }
  })
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {

  if (request.greeting == 'business') {
    chrome.tabs.getSelected(null, async function(tab) {
      let tabId = tab.id
      let _tk = request.tk;
      if (currentTab) {
        tabId = currentTab;//防止切换当前页改变tabid
      } else {
        currentTab = tab.id
      }
      await getT(_tk);
      //检查参谋是否登录，未登录弹出提示，已登录开始爬数据
      checkLogin(tabId).then((res) => {
        loginUserId = res.loginUserId;
        mainUserId = res.mainUserId;
        chrome.tabs.sendRequest(tabId, {
          greeting: "postShopData"
        });
        postShopData(tabId, res, _tk).then((res) => {
          //先跑一页，确定总页数，再根据总页数循环
          getContentId(categoryFlag, tabId, loginUserId, mainUserId, _tk, currentPage);
        }).catch(()=>{
          chrome.tabs.sendRequest(tabId, {
            greeting: "postShopDataFaile"
          });
        })
      }).catch((reason) => {
        chrome.tabs.sendRequest(tabId, {
         greeting: "checkLoginFaile"
       });
      });
    })
  }
  if (request.greeting == 'turn_page') {
    let _tk = request.tk;
    getContentId(categoryFlag, currentTab, loginUserId, mainUserId, _tk, currentPage);
  }
  return
});
