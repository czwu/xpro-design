import { uuid } from '@/utils/util'


/**
 * 整个页面设计器的全局上下文对象, 用于数据缓存
 */
const context = {
  idMap:{},

  components: {
  },

  uuid(compName, preIndex) {
    if (!compName) {
      return uuid()
    } else {
      compName = compName.replace(/-/g, '_')
      if (preIndex) {
        this.idMap[compName] = Math.max(preIndex, this.idMap[compName] || 1)
      }
      const index = this.idMap[compName] = this.idMap[compName] ? ++this.idMap[compName] : 1
      return `${compName}_${index}`
    }
  },

  getConfig(compName, ...args) {
    const comp = this.components[compName]
    const conf = comp ? comp.getConfig(...args) : {}
    conf.uid = this.uuid(compName)
    conf.design = conf.design || {}
    Object.assign(conf,{
      selected: false,
      span: conf.design.autoWidth ? 0 : conf.design.span || 24
    })
    if (compName === 'v-table') {
      conf.children.pid = conf.uuid
    }
    return conf
  },
  // 当前设计面板选中的组件
  activeComponent: null,
  // 当前设计面板选中的组件的路径
  activeCompPath: null,

  // 可用图标清单
  iconList: null,

  // 当前事件编排元数据对象
  currEventMeta: null,

  clear() {
    this.activeCompPath = null
    this.activeComponent = null
    this.currEventMeta = null
    this.idMap = {}
  }

}
window.context = context

export default context
