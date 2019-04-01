/* eslint-disable */
(function (doc, win) {
  var docEl = doc.documentElement
  var resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize'
  var u = navigator.userAgent;
  var recalc = function () {
    var clientWidth = docEl.clientWidth
    if (!clientWidth) return
    if (clientWidth >= 750) {
      if (u.indexOf('Android') > -1 || u.indexOf('Linux') > -1) {
        // 安卓
        docEl.style.fontSize = '85px'
      } else {
        docEl.style.fontSize = '100px'
      }
    } else {
      docEl.style.fontSize = 100 * (clientWidth / 750) + 'px'
    }
  }
  if (!doc.addEventListener) return
  win.addEventListener(resizeEvt, recalc, false)
  doc.addEventListener('DOMContentLoaded', recalc, false)
})(document, window)