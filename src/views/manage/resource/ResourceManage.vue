<template>
  <div class="main">
    <div class="search">
      <el-input v-model="data.keyword" placeholder="输入关键字" class="margin-r wit-3"></el-input>
      <el-button @click="addResource">添加根资源</el-button>
    </div>
    <div class="body">
      <div class="left">
        <el-tree :data="data.treeData" @node-click="handleNodeClick"/>
      </div>
      <div class="right">

      </div>
    </div>
    <el-dialog v-model="data.addShow" title="添加资源" width="500px" v-if="data.addShow"
               :before-close="closeDia">
      <div style="padding: 0 30px">
        <el-form :model="data.resource" :rules="data.rules" ref="form" label-width="80px">
          <el-form-item label="资源名称">
            <el-input v-model="data.resource.resourceName" size="small"></el-input>
          </el-form-item>
          <el-form-item label="资源类型">
            <el-select v-model="data.resource.type" size="small" style="width: 100%">
              <el-option v-for="item in data.resourceTypes" :key="item" :label="item" :value="item"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="菜单路径" v-show="data.resource.type === 'menu'">
            <el-input v-model="data.resource.path" size="small"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
      <span class="dialog-footer">
        <t-button theme="default" @click="closeDia" class="mr-12">取消</t-button>
        <t-button theme="primary" @click="confirmDia" :loading="data.diaLoad">确认</t-button>
      </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import {reactive, onMounted} from 'vue'

const data = reactive({
  keyword: '',
  treeData: [
    {
      label: 'Level one 1',
      children: [
        {
          label: 'Level two 1-1',
          children: [
            {
              label: 'Level three 1-1-1',
            },
          ],
        },
      ],
    },
    {
      label: 'Level one 2',
      children: [
        {
          label: 'Level two 2-1',
          children: [
            {
              label: 'Level three 2-1-1',
            },
          ],
        },
        {
          label: 'Level two 2-2',
          children: [
            {
              label: 'Level three 2-2-1',
            },
          ],
        },
      ],
    },
    {
      label: 'Level one 3',
      children: [
        {
          label: 'Level two 3-1',
          children: [
            {
              label: 'Level three 3-1-1',
            },
          ],
        },
        {
          label: 'Level two 3-2',
          children: [
            {
              label: 'Level three 3-2-1',
            },
          ],
        },
      ],
    },
  ],
  addShow: false,
  diaLoad: false,
  resource: {
    isRoot: true,
    path: '',
    icon: '',
    type: '',
    resourceName: ''
  },
  resourceTypes: ['menu'],
  rules: {
    resourceName: [
      {required: true, message: '请输入资源名称', trigger: 'blur'}
    ],
    type: [
      {required: true, message: '请选择图标', trigger: 'blur'}
    ],
  }
})

const addResource = () => {
  data.addShow = true;
}

const closeDia = () => {
  data.addShow = false;
}

const confirmDia = () => {

}

const handleNodeClick = () => {

}

onMounted(() => {
})
</script>
<style scoped lang='less'>
.main {
  background: white;
  height: calc(100vh - 100px);
  padding: 20px;
  display: flex;
  flex-direction: column;

  .search {
    display: flex;
    padding: 0 200px;
    margin-top: 30px
  }

  .body {
    display: flex;
    flex: 1;
    padding: 50px 200px;

    .left {
      flex: 1;
      border: 1px solid var(--el-border-color-base);
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
      margin-right: 20px;
      padding: 12px;
    }

    .right {
      flex: 1;
      border: 1px solid var(--el-border-color-base);
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
    }
  }
}
</style>