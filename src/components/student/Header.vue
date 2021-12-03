<template>
  <div class="main">
    <div class="logo" @click="toPath('/student_home')">
      <el-image style="width: 30px; height: 30px;" :src="logo" fit="fill"></el-image>
      <span style="margin-left:10px;color:black">Online-Exam</span>
    </div>
    <div class="menu"> 

    </div>
    <div class="username">
      <el-icon :size="20">
        <User />
      </el-icon>
      <span class="name">{{ userInfo.username }}</span>
    </div>
    <el-avatar :size="45" :src="avatar" class="avatar"></el-avatar>
  </div>
</template>

<script setup>
import { reactive, onMounted } from 'vue'
import { useRouter } from "vue-router";
import avatar from '../../assets/img/avatar.png'
import { getUser } from '../../utils/utils'
import logo from '../../assets/img/logo.svg'
import {
  Avatar, Fold, Expand, User
} from '@element-plus/icons'

const userInfo = getUser();
const router = useRouter();
const data = reactive({
})

const toPath = path => {
  router.push({path});
}
onMounted(() => {
})
</script>
<style scoped lang='less'>
.main {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  .logo {
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    height: 60px;
    margin-right: 20px;
    cursor: pointer;
  }
  .menu{
    margin-right: auto;
  }
  .username {
    display: flex;
    align-items: center;
    margin-right: 20px;
    font-size: 17px;
    .name {
      margin-left: 10px;
    }
  }
  .avatar {
    margin-right: 30px;
  }
}
</style>