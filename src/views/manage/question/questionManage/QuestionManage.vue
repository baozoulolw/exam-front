<template>
  <div class="main">
    <div class="left">
      <header class="left-head">
        <span>试题分类</span>
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
        <section :class="['item',{'selected':data.selectedGroup.id === ''}]" @click="selectedGroup({id:'',groupName:'全部'})">
          <span class="name">{{ `全部 (${data.groupList.reduce((p,{questionNumber})=> {p+=questionNumber;return p},0)})` }}</span>
        </section>
        <section v-for="item in showGroup" :key="item.id" :class="['ml','item',{'selected':data.selectedGroup.id === item.id}]"
                 @click="selectedGroup(item)">
          <span class="name" :title="item.groupName">{{ `${item.groupName}` }}</span><span style="margin-right: 3px">({{(item.questionNumber)}})</span>
          <el-dropdown @command="handleCommand">
            <el-icon>
              <i-more-filled/>
            </el-icon>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item :command="{type:'trans',param:item}" v-if="checkHasRole(roleKeys.transGroup)">转移分类</el-dropdown-item>
                <el-dropdown-item :command="{type:'edit',param:item}" v-if="item.id !== '1' && checkHasRole(roleKeys.transGroup)">编辑分类</el-dropdown-item>
                <el-dropdown-item :command="{type:'del',param:item}" v-if="item.id !== '1' && checkHasRole(roleKeys.delGroup)">删除分类</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </section>
      </article>
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
        <span class="group">当前分类:{{data.selectedGroup.groupName}}</span>
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
        <!--        <el-table-column label="创建时间" prop="createTime" width="180">
                  <template #default="scope">
                      <span
                          class="table-span"
                          :title="scope.row.createTime"
                      >{{ scope.row.createTime ? scope.row.createTime : '-&#45;&#45;' }}</span>
                  </template>
                </el-table-column>-->
        <el-table-column label="最后修改时间" prop="changeTime" width="180"></el-table-column>
        <el-table-column label="最后操作人" prop="changeUser" width="130"></el-table-column>
        <el-table-column label="操作" width="190">
          <template #default="scope">
            <div class="table-operate">
              <span @click="changeGroup(scope.row)" class="item-span" v-if="checkHasRole(roleKeys.trans)">更改分组</span>
              <el-divider direction="vertical" v-if="checkHasRole(roleKeys.trans)"></el-divider>
              <span @click="edit(scope.row)" class="item-span" v-if="checkHasRole(roleKeys.edit)">编辑</span>
              <el-divider direction="vertical" v-if="checkHasRole(roleKeys.edit) && checkHasRole(roleKeys.del)"></el-divider>
              <span @click='delQuestion(scope.row)' class="item-span" v-if="checkHasRole(roleKeys.del)">删除</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
            :pager-count="5"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :page-sizes="[4, 8, 10,13]"
            background
            layout="total, prev, pager, next, sizes, jumper"
            :total="data.total"
        ></el-pagination>
      </div>
    </div>
  </div>
  <t-dialog
      v-model:visible="data.groupVisible" :header="data.editGroupType === 'add' ? '添加分类':'编辑分类'"
      width="400px" v-if="data.groupVisible" :on-confirm="onConfirmDia" :on-close="closeDia"
      :confirm-btn="{content: '保存',theme: 'primary',loading: data.diaLoad,}">
    <el-form :model="data.groupParam" ref="groupForm" style="margin-top: 20px">
      <el-form-item label="分类名" prop="groupName" :rules="[{required: true,message: '分类名不能为空'}]">
        <el-input v-model="data.groupParam.groupName" placeholder="请输入分类名"></el-input>
      </el-form-item>
    </el-form>
  </t-dialog>
  <t-dialog
      v-model:visible="data.groupTransVisible" :header="data.editGroupType === 'add' ? '添加分类':'编辑分类'"
      width="400px" v-if="data.groupTransVisible" :on-confirm="onConfirmTransDia" :on-close="closeTransDia"
      :confirm-btn="{content: '保存',theme: 'primary',loading: data.diaLoad,}">
    <el-form :model="data.groupParam" ref="groupForm" style="margin-top: 20px">
      <el-form-item label="分类名" prop="groupName" :rules="[{required: true,message: '分类名不能为空'}]">
        <el-input v-model="data.groupParam.groupName" placeholder="请输入分类名" clearable></el-input>
      </el-form-item>
    </el-form>
  </t-dialog>
  <!--  分类转移-->
  <el-dialog v-model="data.transGroupVisible" title="转移分类" width="400px" :before-close="closeTransDia">
    <div style="padding-left: 20px">{{`当前分类:  ${data.transFromGroup.groupName}`}}</div>
    <el-form :model="data.transGroup" ref="groupTransForm" style="margin-top: 20px">
      <el-form-item label="转移至分类" prop="id" :rules="[{required: true,message: '请选择分类'}]">
        <el-select style="width: 100%" v-model="data.transGroup.id" placeholder="请选择分类" filterable>
          <el-option v-for="item in data.groupList.filter(i => i.id !== data.transFromGroup.id)" :key="item.id" :label="item.groupName" :value="item.id"></el-option>
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
  <!--  试题分类更改-->
  <el-dialog v-model="data.changeGroupVisible" title="更改分类" width="400px" :before-close="closeChangeGroupDia">
    <div style="padding-left: 20px">{{`当前分类:  ${data.transFromGroup.groupName}`}}</div>
    <el-form :model="data.changeGroup" ref="changeGroupForm" style="margin-top: 20px">
      <el-form-item label="转移至分类" prop="id" :rules="[{required: true,message: '请选择分类'}]">
        <el-select style="width: 100%" v-model="data.changeGroup.id" placeholder="请选择分类" filterable>
          <el-option v-for="item in data.groupList.filter(i => i.id !== data.transFromGroup.id)" :key="item.id" :label="item.groupName" :value="item.id"></el-option>
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
  <t-drawer v-model:visible="data.editShow" :header="data.editType === 'add' ? '添加试题':'编辑试题'" size="700px"
            :on-confirm="onConfirmEditDia" :on-close="closeEditDia"
            :confirm-btn="{content: '保存',theme: 'primary',loading: data.diaLoad,}">
    <edit-question v-if=data.editShow ref="editQuestion" :edit-type="data.editType" :id="data.editId" :group="data.addQuestionGroup"></edit-question>
  </t-drawer>
