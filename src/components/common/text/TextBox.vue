<template>
  <div>
    <div class="textBox">
      <transition name="slide">
        <p class="text" :key="text.id">
          <el-tag type="warning">{{ text.val.tag }}</el-tag>
          {{ text.val.title }}
        </p>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted, computed } from 'vue'
const data = reactive({
  textArr: [
    { tag: '精彩推荐', title: '1 第一条公告111111111111111' },
    { tag: '热门推荐', title: '1 第23条公告嘎嘎嘎嘎嘎嘎灌灌灌灌灌' },
    { tag: '精彩推荐', title: '1 第3条公告嘎嘎嘎嘎嘎嘎灌灌灌灌灌' },
    { tag: '公司公告', title: '1 第2条公告嘎嘎嘎嘎嘎嘎灌灌灌灌灌' },
    { tag: '热门推荐', title: '1 第2333条公告嘎嘎嘎嘎嘎嘎灌灌灌灌灌' },
  ],
  number: 0
})

const text = computed(() => {
  return {
    id: data.number,
    val: data.textArr[data.number]
  }
})

const startMove = () => {
  let timer = setTimeout(() => {
    if (data.number === data.textArr.length) {
      data.number = 0;
    } else {
      data.number += 1;
    }
    startMove();
  }, 2500);
}
onMounted(() => {
  startMove();
})
</script>
<style scoped lang='less'>
.textBox {
  width: 100%;
  height: 40px;
  margin: 0 auto;
  overflow: hidden;
  position: relative;
  text-align: center;
}
.text {
  width: 100%;
  position: absolute;
  bottom: 0;
}
.slide-enter-active,
.slide-leave-active {
  transition: all 0.5s linear;
}
.slide-enter {
  transform: translateY(20px) scale(1);
  opacity: 1;
}
.slide-leave-to {
  transform: translateY(-20px) scale(0.8);
  opacity: 0;
}
</style>