import PreviewImage from '../components/PreviewImage/PreviewImage.vue'

export default {
  data () {
    return {
      currentImageSrc: '', // 当前点击的图片地址
      shouldShowImagePreview: false, // 图片预览显隐
      previewImageEventSource: {} // 图片预览事件对象
    }
  },
  methods: {
    showImage (src, event) {
      this.currentImageSrc = src
      this.shouldShowImagePreview = true
      this.previewImageEventSource = {
        clientX: event.target.getBoundingClientRect().left + event.target.offsetWidth + 17,
        clientY: event.target.getBoundingClientRect().top
      }
    }
  },
  components: {
    PreviewImage
  }
}
