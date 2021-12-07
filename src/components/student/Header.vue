<template>
  <div class="main">
    <div class="logo" @click="toPath('/student_home')">
      <el-image style="width: 30px; height: 30px;" :src="logo" fit="fill"></el-image>
      <span style="margin-left:10px;color:black">Online-Exam</span>
    </div>
    <div class="menu"></div>
    <div class="username">
      <el-icon :size="20">
        <User />
      </el-icon>
      <span class="name">{{ userInfo.username }}</span>
    </div>
    <el-popover placement="bottom-end" :width="200" trigger="hover" popper-class='head-pop'>
      <template #reference>
        <el-avatar :size="45" :src="avatar" class="avatar"></el-avatar>
      </template>
      <div>
        <el-button type="text" class="item" @click="logout()">退出登录</el-button>
      </div>
    </el-popover>
  </div>
</template>

<script setup>
import { reactive, onMounted } from 'vue'
import { useRouter } from "vue-router";
import avatar from '../../assets/img/avatar.png'
import { getUser } from '../../utils/utils'
import logo from '../../assets/img/logo.svg'
import $store from '../../store/index'
import Cookies from 'js-cookie'
import {
  Avatar, Fold, Expand, User
} from '@element-plus/icons'
import { ElMessage } from 'element-plus';

const userInfo = getUser();
const router = useRouter();
const data = reactive({
})

const logout = () => {
  Cookies.remove('token');
  localStorage.removeItem('user');
  $store.dispatch('setUserInfo', {})
  router.push({ path:'/login' });
  ElMessage.success('退出成功')
}
const toPath = path => {
  router.push({ path });
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
  .menu {
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
<style lang="less">
.head-pop{
  padding-left: 0 !important;
  padding-right: 0 !important;
  .item{
    padding-left: 20px;
    width: 100%;
    text-align: left;
  }
  .item:hover{
    background: rgb(247,247,248);
    cursor: pointer;
  }
}
</style>