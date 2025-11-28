<template>
  <div class="settings-container">

    <el-card class="danger-zone">
      <template #header>
        <div class="danger-title">注销账号</div>
      </template>
      <div class="account-actions">
        <el-button type="danger" @click="handleAccountDeactivation" icon="Delete">
          注销
        </el-button>
        <p class="danger-hint">注销账号后，所有数据将不可恢复，请谨慎操作</p>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { getUserInfo, removeUserInfo } from '@/utils/storage';
import { useRouter } from 'vue-router';
import request from '@/utils/request';


const router = useRouter();
const userInfo = ref({});

onMounted(() => {
  userInfo.value = getUserInfo() || {};
});

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
      await request.delete(`/api/user/${userInfo.value.user_id}`);
      ElMessage.success('账户注销成功');
      removeUserInfo();
      router.push('/login');
    } catch (error) {
      console.error('注销接口错误:', error)
      ElMessage.error('注销失败，请稍后重试');
    }
  }).catch(() => {
    ElMessage.info('已取消注销');
  });
};
</script>


<style scoped>
.danger-zone {
  border: 1px solid #f56c6c;
}

.danger-title {
  color: #f56c6c;
  font-weight: 500;
  font-size: 16px;
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
