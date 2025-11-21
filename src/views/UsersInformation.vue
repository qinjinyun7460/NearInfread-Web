<template>
  <div class="user-list-container">

    <el-card shadow="hover" class="filter-card">
      <el-form :inline="true" :model="filterForm" class="filter-form">
        <el-form-item label="用户名">
          <el-input v-model="filterForm.user_name" placeholder="请输入用户名" clearable @clear="getUserList" />
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="filterForm.tel" placeholder="请输入手机号" clearable @clear="getUserList" />
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="filterForm.email" placeholder="请输入邮箱" clearable @clear="getUserList" />
        </el-form-item>
        <el-form-item label="在线状态">
          <el-select v-model="filterForm.online_status" placeholder="是否在线" clearable @clear="getUserList"
            style="width: 120px">
            <el-option label="在线" value="true" />
            <el-option label="离线" value="false" />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="getUserList">查询</el-button>
          <el-button @click="resetFilter">重置</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleUser">添加用户</el-button>
        </el-form-item>
      </el-form>
    </el-card>


    <el-card shadow="hover" class="table-card">
      <el-table :data="userList" border stripe :loading="tableLoading" style="width: 100%">
        <el-table-column label="用户ID" prop="user_id" align="center" width="100" sortable />
        <el-table-column label="用户名" prop="user_name" align="center" />
        <el-table-column label="手机号" prop="tel" align="center" />
        <el-table-column label="邮箱" prop="email" align="center" />
        <el-table-column label="年龄" prop="age" align="center" />
        <el-table-column label="创建时间" prop="create_time" align="center" sortable />

        <el-table-column label="在线状态" prop="online_status" align="center" width="120">
          <template #default="scope">
            <el-tag :type="scope.row.online_status === 1 ? 'success' : 'danger'">
              {{ scope.row.online_status === 1 ? '在线' : '离线' }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column label="操作" align="center" width="200">
          <template #default="scope">
            <el-button type="text" size="small" @click="handleEditUser(scope.row)" icon="Edit">
              修改
            </el-button>
            <el-button type="text" size="small" @click="handleDeleteUser(scope.row.user_id)" icon="Delete"
              text-color="#ff4d4f">
              删除
            </el-button>

            <el-button type="text" size="small" @click="handleResetPassword(scope.row)" icon="Lock">
              重置密码
            </el-button>

          </template>
        </el-table-column>
      </el-table>


      <div class="pagination-container">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
          :current-page="pagination.currentPage" :page-sizes="[10, 20, 50, 100]" :page-size="pagination.pageSize"
          layout="total, sizes, prev, pager, next, jumper" :total="pagination.total" />
      </div>

    </el-card>


    <el-dialog title="添加用户" v-model="DialogVisible" width="500px" :before-close="handleDialogClose">
      <el-form :model="userForm" ref="FormRef" :rules="userFormRules" label-width="120px">

        <el-form-item label="用户名" prop="user_name">
          <el-input v-model="userForm.user_name" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="手机号" prop="tel">
          <el-input v-model="userForm.tel" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="userForm.email" placeholder="请输入邮箱" />
        </el-form-item>
        <!-- <el-form-item label="年龄" prop="age">
          <el-input v-model="userForm.age" placeholder="请输入年龄" />
        </el-form-item> -->

      </el-form>

      <template #footer>
        <el-button @click="DialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleAddUser">确定</el-button>
      </template>


    </el-dialog>


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


    <el-dialog title="删除确认" v-model="deleteDialogVisible" width="30%" :before-close="handleDialogClose">
      <div>确定要删除该用户吗？删除后数据不可恢复！</div>
      <template #footer>
        <el-button @click="deleteDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitDelete">确定删除</el-button>
      </template>
    </el-dialog>


    <el-dialog title="重置密码" v-model="resetPwdVisible" width="500px" :before-close="handleResetPwdClose">
      <ResetPwd :target-user-id="currentResetUserId" @close="resetPwdVisible = false" @success="onResetPwdSuccess" />
    </el-dialog>

  </div>
</template>


<script setup>
import { ref, reactive, onMounted } from 'vue';
import { ElMessage, ElForm } from 'element-plus';
import axios from 'axios';
import ResetPwd from './resetPwd.vue';
import request from '@/utils/request';
// import { Back } from '@element-plus/icons-vue'


const API_BASE = 'http://127.0.0.1:5000';
const userList = ref([]);
const tableLoading = ref(false);
const currentUserId = sessionStorage.getItem('current_user_id');

const filterForm = reactive({
  user_name: '',
  tel: '',
  email: '',
  online_status: ''
});


const resetFilter = () => {
  filterForm.user_name = '';
  filterForm.tel = '';
  filterForm.email = '';
  filterForm.online_status = '';
  pagination.currentPage = 1;
  getUserList();
};


const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 0
});


