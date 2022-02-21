<template>
   <div class="meta-field flex-row">
    <span v-if="prop.label" class="prop-label">
      {{ prop.label }}
      <el-tooltip
        v-if="prop.help"
        class="item"
        effect="dark"
        :content="prop.help"
        placement="top"
      >
        <i class="el-icon-info" />
      </el-tooltip>
    </span>
    <span class="prop-content flex-grow">
      <v-render :config="config" :context="{}" />
    </span>
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