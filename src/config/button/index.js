import context from "@/common/context";
import Props from "../props";
import { emitter, EVENTS } from "@/common/bus";
context.components.button = {
  // 组件默认配置
  getConfig(parent, ctx) {
    return {
      name: 'button',
      props: {},
      span:0,
      children:'按钮'
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
            label: '按钮文本',
            mapping: 'children',
            type: 'i18n',
            value: '',
            clearable: true
          },
          // {
          //   label: '按钮类型',
          //   mapping: 'props.type',
          //   type: 'select',
          //   options: ['default', 'primary', 'success', 'warning', 'danger', 'info', 'text'],
          //   value: 'text',
          //   help: '按钮类型'
          // }, {
          //   label: '按钮图标',
          //   mapping: 'props.icon',
          //   type: 'icon',
          //   value: ''
          // },
          // Props.width({ help: '' }),
          // Props.size(),
          // ...Props.eventBtn()
        ]
      },
      // {
      //   group: '高级配置',
      //   groupType: 'collapse',
      //   properties: [
      //     Props.disabledExp(),
      //     {
      //       label: '圆角',
      //       mapping: 'props.round',
      //       type: 'bool',
      //       value: false,
      //       help: '是否圆角按钮'
      //     },
      //     {
      //       label: '朴素按钮',
      //       mapping: 'props.plain',
      //       type: 'bool',
      //       value: false,
      //       help: '是否朴素按钮'
      //     },
      //     {
      //       label: '字体颜色',
      //       mapping: 'style.color',
      //       type: 'color',
      //       value: ''
      //     },
      //     Props.classList(),
      //     Props.vif(),
      //     ...Props.permission(),
      //     ...Props.tooltip(),
      //     ...Props.styles()
      //   ]
      // }
    ]
  },

  getEvents() {
    return [
      { id: 'click', label: '点击事件' }
    ]
  }

}
