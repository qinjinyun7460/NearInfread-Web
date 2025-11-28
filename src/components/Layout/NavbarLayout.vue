<template>
  <el-header class="navbar" height="auto">

    <div class="container">
      <el-breadcrumb separator="/" class="breadcrumb">
        <el-breadcrumb-item v-for="(route, index) in $route.matched" :key="index" :to="null">
          {{ route.meta.title }}
        </el-breadcrumb-item>
      </el-breadcrumb>
      <el-dropdown @command="handleDropdownCommand" trigger="click" placement="bottom-end"
        @visible-change="handleMenuVisible">
        <div class="user-container" style="cursor: pointer;">
          <el-avatar class="user-avatar">
            <img src="https://picsum.photos/id/1005/40/40" alt="用户头像">
          </el-avatar>
          <span class="user-name">{{ userInfo.user_name || '' }}</span>
          <el-icon class="user-arrow">
            <ArrowDown />
          </el-icon>
        </div>

        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="profile" @click="handleProfile">
              <span>个人信息</span>
            </el-dropdown-item>

            <el-dropdown-menu-divider />
            <el-dropdown-item command="logout" class="logout-btn" @click="handleLogout">
              <span>退出登录</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </el-header>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useRouter } from 'vue-router';
import { getUserInfo, removeUserInfo } from '@/utils/storage';
import { updateUserOnlineStatus } from '@/views/user/user_api';

const router = useRouter();
const showUserMenu = ref(false);
const userInfo = ref({});

const props = defineProps({
  parentUserInfo: {
    type: Object,
    default: () => ({})
  }
});

onMounted(() => {
  userInfo.value = getUserInfo() || props.userInfo;

  const handleClickOutside = (e) => {
    const userContainer = document.querySelector('.user-container');
    if (userContainer && !userContainer.contains(e.target)) {
      showUserMenu.value = false;
    }
  };
  document.addEventListener('click', handleClickOutside);

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

    const userId = userInfo.value?.user_id;
    if (userId) {
      await updateUserOnlineStatus(userId, false);
    }
  }
  catch (error) {
    if (error === 'cancel') {
      ElMessage.info('已取消退出');
    } else {
      console.error('更新在线状态失败：', error);
    }
  }
};

const handleProfile = async () => {

  try {
    router.push('/personal_center');
  }
  catch {
    ElMessage.info('退出');
  }
  finally {
    showUserMenu.value = false;
  }
};
</script>

<style scoped>
.navbar {
  background-color: #fff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 0;
  z-index: 100;
  margin-bottom: 10px;
}

.container {
  width: 100%;
  max-width: auto;
  margin: 0 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.navbar-menu {
  display: flex;
  list-style: none;
  gap: 30px;
  margin: 0;
  padding: 0;
}

.breadcrumb {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 16px;
}

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
  font-size: 16px;
  color: #303133;
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

.logout-btn {
  color: #f56c6c;
}

.logout-btn:hover {
  color: #f56c6c;
  background-color: #fef0f0;
}

@media (max-width: 768px) {
  .navbar-menu {
    display: none;
    /* 移动端可替换为汉堡菜单 */
  }
}
</style>