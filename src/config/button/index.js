import context from "@/common/context";
import Props from "../props";
context.registerComponent("button", {
  // 组件默认配置
  getConfig() {
    return {
      uid: "",
      name: "button",
      span: 0,
      props: {},
      children: "按钮",
    };
  },
  // 组件的属性配置
  getProperties() {
    return [
      {
        group: "常用配置",
        properties: [
          Props.uid(),
          {
            label: "按钮文本",
            mapping: "children",
            type: "i18n",
            value: "",
            clearable: true,
          },
          {
            label: "按钮类型",
            mapping: "props.type",
            type: "select",
            options: [
              "default",
              "primary",
              "success",
              "warning",
              "danger",
              "info",
              "text",
            ],
            value: "text",
          },
          {
            label: "按钮图标",
            mapping: "props.icon",
            type: "icon",
            value: "",
          },
          Props.width({ help: "" }),
          Props.size(),
          ...Props.eventBtn(),
        ],
      },
      {
        group: "高级配置",
        properties: [
          Props.disabledExp(),
          {
            label: "圆角",
            mapping: "props.round",
            type: "bool",
            value: false,
            help: "是否为圆角按钮",
          },
          {
            label: "朴素按钮",
            mapping: "props.plain",
            type: "bool",
            value: false,
            help: "是否为朴素按钮",
          },
          {
            label: "圆形按钮",
            mapping: "props.circle",
            type: "bool",
            value: false,
            help: "是否为圆形按钮",
          },
          // {
          //   label: '加载中',
          //   mapping: 'props.loading',
          //   type: 'bool',
          //   value: false,
          //   help: '是否为加载中状态'
          // },
          {
            label: "字体颜色",
            mapping: "props.style.color",
            type: "color",
            value: "",
            help: "可自定义按钮文本颜色",
          },
          Props.class(),
          Props.vif(),
          ...Props.permission(),
          ...Props.tooltip(),
          ...Props.styles(),
        ],
      },
    ];
  },

  getEvents() {
    return [{ id: "click", label: "点击事件" }];
  },
});
