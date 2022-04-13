<template>
  <div class="main">
    <div class="search">
      <el-select v-model="data.platform" style="margin-right: 12px" @change="getAllResource">
        <el-option v-for="item in data.platforms" :key="item.value" :label="item.label" :value="item.value"/>
      </el-select>
      <el-input v-model="data.keyword" placeholder="输入关键字过滤筛选" class="margin-r wit-3"></el-input>
      <el-button @click="addResource(1)" v-if="checkHasRole(roleKeys.addRoot)" class="mr-12">添加根资源</el-button>
    </div>
    <div class="body">
      <div class="left" v-loading="data.treeLoad">
        <el-scrollbar style="height: calc(100vh - 300px);">
          <el-tree :data="data.treeData" ref="tree" @node-click="handleNodeClick" :props="data.props"
                   :expand-on-click-node="true" :filter-node-method="filterNode"
                   v-if="!data.treeLoad" :default-expanded-keys="data.defaultExpandKeys"/>
        </el-scrollbar>
      </div>
      <div class="right">
        <div v-if="data.showResource === ''" class="empty">
          <el-icon size="40" style="margin-bottom: 12px;color: #F56C6C">
            <i-warning/>
          </el-icon>
          <span>点击左边节点显示信息</span>
        </div>
        <div v-else class="info">
          <div class="item">
            <span class="title">资源名称</span>
            <span>{{ data.showResource.resourceName }}</span>
          </div>
          <div class="item">
            <span class="title">资源说明</span>
            <span>{{ data.showResource.note }}</span>
          </div>
          <div class="item">
            <span class="title">资源类型</span>
            <span>{{
                getObjByType(data.resourceTypes, 'value', data.showResource.type).label
              }}</span>
          </div>
          <div class="item" v-if="data.showResource.type === 'menu'">
            <span class="title">请求路径</span>
            <span>{{ data.showResource.path }}</span>
          </div>
          <div class="item" v-if="data.showResource.type === 'button'">
            <span class="title">唯一标识</span>
            <span>{{ data.showResource.onlyKey }}</span>
          </div>
          <div class="item" v-if="data.showResource.isRoot === 1">
            <span class="title">图标</span>
            <el-icon size="30">
              <component :is="data.showResource.icon"/>
            </el-icon>
          </div>
          <div class="foot">
            <el-button type="primary" plain size="small" @click="editResource" v-if="checkHasRole(roleKeys.edit)">编辑资源</el-button>
            <el-button size="small" type="info" plain @click="delResource" v-if="checkHasRole(roleKeys.del)">删除资源</el-button>
            <el-button v-if="data.showResource.type === 'menu' && checkHasRole(roleKeys.add)" size="small" type="success" plainx @click="addChildren">
              新增子资源
            </el-button>
          </div>
        </div>
      </div>
    </div>
    <el-dialog v-model="data.addShow" title="添加资源" width="500px" :before-close="closeDia">
      <div style="padding: 0 30px">
        <el-form :model="data.resource" :rules="data.rules" ref="form" label-width="80px">
          <el-form-item label="资源名称" prop="resourceName">
            <el-input v-model="data.resource.resourceName" size="small" placeholder="请输入资源名称"></el-input>
          </el-form-item>
          <el-form-item label="资源类型" prop="type">
            <el-select v-model="data.resource.type" size="small" style="width: 100%" placeholder="请选择资源类型">
              <el-option v-for="item in data.resourceTypes" :key="item.value" :label="item.label"
                         :value="item.value" :disabled="item.disabled"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="菜单路径" v-if="data.resource.type === 'menu'" prop="path">
            <el-input v-model="data.resource.path" size="small" placeholder="请输入资源请求路径"></el-input>
          </el-form-item>
          <el-form-item label="唯一标识" v-if="data.resource.type === 'button'" prop="onlyKey">
            <el-input v-model="data.resource.onlyKey" size="small" placeholder="请输入唯一标识" :disabled="!!data.resource.id"></el-input>
          </el-form-item>
          <el-form-item label="图标" v-if="data.resource.type === 'menu' && data.resource.isRoot" prop="icon">
            <el-button size="small" type="primary" @click="selectIcon" style="margin-right: 20px;">
              {{ data.resource.icon ? '重新选择' : '点击选择' }}
            </el-button>
            <el-icon size="20" v-if="data.resource.icon" style="position: relative;top:6px">
              <component :is="data.resource.icon"></component>
            </el-icon>
          </el-form-item>
          <el-form-item label="资源说明">
            <el-input v-model="data.resource.note" :rows="3" type="textarea" placeholder="请输入资源说明"></el-input>
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
    <el-dialog v-model="data.iconShow" title="选择图标" width="800px"
               :before-close="closeIconDia">
      <div style="padding: 0 0 40px 0">
        <el-scrollbar height="400px" view-class="icon-body" ref="scrollbar">
          <section v-for="item in icons" class="item" @click="choseIcon(item)">
            <el-icon :size="20">
              <component :is="item.name"></component>
            </el-icon>
          </section>
        </el-scrollbar>
      </div>
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
  if(!data.resource.id){
    let res = await get(`/resource/check/${value}`)
    if (res.status !== 1000) {
      callback(new Error(res.desc))
    } else {
      callback()
    }
  }else{
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
    label: 'resourceName',
    children: 'children',
  },
  platforms: [
    //{label: '学生平台', value: 'student'},
    {label: '管理平台', value: 'manage'},
    {label: '教师平台', value: 'teacher'},
  ],
  addShow: false,
  iconShow: false,
  diaLoad: false,
  resource: {
    isRoot: 1,
    path: '',
    icon: '',
    type: '',
    note: '',
    onlyKey: '',
    platform: 'teacher',
    resourceName: '',
    weights: 0
  },
  resourceTypes: [
    {value: 'menu', label: '菜单', disabled: false},
    {value: 'button', label: '按钮', disabled: false},
  ],
  rules: {
    resourceName: [
      {required: true, message: '请输入资源名称', trigger: 'blur'}
    ],
    type: [
      {required: true, message: '请选择资源类型', trigger: 'blur'}
    ],
    path: [{required: true, message: '请填写资源路径', trigger: 'blur'}],
    onlyKey: [{required: true, message: '请填写唯一标识', trigger: 'blur'},
      {validator: checkKey, trigger: 'blur'}],
    icon: [{required: true, message: '请选择图标', trigger: 'blur'}]
  },
  showResource: '',
  expandAll:true,
  defaultExpandKeys:[]
})
const roleKeys = reactive({
  addRoot: {
    teacher: 'tjgzy-t',
    manage: 'tjgzy-m'
  },
  edit: {
    teacher: 'bjzy-t',
    manage: 'bjzy-m'
  },
  del: {
    teacher: 'sczy-t',
    manage: 'sczy-m'
  },
  add: {
    teacher: 'xzzzy-t',
    manage: 'xzzzy-m'
  },
})

