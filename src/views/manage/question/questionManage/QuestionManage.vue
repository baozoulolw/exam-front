<template>
  <div class="main">
    <transition name="el-zoom-in-center">
      <div v-if="data.showList">
        <div class="search">
          <el-input v-model="data.params.param.keyword" placeholder="输入关键词" class="margin-r wit-3"></el-input>
          <el-button @click="toSearch" :loading="data.searchLoad">搜索</el-button>
          <el-button @click="addQuestion">添加试题</el-button>
        </div>
        <el-table :data="data.tableData" border style="width: 100%" v-loading="data.tableLoad">
          <el-table-column label="题目" prop="topic"></el-table-column>
          <el-table-column label="创建时间" prop="createTime" width="180">
            <template #default="scope">
              <span
                class="table-span"
                :title="scope.row.createTime"
              >{{ scope.row.createTime ? scope.row.createTime : '---' }}</span>
            </template>
          </el-table-column>
          <el-table-column label="最后修改时间" prop="changeTime" width="180"></el-table-column>
          <el-table-column label="最后操作人" prop="changeUser" width="150"></el-table-column>
          <el-table-column label="操作" width="120">
            <template #default="scope">
              <div class="table-operate">
                <el-button type="text" @click="edit(scope.row)">编辑</el-button>
                <el-divider direction="vertical"></el-divider>
                <el-button type="text">删除</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination">
          <el-pagination
            :pager-count="5"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :page-sizes="[1, 4, 8, 10]"
            background
            layout="total, prev, pager, next, sizes, jumper"
            :total="data.total"
          ></el-pagination>
        </div>
      </div>
    </transition>
    <transition name="el-zoom-in-center">
      <EditQuestion
        v-if="!data.showList"
        :editType="data.editType"
        :data="data.editQuestion"
        v-model:control="data.showList"
      ></EditQuestion>
    </transition>
  </div>
</template>

<script setup>
import { reactive, onMounted, watch } from 'vue'
import { post } from '../../../../http/request';
import EditQuestion from './EditQuestion.vue';
const data = reactive({
  params: {
    pageNumber: 1,
    pageSize: 10,
    param: {
      keyword: '',
      type: '',
      hard: ''
    }
  },
  total: 0,
  tableData: [],
  searchLoad: false,
  tableLoad: false,
  editType: 'add',
  editQuestion: {},
  showList: true
})
watch(() => data.showList,
  (n, o) => {
    if (n) {
      toSearch();
    }
  })
const getQuestionList = async () => {
  data.tableLoad = true;
  let res = await post('/question/page', data.params);
  if (res.status === 1000) {
    data.tableData = res.data.list;
    data.total = Number(res.data.totalCount);
  } else {
    ElMessage.error(res.desc);
  }
  data.tableLoad = false;
}

const toSearch = () => {
  data.params.pageNumber = 1;
  data.searchLoad = true;
  getQuestionList().then(() => data.searchLoad = false);
}

const handleCurrentChange = val => {
  data.params.pageNumber = val;
  getQuestionList();
}
const handleSizeChange = val => {
  data.params.pageSize = val;
  data.params.pageNumber = 1;
  getQuestionList();
}

const addQuestion = () => {
  data.editType = 'add';
  data.showList = false;
}

const edit = row => {
  data.editQuestion = JSON.parse(JSON.stringify(row));
  data.editType = 'edit';
  data.showList = false;
}

onMounted(() => {
  getQuestionList();
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
  .pagination {
    margin-top: 20px;
    text-align: right;
  }
}
</style>