const getUserList = async () => {
  try {
    tableLoading.value = true;

    const params = {
      user_name: filterForm.user_name,
      tel: filterForm.tel,
      email: filterForm.email,
      online_status: filterForm.online_status,
      page: pagination.currentPage,
      size: pagination.pageSize
    };

    // const response = await axios.get(`${API_BASE}/api/view_users`, { params: params });
    const response = await request.get('api/view_users', { params: params })

    if (response.data.success) {
      userList.value = response.data.data;
      pagination.total = response.data.total;
    }
    else {
      ElMessage.error(response.data.message || '获取用户列表失败');
    }
  }
  catch (error) {
    console.error('用户列表查询失败：', error);
    if (error.response) {
      console.log('请求地址：', error.config.url);
      console.log('传递的参数：', error.config.params);
    }
    ElMessage.error('网络错误，获取用户列表失败');
  }
  finally {
    tableLoading.value = false;
  }
};


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


const handleEditUser = (row) => {
  editForm.user_id = row.user_id;
  editForm.user_name = row.user_name;
  editForm.tel = row.tel || '';
  editForm.email = row.email || '';
  editForm.age = row.age || '';
  // editForm.online_status = row.online_status.toString();
  editDialogVisible.value = true;
};


const submitEditForm = async () => {

  if (!currentUserId) {
    ElMessage.warning('请先登录');
    return;
  }

  try {

    await editFormRef.value.validate();
    const body = {
      user_name: editForm.user_name,
      tel: editForm.tel,
      email: editForm.email,
      age: editForm.age,
      online_status: editForm.online_status
    }

    const config = {
      params: {
        current_user_id: currentUserId
      },
    };

    const response = await axios.put(`${API_BASE}/api/user/${editForm.user_id}`, body, config);

    if (response.data.success) {
      ElMessage.success('用户编辑成功');
      editDialogVisible.value = false;
      getUserList();
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


const deleteDialogVisible = ref(false);
let currentDeleteId = ref('');


const handleDeleteUser = (user_id) => {
  currentDeleteId.value = user_id;
  deleteDialogVisible.value = true;
};


const submitDelete = async () => {
  try {

    const param = {
      current_user_id: currentUserId,
    };

    const response = await axios.delete(`${API_BASE}/api/user/${currentDeleteId.value}`, { params: param });


    if (response.data.success) {
      ElMessage.success('用户删除成功');
      deleteDialogVisible.value = false;
      getUserList();  // 重新查询列表
    } else {
      ElMessage.error(response.data.message || '用户删除失败');
    }
  } catch (error) {
    console.error('用户删除失败：', error);
    ElMessage.error('网络错误，用户删除失败');
  }
};


const handleSizeChange = (val) => {
  pagination.pageSize = val;
  pagination.currentPage = 1;
  getUserList();
};

const handleCurrentChange = (val) => {
  pagination.currentPage = val;
  getUserList();
};


// const handleDialogClose = () => {
//   if (editFormRef.value) {
//     editFormRef.value.resetFields();
//   }
//   currentDeleteId.value = '';
// };



const DialogVisible = ref(false);
const FormRef = ref(null);


const userForm = reactive({
  // user_id: '',
  user_name: '',
  tel: '',
  email: '',
  age: '',
  // password: "",
});


const userFormRules = reactive({
  tel: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /(^\d{11}$)/, message: '请输入正确的手机号格式', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
});


const handleUser = (row) => {
  // userForm.user_id = row.user_id;
  userForm.user_name = row.user_name;
  userForm.tel = row.tel || '';
  userForm.email = row.email || '';
  // userForm.age = row.age || '';
  DialogVisible.value = true;
};



const handleAddUser = async () => {
  try {

    const params = {
      user_name: userForm.user_name,
      tel: userForm.tel,
      email: userForm.email,
      // age: userForm.age
    };

    const config = {
      params: {
        current_user_id: currentUserId
      }
    };

    const response = await axios.post(`${API_BASE}/api/user/addUser`, params, config);

    if (response.data.success) {
      ElMessage.success('用户添加成功');
      DialogVisible.value = false;
      getUserList();
    } else {
      ElMessage.error(response.data.message || '用户添加失败');
    }
  }
  catch (error) {

    if (error.name !== 'ValidationError') {
      console.error('用户添加失败：', error);
      ElMessage.error('网络错误，用户添加失败');
    }
  }
};


const handleDialogClose = () => {
  FormRef.value?.resetFields();
  DialogVisible.value = false;
};

onMounted(() => {
  getUserList();
});



const resetPwdVisible = ref(false)
const currentResetUserId = ref("")

const handleResetPassword = (row) => {
  currentResetUserId.value = row.user_id
  resetPwdVisible.value = true
}

const handleResetPwdClose = () => {
  currentResetUserId.value = ""
  resetPwdVisible.value = false
}

const onResetPwdSuccess = () => {
  getUserList()
}


</script>


<style scoped>
.user-list-container {
  /* padding: 20px; */
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
