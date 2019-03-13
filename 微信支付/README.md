### 微信支付探索
####     支付模式
    付款码支付(线下面对面收银)
    Native支付(商户按微信协议生成支付二维码,用户用"扫一扫"支付完成)
    JSAPI支付
    APP支付
    H5支付
    小程序支付

####     名词说明
    APPID               appid       微信公众号或开放平台APP的唯一标识,用于标识该应用
    微信支付商户号         mch_id      商户申请微信支付后,由微信支付分配的商户收款账号
    API密钥              key          支付交易,产生的签名密钥,仅保留在商户系统和微信支付平台
    Appsecret           secret       是AppID对应的接口密码,用于获取接口调用凭证access_token
####    接口规则
    协议规则 --->  参考:https://pay.weixin.qq.com/wiki/doc/api/jsapi.php?chapter=4_1
    参数规定 --->  参考:https://pay.weixin.qq.com/wiki/doc/api/jsapi.php?chapter=4_2
    安全规范 --->  参考:https://pay.weixin.qq.com/wiki/doc/api/jsapi.php?chapter=4_3

