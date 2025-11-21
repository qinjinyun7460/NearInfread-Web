<template>

  <el-card shadow="hover" class="table-card">
    <el-table :data="userList" border stripe :loading="tableLoading" style="width: 100%">
      <el-table-column label="用户ID" prop="user_id" align="center" width="80" />
      <el-table-column label="用户名" prop="user_name" align="center" width="80" />
      <el-table-column label="登录方式" prop="login_type" align="center" width="100" />
      <el-table-column label="登录IP" prop="ip_address" align="center" width="100" />
      <el-table-column label="用户设备信息" prop="user_agent" align="center" />
      <el-table-column label="登录状态" prop="status" align="center" width="100" />
      <el-table-column label="登录时间" prop="login_time" align="center" width="180" />
      <el-table-column label="操作信息" prop="opera_info" align="center" width="180" />
    </el-table>

    <div class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="pagination.currentPage" :page-sizes="[10, 20, 50, 100]" :page-size="pagination.pageSize"
        layout="total, sizes, prev, pager, next, jumper" :total="pagination.total" />
    </div>
  </el-card>

</template>


<script setup>
import { ref, reactive, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import axios from 'axios';
import { getUserInfo } from '@/utils/storage';

const userInfo = ref({})
const userList = ref([]);
const tableLoading = ref(false);

userInfo.value =  getUserInfo();

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


    const request = axios.create({ baseURL: 'http://127.0.0.1:5000' });
    const response = await request.get('/api/usersloginlogs', {
      params: {
        current_user_id: userInfo.value.user_id
      }
    });


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

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
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

</style>
