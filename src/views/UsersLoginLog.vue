<template>
  <div class="user-list-container">

    <el-card shadow="hover" class="filter-card">
      <el-form :inline="true" :model="filterForm" class="filter-form">

        <el-form-item label="用户名">
          <el-input v-model="filterForm.user_name" placeholder="请输入用户名" clearable @clear="getUserLoginLogs" />
        </el-form-item>
        <el-form-item label="登录时间">
          <el-input v-model="filterForm.login_time" placeholder="请输入登录时间" clearable @clear="getUserLoginLogs" />
        </el-form-item>
        <el-form-item label="登录情况">
          <el-select v-model="filterForm.status" placeholder="成功或失败" clearable @clear="getUserLoginLogs"
            style="width: 120px">
            <el-option label="成功" value="true" />
            <el-option label="失败" value="false" />
          </el-select>
        </el-form-item>
        <el-form-item label="操作信息">
          <el-input v-model="filterForm.opera_info" placeholder="请输入操作信息" clearable @clear="getUserLoginLogs" />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="getUserLoginLogs">查询</el-button>
          <el-button @click="resetFilter">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>


    <el-card shadow="hover" class="table-card">
      <el-table :data="userList" border stripe :loading="tableLoading" style="width: 100%" max-height="800">
        <el-table-column label="用户ID" prop="user_id" align="center" width="120" sortable />
        <el-table-column label="用户名" prop="user_name" align="center" />
        <el-table-column label="登录方式" prop="login_type" align="center" />
        <el-table-column label="登录IP" prop="ip_address" align="center" />
        <el-table-column label="用户设备信息" prop="user_agent" align="center" show-overflow-tooltip />

        <el-table-column label="登录情况" prop="status" align="center">
          <template #default="scope">
            <el-tag :type="scope.row.status ? 'success' : 'danger'">
              {{ scope.row.status ? '成功' : '失败' }}
            </el-tag>
          </template>

        </el-table-column>

        <el-table-column label="登录时间" prop="login_time" align="center" sortable />
        <el-table-column label="操作信息" prop="opera_info" align="center" />
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
import { ElMessage, ElForm } from 'element-plus';
import request from '@/utils/request';


const filterForm = reactive({
  user_name: '',
  status: '',
  login_time: '',
  opera_info: ''
});

const userList = ref([]);
const tableLoading = ref(false);

const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 0
});


const getUserLoginLogs = async () => {
  try {
    tableLoading.value = true;

    const currentUserId = sessionStorage.getItem('current_user_id');
    if (!currentUserId) {
      ElMessage.warning('请先登录');
      tableLoading.value = false;
      return;
    }

    const params = {
      current_user_id: currentUserId,
      user_name: filterForm.user_name,
      status: filterForm.status,
      login_time: filterForm.login_time,
      opera_info: filterForm.opera_info,
      page: pagination.currentPage,
      size: pagination.pageSize
    };

    const response = await request.get('/api/usersloginlogs', { params });

    if (response.data.success) {
      userList.value = response.data.data;
      pagination.total = response.data.total;
    } else {
      ElMessage.error(response.data.message || '获取登录日志失败');
    }
  } catch (error) {
    console.error('登录日志查询失败：', error);
    if (error.response) {
      console.log('请求地址：', error.config.url);
      console.log('传递的参数：', error.config.params);
    }
    ElMessage.error('网络错误，获取登录日志失败');
  } finally {
    tableLoading.value = false;
  }
};


const resetFilter = () => {
  filterForm.user_name = '';
  filterForm.status = '';
  filterForm.login_time = '';
  filterForm.opera_info = '';
  pagination.currentPage = 1;
  getUserLoginLogs();
};


const handleSizeChange = (val) => {
  pagination.pageSize = val;
  pagination.currentPage = 1;
  getUserLoginLogs();
};


const handleCurrentChange = (val) => {
  pagination.currentPage = val;
  getUserLoginLogs();
};


onMounted(() => {
  getUserLoginLogs();
});


</script>


<style scoped>
.user-list-container {
  background-color: #f5f7fa;
  min-height: calc(100vh - 64px);
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
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
