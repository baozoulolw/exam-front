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
        <div class="title flex"><span>{{ item.paperName }}</span></div>
        <div class="remark flex"><span>{{ item.remark }}</span></div>
        <div class="info flex">
          <el-image :src="item.teacherGender === '女' ? woman:man" style="height: 16px;"></el-image><span style="margin-right: 20px">{{ `出卷人: ${item.drawerUser}` }}</span>
          <el-image :src="score" style="height: 14px;"></el-image><span style="margin-right: 20px">{{ `总分: ${item.totalScore}` }}</span>
          <el-image :src="hard" style="height: 14px;"></el-image><span>{{ `难度: ${item.hard === 0 ? '简单' : item.hard === 1 ? '中等' : '困难'}` }}</span>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import {reactive, onMounted} from 'vue'
import {post} from '../../../../http/request';
import paper from '../../../../assets/img/paper.svg'
import remark from '../../../../assets/img/remark.svg'
import score from '../../../../assets/img/score.svg'
import hard from '../../../../assets/img/hard.svg'
import man from '../../../../assets/img/man.svg'
import woman from '../../../../assets/img/woman.svg'

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
    {value: 0, label: '简单'},
    {value: 1, label: '中等'},
    {value: 2, label: '困难'},
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
  display: flex;
  flex-direction: column;

  .papers {
    padding: 20px 0;
    flex: 1;

    .item {
      height: 200px;
      width: 400px;
      border-radius: 6px;
      padding: 20px;
      box-shadow: 0 0 4px 2px rgba(217,222,234,0.3);
      transition: all 0.6s ease;
      box-sizing: border-box;
      cursor: pointer;

      .flex {
        display: flex;
        align-items: center;
        margin-bottom: 10px;
      }

      .title {
        font-size: 25px;
      }
      .remark{
        height: 50px;
        margin-bottom: 30px;
        color: #88949b;
      }
      .info{
        font-size: 14px;
        color: #88949b;
      }

      .icon {
        height: 25px;
      }
    }
    .item:hover{
      box-shadow: 0 0 4px 2px rgba(140, 193, 248, 0.45);
      transform: scale(1.03);
    }
  }
}
</style>