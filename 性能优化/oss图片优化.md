OSS的图片处理配置

目前支持5种

thumb - 商品缩略图 430x430

avatar - 头像 200x200

banner - 轮播图 800x800

web - 商品/活动等详情图 宽度800 高度自适应

wx_cover - 微信多图文主图，900x500(jpeg格式, 绝对质量75)

mp_subcategory - 小程序商品二级分类图，800x200(jpeg格式)

统一转成jpeg格式，绝对质量90

举例，原图 1035x917 382k

http://oss2.nexttao.com/shopforce/images/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20181030115247.jpg.jpg

如果用在详情中,后缀加 @!web 变成 750x664 136k

http://oss2.nexttao.com/shopforce/images/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20181030115247.jpg.jpg@!web

缩略图的话 加 @!thumb 61k

http://oss2.nexttao.com/shopforce/images/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20181030115247.jpg.jpg@!thumb

作为微信主图

http://oss2.nexttao.com/shopforce/images/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20181030115247.jpg.jpg@!wx_cover

作为商品二级分类的图

http://oss2.nexttao.com/shopforce/images/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20181030115247.jpg.jpg@!mp_subcategory