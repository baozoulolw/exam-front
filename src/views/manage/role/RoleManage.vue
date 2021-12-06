<template>
  <div class="main">
    <div class="search">
      <el-input v-model="data.params.param.roleName" placeholder="输入角色名" class="margin-r wit-3"></el-input>
      <el-button @click="toSearch" :loading="data.searchLoad">搜索</el-button>
      <el-button @click="addRole">添加角色</el-button>
    </div>
    <el-table :data="data.tableData" border style="width: 100%" v-loading="data.tableLoad">
      <el-table-column label="角色名称" prop="roleName" width="200"></el-table-column>
      <el-table-column label="备注" prop="remark"></el-table-column>
      <el-table-column label="是否为默认角色" width="150">
        <template #default="scope">
          <div style="text-align: center;">
            <el-tag type="success">{{ scope.row.isDefault === '0' ? '否' : '是' }}</el-tag>
          </div>
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
      <el-table-column label="最后修改时间" prop="changeTime"></el-table-column>
      <el-table-column label="最后操作人" prop="changeUserName"></el-table-column>
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
    <EditRole v-if='data.visible' v-model:visible="data.visible" :roleData="data.editFormData" :type="data.type" @close='getRoleList'></EditRole>
  </div>
</template>

<script setup>
import { ElMessage, ElSelect } from 'element-plus';
import { reactive, onMounted } from 'vue'
import { post } from '../../../http/request'
import EditRole from './EditRole.vue';
const data = reactive({
  params: {
    pageNumber: 1,
    pageSize: 10,
    param: {
      roleName: '',
    }
  },
  total: 0,
  tableData: [],
  visible: false,
  editFormData: {},
  type: 'add',
  searchLoad: false,
  tableLoad: false
})
const getRoleList = async () => {
  data.tableLoad = true;
  let res = await post('/role/roleList', data.params);
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
  getRoleList().then(() => data.searchLoad = false);
}

const handleCurrentChange = val => {
  data.params.pageNumber = val;
  getRoleList();
}
const handleSizeChange = val => {
  data.params.pageSize = val;
  data.params.pageNumber = 1;
  getRoleList();
}

const addRole = () => {
  data.type = 'add';
  data.visible = true;
}

const edit = row => {
  data.editFormData = JSON.parse(JSON.stringify(row));
  data.type = 'edit';
  data.visible = true;
}
onMounted(() => {
  getRoleList();
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