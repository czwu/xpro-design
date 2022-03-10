import context from "@/common/context";
import Props from "../props";

context.registerComponent("text", {
  // 组件默认配置
  getConfig() {
    return {
      uid: "",
      name: "text",
      tag: "span",
      props: {},
      span: 0,
      slotText: "文本",
      props: {
        style: {},
      }
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
            label: "静态文本",
            mapping: "slotText",
            type: "i18n",
            value: "",
            clearable: true,
          },
          {
            label: "绑定模型",
            mapping: "vmodel",
            type: "model",
            value: "",
            clearable: true,
          },
          {
            label: "字体颜色",
            mapping: "props.style.color",
            type: "color",
            value: "",
          },
          Props.span({
            label: "宽度",
            help: "设置为0时，将自适应文本宽度，否则按照栅格宽度",
            onChange(val, meta) {
              if (val) {
                meta.props.style.display = "block";
              } else {
                delete meta.props.style.display;
              }
            },
          }),
        ],
      },
      {
        group: "高级配置",
        properties: [
          Props.fontSize(),
          Props.lineHeight(),
          Props.class(),
          Props.vif(),
          ...Props.tooltip(),
          ...Props.styles(),
        ],
      },
    ];
  },
  getEvents() {
    return [{ id: "click", label: "点击事件" }];
  }
});
