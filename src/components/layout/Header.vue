<template>
  <div class="main">
    <el-avatar :size="50" :src="avatar">

    </el-avatar>
  </div>
</template>

<script setup>
import { reactive, onMounted } from 'vue'
import avatar from '../../assets/img/avatar.png'
import { getUser } from '../../utils/utils'
const data = reactive({
  userInfo:''
})

const getUserInfo = () => {
  return getUser();
}
onMounted(() => {
  data.userInfo = getUserInfo();
})
</script>
<style scoped lang='less'>
.main{
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
}
</style>