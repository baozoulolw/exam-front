<template>
  <div class="main">
    <div class="search">
      <el-input v-model="data.keyword" placeholder="输入关键字过滤筛选" class="margin-r wit-3"></el-input>
      <el-button @click="addCourse(1)" v-if="checkHasRole(roleKeys.addRoot)">添加课程</el-button>
    </div>
    <div class="body">
      <div class="left" v-loading="data.treeLoad">
        <el-scrollbar style="height: calc(100vh - 300px);">
          <el-tree :data="data.treeData" ref="tree" @node-click="handleNodeClick" :props="data.props"
                   :filter-node-method="filterNode"/>
        </el-scrollbar>
      </div>
      <div class="right">
        <div v-if="data.showCourse === ''" class="empty">
          <el-icon size="40" style="margin-bottom: 12px;color: #F56C6C">
            <i-warning/>
          </el-icon>
          <span>点击左边节点显示信息</span>
        </div>
        <div v-else class="info">
          <div class="item">
            <span class="title">课程名称</span>
            <span>{{ data.showCourse.showCourseName }}</span>
          </div>
          <div class="item">
            <span class="title">创建时间</span>
            <span>{{ data.showCourse.createTime }}</span>
          </div>
          <div class="foot">
            <el-button type="primary" plain size="small" @click="editCourse" v-if="checkHasRole(roleKeys.edit)">编辑课程
            </el-button>
            <el-button size="small" type="info" plain @click="delResource" v-if="checkHasRole(roleKeys.del)">删除课程
            </el-button>
            <el-button v-if="checkHasRole(roleKeys.add)" size="small" type="success"
                       plainx @click="addChildren">
              新增子课程
            </el-button>
          </div>
        </div>
      </div>
    </div>
    <el-dialog v-model="data.addShow" :title="data.title" width="500px" :before-close="closeDia">
      <div style="padding: 0 30px">
        <el-form :model="data.course" :rules="data.rules" ref="form" label-width="80px">
          <el-form-item label="资源名称" prop="groupName">
            <el-input v-model="data.course.groupName" size="small" placeholder="请输入课程名称"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
      <span class="dialog-footer">
        <t-button theme="default" @click="closeDia" class="mr-12">取消</t-button>
        <t-button theme="primary" @click="confirmDia" :loading="data.diaLoad">确认</t-button>
      </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import {reactive, onMounted, computed, ref, watch} from 'vue'
// 统一导入el-icon图标
import * as ElIconModules from '@element-plus/icons'
// 导入转换图标名称的函数
import {checkHasRole, deepCloneObj, transElIconName} from '../../../utils/utils'
import {get, post} from "../../../http/request";
import {ElMessage, ElMessageBox} from "element-plus";
import {getObjByType} from "../../../utils/utils";

// 校验用户名是否符合标准的方法
const checkKey = async (rule, value, callback) => {
  if (!data.course.id) {
    let res = await get(`/resource/check/${value}`)
    if (res.status !== 1000) {
      callback(new Error(res.desc))
    } else {
      callback()
    }
  } else {
    callback()
  }
}

const scrollbar = ref(null);
const form = ref(null)
const tree = ref(null)
const data = reactive({
  platform: 'teacher',
  treeLoad: false,
  keyword: '',
  treeData: [],
  props: {
    label: 'groupName',
    children: 'children',
  },
  diaLoad: false,
  course: {
    parent: '',
    groupName: ''
  },
  rules: {
    groupName: [
      {required: true, message: '请输入课程名称', trigger: 'blur'}
    ],
  },
  showCourse: '',
  title:'新增课程'
})
const roleKeys = reactive({
  addRoot: {
    teacher: 'tjkc-t',
    manage: 'tjkc-m'
  },
  edit: {
    teacher: 'bjkc-t',
    manage: 'bjkc-m'
  },
  del: {
    teacher: 'sckc-t',
    manage: 'sckc-m'
  },
  add: {
    teacher: 'xzzkc-t',
    manage: 'xzzkc-m'
  },
})

const addCourse = (root) => {
  data.course = {
    groupName: '',
    parent: 2
  };
  data.title = '添加课程';
  data.addShow = true;
}

