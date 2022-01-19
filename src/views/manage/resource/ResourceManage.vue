<template>
  <div class="main">
    <div class="search">
      <el-input v-model="data.keyword" placeholder="输入关键字过滤筛选" class="margin-r wit-3"></el-input>
      <el-button @click="addResource(1)">添加根资源</el-button>
    </div>
    <div class="body">
      <div class="left">
        <el-scrollbar>
          <el-tree :data="data.treeData" ref="tree" @node-click="handleNodeClick" :props="data.props"
                   :filter-node-method="filterNode"/>
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
          <div class="item">
            <span class="title">请求路径</span>
            <span>{{ data.showResource.path }}</span>
          </div>
          <div class="item">
            <span class="title">图标</span>
            <el-icon size="30">
              <component :is="data.showResource.icon"/>
            </el-icon>
          </div>
          <div class="foot">
            <el-button type="primary" plain size="small" @click="editResource">编辑资源</el-button>
            <el-button size="small" type="info" plain>删除资源</el-button>
            <el-button v-if="data.showResource.isRoot === 1" size="small" type="success" plain>新增子资源</el-button>
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
                         :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="菜单路径" v-show="data.resource.type === 'menu'" prop="path">
            <el-input v-model="data.resource.path" size="small" placeholder="请输入资源请求路径"></el-input>
          </el-form-item>
          <el-form-item label="图标" v-show="data.resource.type === 'menu' && data.resource.isRoot" prop="icon">
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
import {transElIconName} from '../../../utils/utils'
import {get, post} from "../../../http/request";
import {ElMessage} from "element-plus";
import {getObjByType} from "../../../utils/utils";


const scrollbar = ref(null);
const form = ref(null)
const tree = ref(null)
const data = reactive({
  keyword: '',
  treeData: [],
  props: {
    label: 'resourceName',
    children: 'children',
  },
  addShow: false,
  iconShow: false,
  diaLoad: false,
  resource: {
    isRoot: 1,
    path: '',
    icon: '',
    type: '',
    note: '',
    resourceName: ''
  },
  resourceTypes: [
    {value: 'menu', label: '菜单'}
  ],
  rules: {
    resourceName: [
      {required: true, message: '请输入资源名称', trigger: 'blur'}
    ],
    type: [
      {required: true, message: '请选择资源类型', trigger: 'blur'}
    ],
    path: [{required: true, message: '请填写资源路径', trigger: 'blur'}],
    icon: [{required: true, message: '请选择图标', trigger: 'blur'}]
  },
  showResource: ''
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
    resourceName: ''
  };
  data.resource.isRoot = root;
  data.addShow = true;
}

const getAllResource = async () => {
  let res = await get('/resource/getAll');
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
  console.log(form);
  form.value.validate(async (res) => {
    if (res) {
      let res = await post('/resource/add', data.resource);
      if (res.status === 1000) {
        ElMessage.success('新增资源成功');
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

const editResource = () => {

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
        .foot{
          position: absolute;
          bottom: 20px;
          :deep(.el-divider--horizontal){
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