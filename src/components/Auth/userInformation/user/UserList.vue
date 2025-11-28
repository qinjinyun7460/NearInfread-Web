<template>
  <div class="user-list-container">
    <!-- 筛选组件 -->
    <UserFilter :initial-filter="filterForm" @search="handleSearch" @reset="handleResetFilter"
      @add="handleShowAddDialog" />

    <!-- 表格组件 -->
    <UserTable :user-list="userList" :loading="tableLoading" :pagination="pagination" @edit="handleShowEditDialog"
      @delete="handleShowDeleteDialog" @resetPwd="handleShowResetPwdDialog" @sizeChange="handleSizeChange"
      @currentChange="handleCurrentChange" />

    <!-- 添加用户弹窗 -->
    <AddUserDialog v-model="addDialogVisible" @submit="handleAddUser" @close="addDialogVisible = false" />

    <!-- 编辑用户弹窗 -->
    <EditUserDialog v-model="editDialogVisible" :user-info="currentEditUser" @submit="handleEditSubmit"
      @close="editDialogVisible = false" />

    <!-- 删除确认弹窗 -->
    <DeleteConfirmDialog v-model="deleteDialogVisible" @close="deleteDialogVisible = false"
      @confirm="handleDeleteConfirm" />

    <!-- 重置密码弹窗 -->
    <el-dialog title="重置密码" v-model="resetPwdVisible" width="500px" :before-close="handleResetPwdClose">
      <ResetPwd :is-self-mode="false" :target-user-id="currentResetUserId" :target-user-name="currentResetUserName"
        @close="handleResetPwdClose" @success="onResetPwdSuccess" />
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import UserFilter from '@/components/Auth/userInformation/user/UserFilter.vue';
import UserTable from './UserTable.vue';
import AddUserDialog from './AddUserDialog.vue';
import EditUserDialog from './EditUserDialog.vue';
import DeleteConfirmDialog from './DeleteConfirmDialog.vue';
import ResetPwd from '@/views/resetPwd.vue';
import request from '@/utils/request';

// 数据状态
const userList = ref([]);
const tableLoading = ref(false);
const filterForm = reactive({
  user_name: '',
  tel: '',
  email: '',
  online_status: ''
});
const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 0
});

// 弹窗状态
const addDialogVisible = ref(false);
const editDialogVisible = ref(false);
const deleteDialogVisible = ref(false);
const resetPwdVisible = ref(false);

// 当前操作数据
const currentEditUser = ref({});
const currentDeleteId = ref('');
const currentResetUserId = ref('');
const currentResetUserName = ref('');

onMounted(() => {
  getUserList();
});

// 获取用户列表
const getUserList = async () => {
  try {
    tableLoading.value = true;
    const params = {
      ...filterForm,
      page: pagination.currentPage,
      size: pagination.pageSize
    };
    const response = await request.get('api/view_users', { params });
    if (response.data.success) {
      userList.value = response.data.data;
      pagination.total = response.data.total;
    } else {
      ElMessage.error(response.data.message || '获取用户列表失败');
    }
  } catch (error) {
    console.error('用户列表查询失败：', error);
    ElMessage.error('网络错误，获取用户列表失败');
  } finally {
    tableLoading.value = false;
  }
};


// 筛选相关
const handleSearch = (filters) => {
  Object.assign(filterForm, filters);
  pagination.currentPage = 1;
  getUserList();
};
const handleResetFilter = () => {
  filterForm.user_name = '';
  filterForm.tel = '';
  filterForm.email = '';
  filterForm.online_status = '';
  pagination.currentPage = 1;
  getUserList();
};

// 添加用户
const handleShowAddDialog = () => {
  addDialogVisible.value = true;
};
const handleAddUser = async (userData) => {
  try {

    const response = await request.post('/api/user/addUser', userData);
    if (response.data.success) {
      ElMessage.success('用户添加成功');
      addDialogVisible.value = false;
      getUserList();
    } else {
      ElMessage.error(response.data.message || '用户添加失败');
    }
  } catch (error) {
    console.error('用户添加失败：', error);
    ElMessage.error('网络错误，用户添加失败');
  }
};

// 编辑用户
const handleShowEditDialog = (row) => {
  currentEditUser.value = { ...row };
  editDialogVisible.value = true;
};
const handleEditSubmit = async (formData) => {
  try {

    const response = await request.put(`/api/user/${formData.user_id}`, formData);
    if (response.data.success) {
      ElMessage.success('用户编辑成功');
      editDialogVisible.value = false;
      getUserList();
    } else {
      ElMessage.error(response.data.message || '用户编辑失败');
    }
  } catch (error) {
    console.error('用户编辑失败：', error);
    ElMessage.error('网络错误，用户编辑失败');
  }
};


// 删除用户
const handleShowDeleteDialog = (userId) => {
  currentDeleteId.value = userId;
  deleteDialogVisible.value = true;
};
const handleDeleteConfirm = async () => {
  try {
    const response = await request.delete(`/api/user/${currentDeleteId.value}`);
    if (response.data.success) {
      ElMessage.success('用户删除成功');
      deleteDialogVisible.value = false;
      getUserList();

    } else {
      ElMessage.error(response.data.message || '用户删除失败');
    }
  } catch (error) {
    console.error('用户删除失败：', error);
    ElMessage.error('网络错误，用户删除失败');
  }
};

// 重置密码
const handleShowResetPwdDialog = (row) => {
  currentResetUserId.value = row.user_id;
  currentResetUserName.value = row.user_name
  resetPwdVisible.value = true;
};
const handleResetPwdClose = () => {
  currentResetUserId.value = '';
  currentResetUserName.value = '';
  resetPwdVisible.value = false;
};
const onResetPwdSuccess = () => {
  getUserList();
};

// 分页相关
const handleSizeChange = (val) => {
  pagination.pageSize = val;
  pagination.currentPage = 1;
  getUserList();
};
const handleCurrentChange = (val) => {
  pagination.currentPage = val;
  getUserList();
};

</script>


<style scoped>
.user-list-container {
  background-color: #f5f7fa;
  min-height: calc(100vh - 64px);
  /* height: 100%; */
}
</style>
