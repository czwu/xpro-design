

/**
 * 获取随机字符
 * @return {number}
 */
function getRandomInt() {
  const num = Math.random() * 100000
  return Math.floor(num)
}

/**
 * 按指定长度生成随机字符串uuid
 * @param {长度} len
 */
function uuid(len = 8) {
  // ABCDEFGHIJKLMNOPQRSTUVWXYZ
  var chars = '0123456789abcdefghijklmnopqrstuvwxyz'.split('')
  var uuid = []; var i
  const radix = chars.length
  for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix]
  return uuid.join('')
}

/**
 * 返回入参的数据类型
 *  @param {any} obj
 */
function type(obj) {
  var toString = Object.prototype.toString
  var map = {
    '[object Boolean]': 'boolean',
    '[object Number]': 'number',
    '[object String]': 'string',
    '[object Function]': 'function',
    '[object Array]': 'array',
    '[object Date]': 'date',
    '[object RegExp]': 'regExp',
    '[object Undefined]': 'undefined',
    '[object Null]': 'null',
    '[object Object]': 'object'
  }
  return map[toString.call(obj)]
}

/**
 * 深拷贝
 * @param {object} data
 */
function deepClone(data) {
  var t = type(data); var o; var i; var ni
  if (t === 'array') {
    o = []
  } else if (t === 'object') {
    o = {}
  } else {
    return data
  }
  if (t === 'array') {
    for (i = 0, ni = data.length; i < ni; i++) {
      o.push(deepClone(data[i]))
    }
    return o
  } else if (t === 'object') {
    for (i in data) {
      o[i] = deepClone(data[i])
    }
    return o
  }
}

/**
 *
 * @param {*} name
 */
function getUrlParams(name) {
  const startIndex = window.location.href.indexOf('?')
  // eslint-disable-next-line no-unused-vars
  let param = window.location.href.substr(startIndex + 1)
  const paramsObj = {}
  param = param.split('&').map(item => {
    const arr = item.split('=')
    paramsObj[arr[0]] = arr[1]
  })
  return name ? paramsObj[name] : paramsObj
}

/**
 * 根据路径删除对象的属性
 * @param obj
 * @param val
 * @param path
 */
function delAttrByPath(obj, path) {
  let tempObj = obj
  path = path.replace(/\[(\w+)\]/g, '.$1')
  path = path.replace(/^\./, '')
  const keyArr = path.split('.')
  let i = 0
  for (let len = keyArr.length; i < len; ++i) {
    const isLast = i > len - 2
    const key = keyArr[i]
    if (isLast) {
      delete tempObj[key]
    } else {
      if (!tempObj[key] || typeof tempObj[key] !== 'object') {
        tempObj[key] = isNaN(key) ? {} : []
      }
      tempObj = tempObj[key]
    }
  }
}

// 下划转驼峰
function camelCase(str) {
  return str.replace(/-[a-z]/g, str1 => str1.substr(-1).toUpperCase())
}

// 对象转数组
function options(obj) {
  const options = []
  if (type(obj) === 'object') {
    for (const name in obj) {
      options.push({ value: name, label: obj[name] })
    }
  }
  return options
}


function treeEach(list, fn, childKey = 'children') {
  list.forEach((child) => {
    fn(child)
    if (Array.isArray(child[childKey])) {
      treeEach(child[childKey], fn)
    }
  })
}

function vueTemplate(str) {
  return `<template>
    <div>
      ${str}
    </div>
  </template>`
}

function vueScript(str) {
  return `<script>
    ${str}
  </script>`
}

function cssStyle(cssStr, pageId) {
  return `<style>
    ${cssStr}
  </style>`
}
function wrapCss(css = '', pageId) {
  css = css.replace(/([^}]+?{)/g, '.' + pageId + ' $1').replace(/,([^}]+{)/g, function(str, $1) {
    return ',.' + pageId + ' ' + replaceDot($1, pageId)
  })
  return css
}
function replaceDot(str, pageId) {
  return str.replace(/,([^}]+{)/g, function(str, $1) {
    return ',.' + pageId + ' ' + replaceDot($1, pageId)
  })
}
export {
  wrapCss,
  delAttrByPath,
  getRandomInt,
  uuid,
  deepClone,
  type,
  getUrlParams,
  camelCase,
  options,
  vueTemplate,
  vueScript,
  cssStyle,
  treeEach
}
