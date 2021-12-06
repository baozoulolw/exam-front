<template>
  <div class="main">
    <TextBox></TextBox>
  </div>
</template>

<script setup>
import { reactive, onMounted } from 'vue'
import TextBox from '../../../components/common/text/TextBox.vue';
const data = reactive({})
onMounted(() => {
})
</script>
<style scoped lang='less'>
.main{
  
}
</style>