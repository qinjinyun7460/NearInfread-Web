import { createRouter, createWebHistory } from 'vue-router';
import { getUserInfo } from '@/utils/storage';
import PersonalInfo from '@/views/PersonalCenter.vue';
import PasswordReset from '@/views/resetPwd.vue';
import UserList from '@/components/Auth/userInformation/user/UserList.vue';
import SampleDataView from '@/views/SampleDataView.vue';
import SampleDetails from '@/views/Sample/SampleDetails.vue';
import cancelAccount from '@/views/cancelAccount.vue';



// 路由规则
const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/LoginView.vue'),
    meta: {
      title: '登录',
      requiresAuth: false
    }
  },

  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/HomeView.vue'),
    meta: {
      requiresAuth: true
    },
    children: [
      {
        path: '',
        component: () => import('@/views/DashboardView.vue'),
        meta: { title: '首页' }
      },

      {
        path: '/user_manage',
        name: 'UserManage',
        meta: { title: '用户管理' },
        children: [
          {
            path: '/user_manage/list',
            component: UserList,
            meta: { title: '用户列表' }
          },

          {
            path: '/user_manage/loginlogs',
            component: () => import('@/views/UsersLoginLog.vue'),
            meta: { title: '登录日志' }
          },
        ]
      },

      {
        path: '/samples',
        component: SampleDataView,
        meta: { title: '样品数据' },
        // children: [
        //   {
        //     path: '/detail/:sampleId',
        //     name: 'SampleDetails',
        //     component: SampleDetails,
        //     props: true,
        //     meta: {
        //       // title: (route) => `详情(${route.params.sampleId})`
        //       title: '详情'
        //     }
        //   }
        // ]
      },

      {
        path: '/sample/detail/:sampleId',
        name: 'SampleDetails',
        component: SampleDetails,
        props: true,
        meta: { title: '详情' }
      },

      {
        path: '/personal_center',
        component: () => import('@/views/ProfileCard.vue'),
        meta: { title: '个人信息' }
      },

      {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: () => import('@/views/NotFoundView.vue'),
        meta: { title: '页面不存在', requiresAuth: false }
      },


      {
        path: '/settings',
        name: 'Settings',
        meta: { title: '设置' },
        children: [
          {
            path: 'personal',
            name: 'PersonalInfo',
            component: PersonalInfo,
            meta: { title: '修改信息' }
          },
          {
            path: 'security',
            name: 'PasswordReset',
            component: PasswordReset,
            meta: { title: '重置密码' }
          },
          {
            path: 'cancel',
            name: 'cancelAccount',
            component: cancelAccount,
            meta: { title: '注销账号' }
          },
        ]
      }
    ]

  },

];


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

router.beforeEach((to, from, next) => {
  document.title = to.meta.title || 'AdminSystem';

  if (to.meta.requiresAuth) {
    const userInfo = getUserInfo();
    if (userInfo) {
      next();
    } else {
      next(`/login?redirect=${to.path}`);
    }
  } else {
    next();
  }
});

export default router;
