<template>
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
          <span class="info-label">用户角色</span>
          <span class="info-value">{{ userInfo.role_text || '-' }}</span>
        </li>
        <li class="info-item">
          <span class="info-label">用户名</span>
          <span class="info-value">{{ userInfo.user_name || '-' }}</span>
        </li>
        <li class="info-item">
          <span class="info-label">手机号</span>
          <span class="info-value">{{ userInfo.tel || '-' }}</span>
        </li>
        <li class="info-item">
          <span class="info-label">邮箱</span>
          <span class="info-value">{{ userInfo.email || '-' }}</span>
        </li>
        <li class="info-item">
          <span class="info-label">年龄</span>
          <span class="info-value">{{ userInfo.age || '-' }}</span>
        </li>
        <li class="info-item">
          <span class="info-label">创建时间</span>
          <span class="info-value">{{ userInfo.create_time || '-' }}</span>
        </li>
        <li class="info-item">
          <span class="info-label">最近登录</span>
          <span class="info-value">{{ userInfo.login_time || '-' }}</span>
        </li>
      </ul>

    </div>
  </el-card>

</template>

<script setup name="ProfileCard">
import { ref, onMounted } from 'vue';
import { getUserInfo } from '@/utils/storage';

const userInfo = ref({});

onMounted(() => {
  userInfo.value = getUserInfo();
});

</script>


<style scoped>
.header-content {
  font-size: 16px;
  font-weight: 500;
}

.profile-card-col {
  margin-bottom: 20px;
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

/* 详细内容区域样式 */
.detail-card {
  transition: all 0.3s ease;
}

.detail-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.profile-tabs {
  margin-top: 10px;
}

/* 响应式调整 */
@media (max-width: 992px) {

  .profile-card-col,
  .detail-content-col {
    margin-bottom: 20px;
  }
}

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
