import context from '@/common/context'
import Props from '../props'
context.registerComponent('select', {
  // 组件默认配置
  getConfig() {
    return {
      uid: '',
      name: 'select',
      props: {
      },
      children:[],
      slots:{},
      unaided: true
    }
  },
  // 组件的属性配置
  getProperties() {
    return [
      {
        group: '常用配置',
        properties: [
          Props.uid(),
          Props.model(),
          Props.placeholder(),
          Props.size(),
          Props.multiple(),
          Props.clearable(),
          Props.dataType(),
          Props.staticData(),
          Props.dynamicData(),
          ...Props.initApi(),
          Props.valueKey(),
          Props.labelKey(),
          Props.width({ help: '' }),
          ...Props.eventBtn()
        ]
      },
      {
        group: '高级配置',
        groupType: 'collapse',
        properties: [
          Props.clearable(),
          {
            label: '启用搜索',
            mapping: 'props.filterable',
            type: 'bool',
            value: false,
            help: '是否可搜索 (filterable)'
          }, {
            label: '自建项目',
            mapping: 'props.allow-create',
            type: 'bool',
            value: false,
            help: '是否允许用户创建新条目，需启用搜索'
          }, {
            label: '远程搜索',
            mapping: 'props.remote',
            type: 'bool',
            value: false,
            help: '启用远程搜索，需要将filterable和remote设置为true,同时设置搜索方法'
          }, {
            label: '搜索方法',
            mapping: 'props.:remote-method',
            type: 'method',
            onlyCode: true,
            value: '',
            help: '远程搜索方法',
            vif: 'props.remote'
          },

          Props.class(),
          Props.vif(),
          Props.disabled()
        ]
      }
    ]
  },

  getEvents() {
    return [
      { id: 'change', label: '值改变事件(onChange)' },
      { id: 'visible-change', label: '下拉框出现/隐藏时触发' },
      { id: 'focus', label: '当 input 获得焦点时触发' }
    ]
  },

  beforeRender(meta){
    meta.props.modelValue = []
  }

})
