<template>
  <div style="height: 100vh;">
    <el-menu
      active-text-color="#ffd04b"
      background-color="#545c64"
      :collapse="proData.menuCollapse"
      class="el-menu-vertical-demo"
      default-active="2"
      text-color="#fff"
      style="height:100%;"
      router
      @open="handleOpen"
      @close="handleClose"
    >
      <div class="logo">
        <el-image style="width: 30px; height: 30px;" :src="logo" fit="fill"></el-image>
        <span v-show='!proData.menuCollapse' style="margin-left:10px">Online-Exam</span>
      </div>
      <template v-for="item in data.treeData">
        <template v-if="item.children.length > 0">
          <el-sub-menu  :index="item.id">
            <template #title>
              <el-icon>
                <component :is="item.icon"/>
              </el-icon>
              <span>{{item.resourceName}}</span>
            </template>
            <el-menu-item  v-for="itemC in item.children" :index="itemC.path" :key="itemC.id">{{itemC.resourceName}}</el-menu-item>
          </el-sub-menu>
        </template>
        <template v-else>
          <el-menu-item :index="item.path">
            <el-icon>
              <component :is="item.icon"/>
            </el-icon>
            <span>{{item.resourceName}}</span>
          </el-menu-item>
        </template>
      </template>
    </el-menu>
  </div>
</template>

<script setup>
import { reactive, onMounted, inject,onBeforeMount } from 'vue'
import logo from '../../assets/img/logo.svg'
import {
  Location,
  House,Setting,Reading,Trophy
} from '@element-plus/icons'
import {get} from "../../http/request";
import {ElMessage} from "element-plus";
const data = reactive({
  treeData:[]
})
let proData = inject('proData');

const handleOpen = (key, keyPath) => {
  //console.log(key, keyPath)
}
const handleClose = (key, keyPath) => {
  //console.log(key, keyPath)
}

const getAllResource = async () => {
  let res = await get('/resource/getAll');
  if (res.status === 1000) {
    data.treeData = res.data;
  } else {
    ElMessage.error(res.desc);
  }
}

onMounted(() => {
  //getAllResource();
})
onBeforeMount(() => {
  getAllResource();
})

</script>
<style scoped lang='less'>
.logo{
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  height: 60px;
}
:deep(.el-menu-item-group__title) {
  text-align: left;
}
:deep(.el-menu:not(.el-menu--collapse)) {
  .el-sub-menu {
    width: 200px;
  }
  .el-sub-menu.is-opened > .el-sub-menu__title .el-sub-menu__icon-arrow {
    transform: rotateZ(90deg);
  }
}
</style>