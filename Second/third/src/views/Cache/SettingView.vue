<template>
  <div class="settings-container">

    <el-card>
      <el-tabs v-model="activeTab" class="settings-tabs">
        <el-tab-pane label="个人信息" name="personal">
          <personal-info :user-info="userInfo" @update-user="handleUserUpdate" />
        </el-tab-pane>

        <el-tab-pane label="重置密码" name="security">
          <password-reset />
        </el-tab-pane>

        <el-tab-pane label="账户管理" name="account">
          <el-card class="danger-zone">
            <template #header>
              <div class="danger-title">危险操作</div>
            </template>
            <div class="account-actions">
              <el-button type="danger" @click="handleAccountDeactivation" icon="Delete">
                注销账户
              </el-button>
              <p class="danger-hint">注销账户后，所有数据将不可恢复，请谨慎操作</p>
            </div>
          </el-card>
        </el-tab-pane>
      </el-tabs>
    </el-card>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { getUserInfo, setUserInfo, removeUserInfo } from '@/utils/storage';
import { useRouter } from 'vue-router';
import PersonalInfo from '@/views/PersonalCenter.vue';
import PasswordReset from '@/views/resetPwd.vue';
import request from '@/utils/request';


const router = useRouter();
// const activeTab = ref('personal');
const activeTab = ref('details');
const userInfo = ref({});


onMounted(() => {
  userInfo.value = getUserInfo() || {};
});

const handleUserUpdate = (updatedUser) => {
  userInfo.value = { ...userInfo.value, ...updatedUser };
  setUserInfo(userInfo.value);
  ElMessage.success('个人信息更新成功');
};


const handleAccountDeactivation = () => {
  ElMessageBox.confirm(
    '确定要注销账户吗？此操作不可恢复，所有数据将被永久删除。',
    '警告',
    {
      confirmButtonText: '确认注销',
      cancelButtonText: '取消',
      type: 'error'
    }
  ).then(async () => {
    try {
      // 调用注销接口
      await request.delete(`/api/user/${userInfo.value.user_id}`);
      ElMessage.success('账户注销成功');
      // 清除用户信息并跳转到登录页
      removeUserInfo();
      router.push('/login');
    } catch (error) {
      console.error('注销接口错误:', error)
      ElMessage.error('注销失败，请稍后重试');
    }
  }).catch(() => {
    // 取消注销
    ElMessage.info('已取消注销');
  });
};
</script>


<style scoped>
.settings-container {
  /* padding: 20px; */
  background-color: #f5f7fa;
  min-height: calc(100vh - 60px);
}

.header-title {
  font-size: 18px;
  font-weight: 500;
}

.settings-tabs {
  margin-top: 20px;
}

.danger-zone {
  border: 1px solid #f56c6c;
  margin-top: 20px;
}

.danger-title {
  color: #f56c6c;
  font-weight: 500;
}

.account-actions {
  padding: 20px 0;
}

.danger-hint {
  color: #f56c6c;
  font-size: 12px;
  margin-top: 10px;
  max-width: 500px;
}
</style>
