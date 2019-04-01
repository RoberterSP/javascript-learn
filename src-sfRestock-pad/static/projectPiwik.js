
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
_paq.push(['enableLinkTracking', true]);
(function() {
    try {
        var storage, SiteId, userId, platform, appVersion, shopName, tenantId, tenantName
        storage = window.localStorage
        SiteId = getUrlParameter('SiteId') || storage.getItem("SiteId") || siteId
        userId = getUrlParameter('UserId') || storage.getItem("UserId") || UserId
        appVersion = getUrlParameter('AppVersion')?decodeURIComponent(getUrlParameter('AppVersion')):'' || storage.getItem("AppVersion") || AppVersion
        platform = getUrlParameter('Platform')?decodeURIComponent(getUrlParameter('Platform')):'' || storage.getItem("Platform") || Platform
        shopName = getUrlParameter('ShopName')?decodeURIComponent(getUrlParameter('ShopName')):'' || storage.getItem("ShopName") || ShopName
        tenantId = getUrlParameter('TenantId') || storage.getItem("TenantId") || TenantId
        tenantName = getUrlParameter('TenantName')?decodeURIComponent(getUrlParameter('TenantName')):'' || storage.getItem("TenantName") || TenantName
        
        if(!!storage){
            storage.setItem("SiteId", SiteId || '')
            storage.setItem("UserId", userId || '')
            storage.setItem("AppVersion", appVersion || '')
            storage.setItem("Platform", platform || '')
            storage.setItem("ShopName", shopName || '')
            storage.setItem("TenantId", tenantId || '')
            storage.setItem("TenantName", tenantName || '')
        }
        // // 如果SiteId是false,则不发送Piwik数据
        if(SiteId === '' || SiteId === false){
            return
        }

        var u="https://a.nexttao.com/";
        // 当url为空不发送
        if(u == "" || u == "false" || u == false){
            return
        }
        if(!!userId){
            _paq.push(['setUserId', userId]);
        }
        _paq.push(['setTrackerUrl', u+'piwik.php']);
        _paq.push(['setSiteId', SiteId]);
        _paq.push(['setDocumentTitle', document.title]);

        _paq.push(['setCustomVariable', "1", "Platform", localStorage.getItem("Platform")] || platform)
        _paq.push(['setCustomVariable', "2", "TenantId", localStorage.getItem("TenantId")] || tenantId)
        _paq.push(['setCustomVariable', "3", "TenantName", localStorage.getItem("TenantName")] || tenantName)
        _paq.push(['setCustomVariable', "4", "ShopName", localStorage.getItem("ShopName")] || shopName)
        _paq.push(['setCustomVariable', "5", "AppVersion", localStorage.getItem("AppVersion") || appVersion, 'page'])
        _paq.push(['trackPageView']);

        console.log('SiteId: ' + SiteId, '; userId: ' + userId, '; platform: ' + platform, '; tenantId: ' + tenantId, '; tenantName: ' + tenantName, '; shopName: ' + shopName, '; appVersion: ' + appVersion)

        var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
        g.type='text/javascript'; g.async=true; g.defer=true; g.src=u+'piwik.js'; s.parentNode.insertBefore(g,s);
    }catch (e){
        console.log(e);
    }
})();