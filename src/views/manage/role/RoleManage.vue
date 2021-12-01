<template>
  <div class="main">
    <div class="search">
      <el-input v-model="data.params.param.roleName" placeholder="输入角色名" class="margin-r wit-3"></el-input>
      <el-button @click="toSearch">搜索</el-button>
      <el-button @click="addRole">添加角色</el-button>
    </div>
    <el-table :data="data.tableData" border style="width: 100%">
      <el-table-column label="角色名称" prop="roleName"></el-table-column>
      <el-table-column label="备注" prop="remark"></el-table-column>
      <el-table-column label="是否为默认角色">
        <template #default="scope">
          <el-tag type="success">{{ scope.row.isDefault === 0 ? '否' : '是' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="createTime"></el-table-column>
      <el-table-column label="最后修改时间" prop="changeTime"></el-table-column>
      <el-table-column label="最后操作人" prop="changeUserName"></el-table-column>
      <el-table-column label="操作" prop="remark"></el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination
        :pager-count="5"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[1, 5, 10, 15]"
        background
        layout="total, prev, pager, next, sizes, jumper"
        :total="data.total"
      ></el-pagination>
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted } from 'vue'
import { post } from '../../../http/request'
const data = reactive({
  params: {
    pageNumber: 1,
    pageSize: 10,
    param: {
      roleName: '',
    }
  },
  total: 0,
  tableData: []
})
const getRoleList = async () => {
  let res = post('/role/roleList', data.params);
  if (res.status === 1000) {
  }
}

const toSearch = () => {
  data.params.pageNumber = 1;
  getRoleList();
}

const handleCurrentChange = val => {
  data.params.pageNumber = val;
  this.getRoleList();
}
const handleSizeChange = val => {
  data.params.pageSize = val;
  data.params.pageNumber = 1;
  this.getRoleList();
}

const addRole = () => {

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
  .pagination {
    margin-top: 20px;
    text-align: right;
  }
}
</style>