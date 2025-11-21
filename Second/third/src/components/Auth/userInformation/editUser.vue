<template>
  <div class="user-list-container">

    <el-card shadow="hover" class="table-card">
      <el-table :data="userList" border stripe :loading="tableLoading" style="width: 100%">
        <el-table-column label="ID" prop="user_id" align="center" width="100" sortable />
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

  </div>
</template>


<script setup>
import { ref, reactive, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import request from '@/utils/request';


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

const handleSizeChange = (val) => {
  pagination.pageSize = val;
  pagination.currentPage = 1;
  getUserList();
};

const handleCurrentChange = (val) => {
  pagination.currentPage = val;
  getUserList();
};

onMounted(() => {
  getUserList();
});

</script>


<style scoped>
.user-list-container {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: calc(100vh - 64px);
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

.table-card {
  margin-bottom: 20px;
}

.pagination-container {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: 16px;
}

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
