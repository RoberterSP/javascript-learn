/* eslint-disable */
//解析url
var getUrlParameter = function getUrlParameter(sParam) {
  var sPageURL = decodeURIComponent(window.location.search.substring(1)),
      sURLVariables = sPageURL.split('&'),
      sParameterName,
      i;

  for (i = 0; i < sURLVariables.length; i++) {
      sParameterName = sURLVariables[i].split('=');

      if (sParameterName[0] === sParam) {
          return sParameterName[1] === undefined ? true : sParameterName[1];
      }
  }
};
// var _paq = _paq || [];
// 在所有可以应用的链接元素上安装链接跟踪
_paq.push(['enableLinkTracking', true]);
(function () {
    try {
        // let _paq = []
        let siteId = SiteId
        let version = Version
        let tenantName = TenantName
        let userId = window.localStorage.getItem('userId')
        let userName = window.localStorage.getItem('userName')
        let nameSpace = window.localStorage.getItem('nameSpace')
        
        // // 如果SiteId是false,则不发送Piwik数据
        if(SiteId === '' || SiteId === false){
            return
        }
        
        var u = "https://a.nexttao.com/";
        // 当url为空不发送
        if (u == "" || u == "false" || u == false) {
            return
        }
        // 必要参数
        if (!!userId) {
            _paq.push(['setUserId', userId]);
        }
        _paq.push(['setTrackerUrl', u + 'piwik.php']);
        _paq.push(['setSiteId', siteId]);
        _paq.push(['setDocumentTitle', document.title]);
        // 自定义参数
        _paq.push(['setCustomVariable', "1", "UserName", userName])
        _paq.push(['setCustomVariable', "2", "NameSpace", nameSpace, 'page'])
        _paq.push(['setCustomVariable', "3", "TenantName", tenantName])
        _paq.push(['setCustomVariable', "4", "Version", version, 'page'])
        console.log('siteId:', siteId, 'userId:', userId, 'userName:', userName, 'nameSpace:', nameSpace, 'tenantName:', tenantName, 'version:', version)

        var d = document, g = d.createElement('script'), s = d.getElementsByTagName('script')[0];
        g.type = 'text/javascript';
        g.async = true;
        g.defer = true;
        g.src = u + 'piwik.js';
        s.parentNode.insertBefore(g, s);
    } catch (e) {
        console.log('piwik error', e)
    }
})()
