// 注意：一定是 exports，不是 export，否则会报错，报错信息是下列的中的内容不是 string
/*
 * 在HTML 模板中使用，要特别注意在 js 中的国际化写法
 * <input style="width: 300px;" class="form-control" :placeholder="$t('placeholder.enter')">
 * brands: [this.$t('brands.nike'), this.$t('brands.adi'), this.$t('brands.nb'), this.$t('brands.ln')]
*/
module.exports = {
  sidebar: {
    logout: '登出',
    selectArea: '选择分区',
    pleaseSelectArea: '请选择分区',
    nameSpace: '命名空间'
  }
}