</template>

<script setup>
import {reactive, onMounted, watch, computed, ref} from 'vue'
import {get, post} from '../../../../http/request';
import {onBeforeRouteUpdate, useRouter} from "vue-router";
import {ElMessageBox, ElMessage} from "element-plus";
import {AddIcon, EllipsisIcon} from 'tdesign-icons-vue-next';
import { MessagePlugin } from 'tdesign-vue-next';
import {
  Filter,
} from '@element-plus/icons'
import EditQuestion from "./EditQuestion.vue";
import {checkHasRole, getObjByType} from "../../../../utils/utils";

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
  transGroupVisible:false,
  transFromGroup:{},
  selectedGroup: {
    id:'',
    groupName:'全部'
  },
  transGroup:{
    id:''
  },
  changeGroup:{
    id:''
  },
  editShow:false,
  diaLoad: false,
  groupVisible: false,
  groupTransVisible:false,
  changeGroupVisible:false,
  groupParam: {
    groupName: ''
  },
  editGroupType:'add',
  groupList: [],
  qTypes: [
    {value: 0, label: '单选题'},
    {value: 1, label: '多选题'},
    {value: 2, label: '判断题'},
    {value: 3, label: '填空题'},
    {value: 3, label: '简答题'},
  ],
  qHards: [
    {value: 0, label: '简单'},
    {value: 1, label: '中等'},
    {value: 2, label: '困难'},
  ],
  types: ['单选题', '多选题', '判断题', '填空题','简答题'],
  hards: ['简单', '中等', '困难'],
  total: 0,
  tableData: [],
  searchLoad: false,
  tableLoad: false,
  editType: 'add',
  editId:'',
  editQuestion: {},
  addQuestionGroup:'',
  showList: true,
  groupFilter: '',
  editGroupId:'',
  changeGroupId:''
})
const roleKeys = reactive({
  add: {
    teacher: 'tjst-t',
    manage: 'tjst-m'
  },
  addGroup: {
    teacher: 'tjstfl-t',
    manage:'tjstfl-m'
  },
  editGroup:{
    teacher: 'bjstfl-t',
    manage:'bjstfl-m'
  },
  transGroup:{
    teacher: 'zystfl-t',
    manage:'zystfl-m'
  },
  delGroup:{
    teacher: 'scstfl-t',
    manage:'scstfl-m'
  },
  del:{
    teacher: 'scst-t',
    manage:'scst-m'
  },
  trans:{
    teacher: 'ggstfl-t',
    manage:'ggstfl-m'
  },
  edit:{
    teacher: 'bjst-t',
    manage:'bjst-m'
  },
})