const getAllCourse = async () => {
  data.treeLoad = true;
  let res = await get(`/question/course/all`);
  data.treeLoad = false;
  if (res.status === 1000) {
    data.treeData = res.data;
    data.treeData.forEach(item => {
      item.showCourseName = item.groupName;
      item.children.forEach(c => {
        c.showCourseName = item.showCourseName + '>' + c.groupName;
      })
    })
  } else {
    ElMessage.error(res.desc);
  }
}

const closeDia = () => {
  form.value.resetFields();
  data.addShow = false;
}


const confirmDia = async () => {
  form.value.validate(async (res) => {
    if (res) {
      let res;
      if(data.course.id){
        res = await post('/question/group/edit', data.course);
      }else{
        res = await get(`/question/group/add/${data.course.groupName}/${data.course.parent}`);
      }
      if (res.status === 1000) {
        ElMessage.success(data.course.id ? '编辑成功' : '新增成功');
        data.showCourse = deepCloneObj(data.course);
        closeDia();
        await getAllCourse();
      } else {
        ElMessage.error(res.desc);
      }
    }
  })
}

watch(() => data.keyword, (val) => {
  tree.value.filter(val)
})

const filterNode = (value, data) => {
  if (!value) return true
  return data.groupName.indexOf(value) !== -1
}

const handleNodeClick = item => {
  data.showCourse = item;
}
const delResource = () => {
  ElMessageBox.confirm(
      '删除后不可恢复，确认删除？',
      '提示',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      }
  ).then(async () => {
    if(data.showCourse.questionNumber > 0) {
      ElMessage.warning('该课程下有试题，不可删除！');
      return;
    }
    if(data.showCourse.parent === '2' && data.showCourse.children.length > 0) {
      ElMessage.warning('该课程下有子课程，不可删除！');
      return;
    }
    let res = await get(`/question/group/del/${data.showCourse.id}`);
    if (res.status === 1000) {
      ElMessage.success('删除成功');
      data.showCourse = '';
      await getAllCourse();
    } else {
      ElMessage.error(res.desc)
    }
  })
}
const editCourse = () => {
  let {groupName, id, parent} = data.showCourse;
  data.course = {groupName, id, parent};
  data.addShow = true;
}

const addChildren = () => {
  data.course = {
    groupName: '',
    parent: data.showCourse.id
  };
  data.title = '添加子课程'
  data.addShow = true;
}

onMounted(() => {
  getAllCourse();
})
</script>
<style scoped lang='less'>
.main {
  background: white;
  height: calc(100vh - 100px);
  padding: 20px;
  display: flex;
  flex-direction: column;

  .search {
    display: flex;
    padding: 0 300px;
    margin-top: 30px
  }

  .body {
    display: flex;
    flex: 1;
    padding: 50px 300px;

    .left {
      flex: 1;
      border: 1px solid var(--el-border-color-base);
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
      margin-right: 20px;
      padding: 12px;
      border-radius: 6px;
      min-width: 370px;
      :deep(.el-tree-node__content) {
        height: 32px;
      }
    }

    .right {
      flex: 1;
      border: 1px solid var(--el-border-color-base);
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
      border-radius: 6px;
      min-width: 370px;

      .empty {
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        span {
          font-size: 20px;
        }
      }

      .info {
        padding: 40px;
        position: relative;
        height: 100%;

        .item {
          margin-bottom: 30px;
          display: flex;
          position: relative;

          .title {
            margin-right: 22px;
            display: inline-block;
            width: 70px;
            min-width: 70px;
            position: relative;
            top: 0;
          }
        }

        .foot {
          position: absolute;
          bottom: 20px;

          :deep(.el-divider--horizontal) {
            margin-bottom: 20px;
          }
        }
      }
    }
  }

  :deep( .icon-body) {
    height: 400px;
    display: flex;
    flex-wrap: wrap;
    padding: 0 20px;
    margin-bottom: 20px;

    .item {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 72px;
      width: 72px;
      cursor: pointer;
      border-radius: 4px;
    }

    .item:hover {
      background: rgba(0, 0, 0, 0.2);
    }
  }
}
</style>