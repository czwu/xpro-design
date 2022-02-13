<script setup>
import { ref, reactive} from 'vue'
const data = reactive({
  view:'button',
  props:{
    type:'primary'
  },
  children:'sdfdfsdf'
})
const name = ref("button1")

</script> 

<template>
  <router-view></router-view>
</template>

<style lang="scss" >
#app{
  width:100vw;
  height:100vh;
  display: flex;
  flex-direction: column;
}
</style>