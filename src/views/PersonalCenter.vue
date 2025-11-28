<template>
  <div class="app-container">
    <el-row :gutter="20" class="page-content">

      <el-col :span="9" :xs="24" class="profile-card-col">
        <el-card class="box-card profile-card">
          <template v-slot:header>
            <div class="clearfix header-content">
              <span>个人信息</span>
            </div>
          </template>

          <div class="profile-info">
            <div class="avatar-container">
              <el-avatar size="48" class="user-avatar">
                <img src="https://picsum.photos/id/1005/40/40">
              </el-avatar>
            </div>

            <ul class="info-list">
              <li class="info-item">
                <svg-icon icon-class="user" class="info-icon" />
                <span class="info-label">用户角色</span>
                <span class="info-value">{{ userInfo.role_text || '-' }}</span>
              </li>
              <li class="info-item">
                <svg-icon icon-class="user" class="info-icon" />
                <span class="info-label">用户名</span>
                <span class="info-value">{{ userInfo.user_name || '-' }}</span>
              </li>
              <li class="info-item">
                <svg-icon icon-class="phone" class="info-icon" />
                <span class="info-label">手机号</span>
                <span class="info-value">{{ userInfo.tel || '-' }}</span>
              </li>
              <li class="info-item">
                <svg-icon icon-class="email" class="info-icon" />
                <span class="info-label">邮箱</span>
                <span class="info-value">{{ userInfo.email || '-' }}</span>
              </li>
              <li class="info-item">
                <svg-icon icon-class="date" class="info-icon" />
                <span class="info-label">年龄</span>
                <span class="info-value">{{ userInfo.age || '-' }}</span>
              </li>
              <li class="info-item">
                <svg-icon icon-class="date" class="info-icon" />
                <span class="info-label">创建时间</span>
                <span class="info-value">{{ userInfo.create_time || '-' }}</span>
              </li>
              <li class="info-item">
                <svg-icon icon-class="date" class="info-icon" />
                <span class="info-label">最近登录</span>
                <span class="info-value">{{ userInfo.login_time || '-' }}</span>
              </li>
            </ul>

          </div>

        </el-card>
      </el-col>

      <el-col :span="15" :xs="24">
        <el-card>
          <el-tabs v-model="activeTab">
            <el-tab-pane label="修改资料" name="userinfo">
              <EditProfile :initial-user="userInfo" @update:user="handleUserUpdate" />
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>

    </el-row>
  </div>
</template>

<script setup name="Profile">
import { ref, onMounted } from 'vue';
import { getUserInfo, setUserInfo } from '@/utils/storage';
import EditProfile from './Setting/Profile/EditProfile.vue';

const showUserMenu = ref(false);
const userInfo = ref({});
const activeTab = ref('userinfo');

onMounted(() => {
  userInfo.value = getUserInfo();

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


const handleUserUpdate = (updatedUser) => {
  userInfo.value = { ...userInfo.value, ...updatedUser };
  setUserInfo(userInfo.value);
};

</script>


<style scoped>
.app-container {
  background-color: #f5f7fa;
  min-height: calc(100vh - 60px);
}

.page-content {
  margin-bottom: 20px;
}

.header-content {
  font-size: 16px;
  font-weight: 500;
}

.profile-card {
  transition: all 0.3s ease;
}

.profile-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.profile-info {
  padding: 15px 0;
}

.avatar-container {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.user-avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  transition: transform 0.3s ease;
}

.user-avatar:hover {
  transform: scale(1.05);
}

.info-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.info-item {
  display: flex;
  align-items: center;
  padding: 10px 15px;
  border-bottom: 1px solid #f5f5f5;
  transition: background-color 0.2s ease;
}

.info-item:last-child {
  border-bottom: none;
}

.info-item:hover {
  background-color: #fafafa;
}

.info-icon {
  width: 18px;
  height: 18px;
  margin-right: 10px;
  color: #606266;
}

.info-label {
  flex: 1;
  color: #606266;
}

.info-value {
  text-align: right;
  color: #303133;
  word-break: break-all;
  max-width: 50%;
}

.detail-card {
  transition: all 0.3s ease;
}

.detail-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.profile-tabs {
  margin-top: 10px;
}

/* @media (max-width: 992px) {

  .profile-card-col,
  .detail-content-col {
    margin-bottom: 20px;
  }
} */

@media (max-width: 768px) {
  .app-container {
    padding: 10px;
  }

  .info-item {
    flex-wrap: wrap;
    padding: 8px 10px;
  }

  .info-value {
    max-width: 100%;
    width: 100%;
    margin-top: 5px;
    text-align: left;
    padding-left: 28px;
    /* 与标签对齐 */
  }
}
</style>
