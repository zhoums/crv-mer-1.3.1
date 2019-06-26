$(function() {
  // $("body").prepend("<button id='btn_business'>uuuuuu</button>")
  let _href = location.href;
  let tk;
  let showMsg = msg=>{
    if (!$('#crx-cer-progressing').length) {
      $("body").append('<div id="crx-cer-progressing" style="position:absolute; background:rgba(120,120,120,.2); right:50px; top:10px;  border:1px solid #f50; padding:5px 15px;">'+msg+'</div>')
    }else{
      $("#crx-cer-progressing").html(msg);
    }
  }
  if (_href.includes('page/datacount/sycm.html')) {
  // if (true) {

    const triggerFn = () => {
      let triggerBtn = $("#btn_business");

      if (triggerBtn) {
        triggerBtn.on("click", () => {
          // let shopIds = $("#search_shopId").val();
          let token = $("#token").val();
          tk = token;
          // if (!shopIds || shopIds.length < 1) {
          //   alert('请先选择店铺');
          //   return;
          // }
          chrome.runtime.sendMessage({
            greeting: "business",
            tk: token,
            // shopIds: shopIds
          });
        })
      }
    }
    triggerFn();


    //监听事件
    chrome.extension.onRequest.addListener(
      function(request, sender, sendResponse) {
        if (request.greeting == "showRuning") {
          showMsg(`正在回填${request.content}，请稍候。。。`)
        } else if(request.greeting == "checkLogin"){
          showMsg('正在验证店铺账号，请稍候。。。')
        } else if(request.greeting == "checkLoginFaile"){
          showMsg('验证店铺账号失败，请重试。。。')
        } else if(request.greeting == "postShopData"){
          showMsg('正在回填店铺信息，请稍候。。。')
        } else if(request.greeting == "postShopDataFaile"){
          showMsg('回填店铺信息失败，请重试。。。')
        } else if (request.greeting == 'fetchError') {
          $("#crx-cer-progressing").html('获取数据出错，请重试！');
        } else if (request.greeting == "errorTips") {
          alert(request.message)
        } else if (request.greeting == 'turnPage') {
          let tk = $("#token").val();
          chrome.runtime.sendMessage({
            greeting: "turn_page",
            tk
          });
        } else if (request.greeting == 'finish') {
          $("#crx-cer-progressing").html('数据回填已经完成！');
        }

      });

  }
  return;


})
