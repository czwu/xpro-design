import loadScript from './loadScript'
import { ElLoading } from 'element-plus'

let beautifierObj

export default function loadBeautifier(cb) {
  if (beautifierObj) {
    cb(beautifierObj)
    return
  }
  const loading = ElLoading.service({
    fullscreen: true,
    lock: true,
    text: '格式化资源加载中...',
    spinner: 'el-icon-loading',
    background: 'rgba(255, 255, 255, 0.5)'
  })
  loadScript('./static/beautifier.min.js', () => {
    loading.close()
    beautifierObj = window.beautifier
    cb(beautifierObj)
  })
}
