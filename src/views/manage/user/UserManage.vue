<template>
  <div class="main">
    <div class="search">
      <el-input v-model="data.params.param.keyword" placeholder="输入关键字" class="margin-r wit-3"></el-input>
      <el-select v-model="data.params.param.gradeId" class="margin-r wit-3"></el-select>
      <el-select v-model="data.params.param.classId" class="margin-r wit-3"></el-select>
      <el-button @click="toSearch" :loading="data.searchLoad">搜索</el-button>
      <el-button @click="addUser">添加人员</el-button>
    </div>
    <el-table :data="data.tableData" border style="width: 100%" v-loading="data.tableLoad">
    <el-table-column label="所在班级">
        <template #default="scope">
          <span
            :title="scope.row.classExam ? scope.row.classExam.className : '--'"
          >{{ scope.row.classExam ? scope.row.classExam.className : '--' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="姓名" prop="realName" width="200"></el-table-column>
      <el-table-column label="性别" prop="gender"></el-table-column>
      <el-table-column label="手机号" prop="phone" show-overflow-tooltip></el-table-column>
      <el-table-column label="地址" prop="address" width="180">
        <template #default="scope">
          <span
              :title="getAddressStringByCode(JSON.parse(scope.row.address))">
            {{ getAddressStringByCode(JSON.parse(scope.row.address)) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="createTime" width="180"></el-table-column>
      <el-table-column label="最后修改时间" prop="changeTime" width="180"></el-table-column>
      <el-table-column label="最后操作人" prop="changeUser"></el-table-column>
      <el-table-column label="操作" width="120">
        <template #default="scope">
          <div class="table-operate">
            <span class="item-span" @click="bindRole(scope.row)">角色绑定</span>
            <el-divider direction="vertical"></el-divider>
            <span class="item-span" @click="edit(scope.row)">编辑</span>
            <el-divider direction="vertical"></el-divider>
            <span class="item-span">删除</span>
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
    <user-info v-model:visible="data.visible" @close="closeDia"></user-info>
  </div>
</template>

<script setup>
import { ElMessage, ElSelect } from 'element-plus';
import { reactive, onMounted } from 'vue'
import { post } from '../../../http/request'
import UserInfo from "./UserInfo.vue";
import {getAddressStringByCode} from '../../../utils/utils';

const data = reactive({
  params: {
    pageNumber: 1,
    pageSize: 10,
    param: {
      keyword: '',
      classId: '',
      gradeId: ''
    }
  },
  total: 0,
  tableData: [],
  visible: false,
  editFormData: {},
  searchLoad: false,
  tableLoad: false,
})
const getUserList = async () => {
  data.tableLoad = true;
  let res = await post('/user/userList', data.params);
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
  getUserList().then(() => data.searchLoad = false);
}

const handleCurrentChange = val => {
  data.params.pageNumber = val;
  getUserList();
}
const handleSizeChange = val => {
  data.params.pageSize = val;
  data.params.pageNumber = 1;
  getUserList();
}

const addUser = () => {
  data.visible = true;
}

const edit = row => {
  data.editFormData = JSON.parse(JSON.stringify(row));
  data.type = 'edit';
  data.visible = true;
}

const bindRole = row => {

}

const closeDia = () => {
  data.visible = false;
  toSearch();
}
onMounted(() => {
  getUserList();
})
</script>
<style scoped lang='less'>
.main {
  background: white;
  height: calc(100vh - 100px);
  padding: 20px;
  position: relative;
  .search {
    display: flex;
    margin-bottom: 30px;
  }
  .pagination {
    position: absolute;
    bottom:20px;
    right: 20px;
  }
}
</style>