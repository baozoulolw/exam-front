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
      title: '首页'
    },
    component: () => import('../views/manage/ManageHome.vue'),
    children: [
      {
        path: "/homePage",
        meta: {
          title: '首页'
        },
        component: () => import("../views/manage/homePage/homePage.vue")
      },
      {
        path:'/setting',
        meta:{
          title:'设置'
        },
        component: () => import('../views/manage/setting/Setting.vue'),
        children:[
          {
            path:'/user',
            meta:{
              title:'成员管理'
            },
            component:() => import('../views/manage/user/UserManage.vue')
          },
          {
            path:'/role',
            meta:{
              title:'角色管理'
            },
            component:() => import('../views/manage/role/RoleManage.vue')
          },
          {
            path:'/resource',
            meta:{
              title:'资源管理'
            },
            component:() => import('../views/manage/resource/ResourceManage.vue')
          }
        ]
      }
    ]
  },
  {
    path: '/student_home',
    meta: {
      title: '首页'
    },
    component: () => import('../views/student/StudentHome.vue'),
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
  if (!to.matched.length) {
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