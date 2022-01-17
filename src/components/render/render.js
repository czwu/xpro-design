import { h } from "vue";
const $pre = "el-";
const viewMap = {
  select: $pre + "select",
};
const render = (props, context) => {
  if (props.config) {
    let { meta, beforeRender } = props.config;

    return h(`div`, null, props.msg);
  } else {
    return h(`div`, { class: "empity-content" }, "");
  }
};
render.props = ["config"];

export default render;
