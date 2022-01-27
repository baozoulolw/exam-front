<template>
  <div class="main">
    <div class="left">
      <header class="left-head">
        <span>试题分类</span>
        <t-button shape="square" variant="outline" size="small">
          <template #icon>
            <add-icon size="large"/>
          </template>
        </t-button>
      </header>
      <div class="filter">
        <el-input v-model="data.groupFilter" :prefix-icon="Filter" size="mini" placeholder="输入关键词过滤"></el-input>
      </div>
      <div class="list">
        <section v-for="item in showGroup" :key="item.id" class="item">
          <span class="name">{{ item.groupName }}</span>
          <el-dropdown>
            <el-icon>
            <i-more-filled/>
            </el-icon>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>转移分类</el-dropdown-item>
                <el-dropdown-item>编辑分类</el-dropdown-item>
                <el-dropdown-item>删除分类</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </section>
      </div>
    </div>
    <div class="right">
      <div class="search">
        <el-input v-model="data.params.param.keyword" placeholder="输入关键词" class="margin-r wit-3" clearable></el-input>
        <el-select v-model="data.params.param.type" placeholder="请选择题型" style="margin-right:10px" clearable>
          <el-option v-for="item in data.qTypes" :key="item.value" :value="item.value" :label="item.label"></el-option>
        </el-select>
        <el-select v-model="data.params.param.hard" placeholder="请选择难度" style="margin-right:20px" clearable>
          <el-option v-for="item in data.qHards" :key="item.value" :value="item.value" :label="item.label"></el-option>
        </el-select>
        <el-button @click="toSearch" :loading="data.searchLoad" type="primary">搜索</el-button>
        <el-button @click="addQuestion" type="primary" plain>添加试题</el-button>
      </div>
      <el-table :data="data.tableData" border style="width: 100%" v-loading="data.tableLoad">
        <el-table-column label="序号" width="50" align='center' header-align='left'>
          <template #default="scope">
              <span
                  class="table-span"
              >{{ (data.params.pageNumber - 1) * data.params.pageSize + scope.$index + 1 }}</span>
          </template>
        </el-table-column>
        <el-table-column label="题目" prop="topic" show-overflow-tooltip/>
        <el-table-column label="题型" width="100">
          <template #default="scope">
              <span
                  class="table-span"
              >{{ data.types[scope.row.type] }}</span>
          </template>
        </el-table-column>
        <el-table-column label="难度" width="100">
          <template #default="scope">
              <span
                  class="table-span"
              >{{ data.hards[scope.row.hard] }}</span>
          </template>
        </el-table-column>
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
              <span @click="edit(scope.row)" class="item-span">编辑</span>
              <el-divider direction="vertical"></el-divider>
              <span @click='delQuestion(scope.row)' class="item-span">删除</span>
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
  </div>
</template>

<script setup>
import {reactive, onMounted, watch, computed} from 'vue'
import {get, post} from '../../../../http/request';
import {onBeforeRouteUpdate, useRouter} from "vue-router";
import {ElMessageBox, ElMessage} from "element-plus";
import {AddIcon, EllipsisIcon} from 'tdesign-icons-vue-next';
import {
  Filter,
} from '@element-plus/icons'

const router = useRouter(); //路由

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
  groupList: [],
  qTypes: [
    {value: 0, label: '单选题'},
    {value: 1, label: '多选题'},
    {value: 2, label: '判断题'},
    {value: 3, label: '填空题'},
  ],
  qHards: [
    {value: 0, label: '简单'},
    {value: 1, label: '中等'},
    {value: 2, label: '困难'},
  ],
  types: ['单选题', '多选题', '判断题', '填空题'],
  hards: ['简单', '中等', '困难'],
  total: 0,
  tableData: [],
  searchLoad: false,
  tableLoad: false,
  editType: 'add',
  editQuestion: {},
  showList: true,
  groupFilter: ''
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

let showGroup = computed(() => {
  console.log(data.groupList);
  return data.groupList.filter(item => item.groupName.includes(data.groupFilter.trim()));
})
const getGroupList = async () => {
  let res = await get('/question/group/list');
  if (res.status === 1000) {
    data.groupList = res.data;
  } else {
    ElMessage.error(res.desc);
  }
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
  const path = '/question_edit'
  router.push({path, query: {editType: 'add'}})
}
const delQuestion = row => {
  ElMessageBox.confirm(
      '删除后不可恢复，确认删除此题?',
      '提示',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      }
  )
      .then(async () => {
        let res = await get(`/question/delById/${row.id}`);
        if (res.status === 1000) {
          ElMessage.success('删除成功')
          await getQuestionList();
        } else {
          ElMessage.error(res.desc);
        }
      })
}

const edit = row => {
  data.editQuestion = JSON.parse(JSON.stringify(row));
  const path = '/question_edit'
  router.push({path, query: {editType: 'edit', id: data.editQuestion.id}})
}

onMounted(() => {
  getQuestionList();
  getGroupList();
})
</script>
<style scoped lang='less'>
.main {
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  height: calc(100vh - 100px);
  padding: 20px;
  position: relative;
  display: flex;

  .left {
    min-width: 200px;
    height: 100%;
    padding: 0 20px 0 0;
    border-right: 1px solid var(--el-border-color-base);

    .left-head {
      display: flex;
      align-items: center;
      padding-bottom: 12px;
      border-bottom: 1px solid var(--el-border-color-base);

      span {
        margin-right: auto;
      }
    }
    .list{
      margin-top: 20px;
      display: flex;
      flex-direction: column;
      .item{
        display: flex;
        align-items: center;
        padding: 0 12px;
        height: 36px;
        border-radius: 6px;
        .name{
          margin-right: auto;
        }
      }
      .item:hover{
        background:rgba(52, 73, 94,0.2) ;
      }
      .item:active{
        background:rgba(52, 73, 94,0.2) ;
      }
    }
  }

  .right {
    flex: 1;
    padding: 0 0 0 20px;

    .search {
      display: flex;
      margin-bottom: 30px;
    }

    .pagination {
      position: absolute;
      right: 20px;
      bottom: 20px;
    }
  }
}
</style>