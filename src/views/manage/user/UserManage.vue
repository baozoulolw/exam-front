<template>
  <div class="main">
    <div class="left">
      <header class="left-head">
        <span>成员分组</span>
        <t-button shape="square" variant="outline" @click="addGroup" v-if="checkHasRole(roleKeys.addGroup)">
          <template #icon>
            <add-icon size="large"/>
          </template>
        </t-button>
      </header>
      <div class="filter" style="margin-top: 12px">
        <el-input v-model="data.groupFilter" :prefix-icon="Filter" size="mini" placeholder="输入关键词过滤"></el-input>
      </div>
      <article class="list">
        <section :class="['item',{'selected':data.selectedGroup.id === ''}]"
                 @click="selectedGroup({id:'',groupName:'全部'})">
          <span class="name">{{
              `全部 (${data.groupList.reduce((p, {userNumber}) => {
                p += userNumber;
                return p
              }, 0)})`
            }}</span>
        </section>
        <section v-for="item in showGroup" :key="item.id"
                 :class="['ml','item',{'selected':data.selectedGroup.id === item.id}]"
                 @click="selectedGroup(item)">
          <span class="name" :title="item.groupName">{{ item.groupName }}</span><span
            style="margin-right: 3px">({{ item.userNumber }})</span>
          <el-dropdown @command="handleCommand">
            <el-icon>
              <i-more-filled/>
            </el-icon>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item :command="{type:'trans',param:item}" v-if="checkHasRole(roleKeys.transGroup)">转移分类</el-dropdown-item>
                <el-dropdown-item :command="{type:'edit',param:item}" v-if="item.id !== '1' && checkHasRole(roleKeys.editGroup)">编辑分类</el-dropdown-item>
                <el-dropdown-item :command="{type:'del',param:item}" v-if="item.id !== '1' && checkHasRole(roleKeys.delGroup)">删除分类</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </section>
      </article>
    </div>
    <div class="right">
      <!--搜索栏-->
      <div class="search">
        <el-input v-model="data.params.param.keyword" placeholder="输入关键字" class="margin-r wit-3"></el-input>
        <el-button @click="toSearch" :loading="data.searchLoad">搜索</el-button>
        <el-button @click="addUser" v-if="checkHasRole(roleKeys.addUser)">添加人员</el-button>
      </div>
      <!--用户表格-->
      <!--            <el-table :data="data.tableData" border style="width: 100%" v-loading="data.tableLoad">
                    <el-table-column prop="address" width="63">
                      <template #default="scope">
                      <el-avatar :src=scope.row.avatarUrl>
                      </el-avatar>
                      </template>
                    </el-table-column>
                    <el-table-column label="姓名" prop="realName" width="140"></el-table-column>
                    <el-table-column label="性别" prop="gender"></el-table-column>
            &lt;!&ndash;        <el-table-column label="手机号" prop="phone" show-overflow-tooltip></el-table-column>&ndash;&gt;
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
                    <el-table-column label="操作" width="250">
                      <template #default="scope">
                        <div class="table-operate">
                          <span @click="changeGroup(scope.row)" class="item-span">更改分组</span>
                          <el-divider direction="vertical"></el-divider>
                          <span class="item-span" @click="bindRole(scope.row)">角色绑定</span>
                          <el-divider direction="vertical"></el-divider>
                          <span class="item-span" @click="edit(scope.row)">编辑</span>
                          <el-divider direction="vertical"></el-divider>
                          <span class="item-span">删除</span>
                        </div>
                      </template>
                    </el-table-column>
                  </el-table>-->
      <el-scrollbar v-loading="data.tableLoad">
        <div class="users">
          <section v-for="item in data.tableData" class="item-user" style="position: relative">
            <el-dropdown style="position: absolute;z-index: 9;right:10px;top:10px" @command="handleItemCommand">
              <div class="el-dropdown-link"
                   style="height: 20px;
                          width: 30px;
                          z-index:9;
                          background: white;
                          border-radius: 6px;
                          display: flex;
                          align-items: center;
                          justify-content: center;
               ">
                <el-icon class="el-icon--right" style="left: -2px;">
                  <moreFilled/>
                </el-icon>
              </div>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item :icon="Avatar" :command="{type:'info',param:item}">查看信息</el-dropdown-item>
                  <el-dropdown-item :icon="Delete" :command="{type:'del',param:item}" v-if="checkHasRole(roleKeys.delUser)">删除</el-dropdown-item>
                  <el-dropdown-item :icon="Paperclip" :command="{type:'role',param:item}" v-if="checkHasRole(roleKeys.bindRole)">绑定角色</el-dropdown-item>
                  <el-dropdown-item :icon="Switch" :command="{type:'trans',param:item}" v-if="checkHasRole(roleKeys.transUser)">转移分类</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
            <el-image
                style="width: 100%; height: 120px;margin-bottom: 12px"
                :src="item.avatarUrl"
                fit="fill"
            ></el-image>
            <div class="foot-info">
              <div>
                <el-image :src="item.gender === '女' ? woman:man" style="height: 16px;"></el-image>
                <span>{{ item.realName }}</span>
              </div>
              <div>
                <el-image :src="phone" style="height: 16px;"></el-image>
                <span>{{ item.phone }}</span>
              </div>
              <div>
                <el-image :src="role" style="height: 16px;"></el-image>
                <span v-for="role in item.roles" class="role—item">{{ role.roleName }}</span>
                <span v-if="item.roles.length === 0" class="role—item">学生</span>
              </div>
            </div>
          </section>
        </div>
      </el-scrollbar>
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
    </div>
    <!--新增用户弹窗-->
    <user-info v-model:visible="data.visible" @close="closeDia" :groupList="data.groupList"></user-info>
    <!--  分类转移-->
    <el-dialog v-model="data.transGroupVisible" title="转移分类" width="400px" :before-close="closeTransDia">
      <div style="padding-left: 20px">{{ `当前分类:  ${data.transFromGroup.groupName}` }}</div>
      <el-form :model="data.transGroup" ref="groupTransForm" style="margin-top: 20px">
        <el-form-item label="转移至分类" prop="id" :rules="[{required: true,message: '请选择分类'}]">
          <el-select style="width: 100%" v-model="data.transGroup.id" placeholder="请选择分类" filterable>
            <el-option v-for="item in data.groupList.filter(i => i.id !== data.transFromGroup.id)" :key="item.id"
                       :label="item.groupName" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
      <span class="dialog-footer">
        <t-button theme="default" @click="closeTransDia" class="mr-12">取消</t-button>
        <t-button theme="primary" @click="confirmTransDia" :loading="data.diaLoad">确认</t-button>
      </span>
      </template>
    </el-dialog>
    <!--  分类更改-->
    <el-dialog v-model="data.changeGroupVisible" title="更改分类" width="400px" :before-close="closeChangeGroupDia">
      <div style="padding-left: 20px">{{ `当前分类:  ${data.transFromGroup.groupName}` }}</div>
      <el-form :model="data.changeGroup" ref="changeGroupForm" style="margin-top: 20px">
        <el-form-item label="转移至分类" prop="id" :rules="[{required: true,message: '请选择分类'}]">
          <el-select style="width: 100%" v-model="data.changeGroup.id" placeholder="请选择分类" filterable>
            <el-option v-for="item in data.groupList.filter(i => i.id !== data.transFromGroup.id)" :key="item.id"
                       :label="item.groupName" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
      <span class="dialog-footer">
        <t-button theme="default" @click="closeChangeGroupDia" class="mr-12">取消</t-button>
        <t-button theme="primary" @click="confirmChangeGroupDia" :loading="data.diaLoad">确认</t-button>
      </span>
      </template>
    </el-dialog>
    <t-dialog
        v-model:visible="data.groupVisible" :header="data.editGroupType === 'add' ? '添加分组':'编辑分组'"
        width="400px" v-if="data.groupVisible" :on-confirm="onConfirmGroupDia" :on-close="closeGroupDia"
        :confirm-btn="{content: '保存',theme: 'primary',loading: data.diaLoad,}">
      <el-form :model="data.groupParam" ref="groupForm" style="margin-top: 20px">
        <el-form-item label="分类名" prop="groupName" :rules="[{required: true,message: '分类名不能为空'}]">
          <el-input v-model="data.groupParam.groupName" placeholder="请输入分类名"></el-input>
        </el-form-item>
      </el-form>
    </t-dialog>
    <el-dialog v-model="data.bindRoleVisible" title="绑定角色" width="700px"
               :before-close="bindRoleClose" :close-on-click-modal="false" :destroy-on-close="true">
      <el-checkbox-group v-model="data.selfRoleList" @change="bindRoleChange" v-loading="data.bindRoleLoad" class="roleCheck">
        <el-checkbox v-for="item in data.roleList" :label="item.id" border
                     :disabled="['1','2','3'].includes(item.id)"
        >{{item.roleName}}</el-checkbox>
      </el-checkbox-group>
    </el-dialog>
  </div>
  <el-dialog
      v-model="data.infoVisible" title="个人信息" width="700px"
      :before-close="infoClose" :close-on-click-modal="false" :destroy-on-close="true">
    <div style="padding-left: 130px">
    <el-row :gutter="20" class="item-info">
      <el-col :span="7" class="title">头像：</el-col>
      <el-col :span="10">
        <el-image style="width: 100px; height: 100px" :src="data.showUser.avatarUrl" fit="fill"/>
      </el-col>
    </el-row>
    <el-row :gutter="20" class="item-info">
      <el-col :span="7" class="title">姓名：</el-col>
      <el-col :span="10" class="content">
        <span>{{ data.showUser.realName }}</span>
      </el-col>
    </el-row>
    <el-row :gutter="20" class="item-info">
      <el-col :span="7" class="title">用户名：</el-col>
      <el-col :span="10" class="content">{{ data.showUser.username }}</el-col>
    </el-row>
    <el-row :gutter="20" class="item-info">
      <el-col :span="7" class="title">性别：</el-col>
      <el-col :span="10" class="content">
        <span>{{ data.showUser.gender }}</span>
      </el-col>
    </el-row>
    <el-row :gutter="20" class="item-info">
      <el-col :span="7" class="title">住址：</el-col>
      <el-col :span="10" class="content">
        <span>{{getAddressStringByCode(JSON.parse(data.showUser.address))}}</span>
      </el-col>
    </el-row>
    <el-row :gutter="20" class="item-info">
      <el-col :span="7" class="title">电话号码：</el-col>
      <el-col :span="10" class="content">
        <span>{{ data.showUser.phone }}</span>
      </el-col>
    </el-row>
    <el-row :gutter="20" class="item-info">
      <el-col :span="7" class="title">电子邮箱：</el-col>
      <el-col :span="10" class="content">
        <span>{{ data.showUser.email }}</span>
      </el-col>
    </el-row>
    </div>
  </el-dialog>
