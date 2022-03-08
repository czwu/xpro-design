import { deepClone } from "./util";
import { useI18n } from "vue-i18n";
import tags from './tags'
/**
 * 组件template 渲染入口
 * @param meta 组件元数据配置对象
 * @param ctx 渲染上下文参数
 * @returns {object}
 */
export function compile(meta, ctx = {}) {
  const meta = deepClone(meta);
  // 上下文初始化
  ctx.vue$props = [];
  ctx.vue$data = [];
  ctx.vue$methods = [];
  ctx.vue$created = [];
  ctx.vue$beforeUnmount = [];
  ctx.vue$watch = [];
  ctx.vue$pageInit = [];
  ctx.vue$pageActivated = [];
  ctx.path = [];
  ctx.pageMeta = meta;
  ctx.cssCode = [];
  // 优先执行html compile, compileHtml 内部会解析元数据,并分析JSCode
  const html = generateHtml(meta, ctx);
  return {
    js: this.compileScript(meta, ctx),
    css: wrapCss(meta.css, meta.id) + ctx.cssCode.join("\n"),
    html,
  };
}

function generateHtml(meta, ctx) {
  const i18n = useI18n()
  const { view, props } = meta;
  let tagName = tags[view] || view
  if (typeof meta === "string") {
    return i18n.t(meta);
  }
  if (!tagName) {
    return "";
  }
  // 编译前预处理,主要处理组件元数据中自定义配置项
  pretreatment(meta, ctx);
  // 预处理函数可能修改渲染组件名, 需要重新获取
  tagName = tagMap[meta.name] || tagName;
  if (tagName === "async-component") {
    tagName = `async-component-${meta.code}`;
  }

  // 编译元数据红的design.initApi
  compileInitApi(meta, ctx);
  if (ctx.path[ctx.path.length - 1] !== meta) {
    ctx.path.push(meta);
  }

  // 如果有children 则递归执行子组件解析,如果没有children元素,则走动态子元素解析逻辑
  let childHtml = meta.children
    ? this.compileChildren(meta.children, ctx)
    : this.compileDynamicChildren(meta, ctx);
  const slotsHtml = this.compileChildren(meta.slots, ctx);
  ctx.path.pop();
  if (!childHtml && meta.design && meta.design.template) {
    childHtml = meta.design.template;
    meta.props.template_id = meta.uuid;
  }
  // 检查元数据中是否有配置插槽名称, 如果有,则加上插槽名称
  const slotName = meta.slot ? `slot='${meta.slot}'` : "";
  // 根据元数据中的属性配置生成 vue属性字符串

  const propsHtml = this.compileProps(props, ctx).join("");
  const styleHtml = this.compileStyles(style, ctx).join(";");
  // 样式名称处理
  const cssNames = [];
  for (const name in meta.class) {
    if (meta.class[name]) {
      cssNames.push(name);
    }
  }
  const css = cssNames.length ? `class='${cssNames.join(" ")}'` : "";
  const styles = styleHtml.length ? `style='${styleHtml}'` : "";
  // 获取数据模型绑定值 (需要进行处理)
  const vmodel = getModel(meta, ctx);
  // 处理循环指令
  let vfor = "";
  if (meta.design.vfor && meta.design.scope) {
    vfor = `v-for='(${meta.design.scope_alias || "item"},index) in ${
      meta.design.scope
    }' :key='index'`;
  }
  // 处理动态数据
  let data = "";
  if (
    meta.design.bindDataAttr &&
    meta.design.dataType === "api" &&
    meta.design.initApi.apiUcode
  ) {
    data = `:${meta.design.bindDataAttr}='${meta.uuid || meta.pid}_api_data'`;
  }
  // 处理ref
  const ref = meta.ref
    ? `ref='${meta.uuid || ctx.path[ctx.path.length - 1].uuid}'`
    : "";
  // 事件处理
  if (meta.events) {
    compileEvents(meta, ctx);
  }
  const events = meta.events ? this.compileEvents(meta.events, ctx) : "";

  const customAttr = meta.design.customAttr || "";
  const vif = meta.design.vif ? `v-if='${meta.design.vif}'` : "";
  const html = `<${tagName} ${vfor}  ${vif} ${data}  ${vmodel} ${slotName} ${propsHtml} ${customAttr} ${css} ${ref} ${styles} ${events}>
     ${childHtml}
     ${slotsHtml}
     </${tagName}>`;
  // 处理元素包裹
  return this.wrap(html, meta, ctx);
}

/**
 * css 包装
 * @param {*} css 
 * @param {*} pageId 
 * @returns 
 */
function wrapCss(css = "", pageId) {
  css = css
    .replace(/([^}]+?{)/g, "." + pageId + " $1")
    .replace(/,([^}]+{)/g, function (str, $1) {
      return ",." + pageId + " " + replaceDot($1, pageId);
    });
  return css;
}
