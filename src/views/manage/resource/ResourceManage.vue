<template>
  <div class="main">
    <div class="search">
      <el-input v-model="data.keyword" placeholder="输入关键字" class="margin-r wit-3"></el-input>
      <el-button @click="addResource">添加根资源</el-button>
    </div>
    <div>
      <div>
        <el-tree :data="data.treeData" :props="defaultProps" @node-click="handleNodeClick" />
      </div>
      <div></div>
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted } from 'vue'
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
  ]
})

const addResource = () => {

}
onMounted(() => {
})
</script>
<style scoped lang='less'>
.main {
  background: white;
  height: calc(100vh - 140px);
  padding: 20px;
  .search {
    display: flex;
    margin-bottom: 30px;
  }
}
</style>