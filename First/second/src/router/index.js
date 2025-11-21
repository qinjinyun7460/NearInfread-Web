// // src/router/index.js
// import { createRouter, createWebHistory } from 'vue-router';
// import Home from '../component/Home.vue';

// // 路由规则
// const routes = [
//   {
//     path: '/login',
//     name: 'Login',
//     component: Login,
//     meta: { isPublic: true } // 标记为公开路由（无需登录即可访问）
//   },
//   {
//     path: '/',
//     name: 'Home',
//     component: Home,
//     meta: { requiresAuth: true } // 标记为需要登录的路由
//   },
//   // 可添加404页面等其他路由
//   {
//     path: '/:pathMatch(.*)*',
//     redirect: '/login' // 未匹配路由重定向到登录页
//   }
// ];

// // 创建路由实例
// const router = createRouter({
//   history: createWebHistory(), // 使用HTML5 History模式（无#号）
//   routes
// });

// // 路由守卫：拦截未登录用户访问需要授权的页面
// router.beforeEach((to, from, next) => {
//   // 判断目标路由是否需要登录
//   if (to.meta.requiresAuth) {
//     // 从localStorage/sessionStorage获取用户信息
//     const userInfo = localStorage.getItem('userInfo') || sessionStorage.getItem('userInfo');
//     if (userInfo) {
//       // 已登录，允许访问
//       next();
//     } else {
//       // 未登录，重定向到登录页
//       next({ name: 'Login' });
//     }
//   } else {
//     // 公开路由，直接放行
//     next();
//   }
// });

// export default router;