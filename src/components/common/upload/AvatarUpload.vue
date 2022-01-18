<template>
  <t-upload
      v-model="data.file"
      :request-method="saveImg"
      theme="image"
      accept="image/*, .png , .svg"
      @fail="handleFail"
      trigger="点击上传头像"
  ></t-upload>
</template>

<script setup>
import {reactive, onMounted} from 'vue'
import {ElMessage} from "element-plus";
import {Plus} from '@element-plus/icons'

const props = defineProps({})

const emit = defineEmits([])

const data = reactive({
  file: []
})

/**
 * 网络请求
 */


/**
 * 事件
 */
const handleAvatarSuccess = (res, file) => {
  data.imageUrl = URL.createObjectURL(file.raw)
}
const beforeAvatarUpload = (file) => {
  const isJPG = file.type === 'image/jpeg'
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isJPG) {
    ElMessage.error('Avatar picture must be JPG format!')
  }
  if (!isLt2M) {
    ElMessage.error('Avatar picture size can not exceed 2MB!')
  }
  return isJPG && isLt2M
}

const handleFail = () => {

}

const saveImg = async (file) => {
  let reader = new FileReader();
  reader.readAsDataURL(file.raw);
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