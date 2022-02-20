import XRender from './render/render.js'
import SvgIcon from './svg-icon/index.vue'

import Layout from './ui/layout/index'

export default {
  install: (app) => {
    app.component('XRender',XRender)
    app.component(SvgIcon.name,SvgIcon)

    app.use(Layout)
  }
}
