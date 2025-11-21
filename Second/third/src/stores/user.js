// import { defineStore } from 'pinia';
// import { ref } from 'vue';
// import { socketService } from '@/utils/socketService';
// import axios from 'axios';

// export const useUserStore = defineStore('user', () => {
//   // 状态
//   const userId = ref(localStorage.getItem('userId') || '');
//   const username = ref(localStorage.getItem('username') || '');
//   const isLoggedIn = ref(!!localStorage.getItem('userId'));

//   // 登录
//   const login = async (username, password) => {
//     try {
//       const response = await axios.post('http://localhost:5000/api/login', {
//         username,
//         password
//       });

//       if (response.data.success) {
//         // 保存用户信息
//         userId.value = response.data.data.user_id;
//         username.value = response.data.data.username;
//         isLoggedIn.value = true;

//         // 存储到本地
//         localStorage.setItem('userId', userId.value);
//         localStorage.setItem('username', username.value);

//         // 连接WebSocket并注册用户
//         socketService.connect();
//         socketService.registerUser(userId.value);

//         return { success: true };
//       }
//     } catch (error) {
//       console.error('登录失败:', error);
//       return {
//         success: false,
//         message: error.response?.data?.message || '登录失败'
//       };
//     }
//   };

//   // 登出
//   const logout = () => {
//     // 清除状态
//     userId.value = '';
//     username.value = '';
//     isLoggedIn.value = false;

//     // 清除本地存储
//     localStorage.removeItem('userId');
//     localStorage.removeItem('username');

//     // 断开WebSocket连接
//     socketService.disconnect();
//   };

//   return {
//     userId,
//     username,
//     isLoggedIn,
//     login,
//     logout
//   };
// });
