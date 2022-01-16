<template>
  <div v-loading="data.isLoad" class="main">
    <div>
      <div class="title">
        <span style="margin-right: auto">{{ data.paper.paperName }}</span>
        <el-button @click="back" type="primary" plain>返回</el-button>
      </div>
      <div class="info">
        <el-image :src="data.paper.drawerUserInfo.gender === '女' ? woman:man" style="height: 16px;"></el-image>
        <span style="margin-right: 20px">{{ `出卷人: ${data.paper.drawerUserInfo.realName}` }}</span>

        <el-image :src="time" style="height: 24px;"></el-image>
        <span style="margin-right: 20px">{{ `创建于${data.paper.createTime}` }}</span>

        <el-image :src="time" style="height: 24px;"></el-image>
        <span style="margin-right: 20px">{{ `修改于${data.paper.changeTime}` }}</span>

        <el-image :src="data.paper.changeUserInfo.gender === '女' ? woman:man" style="height: 16px;"></el-image>
        <span style="margin-right: 20px">{{ `修改人: ${data.paper.changeUserInfo.realName}` }}</span>

        <el-image :src="hard" style="height: 14px;margin-right: 5px"></el-image>
        <span>{{ `难度: ${data.paper.hard === 0 ? '简单' : data.paper.hard === 1 ? '中等' : '困难'}` }}</span>
      </div>
    </div>
    <el-divider></el-divider>
    <div class="questions">
      <div class="info-title">
        <div class="name">试题信息</div>
        <span class="score">总分:</span>
        <el-tag class="mr-20" effect="plain" type="danger">{{ totalScore }}</el-tag>
        <span class="size mr-20">{{ `试题数量: ${data.types.reduce((p, i) => p + i.questions.length, 0)}` }}</span>
        <t-button variant="outline" @click="addQuestion">
          <template #icon>
            <add-icon></add-icon>
          </template>
          添加试题
        </t-button>
      </div>
      <div class="body-question">
        <section v-for="item in data.types" :key="item.value" class="item">
          <div class="type" @click="()=> item.trans = !item.trans">
            <el-icon :class="['down',{'trans':item.trans}]">
              <ArrowDownBold/>
            </el-icon>
            <span style="margin-right: 40px">{{ item.label }}</span>
            <span style="margin-right: 40px">{{ `题目数: ${item.questions.length}` }}</span>
            <span style="margin-right: auto">{{ `分值: ${item.questions.reduce((p, i) => p + i.score, 0)}` }}</span>
            <t-button theme="primary" variant="outline" @click.stop="dragQuestion(item)">
              <template #icon>
                <swap-icon/>
              </template>
              编辑顺序
            </t-button>
          </div>
          <el-collapse-transition>
            <div v-show='!item.trans' style="padding: 0 30px">
              <el-table v-show="item.questions.length > 0" :data="item.questions" style="width: 100%"
                        :cell-style="{height:'36px'}">
                <el-table-column type="index" label="题号" width="100"/>
                <el-table-column prop="question.topic" label="题目" show-overflow-tooltip/>
                <el-table-column prop="question.hard" label="难度" width="100">
                  <template #default="scope">
                    <span>{{ scope.row.question.hard === 0 ? '简单' : data.paper.hard === 1 ? '中等' : '困难' }}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="score" label="分值" width="100">
                  <template #default="scope">
                    <el-tag type="success">{{ scope.row.score }}</el-tag>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="150">
                  <template #default="scope">
                    <el-button type="text" @click="questionDetail(scope.row)">预览</el-button>
                    <t-divider theme="vertical"/>
                    <el-button type="text" @click="openScore(scope.row)">调整分值</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <empty v-show="item.questions.length === 0"></empty>
            </div>
          </el-collapse-transition>
        </section>
      </div>
    </div>
    <el-dialog v-model="data.questionShow" title="题目预览"
               width="600px">
      <div class="mb-20" style="display: flex;align-items: center;justify-content: flex-end;padding-right: 40px">
        <el-tag class="mr-30">{{ getType(data.questionInfo.question.type) }}</el-tag>
        <span class="mr-12">分值: </span>
        <el-tag type="warning">{{ data.questionInfo.score }}</el-tag>
      </div>
      <div class="mb-20">
        <span>{{ `${data.questionInfo.sort}.${data.questionInfo.question.topic}` }}</span>
      </div>
      <div style="padding-bottom: 20px">
        <div v-if="data.questionInfo.question.type === 0">
          <section v-for="item in data.options" :key="item.option" class="mb-10">
            <el-tag :type="data.questionInfo.question.answer === item.option ? 'success':'danger'" size="small"
                    class="mr-20">{{ item.option }}
            </el-tag>
            <span>{{ item.value }}</span>
          </section>
          <div style="display: flex;align-items: center;justify-content: flex-end;padding-right: 40px">答案：
            <el-tag size="small" type="success">{{ data.questionInfo.question.answer }}</el-tag>
          </div>
        </div>
        <div v-if="data.questionInfo.question.type === 1">
          <section v-for="item in data.options" :key="item.option" class="mb-10">
            <el-tag
                :type="JSON.parse(data.questionInfo.question.answer).some(v => item.option === v) ? 'success':'danger'"
                size="small"
                class="mr-20">{{ item.option }}
            </el-tag>
            <span>{{ item.value }}</span>
          </section>
          <div style="display: flex;align-items: center;justify-content: flex-end;padding-right: 40px">答案：

            <el-tag style="margin-right: 10px" size="small" type="success"
                    v-for="item in JSON.parse(data.questionInfo.question.answer)" :key="item">
              {{ item }}
            </el-tag>
          </div>
        </div>
        <div v-if="data.questionInfo.question.type === 2">
          <div class="mb-10">
            <el-tag class="mr-20" size="small">1</el-tag>
            <span class="status correct"></span></div>
          <div class="mb-20">
            <el-tag class="mr-20" size="small">2</el-tag>
            <span class="status incorrect"></span></div>
          <div style="display: flex;align-items: center;justify-content: flex-end;padding-right: 40px">答案：
            <el-tag style="margin-right: 10px" size="small" type="success"
                    v-for="item in JSON.parse(data.questionInfo.question.answer)" :key="item">
              {{ item }}
            </el-tag>
          </div>
        </div>
        <div v-if="data.questionInfo.question.type === 3">
          <section v-for="(item,index) in JSON.parse(data.questionInfo.question.answer)" :key="index">
            <el-tag size="small" class="mr-20">{{ `填空${index + 1}` }}</el-tag>
            答案： {{ item.value }}
          </section>
        </div>
      </div>
    </el-dialog>
    <t-dialog v-model:visible="data.addShow" header="添加试题" width="1000px" v-if="data.addShow"
              :on-confirm="onConfirmDia" :on-close="closeDia"
              :confirm-btn="{content: '保存',theme: 'primary',loading: data.diaLoad,}">
      <paper-question :paperId="props.id" v-model:selectId="data.selectedRowKeys"></paper-question>
    </t-dialog>

    <t-drawer v-model:visible="data.dragShow" header="编辑顺序" size="700px" v-if="data.dragShow"
              :on-confirm="onConfirmDragDia" :on-close="closeDragDia"
              :confirm-btn="{content: '保存',theme: 'primary',loading: data.diaLoad,}">
      <drag-paper :paperId="props.id" v-model:question="data.editQuestion" v-model:delIds="data.delIds"></drag-paper>
    </t-drawer>
  </div>
