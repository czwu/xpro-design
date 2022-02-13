import XRender from './render/render.js'
import SvgIcon from './svg-icon/index.vue'

export default {
  install: (app) => {
    app.component('XRender',XRender)
    app.component(SvgIcon.name,SvgIcon)
  }
}
