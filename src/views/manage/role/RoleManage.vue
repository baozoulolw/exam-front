<template>
  <div class="main">
    <!--搜索栏-->
    <div class="search">
      <el-input v-model="data.params.param.roleName" placeholder="输入角色名" class="margin-r wit-3"></el-input>
      <el-button @click="toSearch" :loading="data.searchLoad">搜索</el-button>
      <el-button @click="addRole">添加角色</el-button>
    </div>
    <!--    角色表格区域-->
    <el-table :data="data.tableData" border style="width: 100%" v-loading="data.tableLoad">
      <el-table-column label="角色名称" prop="roleName" width="200"></el-table-column>
      <el-table-column label="备注" prop="remark"></el-table-column>
      <el-table-column label="是否为默认角色" width="150">
        <template #default="scope">
          <div style="text-align: center;">
            <el-tag type="success">{{ !data.baseIds.includes(scope.row.id) ? '否' : '是' }}</el-tag>
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
      <el-table-column label="操作" width="200">
        <template #default="scope">
          <div class="table-operate" v-if="!data.baseIds.includes(scope.row.id)">
            <span @click="edit(scope.row)" class="item-span">编辑</span>
            <el-divider direction="vertical"></el-divider>
            <span @click="editResource(scope.row)" class="item-span">配置资源</span>
            <el-divider direction="vertical"></el-divider>
            <span class="item-span" @click="delRole(scope.row)">删除</span>
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
    <!--    编辑或新增角色弹窗-->
    <EditRole v-if='data.visible' v-model:visible="data.visible" :roleData="data.editFormData" :type="data.type" @close='getRoleList'></EditRole>
    <!--    资源配置弹窗-->
    <el-dialog v-model="data.resourceShow" title="资源配置" width="600px" :before-close="closeResourceDia" v-if="data.resourceShow">
      <resource-edit :id="data.resourceId" ref="resource" v-model:visible="data.resourceShow"></resource-edit>
      <template #footer>
      <span class="dialog-footer">
        <t-button theme="default" @click="closeResourceDia" class="mr-12">关闭</t-button>
      </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import {ElMessage, ElMessageBox} from 'element-plus';
import {reactive, onMounted, ref} from 'vue'
import {get, post} from '../../../http/request'
import EditRole from './EditRole.vue';
import ResourceEdit from "./ResourceEdit.vue";
import Cookies from "js-cookie";
import $store from "../../../store";

const data = reactive({
  params: {
    pageNumber: 1,
    pageSize: 10,
    param: {
      roleName: '',
    }
  },
  resourceShow:false,
  diaLoad:false,
  total: 0,
  tableData: [],
  visible: false,
  editFormData: {},
  type: 'add',
  searchLoad: false,
  tableLoad: false,
  resourceId:'',
  baseIds:['1','2','3']
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

const delRole = (row) => {
  ElMessageBox.confirm(
      '此操作会将与此角色绑定的人员的一切资源清除',
      '危险操作',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      }
  )
      .then(async() => {
        let res = await get('/role/del/'+row.id);
        if(res.status === 1000){
          ElMessage.success('删除成功');
          getRoleList();
        }
      })
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

const editResource = row =>{
  data.resourceId = row.id;
  data.resourceShow = true;
}
const closeResourceDia = () => {
  data.resourceShow = false;
}

const resource = ref(null);
const confirmDia = async() => {
  console.log(resource.value);
  data.diaLoad = true;
  await resource.value.submit();
  data.diaLoad = false;
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