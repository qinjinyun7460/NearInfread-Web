<template>

  <!-- <nav class="navbar">
    <div class="container">
      <div class="navbar-logo"><a href="/" class="logo-text">System</a></div>

      <div class="user-container" @click="toggleUserMenu">
        <img :src="userInfo.avatar || 'https://picsum.photos/id/1005/40/40'" alt="用户头像" class="user-avatar">
        <span class="user-name">{{ userInfo.name || '默认用户' }}</span>
        <i class="el-icon-arrow-down user-arrow" :class="{ rotate: showUserMenu }"></i>
        <div class="user-dropdown" v-if="showUserMenu">
          <a href="/profile" class="dropdown-item">
            <i class="el-icon-user"></i> 个人中心
          </a>
          <a href="/account" class="dropdown-item">
            <i class="el-icon-setting"></i> 账号设置
          </a>
          <div class="dropdown-divider"></div>
          <a href="javascript:;" class="dropdown-item logout-btn" @click="handleLogout">
            <i class="el-icon-logout"></i> 退出登录
          </a>
        </div>
      </div>
    </div>

    <el-row class="tac">
      <el-menu class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose" @select="handleMenuSelect"
        :default-active="currentRoute">
        <el-menu-item index="/">
          <span>首页</span>
        </el-menu-item>

        <el-sub-menu index="user-manage">
          <template #title><span>用户管理</span></template>
<el-menu-item index="/user-manage/list">用户列表</el-menu-item>
<el-menu-item index="/user-manage/logs">登录日志</el-menu-item>
</el-sub-menu>

<el-menu-item index="/settings">
  <span>系统设置</span>
</el-menu-item>
</el-menu>
</el-row>

</nav> -->

  <nav class="navbar">
    <div class="container">
      <div class="navbar-logo"><a href="/" class="logo-text">System</a></div>

      <div class="user-container" @click="toggleUserMenu">
        <img :src="'https://picsum.photos/id/1005/40/40'" alt="用户头像" class="user-avatar">
        <span class="user-name">{{ userInfo.user_name }}</span>
        <i class="el-icon-arrow-down user-arrow" :class="{ rotate: showUserMenu }"></i>
        <div class="user-dropdown" v-if="showUserMenu">
          <a href="/profile" class="dropdown-item">
            <i class="el-icon-user"></i> 个人中心
          </a>

          <div class="dropdown-divider"></div>
          <a href="javascript:;" class="dropdown-item logout-btn" @click="handleLogout">
            <i class="el-icon-logout"></i> 退出登录
          </a>
        </div>
      </div>
    </div>
  </nav>


</template>

<script setup>
import { ref, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useRouter } from 'vue-router';
import { getUserInfo, removeUserInfo } from '@/utils/storage';

// 接收父组件传递的用户信息（可选，优先用本地存储）
const props = defineProps({
  parentUserInfo: {
    type: Object,
    default: () => ({})
  }
});

// 路由实例
const router = useRouter();

// 响应式数据
const showUserMenu = ref(false); // 控制下拉菜单显示
const userInfo = ref({}); // 最终使用的用户信息

// 切换下拉菜单显示状态
const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value;
};

// 点击其他区域关闭下拉菜单（全局监听）
onMounted(() => {
  // 初始化用户信息（优先用本地存储，再用props）
  userInfo.value = getUserInfo() || props.userInfo;

  // 全局点击事件监听
  const handleClickOutside = (e) => {
    const userContainer = document.querySelector('.user-container');
    if (userContainer && !userContainer.contains(e.target)) {
      showUserMenu.value = false;
    }
  };
  document.addEventListener('click', handleClickOutside);

  // 组件卸载时移除监听
  return () => {
    document.removeEventListener('click', handleClickOutside);
  };
});


const handleLogout = async () => {
  try {
    await ElMessageBox.confirm(
      '确定要退出登录吗？退出后需重新登录',
      '退出确认',
      {
        confirmButtonText: '确认退出',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }
    );

    removeUserInfo();
    router.push('/login');
    ElMessage.success('退出登录成功');

  }
  catch {
    ElMessage.info('已取消退出');
  }
  finally {
    showUserMenu.value = false;
  }
};


import { useRoute } from 'vue-router';
import { watch } from 'vue';

const route = useRoute();

const currentRoute = ref(route.path);

watch(
  () => route.path,
  (newPath) => {
    currentRoute.value = newPath;
  }
);

// const handleMenuSelect = (index) => {
//   router.push(index);
// };

// const handleOpen = (key, keyPath) => {
//   console.log(key, keyPath);
// };
// const handleClose = (key, keyPath) => {
//   console.log(key, keyPath);
// };


</script>

<style scoped>
.navbar {
  background-color: #fff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  padding: 12px 0;
  position: sticky;
  top: 0;
  z-index: 100;
}

.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* Logo样式 */
.navbar-logo .logo-text {
  font-size: 20px;
  font-weight: 600;
  color: #409eff;
  /* 与登录页主色调统一 */
  text-decoration: none;
}

/* 导航菜单 */
.navbar-menu {
  display: flex;
  list-style: none;
  gap: 30px;
  margin: 0;
  padding: 0;
}

.menu-item a {
  font-size: 14px;
  color: #606266;
  text-decoration: none;
  padding: 5px 0;
  position: relative;
  transition: color 0.3s;
}

.menu-item.active a {
  color: #409eff;
  font-weight: 500;
}

.menu-item.active a::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: #409eff;
  border-radius: 1px;
}

.menu-item a:hover {
  color: #409eff;
}

/* 用户信息区域 */
.user-container {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 5px 10px;
  border-radius: 20px;
  transition: background-color 0.3s;
  position: relative;
}

.user-container:hover {
  background-color: #f5f7fa;
}

.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #f5f7fa;
}

.user-name {
  font-size: 14px;
  color: #303133;
  white-space: nowrap;
}

.user-arrow {
  font-size: 12px;
  color: #909399;
  transition: transform 0.3s, color 0.3s;
}

.user-container:hover .user-arrow {
  color: #409eff;
}

.user-arrow.rotate {
  transform: rotate(180deg);
}

/* 用户下拉菜单 */
.user-dropdown {
  position: absolute;
  top: 50px;
  right: 0;
  width: 180px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  padding: 10px 0;
  z-index: 101;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  font-size: 14px;
  color: #606266;
  text-decoration: none;
  transition: all 0.3s;
}

.dropdown-item:hover {
  background-color: #f5f7fa;
  color: #409eff;
}

.dropdown-item i {
  font-size: 16px;
  width: 20px;
  text-align: center;
}

.dropdown-divider {
  height: 1px;
  background-color: #f5f5f5;
  margin: 5px 0;
}

.logout-btn {
  color: #f56c6c;
}

.logout-btn:hover {
  color: #f56c6c;
  background-color: #fef0f0;
}

/* 响应式适配 */
@media (max-width: 768px) {
  .navbar-menu {
    display: none;
    /* 移动端可替换为汉堡菜单 */
  }
}
</style>