watch(() => data.showList,
    (n, o) => {
      if (n) {
        getGroupList();
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

const addGroup = () => {
  data.groupParam.groupName = '';
  data.editGroupType = 'add';
  data.groupVisible = true;
}
const getGroupList = async () => {
  let res = await get('/question/group/list');
  if (res.status === 1000) {
    data.groupList = res.data;
  } else {
    ElMessage.error(res.desc);
  }
}
const handleCommand = ({type,param}) => {
  if(type === 'del'){
    delGroup(param);
  }else if(type === 'edit'){
    editGroup(param);
  }else if(type === 'trans'){
    transGroup(param)
  }
}
const editGroup = (item) => {
  data.editGroupId = item.id;
  data.groupParam.groupName = item.groupName;
  data.editGroupType = 'edit';
  data.groupVisible = true;
}

const transGroup = item => {
  if(item.questionNumber < 1){
    ElMessage.warning('当前分类下暂无试题转移');
    return;
  }
  data.transFromGroup = item;
  data.transGroup.id = '';
  data.transGroupVisible = true;
}

const delGroup = item => {
  if(item.questionNumber > 0){
    ElMessage.warning('改分类下还有试题，请转移分组后再删除')
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
      .then(async() => {
        let res = await get(`/question/group/del/${item.id}`)
        if(res.status === 1000){
          ElMessage.success('删除成功');
          getGroupList();
          selectedGroup({id:'',groupName:'全部'})
        }
      })
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
  /*const path = '/question_edit'
  let group = data.selectedGroup.id === '' ? '1': data.selectedGroup.id;
  console.log(group)
  router.push({path, query: {editType: 'add',group:group}})*/
  data.addQuestionGroup = data.selectedGroup.id === '' ? '1': data.selectedGroup.id;
  data.editType = 'add';
  data.editShow = true;
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
          getQuestionList();
          getGroupList();
        } else {
          ElMessage.error(res.desc);
        }
      })
}

const edit = row => {
  data.editQuestion = JSON.parse(JSON.stringify(row));
  /*const path = '/question_edit'
  router.push({path, query: {editType: 'edit', id: data.editQuestion.id}})*/
  data.editType = 'edit';
  data.editId = data.editQuestion.id;
  data.editShow = true;
}

const selectedGroup = item => {
  data.selectedGroup = item;
  data.params.param = {
    keyword: '',
    type: '',
    hard: '',
    groupId:data.selectedGroup.id
  }
  toSearch();
}

const groupForm = ref();
const groupTransForm = ref();
const changeGroupForm = ref();

const onConfirmDia = () => {
  groupForm.value.validate(async (checkRes) => {
    if (checkRes) {
      let res;
      let message;
      data.diaLoad = true;
      if(data.editGroupType === 'add'){
        res = await get(`/question/group/add/${data.groupParam.groupName}`)
        message = '添加成功';
      }else{
        res = await post(`/question/group/edit`,{groupName:data.groupParam.groupName,id:data.editGroupId})
        message = '更新成功';
      }
      data.diaLoad = false;
      if (res.status === 1000) {
        await MessagePlugin.success(message)
        closeDia();
        await getGroupList();
      } else {
        await MessagePlugin.error(res.desc)
      }
    }
  })
}
const closeDia = () => {
  data.groupVisible = false;
}

const closeTransDia = () => {
  data.transGroupVisible = false;
}

const closeChangeGroupDia = () => {
  data.changeGroupVisible = false;
  data.diaLoad = false;
}

const confirmTransDia = () => {
  groupTransForm.value.validate(async(checkRes) => {
    if(checkRes){
      data.diaLoad = true;
      let res = await get(`/question/group/trans?from=${data.transFromGroup.id}&to=${data.transGroup.id}`)
      data.diaLoad = true;
      if(res.status === 1000){
        ElMessage.success('转移成功');
        closeTransDia();
        await getQuestionList();
        await getGroupList();
      }else{
        ElMessage.error(res.desc);
      }
    }
  })
}

const confirmChangeGroupDia = () => {
  changeGroupForm.value.validate(async(checkRes) => {
    if(checkRes){
      data.diaLoad = true;
      let res = await post(`/question/edit`,{id:data.changeGroupId,groupId:data.changeGroup.id})
      data.diaLoad = false;
      if(res.status === 1000){
        ElMessage.success('更改分类成功');
        closeChangeGroupDia();
        await getQuestionList();
        await getGroupList();
      }else{
        ElMessage.error(res.desc);
      }
    }
  })
}

const changeGroup = item => {
  data.transFromGroup = getObjByType(data.groupList,'id',item.groupId)
  data.changeGroupId = item.id;
  data.changeGroupVisible = true;
}

const editQuestion = ref();
const onConfirmEditDia = () => {
  editQuestion.value.save();
}

const closeEditDia = () => {

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

    .pagination {
      position: absolute;
      right: 20px;
      bottom: 20px;
    }
  }
}
</style>