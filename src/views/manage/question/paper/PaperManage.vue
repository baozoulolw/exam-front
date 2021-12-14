<template>
  <div class="main">
    <div class="search">
      <el-input
        v-model="data.params.param.keyword"
        placeholder="输入关键词"
        class="margin-r wit-3"
        clearable
      ></el-input>
      <el-select
        v-model="data.params.param.hard"
        placeholder="请选择难度"
        style="margin-right:20px"
        clearable
      >
        <el-option
          v-for="item in data.qHards"
          :key="item.value"
          :value="item.value"
          :label="item.label"
        ></el-option>
      </el-select>
      <el-button @click="toSearch" :loading="data.searchLoad" type="primary">搜索</el-button>
    </div>
    <div v-loading="data.paperLoad" class="papers">
      <section v-for="item in data.papers" :key="item.id" class="item"> 
        <div><el-image :src="paper" class="icon"></el-image><span>{{item.paperName}}</span></div>
        <div><el-image :src="score" class="icon"></el-image><span>{{item.totalScore}}</span></div>
        <div><el-image :src="teacher" class="icon"></el-image><span>{{item.drawerUser}}</span></div>
        <div><el-image :src="remark" class="icon"></el-image><span>{{item.remark}}</span></div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted } from 'vue'
import { post } from '../../../../http/request';
import paper from '../../../../assets/img/paper.svg'
import remark from '../../../../assets/img/remark.svg'
import score from '../../../../assets/img/score.svg'
import teacher from '../../../../assets/img/teacher.svg'
const data = reactive({
  searchLoad: false,
  paperLoad: false,
  params: {
    pageSize: 10,
    pageNum: 1,
    param: {
      keyword: '',
      hard: ''
    },
  },
  qHards: [
    { value: 0, label: '简单' },
    { value: 1, label: '中等' },
    { value: 2, label: '困难' },
  ],
  papers: [],
  total: 0
})

const getPaper = async () => {
  data.paperLoad = true;
  let res = await post('/paper/page', data.params);
  if (res.status === 1000) {
    data.papers = res.data.list;
    data.total = Number(res.data.totalCount);
  } else {
    ElMessage.error(res.desc);
  }
  data.paperLoad = false;
}

const toSearch = async () => {
  data.searchLoad = true;
  await getPaper();
  data.searchLoad = false;
}

onMounted(() => {
  getPaper();
})
</script>
<style scoped lang='less'>
.main {
  background: white;
  height: calc(100vh - 140px);
  padding: 20px;
  .papers {
    padding: 20px 0;
    .item {
      height: 170px;
      width: 300px;
      border-radius: 6px;
      background: #ecf0f1;
      .icon{
        height: 25px;
      }
    }
  }
}
</style>