</template>

<script setup>
import {reactive, onMounted, watch, computed, h} from 'vue'
import {useRouter} from "vue-router";
import {get, post} from "../../../../http/request";
import {ElMessage, ElMessageBox} from "element-plus";
import man from '../../../../assets/img/man.svg';
import woman from '../../../../assets/img/woman.svg';
import time from '../../../../assets/img/time.svg';
import hard from '../../../../assets/img/hard.svg';
import {
  ArrowDownBold, CirclePlus
} from '@element-plus/icons';
import Empty from "../../../../components/common/empty/Empty.vue";
import {SwapIcon, AddIcon} from 'tdesign-icons-vue-next';
import PaperQuestion from "./PaperQuestion.vue";
import DragPaper from "./DragPaper.vue";

const router = useRouter(); //路由

watch(
    () => props.id,
    n => {
      getPaperById(n);
    })
const props = defineProps({
  id: String
})

const emit = defineEmits([])

const data = reactive({
  editQuestion: {},
  addShow: false,
  dragShow: false,
  selectedRowKeys: [],
  questionVisible: false,
  isLoad: false,
  diaLoad: false,
  paper: {
    changeUserInfo: '',
    drawerUserInfo: '',
    content: ''
  },
  questions: [],
  delIds: [],
  types: [
    {value: 0, label: '单选题', questions: [], trans: true},
    {value: 1, label: '多选题', questions: [], trans: true},
    {value: 2, label: '判断题', questions: [], trans: true},
    {value: 3, label: '填空题', questions: [], trans: true},
  ],
  totalScore: 0,
  questionShow: false,
  options: [],
  questionInfo: ''
})
const totalScore = computed(() => data.types.reduce((p, i) => p + i.questions.reduce((p1, i1) => p1 + i1.score, 0), 0))
/**
 * 网络请求
 */
