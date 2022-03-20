function generateData(meta, ctx) {
    const vars = []
    meta.models.forEach(model => {
        if (model.id === 'props') {
            // 组件模式
            ctx.vue$props.push(model.fields.map(field => {
                return `${field.id}:${field.dataType}`
            }))
        } else {
            const isApi = model.apiUcode
            vars.push(`${model.name}:{${getFieldsVars(model.fields, isApi)}}`)
        }
    })
    ctx.vue$data.push(...vars)
}

function getFieldsVars(fields, isApi) {
    const vars = []
    fields.forEach(field => {
        let value = "''"
        if (field.dataType === 'Array') {
            value = getValue(field) || `[]`
        } else if (field.dataType === 'boolean') {
            value = getValue(field) || 'false'
        } else if (field.dataType === 'Object') {
            if (field.children && field.children.length) {
                value = `{${getFieldsVars(field.children)}}`
            } else {
                value = getValue(field) || '{}'
            }
        } else if (field.dataType === 'String') {
            value = getValue(field) || `''`
        } else {
            value = getValue(field)
        }
        if (isApi && !value && (field.name === 'pageNum' || field.name === 'pageSize')) {
            // 模型pageNum 与pageSize 暂时不需要生成
        } else {
            vars.push(`${field.name || '字段未命名'}: ${value}`)
        }
    })
    return vars.join(',')
}

function getValue(field) {
    if (field.defaultValue) {
        if (field.valueSource === 'value') {
            if (field.dataType === 'String') {
                return `'${field.defaultValue || ''}'`
            } else if (field.dataType === 'Integer') {
                return parseInt(field.defaultValue)
            } else {
                return field.defaultValue
            }
        } else if (field.valueSource === 'querys') {
            return 'this.' + field.defaultValue
        }
    } else {
        return null
    }
}


export function generateScript(meta, ctx = {}) {
    generateData(meta, ctx)
    ctx.vue$data.push('listeners:[]')
    return `export default {
     components: {},
     props:{
       ${ctx.vue$props.join(',')}
     },
     data() {
       return {
         ${ctx.vue$data.join(',')}
       }
     },
     computed: {},
     watch: {
       ${ctx.vue$watch.join(',')}
     },
     created() {
       ${ctx.vue$created.join('\n')}
     },
     mounted() {
       this.init()
     },
     methods: {
       async init(ctx = {}){
         ${ctx.vue$mounted.join('\n')}
       },
       ${ctx.vue$methods.join(',')}
     },
     beforeUnmount(ctx={}) {
       ${ctx.vue$beforeUnmount.join(';')}
       this.listeners.forEach(item=>{
        this.$bus.$off(item.key,item.fn)
      });
     },
     activated(ctx={}){
        ${ctx.vue$activated.join(';')}
     }
   }`
}