</template>

<script setup>
import {ElMessage, ElMessageBox, ElSelect} from 'element-plus';
import {reactive, onMounted, computed, ref} from 'vue'
import {get, post} from '../../../http/request'
import man from '@/assets/img/man.svg';
import woman from '@/assets/img/woman.svg';
import role from '@/assets/img/role.svg';
import phone from '@/assets/img/phone.svg';
import UserInfo from "./UserInfo.vue";
import {AddIcon, EllipsisIcon} from 'tdesign-icons-vue-next';
import {checkHasRole, getAddressStringByCode, getObjByType, getUser} from '../../../utils/utils';
import {
  Filter, Delete, Avatar, MoreFilled, Paperclip,Switch
} from '@element-plus/icons'
import {MessagePlugin} from "tdesign-vue-next";

const data = reactive({
  // 用户查询参数
  params: {
    pageNumber: 1,
    pageSize: 10,
    param: {
      keyword: '', // 关键字
      classId: '', // 班级id（暂未实现）
      gradeId: '',  // 分组id（暂未实现）
      groupId: ''  // 分组id（暂未实现）
    }
  },
  transGroup: {
    id: ''
  },
  total: 0, // 总人数
  tableData: [], // 表格数据
  visible: false,  // 新增用户弹窗控制
  searchLoad: false, // 搜索用户加载动画控制
  tableLoad: false,  // 表格加载动画控制
  groupParam: {  // 新增、编辑分组参数
    groupName: ''
  },
  groupFilter: '', // 过滤分组参数
  selectedGroup: {
    id: '',
    groupName: '全部'
  },
  groupList: [], // 分类列表
  transGroupVisible: false, // 分类转移弹窗显示控制
  changeGroupVisible: false, // 分类更改弹窗显示控制
  groupVisible: false,
  editGroupId: '',
  transFromGroup: {},
  changeGroup: {
    id: ''
  },
  bindRoleVisible:false,
  roleList: [],
  selfRoleList:[],
  oldSelfRoleList:[],
  editRoleUserId:'',
  editGroupType: 'add',
  changeGroupId: '',
  bindRoleLoad:false,
  infoVisible:false,
  showUser:''
})

