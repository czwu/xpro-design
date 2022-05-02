<template>
    <div class="meta-list-editor flex-col">
        <div class="flex-row" v-for="(row, i) in data" :key="i">
            <div class="drag-icon">
                <el-icon v-if="sortable">
                    <el-icon-sort />
                </el-icon>
            </div>
            <template v-for="col in columns" :key="col.mapping" >
                <meta-field
                    class="meta-field"
                    v-if="check(col, row)"
                    :prop="getProp(col, row)"
                    @change="(val, prop) => onFieldChange(val, prop, row)"
                ></meta-field>
            </template>
            <div v-if="deleteable" @click="deleteHandler(row)" class="flex-icon">
                <el-icon v-if="sortable"  class="del-icon"  >
                    <el-icon-remove  />
                </el-icon>
            </div>
        </div>
        <div v-if="addable" style="margin: 0 0 20px 20px">
            <el-button icon="el-icon-plus" type="text" @click="addHandler">{{ addButtonLabel }}</el-button>
        </div>
    </div>
</template>


<script>
import dragList from 'vuedraggable'
import { defineComponent, reactive, watch } from 'vue'
import MetaField from "../meta-form/MetaField.vue";
import set from "lodash/set";
import get from "lodash/get";
import { clone } from '@/utils/util';
export default defineComponent({
    name: 'ListEditor',
    props: {
        data: {
            type: Array,
            default: () => []
        },
        columns: {
            type: Array,
            default: () => []
        },
        addable: Boolean,
        deleteable: Boolean,
        sortable: Boolean,
        addButtonLabel: {
            type: String,
            default: '新增'
        },
        dataTemplate: {
            type: Function,
            default: () => { return {} }
        },
        beforeDelete: Function
    },
    emits: ["change"],
    components: {
        dragList, MetaField
    },
    setup(props, { emit }) {
        function addHandler() {
            props.data.push(reactive(props.dataTemplate(props.data)))
        }
        function deleteHandler(row) {
            if (props.beforeDelete) {
                if (props.beforeDelete()) {
                    this.sync2Value()
                }
            }
            props.data.splice(props.data.indexOf(row), 1)
        }
        function check(field, meta) {
            if (field.vif) {
                return field.vif(meta);
            }
            return true
        }
        function onFieldChange(value, prop, row) {
            if (prop) {
                prop.value = value;
                if (prop.mapping) {
                    set(row, prop.mapping, value);
                }
                emit('change', this.data)
            }
        }
        function getProp(col, row) {
            const prop = clone(col)
            prop.value = get(row, col.mapping)
            return prop
        }

        return {
            check,
            deleteHandler,
            addHandler,
            onFieldChange,
            getProp
        }
    }
})
</script>

<style lang="scss" scoped>
.meta-field{
    margin:0 0;
    padding:0 
}
.drag-icon{
    cursor:pointer;
}
.del-icon{
    width:1.1em;
    height:1.1em;
    cursor: pointer;
}
.flex-icon{
    align-items: center;
}
 :deep(.del-icon svg) {
    color:Red;
    width:1.1em;
    height:1.1em;
}
</style>
