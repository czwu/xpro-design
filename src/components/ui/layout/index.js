import Layout from './src/layout'
import './layout.scss'
Layout.install = (vue) => {
  vue.component(Layout.name, Layout)
}

export default Layout