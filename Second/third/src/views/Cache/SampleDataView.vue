<template>
  <div class="sample-list-container">

    <div class="page-header">
      <el-page-header :icon="Back" @back="$router.back()" class="mb-4" title="返回">
        <template #content>
          <span class="text-large font-600">样品数据</span>
        </template>
      </el-page-header>
    </div>


    <el-card shadow="hover" class="filter-card mb-4">
      <el-form :inline="true" :model="filterForm" class="filter-form" @submit.prevent="getSampleList">
        <el-form-item label="样品名称">
          <el-input v-model="filterForm.sample_name" placeholder="请输入样品名称（模糊查询）" clearable @clear="getSampleList"
            max-length="50" />
        </el-form-item>

        <el-form-item label="采样地点">
          <el-input v-model="filterForm.location" placeholder="请输入采样地点（模糊查询）" clearable @clear="getSampleList"
            max-length="100" />
        </el-form-item>

        <el-form-item label="是否已检测">
          <el-select v-model="filterForm.is_processed" placeholder="请选择检测状态" clearable @clear="getSampleList">
            <el-option label="已检测" value="true" />
            <el-option label="未检测" value="false" />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="getSampleList">查询</el-button>
          <el-button @click="resetFilter" class="ml-2">重置</el-button>
        </el-form-item>

      </el-form>
    </el-card>


    <el-card shadow="hover" class="table-card">
      <el-table :data="sampleList" border stripe :loading="tableLoading"
        :empty-text="tableLoading ? '加载中...' : '暂无样品数据'" style="width: 100%">
        <el-table-column label="用户ID" prop="user_id" align="center" withe="80" />
        <el-table-column label="样品ID" prop="sample_id" align="center" width="80" />
        <el-table-column label="样品名称" prop="sample_name" align="center" />
        <el-table-column label="采样地点" prop="location" align="center" />

        <el-table-column label="采样时间" prop="detect_time" align="center" width="180">
          <template #default="scope">
            {{ formatTime(scope.row.detect_time) }}
          </template>
        </el-table-column>

        <el-table-column label="是否已检测" prop="is_processed" align="center" width="120">
          <template #default="scope">
            <el-tag :type="scope.row.is_processed ? 'success' : 'info'">
              {{ scope.row.is_processed ? '已检测' : '未检测' }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column label="检测结果" prop="predict_data" align="center">
          <template #default="scope">
            <span v-if="scope.row.predict_data" class="text-ellipsis" :title="scope.row.predict_data">
              {{ scope.row.predict_data }}
            </span>
            <span v-else class="text-gray-400">-</span>
          </template>
        </el-table-column>

        <el-table-column label="检测时间" prop="processed_time" align="center" width="180">
          <template #default="scope">
            {{ formatTime(scope.row.processed_time) }}
          </template>
        </el-table-column>

        <el-table-column label="详情" align="center" width="120">
          <template #default="scope">
            <el-button type="text" size="small" icon="Eye" @click="viewSampleDetail(scope.row)" text-color="#409EFF">
              查看
            </el-button>
          </template>
        </el-table-column>


        <!-- <el-table-column label="操作" align="center" width="120">
          <template #default="scope">
            <el-button type="text" size="small" icon="Eye" @click="viewSampleDetail(scope.row)" text-color="#409EFF">
              检测
            </el-button>
          </template>
        </el-table-column> -->


      </el-table>


      <div class="pagination-container mt-4">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
          :current-page="pagination.currentPage" :page-sizes="[10, 20, 50, 100]" :page-size="pagination.perPage"
          layout="total, sizes, prev, pager, next, jumper" :total="pagination.total" />
      </div>
    </el-card>


    <el-dialog title="样品详情" v-model="detailDialogVisible" width="600px" :before-close="closeDetailDialog">
      <el-descriptions :column="1" border class="mt-2">
        <el-descriptions-item label="用户ID">{{ currentSample.user_id }}</el-descriptions-item>
        <el-descriptions-item label="样品ID">{{ currentSample.sample_id }}</el-descriptions-item>
        <el-descriptions-item label="样品名称">{{ currentSample.sample_name }}</el-descriptions-item>

        <!-- <el-descriptions-item label="样品原始数据">{{ currentSample.sample_data }}</el-descriptions-item> --> //数据展示-表格

        <el-descriptions-item label="采样地点">{{ currentSample.location || '-' }}</el-descriptions-item>
        <el-descriptions-item label="采样时间">{{ formatTime(currentSample.detect_time) }}</el-descriptions-item>
        <el-descriptions-item label="是否已检测">{{ currentSample.is_processed ? '已检测' : '未检测' }}</el-descriptions-item>
        <el-descriptions-item label="检测结果">
          <pre class="bg-gray-50 p-3 rounded text-sm">{{ currentSample.predict_data || '暂无检测结果' }}</pre>
        </el-descriptions-item>
        <el-descriptions-item label="检测时间">{{ formatTime(currentSample.processed_time) }}</el-descriptions-item>



      </el-descriptions>
      <template #footer>
        <el-button @click="detailDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>


<script setup>
import { ref, reactive, onMounted } from 'vue';
import { ElMessage, ElDialog, ElDescriptions } from 'element-plus';
import axios from 'axios';
import dayjs from 'dayjs';
import { Back } from '@element-plus/icons-vue';



const filterForm = reactive({
  sample_name: '',
  location: '',
  is_processed: '',
  status: ''
});


const sampleList = ref([]);
const tableLoading = ref(false);


const pagination = reactive({
  currentPage: 1,
  perPage: 10,
  total: 0
});


const detailDialogVisible = ref(false);
const currentSample = ref({});

const getSampleList = async () => {
  try {
    tableLoading.value = true;
    const params = {
      sample_name: filterForm.sample_name.trim(),
      location: filterForm.location.trim(),
      is_processed: filterForm.is_processed || undefined,
      status: filterForm.status || undefined,
      page: pagination.currentPage,
      per_page: pagination.perPage
    };

    const API_BASE = 'http://127.0.0.1:5000';
    const response = await axios.get(`${API_BASE}/api/view_samples`, { params: params });

    if (response.data.success) {
      sampleList.value = response.data.data;
      pagination.total = response.data.pagination.total;
      console.log('接口返回的样品数据：', response.data.data);
    } else {
      ElMessage.error(response.data.message || '获取样品列表失败');
    }
  } catch (error) {
    console.error('获取样品列表错误：', error);

    if (error.response) {
      console.log('请求地址：', error.config.url);
      console.log('请求参数：', error.config.params);
      console.log('响应状态：', error.response.status);
    }
    ElMessage.error('网络错误，获取样品列表失败');
  } finally {
    tableLoading.value = false;
  }
};


const resetFilter = () => {
  filterForm.sample_name = '';
  filterForm.location = '';
  filterForm.is_processed = '';
  filterForm.status = '';
  pagination.currentPage = 1;
  getSampleList();
};


const handleSizeChange = (val) => {
  pagination.perPage = val;
  pagination.currentPage = 1;
  getSampleList();
};


const handleCurrentChange = (val) => {
  pagination.currentPage = val;
  getSampleList();
};


const formatTime = (time) => {
  if (!time) return '-';
  return dayjs(time).format('YYYY-MM-DD HH:mm:ss');
};


const viewSampleDetail = (row) => {
  currentSample.value = { ...row };
  detailDialogVisible.value = true;
};


const closeDetailDialog = () => {
  detailDialogVisible.value = false;
  currentSample.value = {};
};


onMounted(() => {
  getSampleList();
});
</script>

<style scoped>
.sample-list-container {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: calc(100vh - 64px);
  /* 适配导航栏高度，避免页面滚动异常 */
}

.page-header {
  margin-bottom: 16px;
}

.filter-card {
  background-color: #fff;
}

.pagination-container {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

/* 表格文字溢出处理 */
.text-ellipsis {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px;
  /* 根据列宽调整 */
}

/* 详情弹窗代码块样式 */
pre {
  white-space: pre-wrap;
  /* 自动换行 */
  word-break: break-all;
  color: #333;
}

/* 适配小屏幕 */
@media (max-width: 1200px) {
  .filter-form .el-form-item {
    margin-bottom: 12px;
  }
}

@media (max-width: 768px) {
  .sample-list-container {
    padding: 10px;
  }

  .filter-form {
    flex-direction: column;
    align-items: flex-start !important;
  }

  .el-table-column {
    font-size: 12px;
  }
}
</style>
