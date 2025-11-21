<template>
  <div class="user-list-container">

    <el-dialog title="编辑用户" v-model="editDialogVisible" width="500px" :before-close="handleDialogClose">

      <el-form :model="editForm" ref="editFormRef" :rules="editFormRules" label-width="120px">
        <el-form-item label="用户ID" prop="user_id">
          <el-input v-model="editForm.user_id" disabled placeholder="用户ID不可修改" />
        </el-form-item>
        <el-form-item label="用户名" prop="user_name">
          <el-input v-model="editForm.user_name" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="手机号" prop="tel">
          <el-input v-model="editForm.tel" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="年龄" prop="age">
          <el-input v-model="editForm.age" placeholder="请输入年龄" />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="editDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitEditForm">确定</el-button>
      </template>

    </el-dialog>

  </div>
</template>


<script setup>
import { ref, reactive } from 'vue';
import { ElMessage, ElForm } from 'element-plus';
import request from '@/utils/request';


const editDialogVisible = ref(false);
const editFormRef = ref(null);


const editForm = reactive({
  user_id: '',
  user_name: '',
  tel: '',
  email: '',
  age: '',
  online_status: '1'
});


const editFormRules = reactive({
  tel: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /(^\d{11}$)/, message: '请输入正确的手机号格式', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  online_status: [
    { required: true, message: '请选择用户在线状态', trigger: 'change' }
  ]
});

const submitEditForm = async () => {

  try {

    await editFormRef.value.validate();
    const params = {
      user_name: editForm.user_name,
      tel: editForm.tel,
      email: editForm.email,
      age: editForm.age,
      online_status: editForm.online_status
    }


    const response = await request.put('/api/user/${editForm.user_id}', params);

    if (response.data.success) {
      ElMessage.success('用户编辑成功');
      editDialogVisible.value = false;

    } else {
      ElMessage.error(response.data.message || '用户编辑失败');
    }
  } catch (error) {
    if (error.name === 'ValidationError') {
      return;
    }
    console.error('用户编辑失败：', error);
    ElMessage.error('网络错误，用户编辑失败');
  }
};


</script>


<style scoped>
.user-list-container {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: calc(100vh - 64px);
  /* 适配导航栏高度 */
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.page-header h2 {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.filter-card {
  margin-bottom: 20px;
}

.filter-form {
  margin-bottom: 0;
}

.table-card {
  margin-bottom: 20px;
}

.pagination-container {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: 16px;
}

/* 适配小屏幕 */
@media (max-width: 768px) {
  .filter-form {
    flex-direction: column;
    align-items: flex-start !important;
  }

  .filter-form .el-form-item {
    margin-bottom: 12px;
    width: 100%;
  }
}
</style>
