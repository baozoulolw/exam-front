<template>
  <div class="main">
    <!--搜索栏-->
    <div class="search">
      <el-input v-model="data.params.param.keyword" placeholder="输入关键字" class="margin-r wit-3"></el-input>
      <el-select v-model="data.params.param.gradeId" class="margin-r wit-3"></el-select>
      <el-select v-model="data.params.param.classId" class="margin-r wit-3"></el-select>
      <el-button @click="toSearch" :loading="data.searchLoad">搜索</el-button>
      <el-button @click="addUser">添加人员</el-button>
    </div>
    <!--用户表格-->
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
      <el-table-column label="操作" width="200">
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
    <!--分页控制-->
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
    <!--新增用户弹窗-->
    <user-info v-model:visible="data.visible" @close="closeDia"></user-info>
  </div>
</template>

<script setup>
import {ElMessage, ElSelect} from 'element-plus';
import {reactive, onMounted} from 'vue'
import {post} from '../../../http/request'
import UserInfo from "./UserInfo.vue";
import {getAddressStringByCode} from '../../../utils/utils';

const data = reactive({
  // 用户查询参数
  params: {
    pageNumber: 1,
    pageSize: 10,
    param: {
      keyword: '', // 关键字
      classId: '', // 班级id（暂未实现）
      gradeId: ''  // 分组id（暂未实现）
    }
  },
  total: 0, // 总人数
  tableData: [], // 表格数据
  visible: false,  // 新增用户弹窗控制
  searchLoad: false, // 搜索用户加载动画控制
  tableLoad: false,  // 表格加载动画控制
})

// 获取用户列表表格数据
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

// 点击搜索触发
const toSearch = () => {
  data.params.pageNumber = 1;
  data.searchLoad = true;
  getUserList().then(() => data.searchLoad = false);
}

// 当前页更改触发
const handleCurrentChange = val => {
  data.params.pageNumber = val;
  getUserList();
}

// 每页数量更改触发
const handleSizeChange = val => {
  data.params.pageSize = val;
  data.params.pageNumber = 1;
  getUserList();
}

// 点击新增用户触发 ，打开弹窗
const addUser = () => {
  data.visible = true;
}

const edit = row => {
  data.type = 'edit';
  data.visible = true;
}

const bindRole = row => {

}

// 关闭新增用户弹窗
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
    bottom: 20px;
    right: 20px;
  }
}
</style>