import util from '../util'

const host1 = 'https://sycm.taobao.com/',
      host2 = 'https://we.taobao.com/';

function getConfig(){
    util.$http('GET',`${host}/spider/config.wb?version=1.0`,function(res){console.log(res)})
}


function checkPlug(e) {
    var search = "check-plug-cookie="//查询检索的值
    var returnvalue = "";//返回值
    if (document.cookie.length > 0) {
        let sd = document.cookie.indexOf(search);
        if (sd!= -1) {
            sd += search.length;
            let end = document.cookie.indexOf(";", sd);
            if (end == -1)
                end = document.cookie.length;
            //unescape() 函数可对通过 escape() 编码的字符串进行解码。
            returnvalue=unescape(document.cookie.substring(sd, end))
        }
    }
    if(!returnvalue){
        $("#step-install").addClass("s-step-ed")
        $("#s-step-tip").text("请先安装插件！！")
    }
    mizhu.open('插件');
}

export {getConfig}