const getPaperById = async (id) => {
  data.isLoad = true;
  let res = await get(`/paper/one/${id}`);
  if (res.status === 1000) {
    data.paper = res.data;
    let {questions} = data.paper;
    data.types.forEach(type => {
      type.questions = questions.filter(item => {
        if (item.question.type === type.value) {
          data.totalScore += item.score;
          return true;
        }
      }).sort((v1, v2) => v1.sort - v2.sort);
    });
  } else {
    ElMessage.error(res.desc);
  }
  data.isLoad = false;
}

const onConfirmDia = async () => {
  if (data.selectedRowKeys.length > 0) {
    data.diaLoad = true;
    let param = data.selectedRowKeys.reduce((pre, item) => {
      let obj = {
        questionId: item,
        paperId: props.id,
        sort: 0,
        score: 0
      }
      pre.push(obj)
      return pre
    }, [])
    let res = await post('/paper/addQue', param);
    data.diaLoad = false;
    if (res.status === 1000) {
      closeDia();
      await getPaperById(props.id)
    } else {
      ElMessage.error(res.desc);
    }
  } else {
    closeDia();
  }
}

/**
 * 事件
 */

const back = () => {
  const path = '/paper'
  router.push({path})
}

const questionDetail = row => {
  data.questionInfo = JSON.parse(JSON.stringify(row));
  let {type} = data.questionInfo.question;
  if (type === 0 || type === 1) {
    data.options = JSON.parse(data.questionInfo.question.options);
  }
  data.questionShow = true;
}

const closeDia = () => {
  data.addShow = false;
}

const addQuestion = () => {
  data.addShow = true;
}

const openScore = (row) => {
  console.log(row)
  ElMessageBox.prompt('输入新的分值', '调整分值', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    inputPattern: /(^[1-9]{1}[0-9]*$)/,
    inputErrorMessage: '请输入大于0的数字',
  })
      .then(async ({value}) => {
        let res = await post('/paper/score', {id: row.id, score: value});
        if (res.status === 1000) {
          ElMessage.success('修改成功');
          await getPaperById(props.id);
        } else {
          ElMessage.error(res.desc);
        }
      })
}

const onConfirmDragDia = async () => {
  data.diaLoad = true;
  let delIds = data.delIds;
  let sorts = data.editQuestion.questions.reduce((p, i, index) => {
    p.push({id: i.id, sort: index})
    return p;
  }, []);
  let res = await post('/paper/sort', {delIds, sorts});
  data.diaLoad = false;
  if (res.status === 1000) {
    closeDragDia();
    await getPaperById(props.id)
  } else {
    ElMessage.error(res.desc);
  }
}

const closeDragDia = () => {
  data.dragShow = false;
}
const dragQuestion = item => {
  data.editQuestion = JSON.parse(JSON.stringify(item));
  data.delIds = [];
  data.dragShow = true
}
const getType = type => {
  let res = '';
  data.types.some(item => {
    if (item.value === type) {
      res = item.label;
      return true;
    }
  })
  return res;
}

onMounted(() => {
  getPaperById(props.id);
})
</script>

<style scoped lang='less'>
.main {
  background: white;
  height: calc(100vh - 100px);
  box-sizing: border-box;
  padding: 60px;

  .title {
    font-size: 34px;
    color: #444;
    font-family: '\5FAE\8F6F\96C5\9ED1';
    margin-bottom: 20px;
    display: flex;
    align-items: center;
  }

  .info {
    display: flex;
    align-items: center;
  }

  .questions {
    .info-title {
      display: flex;
      background: #f2f2f4;
      padding: 20px;
      align-items: center;

      .name {
        margin-right: auto;
        display: block;
        font-size: 18px;
      }

      .score {
        margin-right: 20px;
      }

    }

    .body-question {
      border: 1px solid #f1f1f3;

      .item {
        .type {
          padding: 10px 30px;
          display: flex;
          align-items: center;

          .down {
            margin-right: 20px;
            transition: 0.5s;
            cursor: pointer;
          }

          .trans {
            transform: rotate(-90deg);
          }
        }
        .type:hover{
          background: #ecf0f1;
        }
      }
    }
  }

  .correct:before {
    content: '\2714';
    color: #008100;
  }

  .incorrect:before {
    content: '\2716';
    color: #b20610;
  }
}
</style>