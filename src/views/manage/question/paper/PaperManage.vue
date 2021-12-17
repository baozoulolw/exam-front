<template>
  <div class="main">
    <div class="search">
      <el-input
          v-model="data.params.param.keyword"
          placeholder="输入关键词"
          class="margin-r wit-3"
          clearable
      ></el-input>
      <el-select
          v-model="data.params.param.hard"
          placeholder="请选择难度"
          style="margin-right:20px"
          clearable
      >
        <el-option
            v-for="item in data.qHards"
            :key="item.value"
            :value="item.value"
            :label="item.label"
        ></el-option>
      </el-select>
      <el-button @click="toSearch" :loading="data.searchLoad" type="primary">搜索</el-button>
      <el-button @click="creatPaper" type="primary" plain>创建试卷</el-button>
    </div>
    <el-scrollbar v-loading="data.paperLoad" :view-class="['papers',{'em':data.papers.length === 0}]"
                  wrap-class="paper-warp">
      <section v-for="item in data.papers" :key="item.id" class="item" @dblclick="toPaper(item)">
        <div class="menu">
          <el-dropdown>
            <el-button type="text">
              <el-icon>
                <More></More>
              </el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item :icon="Edit" @click.native="editOnePaper(item)">编辑</el-dropdown-item>
                <el-dropdown-item :icon="Delete" @click.native="deletePaper(item.id)">删除</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
        <div class="title flex"><span>{{ item.paperName }}</span></div>
        <div class="remark flex"><span>{{ item.remark }}</span></div>
        <div class="info flex">
          <el-image :src="item.teacherGender === '女' ? woman:man" style="height: 16px;"></el-image>
          <span style="margin-right: 20px">{{ `出卷人: ${item.drawerUser}` }}</span>
          <el-image :src="score" style="height: 14px;"></el-image>
          <span style="margin-right: 20px">{{ `总分: ${item.totalScore}` }}</span>
          <el-image :src="hard" style="height: 14px;"></el-image>
          <span>{{ `难度: ${item.hard === 0 ? '简单' : item.hard === 1 ? '中等' : '困难'}` }}</span>
        </div>
      </section>
      <Empty style="height:100%" v-if="data.papers.length === 0"></Empty>
    </el-scrollbar>
    <edit-paper v-if="data.visible" v-model:visible="data.visible" :type="data.type" :data="data.editPaper"></edit-paper>
  </div>
</template>

<script setup>
import {onMounted, reactive, watch} from 'vue'
import Empty from "@/components/common/empty/Empty.vue";
import {get, post} from '../../../../http/request';
import score from '@/assets/img/score.svg'
import hard from '../../../../assets/img/hard.svg'
import man from '../../../../assets/img/man.svg'
import woman from '../../../../assets/img/woman.svg'
import {useRouter} from "vue-router";
import {ElMessage, ElMessageBox} from "element-plus";
import EditPaper from "./EditPaper.vue";
import {Delete, Edit, More} from '@element-plus/icons'


const router = useRouter(); //路由

const data = reactive({
  visible: false,
  searchLoad: false,
  paperLoad: false,
  params: {
    pageSize: 99999,
    pageNum: 1,
    param: {
      keyword: '',
      hard: ''
    },
  },
  qHards: [
    {value: 0, label: '简单'},
    {value: 1, label: '中等'},
    {value: 2, label: '困难'},
  ],
  papers: [],
  total: 0,
  type: 'add',
  editPaper:''
})
watch(
    () => data.visible,
    n => {
      if (!n) {
        toSearch();
      }
    })
const delPaper = async (id) =>{
  return await get(`/paper/del/${id}`);
}
const getPaper = async () => {
  data.paperLoad = true;
  let res = await post('/paper/page', data.params);
  if (res.status === 1000) {
    data.papers = res.data.list;
    data.total = Number(res.data.totalCount);
  } else {
    ElMessage.error(res.desc);
  }
  data.paperLoad = false;
}

const toSearch = async () => {
  data.searchLoad = true;
  await getPaper();
  data.searchLoad = false;
}

const toPaper = paper => {
  const path = '/paper_details'
  router.push({path, query: {id: paper.id}})
}

const creatPaper = () => {
  data.type = 'add';
  data.visible = true;
}

const editOnePaper = paper => {
  data.type = 'edit';
  data.editPaper = JSON.parse(JSON.stringify(paper));
  data.visible = true;
}

const deletePaper = id => {
  ElMessageBox.confirm(
      '删除后不可恢复，确认删除次试卷？',
      '提示',
      {
        showCancelButton: true,
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'danger',
        beforeClose: async(action, instance, done) => {
          if(action === 'confirm'){
            instance.confirmButtonLoading = true
            let res = await delPaper(id);
            instance.confirmButtonLoading = false
            if(res.status === 1000){
              done();
              ElMessage.success("删除成功");
              await toSearch();
            }else{
              ElMessage.error(res.desc);
            }
          }
        }
      }
  )
}

onMounted(() => {
  getPaper();
})
</script>
<style scoped lang='less'>
:deep(.el-dropdown-menu__item){
  display: flex;
  align-items: center;
}
.main {
  background: white;
  height: calc(100vh - 140px);
  padding: 20px;
  display: flex;
  flex-direction: column;

  :deep(.paper-warp) {
    overflow-x: hidden;

    .em {
      height: 90%;
    }

    .papers {
      padding: 20px 0 0 10px;
      flex: 1;
      display: flex;
      flex-wrap: wrap;
      align-items: flex-start;

      .item {
        height: 200px;
        width: 380px;
        margin-right: 20px;
        margin-bottom: 20px;
        border-radius: 6px;
        padding: 20px;
        box-shadow: 0 0 4px 2px rgba(217, 222, 234, 0.3);
        transition: all 0.6s ease;
        box-sizing: border-box;
        position:relative;
        cursor: pointer;
        .menu{
          position:absolute;
          right: 20px;
          top: 10px;
        }

        .flex {
          display: flex;
          align-items: center;
          margin-bottom: 10px;
        }

        .title {
          font-size: 25px;
        }

        .remark {
          height: 50px;
          margin-bottom: 30px;
          color: #88949b;
        }

        .info {
          font-size: 14px;
          color: #88949b;
        }

        .icon {
          height: 25px;
        }
      }

      .item:hover {
        box-shadow: 0 0 4px 2px rgba(140, 193, 248, 0.45);
        transform: scale(1.03);
      }
    }
  }
}
</style>