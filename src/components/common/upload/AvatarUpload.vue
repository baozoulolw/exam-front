<template>
  <t-upload
      v-model="data.file"
      :request-method="saveImg"
      theme="image"
      accept="image/*, .png , .svg"
      @fail="handleFail"
      :sizeLimit="{ size: 2, unit: 'MB', message: '图片大小不超过 {sizeLimit} MB' }"
      trigger="点击上传头像"
  ></t-upload>
</template>

<script setup>
import {reactive, onMounted} from 'vue'
import {ElMessage} from "element-plus";
import {Plus} from '@element-plus/icons'

const props = defineProps({
  file:Object
})

const emit = defineEmits(['update:file'])

const data = reactive({
  file: []
})

/**
 * 网络请求
 */


/**
 * 事件
 */

const handleFail = () => {

}

const saveImg = async (file) => {
  let reader = new FileReader();
  reader.readAsDataURL(file.raw);
  emit('update:file',file.raw);
  return new Promise(resolve=>{
    reader.onloadend = () => {
      let url = reader.result;
      resolve({status: 'success', response: {url}})
    }
  })
}

onMounted(() => {
})
</script>

<style scoped lang='less'>
</style>