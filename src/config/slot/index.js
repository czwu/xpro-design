import context from '@/common/context'
import Props from '../props'


context.registerComponent('slot', {
  // 组件默认配置
  getConfig() {
    return {
      uid: '',
      name: 'slot',
      props: {},
      children:[]
    }
  },

  // 组件的属性配置
  getProperties(meta) {
    return [
      {
        group: '常用配置',
        properties: [
          Props.uid(),
        ]
      }
 
    ]
  }

})
