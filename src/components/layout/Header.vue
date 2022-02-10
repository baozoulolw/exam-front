<template>
  <div class="main">
    <!--缩放左边菜单控制-->
    <el-icon :size="20" @click="collapseChange" class="collapse">
      <Expand v-if="proData.menuCollapse" />
      <Fold v-else />
    </el-icon>
    <div class="username">
      <el-icon :size="20">
        <User />
      </el-icon>
      <span class="name">{{ userInfo.username }}</span>
    </div>
    <el-popover placement="bottom-end" :width="200" trigger="hover" popper-class="head-pop">
      <!--头像-->
      <template #reference>
        <el-avatar :size="45" :src="userInfo.avatarUrl" class="avatar"></el-avatar>
      </template>
      <!--鼠标放在头像上呼出菜单-->
      <div>
        <el-button type="text" class="item" @click="logout()">退出登录</el-button>
      </div>
    </el-popover>
  </div>
</template>

<script setup>
import { reactive, onMounted, inject } from 'vue'
import avatar from '../../assets/img/avatar.png'
import { getUser } from '../../utils/utils'
import $store from '../../store/index'
import Cookies from 'js-cookie'
import { useRouter } from "vue-router";
import { ElMessage } from 'element-plus';
import {
  Avatar, Fold, Expand, User
} from '@element-plus/icons'


const userInfo = getUser();
const router = useRouter();
let proData = inject('proData');

//点击进行菜单缩放或显示
const collapseChange = () => {
  proData.menuCollapse = !proData.menuCollapse;
}

//退出登录
const logout = () => {
  Cookies.remove('token');
  localStorage.removeItem('user');
  $store.dispatch('setUserInfo', {})
  router.push({ path: '/login' });
  ElMessage.success('退出成功')
}

const data = reactive({
})

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
  .collapse {
    margin-right: auto;
    margin-left: 20px;
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