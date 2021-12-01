<template>
  <div class="main">
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
    <el-avatar :size="45" :src="avatar" class="avatar"></el-avatar>
  </div>
</template>

<script setup>
import { reactive, onMounted, inject } from 'vue'
import avatar from '../../assets/img/avatar.png'
import { getUser } from '../../utils/utils'
import {
  Avatar, Fold, Expand,User
} from '@element-plus/icons'

const userInfo = getUser();
let proData = inject('proData');

const collapseChange = () => {
  proData.menuCollapse = !proData.menuCollapse;
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