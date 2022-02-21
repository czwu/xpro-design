<template>
    <div class="meta-form flex-col">
        <template v-for="(meta,i) in metas">
            <template v-if="meta.group === 'collapse'">
                <el-collapse :key="meta.name" v-model="activeName" :accordion="true">
                    <el-collapse-item :title="prop.group" :name="prop.group">
                        <div class="meta-form-group" :class="meta.class">

                        </div>
                    </el-collapse-item>
                </el-collapse>
            </template>
            <div v-else class="meta-form-group" :class="meta.class" :key="i">
               
            </div>
        </template>
    </div>
</template>


<script>

import { defineComponent, ref, reactive, toRefs } from 'vue'
export default defineComponent({
    props: {
        metas: Array,
        data: Object
    },
    setup(props) {
        const { metas } = toRefs(props)
        const activeName = ref('')
        return {
            metas,
            activeName
        }
    }
})
</script>