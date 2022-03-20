import context from '@/common/context'
import { options } from '@/utils/util'
import Props from '../props'

context.registerComponent('dropdown', {
  // 组件默认配置
  getConfig() {
    return {
      uid: '',
      name: 'dropdown',
      span: 0,
      props: {
        splitButton : true,
        trigger: 'click'
      },
      children:{
        name:'button',
        props:{

        },
        children:[
          "下拉菜单",
          {
            name:'el-icon',
            props:{
              class:['el-icon--right']
            },
            children:{
              name:"el-icon-arrow-down",
            }
          }
        ]
      },
      slots: {
        dropdown: [
          {
            name: 'el-dropdown-menu',
            props:{}
          }
        ]
      },
      unaided: true
    }
  },
  // 组件的属性配置
  getProperties(meta) {
    return [
      {
        group: '常用配置',
        groupType: 'collapse',
        properties: [
          Props.uid(),
          {
            label: '按钮类型',
            mapping: 'children.props.type',
            type: 'select',
            options: ['primary', 'success', 'warning', 'danger', 'info', 'text'],
            value: 'text',
            help: '按钮类型'
          }, {
            label: '菜单文字',
            type: 'i18n',
            value: '',
            mapping: 'children.children[0]',
            help: '主菜单按钮文本'
          },
          {
            label: '按钮图标',
            mapping: 'children.children[1].children.name',
            type: 'icon',
            value: '',
          },
          {
            label: '组件尺寸',
            mapping: 'children.props.size',
            type: 'radio',
            options: options({ medium: '中等', small: '较小', mini: '迷你' }),
            help: '菜单按钮尺寸'
          },
          {
            label: '数据绑定',
            mapping: 'dataSourceType',
            type: 'radio',
            options: options({ static: '静态', api: '服务' }),
            value: 'static',
            help: '请提供绑定数据的来源类型'
          },
          {
            label: '下拉菜单数据',
            type: '$list',
            mapping: 'slots.dropdown',
            deleteable: true,
            addable: true,
            value: [],
            columns: [
              {
                mapping: 'children',
                type: 'i18n',
                value: '',
                placeholder: '菜单名'
              },
              {
                mapping: 'prop',
                type: 'button',
                buttonText: ' ',
                btnType: 'text',
                icon: 'el-icon-edit-outline',
                onClick(e) {
                  // const rowIndex = getRowIndex(e.target)
                  // const col = meta.slots[0].children[rowIndex * 1]
                  // bus.$emit(EVENTS.SHOW_CHILD_PROP, col, meta)
                }
              }

            ],
            addHandler() {
              return { name: 'el-dropdown-item', props: {}, children: '' }
            },
            vif: meta=> meta.dataSourceType === 'static'
          },
          ...props.initApi(meta),
          Props.valueKey({
            help: '作为菜单command命令值 段'
          }, meta),
          Props.labelKey({
            help: '作为菜单名显示的字段名称'
          }, meta),
          ...props.eventBtn()
        ]
      },
      {
        group: '高级配置',
        groupType: 'collapse',
        properties: [
          Props.class(),
          Props.vif(),
          ...Props.permission(),
          Props.disabled()
        ]
      }
    ]
  },

  getEvents(meta) {
    const arr = [
      { id: 'visible-change', label: '下拉框出现/隐藏时触发' },
      { id: 'command', label: '点击菜单项触发的事件', params: '$event' }
    ]
    if (meta.props['split-button']) {
      arr.push({ id: 'click', label: '左侧按钮的事件(分割按钮模式)' })
    }
    return arr
  }

})

context.components['el-dropdown-item'] = {
  getProperties() {
    return [
      {
        group: '菜单项配置',
        groupType: 'collapse',
        properties: [
          {
            label: '指令值',
            mapping: 'props.command',
            type: 'input',
            value: '',
            help: '指令值(command),点击菜单项触发的事件指令值'
          },
          {
            label: '菜单名称',
            mapping: 'slotText',
            type: 'i18n',
            value: '',
            help: '菜单显示名称'
          },
          {
            label: '菜单图标',
            mapping: 'props.icon',
            type: 'icon',
            value: '',
            help: '自定义菜单前置图标'
          },
          {
            label: '分割线',
            mapping: 'props.divided',
            type: 'bool',
            value: false,
            help: '是否显示分隔符'
          },
          ...Props.permission(),
          Props.disabled()
        ]
      }
    ]
  }
}

