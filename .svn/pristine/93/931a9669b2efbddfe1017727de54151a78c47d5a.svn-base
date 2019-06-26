import util from '../util'

const host = 'http://molitest.willbe.net.cn/editor';

async function getConfig(){
    let res = await util.$http('GET',`${host}/spider/config.wb?version=1.0`);
    return res;
}

export {getConfig}
