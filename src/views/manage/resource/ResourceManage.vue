<template>
  <div class="main">
    <div class="search">
      <el-input v-model="data.keyword" placeholder="输入关键字" class="margin-r wit-3"></el-input>
      <el-button @click="addResource(1)">添加根资源</el-button>
    </div>
    <div class="body">
      <div class="left">
        <el-tree :data="data.treeData" @node-click="handleNodeClick"/>
      </div>
      <div class="right">

      </div>
    </div>
    <el-dialog v-model="data.addShow" title="添加资源" width="500px" :before-close="closeDia">
      <div style="padding: 0 30px">
        <el-form :model="data.resource" :rules="data.rules" ref="form" label-width="80px">
          <el-form-item label="资源名称" prop="resourceName">
            <el-input v-model="data.resource.resourceName" size="small"></el-input>
          </el-form-item>
          <el-form-item label="资源类型" prop="type">
            <el-select v-model="data.resource.type" size="small" style="width: 100%">
              <el-option v-for="item in data.resourceTypes" :key="item.value" :label="item.label"
                         :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="菜单路径" v-show="data.resource.type === 'menu'" prop="path">
            <el-input v-model="data.resource.path" size="small"></el-input>
          </el-form-item>
          <el-form-item label="图标" v-show="data.resource.type === 'menu' && data.resource.isRoot" prop="icon">
            <el-button size="small" type="primary" @click="selectIcon" style="margin-right: 20px;">{{data.resource.icon ? '重新选择':'点击选择'}}</el-button>
            <el-icon size="20" v-if="data.resource.icon" style="position: relative;top:6px">
              <component :is="data.resource.icon"></component>
            </el-icon>
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
import {reactive, onMounted, computed, ref} from 'vue'
// 统一导入el-icon图标
import * as ElIconModules from '@element-plus/icons'
// 导入转换图标名称的函数
import {transElIconName} from '../../../utils/utils'
import {post} from "../../../http/request";
import {ElMessage} from "element-plus";


const scrollbar = ref(null);
const form = ref(null)
const data = reactive({
  keyword: '',
  treeData: [
    {
      label: 'Level one 1',
      children: [
        {
          label: 'Level two 1-1',
          children: [
            {
              label: 'Level three 1-1-1',
            },
          ],
        },
      ],
    },
    {
      label: 'Level one 2',
      children: [
        {
          label: 'Level two 2-1',
          children: [
            {
              label: 'Level three 2-1-1',
            },
          ],
        },
        {
          label: 'Level two 2-2',
          children: [
            {
              label: 'Level three 2-2-1',
            },
          ],
        },
      ],
    },
    {
      label: 'Level one 3',
      children: [
        {
          label: 'Level two 3-1',
          children: [
            {
              label: 'Level three 3-1-1',
            },
          ],
        },
        {
          label: 'Level two 3-2',
          children: [
            {
              label: 'Level three 3-2-1',
            },
          ],
        },
      ],
    },
  ],
  addShow: false,
  iconShow: false,
  diaLoad: false,
  resource: {
    isRoot: 1,
    path: '',
    icon: '',
    type: '',
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
    path:[{required: true, message: '请填写资源路径', trigger: 'blur'}],
    icon:[{required: true, message: '请选择图标', trigger: 'blur'}]
  }
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
const confirmDia = async() => {
  console.log(form);
  form.value.validate( async(res) => {
    if(res){
      let res = await post('/resource/add',data.resource);
      if(res.status === 1000){
        ElMessage.success('新增资源成功');
        closeDia();
      }else{
        ElMessage.error(res.desc);
      }
    }
  })
}

const handleNodeClick = () => {

}

onMounted(() => {
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
    padding: 0 200px;
    margin-top: 30px
  }

  .body {
    display: flex;
    flex: 1;
    padding: 50px 200px;

    .left {
      flex: 1;
      border: 1px solid var(--el-border-color-base);
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
      margin-right: 20px;
      padding: 12px;
    }

    .right {
      flex: 1;
      border: 1px solid var(--el-border-color-base);
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
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