const roleKeys = reactive({
  addUser: {
    teacher: 'tjcy-t',
    manage: 'tjcy-m'
  },
  addGroup: {
    teacher: 'utjfz-t',
    manage:'utjfz-m'
  },
  editGroup:{
    teacher: 'ubjfl-t',
    manage:'ubjfl-m'
  },
  transGroup:{
    teacher: 'uzyfl-t',
    manage:'uzyfl-m'
  },
  delGroup:{
    teacher: 'uscfl-t',
    manage:'uscfl-m'
  },
  delUser:{
    teacher: 'usccy-t',
    manage:'usccy-m'
  },
  transUser:{
    teacher: 'usccy-t',
    manage:'uizyfl-m'
  },
  bindRole:{
    teacher: 'bdjs-t',
    manage:'bdjs-m'
  }
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
// 搜索分组
const getGroupList = async () => {
  let res = await get('/user/group/list');
  if (res.status === 1000) {
    data.groupList = res.data;
  } else {
    ElMessage.error(res.desc);
  }
}

const getRoleList = async () => {
  let param = {
    pageNumber: 1,
    pageSize: 99999,
    param: {
    }
  };
  let res = await post('/role/roleList', param);
  if (res.status === 1000) {
    data.roleList = res.data.list;
  } else {
    ElMessage.error(res.desc);
  }
}

const groupForm = ref();
const groupTransForm = ref();
const changeGroupForm = ref();

const onConfirmGroupDia = () => {
  groupForm.value.validate(async (checkRes) => {
    if (checkRes) {
      let res;
      let message;
      data.diaLoad = true;
      if (data.editGroupType === 'add') {
        res = await get(`/user/group/add/${data.groupParam.groupName}`)
        message = '添加成功';
      } else {
        res = await post(`/user/group/edit`, {groupName: data.groupParam.groupName, id: data.editGroupId})
        message = '更新成功';
      }
      data.diaLoad = false;
      if (res.status === 1000) {
        await MessagePlugin.success(message)
        closeGroupDia();
        await getGroupList();
      } else {
        await MessagePlugin.error(res.desc)
      }
    }
  })
}
const bindRoleClose = () => {
  data.bindRoleVisible = false;
}
const bindRoleChange = async(val) => {
  data.bindRoleLoad = true;
  let roleId;
  let type;
  if(val.length > data.oldSelfRoleList.length){
    type = 1;
    val.some(i => data.oldSelfRoleList.some(oi => {
      if(oi !== i){
        roleId = i;
        return true;
      }
    }))
  }else{
    type = 0;
    data.oldSelfRoleList.some(oi => {
      if(!val.includes(oi)){
        roleId = oi;
        return true;
      }
    })
  }
  let res = await get(`/user/role/${roleId}/${data.editRoleUserId}/${type}`);
  if(res.status === 1000){
    data.oldSelfRoleList = JSON.parse(JSON.stringify(val));
  }else{
    ElMessage.error(res.desc);
    data.selfRoleList = JSON.parse(JSON.stringify(data.oldSelfRoleList));
  }
  data.bindRoleLoad = false;
}

const changeGroup = item => {
  data.transFromGroup = getObjByType(data.groupList, 'id', item.groupId)
  data.changeGroupId = item.id;
  data.changeGroupVisible = true;
}

const closeGroupDia = () => {
  data.groupVisible = false;
  data.diaLoad = false;
}

const closeTransDia = () => {
  data.transGroupVisible = false;
  data.diaLoad = false;
}

const closeChangeGroupDia = () => {
  data.changeGroupVisible = false;
  data.diaLoad = false;
}
const infoClose = () => {
  data.infoVisible = false;
}

const handleItemCommand = ({type, param}) => {
  if (type === 'del') {
    delItem(param);
  } else if (type === 'info') {
    infoItem(param);
  } else if (type === 'role') {
    bindRole(param);
  }else if (type === 'trans') {
    changeGroup(param);
  }
}

const transUser = (param) => {

}

const delItem = (param) => {
  ElMessageBox.confirm(
      '删除后不可恢复，是否继续?',
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
  )
      .then(() => {
        ElMessage({
          type: 'success',
          message: 'Delete completed',
        })
      })
};

const infoItem = (param) => {
  data.showUser = param;
  data.infoVisible = true;
}

const bindRole = (param) => {
  data.selfRoleList = param.roles.map(i => i.id);
  data.oldSelfRoleList = param.roles.map(i => i.id);
  getRoleList();
  data.editRoleUserId = param.id;
  data.bindRoleVisible = true;
}

const handleCommand = ({type, param}) => {
  if (type === 'del') {
    delGroup(param);
  } else if (type === 'edit') {
    editGroup(param);
  } else if (type === 'trans') {
    transGroup(param)
  }
}

const delGroup = item => {
  if (item.userNumber > 0) {
    ElMessage.warning('改分类下还有成员，请转移分组后再删除')
    return;
  }
  ElMessageBox.confirm(
      '删除后不可恢复，确认删除?',
      '提示',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      }
  )
      .then(async () => {
        let res = await get(`/user/group/del/${item.id}`)
        if (res.status === 1000) {
          ElMessage.success('删除成功');
          await getUserList();
          selectedGroup({id: '', groupName: '全部'})
        }
      })
}

const confirmTransDia = () => {
  groupTransForm.value.validate(async (checkRes) => {
    if (checkRes) {
      data.diaLoad = true;
      let res = await get(`/user/group/trans?from=${data.transFromGroup.id}&to=${data.transGroup.id}`)
      data.diaLoad = true;
      if (res.status === 1000) {
        ElMessage.success('转移成功');
        closeTransDia();
        await getUserList();
        await getGroupList();
      } else {
        ElMessage.error(res.desc);
      }
    }
  })
}

const confirmChangeGroupDia = () => {
  changeGroupForm.value.validate(async (checkRes) => {
    if (checkRes) {
      data.diaLoad = true;
      let res = await post(`/user/edit`, {id: data.changeGroupId, groupId: data.changeGroup.id})
      data.diaLoad = true;
      if (res.status === 1000) {
        ElMessage.success('更改分类成功');
        closeChangeGroupDia();
        await getUserList();
        await getGroupList();
      } else {
        ElMessage.error(res.desc);
      }
    }
  })
}

const editGroup = (item) => {
  data.editGroupId = item.id;
  data.groupParam.groupName = item.groupName;
  data.editGroupType = 'edit';
  data.groupVisible = true;
}

const transGroup = item => {
  if (item.userNumber < 1) {
    ElMessage.warning('当前分类下暂无成员转移');
    return;
  }
  data.transFromGroup = item;
  data.transGroup.id = '';
  data.transGroupVisible = true;
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

//新增成员分组
const addGroup = () => {
  data.groupParam.groupName = '';
  data.editGroupType = 'add';
  data.groupVisible = true;
}

const selectedGroup = item => {
  data.selectedGroup = item;
  data.params.param = {
    keyword: '', // 关键字
    classId: '', // 班级id（暂未实现）
    gradeId: '',  // 分组id（暂未实现）
    groupId: data.selectedGroup.id
  }
  toSearch();
}

let showGroup = computed(() => {
  console.log(data.groupList);
  return data.groupList.filter(item => item.groupName.includes(data.groupFilter.trim()));
})

const edit = row => {
  data.type = 'edit';
  data.visible = true;
}

// 关闭新增用户弹窗
const closeDia = () => {
  data.visible = false;
  toSearch();
}
onMounted(() => {
  getUserList();
  getGroupList();
})
</script>
<style scoped lang='less'>
.main {
  background: white;
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

    .list {
      margin-top: 20px;
      display: flex;
      flex-direction: column;

      .item {
        display: flex;
        align-items: center;
        padding: 0 12px;
        height: 45px;
        border-radius: 6px;
        cursor: pointer;
        margin-bottom: 7px;

        .name {
          margin-right: auto;
          display: inline-block;
          max-width: 130px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }

      .item:hover {
        background: rgba(52, 73, 94, 0.1);
      }

      .item:active {
        background: rgba(52, 73, 94, 0.1);
      }

      .selected {
        background: rgba(52, 73, 94, 0.1);
      }
    }
  }

  .right {
    flex: 1;
    overflow: hidden;
    padding: 0 0 0 20px;

    .search {
      display: flex;
      margin-bottom: 30px;
      align-items: center;

      .group {
        margin-left: auto;
        font-size: 16px;
      }
    }

    .users {
      display: flex;
      flex-wrap: wrap;

      .item-user {
        background-color: #f5f7f9;
        width: 200px;
        border-radius: 6px;
        overflow: hidden;
        margin-right: 20px;
        margin-bottom: 20px;

        .foot-info {
          display: flex;
          flex-direction: column;
          padding-left: 20px;

          > div {
            display: flex;
            align-items: center;
            margin-bottom: 8px;

            span {
              margin-left: 12px;
            }
          }

          .role—item {
            display: inline-block;
          }
        }
      }
    }

    .pagination {
      position: absolute;
      right: 20px;
      bottom: 20px;
    }
  }
}
.roleCheck{
  .el-checkbox{
    margin-bottom: 12px;
  }
}
.item-info {
  min-height: 30px;
  margin-bottom: 12px;
  font-size: 14px;

  .title ,.content,.edit{
    display: flex;
    align-items: center;
  }
}
</style>