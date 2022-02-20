import { h, isVNode, resolveComponent} from "vue";
import XEUtils from "xe-utils";
const $pre = "el-";
const viewMap = {
  select: $pre + "select",
  button: "ElButton",
};

const getNodes = (meta, context, beforeRender) => {
  if (isVNode(meta)) {
    return meta;
  } else if (XEUtils.isFunction(meta)) {
    return getNodes(meta(h,context))
  } else if(Array.isArray(meta)){
    return meta.map((item,idx) => getNodes(item, beforeRender, idx))
  }else if(XEUtils.isObject(meta)){
    beforeRender?.(meta)
    const childs = meta?.children
    let childNodes = []
    if(Array.isArray(childs)){
      childNodes = childs.map((item,idx) => getNodes(item, context, beforeRender, idx))
    }else{
      childNodes = getNodes(childs, context,beforeRender)
    }
    //TODO 检测是否可以取消析构
    const props = {...meta.props}
    return h(resolveComponent(meta.tag || viewMap[meta.view] || meta.view), props, childNodes);

  }else if(typeof meta === "string"){
    return h(meta)
  }
};
const render = (props, context) => {
  if (props.meta) {
    let { meta, beforeRender } = props;
    if (meta) {
      return getNodes(JSON.parse(JSON.stringify(meta)),context, beforeRender)
    }
  } else {
    return h(`div`, { class: "empity-content" }, "");
  }
};
render.props = ["meta",'beforeRender'];

export default render;

