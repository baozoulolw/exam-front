import { createRouter, createWebHashHistory, createWebHistory } from "vue-router";
import { getToken } from "../utils/utils";
import { ElMessage } from "element-plus";

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/login/Login.vue')
  },
  {
    path: '/manage_home',
    meta: {
      title: '首页',
      path:'/manage_home',
    },
    component: () => import('../views/manage/ManageHome.vue'),
    children: [
      {
        path: '/manage_home',
        redirect: '/homePage'
      },
      {
        path: "/homePage",
        name: "HomePage",
        meta: {
          title: '首页',
          path: '/homePage',
        },
        component: () => import("../views/manage/homePage/homePage.vue")
      },
      {
        path:'/setting',
        name:'Setting',
        meta:{
          title:'设置',
          path:'/setting',
        },
        component: () => import('../views/manage/setting/Setting.vue'),
        children:[
          {
            path: '/setting',
            redirect: '/user'
          },
          {
            path:'/user',
            name : 'User',
            meta:{
              title:'成员管理',
              path:'/user',
            },
            component:() => import('../views/manage/user/UserManage.vue')
          },
          {
            path:'/role',
            name : 'Role',
            meta:{
              title:'角色管理',
              path:'/role',
            },
            component:() => import('../views/manage/role/RoleManage.vue')
          },
          {
            path:'/resource',
            name : 'Resource',
            meta:{
              title:'资源管理',
              path:'/resource',
            },
            component:() => import('../views/manage/resource/ResourceManage.vue')
          },
          {
            path:'/course',
            name : 'Course',
            meta:{
              title:'课程管理',
              path:'/course',
            },
            component:() => import('../views/manage/course/CourseManage.vue')
          }
        ]
      },
      {
        path:'/exam',
        name : 'Exam',
        meta:{
          title:'考试',
          path:'/exam',
        },
        component: () => import('../views/manage/exam/Exam.vue'),
        children:[
          {
            path: '/exam',
            redirect: '/exam_arrange'
          },
          {
            path:'/exam_arrange',
            name:'ExamArrange',
            meta:{
              title:'考试编排',
              path:'/exam_arrange',
            },
            component:() => import('../views/manage/exam/ExamArrange.vue')
          },
          {
            path:'/score',
            name:'Score',
            meta:{
              title:'考试成绩',
              path:'/score',
            },
            component:() => import('../views/manage/score/Score.vue')
          },
          {
            path:'/marking',
            name:'Marking',
            meta:{
              title:'阅卷',
              path: '/marking',
            },
            component:() => import('../views/manage/marking/Marking.vue')
          }
        ]
      },
      {
        path:'/question',
        name:'Question',
        meta:{
          title:'题库',
          path:'/question',
        },
        component: () => import('../views/manage/question/Question.vue'),
        children:[
          {
            path: '/question',
            redirect: '/questions2'
          },
          {
            path:'/questions',
            name:'Questions',
            meta:{
              title:'题库管理',
              path:'/questions',
            },
            component:() => import('../views/manage/question/questionManage/QuestionManage.vue')
          },{
            path:'/questions2',
            name:'Questions2',
            meta:{
              title:'题库管理',
              path:'/questions2',
            },
            component:() => import('../views/manage/question/questionManage/QuestionManage2.vue')
          },
          {
            path:'/paper',
            name:'Paper',
            meta:{
              title:'试卷管理',
              path:'/paper',
            },
            component:() => import('../views/manage/question/paper/PaperManage.vue')
          },
          {
            path:'/paper_details',
            name:'PaperDetails',
            meta:{
              title:'试卷详情',
              path:'/paper_details',
            },
            props: route => ({id:route.query.id}),
            component:() => import('../views/manage/question/paper/PaperDetails.vue')
          },
        ]
      },{
        path:'/404',
        component:() => import('../components/common/404/NotFound.vue')
      }
    ]
  },
  {
    path: '/student_home',
    meta: {
      title: '首页'
    },
    component: () => import('../views/student/StudentHome.vue'),
    children:[
      {
        path: '/student_home',
        redirect: '/navigation'
      },
      {
        path:'/navigation',
        component: () => import('../views/student/navigation/Navigation.vue')
      },
      {
        path:'/exercise',
        component: () => import('../views/student/exercise/Exercise.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

//手动跳转的页面白名单
const whiteList = ['/login', '/404', '/403'];

router.beforeEach((to, from, next) => {
  //document.title = `Admin Frame | ${to.meta.title}`; //添加title
  const user = getToken();//获取token to.path !== '/login'
  //NProgress.start();// 路由跳转前钩子函数中 - 执行进度条开始加载
  if (to.matched.length === 0) {
    next('/404');
  }
  if (user) {
    if (to.path === '/') {
      next();
    } else {
      next();
    }
  } else {
    if (whiteList.includes(to.path)) {  //如果是白名单无须token则直接进入
      next();
    } else {
      ElMessage.error("无登陆凭证,无法访问,请先登陆!")
      next('/login')
    }
  }
});


// // 路由跳转后钩子函数中 - 执行进度条加载结束
// router.afterEach(() => {
//   NProgress.done();
// });

export default router