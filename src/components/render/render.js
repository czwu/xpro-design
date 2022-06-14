import { h, isVNode, resolveComponent } from "vue";
import XEUtils from "xe-utils";
const viewMap = {
  select: "ElSelect",
  button: "ElButton",
  text: "span",
  input:"ElInput",
  select:'ElSelect',
  slot:'DesignSlot',
  form:'ElForm',
  row:'ElRow',
  col:'ElCol',
  'form-item':'ElFormItem',
  'radio-group':'el-radio-group',
  'checkbox-group':'el-checkbox-group',
  switch:'ElSwitch',
  'date-picker':'ElDatePicker',
  'time-picker':'ElTimePicker'
};
const getNodes = (meta, context, beforeRender) => {
  if (isVNode(meta)) {
    return meta;
  } else if (XEUtils.isFunction(meta)) {
    return getNodes(meta(h, context));
  } else if (Array.isArray(meta)) {
    return meta.map((item, idx) => getNodes(item, beforeRender, idx));
  } else if (XEUtils.isObject(meta)) {
    beforeRender?.(meta);
    const childs = meta?.children;
    let childNodes = [];
    if (Array.isArray(childs)) {
      childNodes = childs.map((item, idx) =>
        getNodes(item, context, beforeRender, idx)
      );
    } else {
      childNodes = getNodes(childs, context, beforeRender);
    }
    //TODO 检测是否可以取消析构
    const props = { ...meta.props };
    if (meta.slots) {
      const children = {};
      Object.keys(meta.slots).forEach((key) => {
        const slotNode = getNodes(meta.slots[key], context, beforeRender);
        children[key] = () => slotNode;
      });
      if (childNodes) {
        children.default = () => childNodes;
      }

      return h(
        resolveComponent(meta.tag || viewMap[meta.name] || meta.name),
        props,
        children
      );
    }

    const children = meta.tag ? childNodes : () => childNodes;
    return h(
      meta.tag || resolveComponent(viewMap[meta.name] || meta.name),
      props,
      children
    );
  } else if (typeof meta === "string") {
    return meta;
  }
};
const render = (props, context) => {
  if (props.meta) {
    let { meta, beforeRender } = props;
    if (meta) {
      return getNodes(XEUtils.clone(meta, true), context, beforeRender);
    }
  } else {
    return h(`div`, { class: "empity-content" }, "");
  }
};
render.props = ["meta", "beforeRender"];

export default render;
