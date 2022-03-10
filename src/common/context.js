import { uuid } from '@/utils/util'

const uidIndexMap = {}
/**
 * 整个页面设计器的全局上下文对象, 用于数据缓存
 */
const context = {

  components: {},

  generateId(compName, index) {
    if (!compName) {
      return uuid()
    } else {
      compName = compName.replace(/-/g, '_')
      if (index) {
        uidIndexMap[compName] = Math.max(index, uidIndexMap[compName] || 1)
      }else{
        index = uidIndexMap[compName] =  uidIndexMap[compName] ? uidIndexMap[compName] + 1 : 1
      }
      return `${compName}_${index}`
    }
  },

  registerComponent(name,config){
    this.components[name] = config
  },

  getConfig(compName, ...args) {
    const comp = this.components[compName]
    const conf = comp ? comp.getConfig(...args) : {}
    conf.uid = this.generateId(compName)
    Object.assign(conf,{
      selected: false,
      span: conf.span===0 ? 0 :  conf.span || 24 ,
    })
    if(!conf.props.class){
      conf.props.class = []
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

  reset() {
    this.activeCompPath = null
    this.activeComponent = null
    this.currEventMeta = null
    this.uidIndexMap = {}
  }

}
window.context = context
export default context