const icons = computed(() => {
  let arr = [];
  for (let iconName in ElIconModules) {
    arr.push({name: transElIconName(iconName), value: iconName})
  }
  return arr;
})
const addResource = (root) => {
  data.resource = {
    isRoot: 1,
    path: '',
    icon: '',
    type: 'menu',
    resourceName: '',
    parent: '',
    onlyKey: '',
    weights: data.treeData.length + 1
  };
  data.resourceTypes[0].disabled = false;
  data.resourceTypes[1].disabled = true;
  data.resource.isRoot = root;
  data.defaultExpandKeys = [data.showResource.id];
  data.addShow = true;
}

const getAllResource = async () => {
  data.treeLoad = true;
  let res = await get(`/resource/getAll/${data.platform}`);
  data.treeLoad = false;
  if (res.status === 1000) {
    data.treeData = res.data;
  } else {
    ElMessage.error(res.desc);
  }
}
const selectIcon = () => {
  data.iconShow = true;
}
const closeDia = () => {
  data.addShow = false;
}
const closeIconDia = () => {
  data.iconShow = false;
  scrollbar.value.setScrollTop(0);
}
const choseIcon = item => {
  data.resource.icon = item.name;
  closeIconDia();
}
const confirmDia = async () => {
  form.value.validate(async (res) => {
    if (res) {
      let url = data.resource.id ? '/resource/update' : '/resource/add'
      data.resource.platform = data.platform;
      let res = await post(url, data.resource);
      if (res.status === 1000) {
        ElMessage.success(data.resource.id ? '编辑资源成功' : '新增资源成功');
        data.showResource = deepCloneObj(data.resource);
        closeDia();
        await getAllResource();
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
  return data.resourceName.indexOf(value) !== -1
}

const handleNodeClick = item => {
  data.showResource = item;
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
    let res = await get(`/resource/del/${data.showResource.id}`);
    if (res.status === 1000) {
      ElMessage.success('删除成功');
      data.showResource = '';
      await getAllResource();
    } else {
      ElMessage.error(res.desc)
    }
  }).catch(() => {
    ElMessage.info('Delete canceled');
  })
}
const editResource = () => {
  let {id, isRoot, path, icon, type, resourceName, note, weights, onlyKey} = data.showResource;
  data.resource = {id, isRoot, path, icon, type, resourceName, note, weights, onlyKey};
  data.defaultExpandKeys = [data.resource.id];
  data.addShow = true;
}

const addChildren = () => {
  if (data.showResource.isRoot === 1) {
    data.resource = {
      isRoot: 0,
      path: '',
      icon: '',
      onlyKey: '',
      type: 'menu',
      resourceName: '',
      parent: data.showResource.id,
      weights: data.showResource.children.length + 1
    };
    data.resourceTypes[0].disabled = false;
    data.resourceTypes[1].disabled = true;
  } else {
    data.resource = {
      isRoot: 0,
      path: '',
      onlyKey: '',
      icon: '',
      type: 'button',
      resourceName: '',
      parent: data.showResource.id,
      weights: data.showResource.children.length + 1
    };
    data.resourceTypes[0].disabled = true;
    data.resourceTypes[1].disabled = false;
  }
  data.defaultExpandKeys = [data.showResource.id];
  data.addShow = true;
}

onMounted(() => {
  getAllResource();
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