<template>
  <div class="sample-list-container">

    <div class="page-header">
      <el-page-header :icon="Back" @back="$router.back()" class="mb-4" title="返回">
        <template #content>
          <span class="text-large font-600">检测数据</span>
        </template>
      </el-page-header>
    </div>


    <el-card shadow="hover" class="filter-card mb-4">
      <el-form :inline="true" :model="filterForm" class="filter-form" @submit.prevent="fetchDetectionData">
        <el-form-item label="样品名称">
          <el-input v-model="filterForm.sample_name" placeholder="请输入样品名称（模糊查询）" clearable @clear="fetchDetectionData"
            max-length="50" />
        </el-form-item>

        <el-form-item label="采样地点">
          <el-input v-model="filterForm.location" placeholder="请输入采样地点（模糊查询）" clearable @clear="fetchDetectionData"
            max-length="100" />
        </el-form-item>

        <el-form-item label="是否已检测">
          <el-select v-model="filterForm.is_processed" placeholder="请选择检测状态" clearable @clear="fetchDetectionData">
            <el-option label="已检测" value="true" />
            <el-option label="未检测" value="false" />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="fetchDetectionData">查询</el-button>
          <el-button @click="resetFilter" class="ml-2">重置</el-button>
        </el-form-item>

        <div class="action-buttons">
          <el-button type="primary" icon="el-icon-refresh" @click="fetchDetectionData">
            刷新数据
          </el-button>
          <el-button type="success" icon="el-icon-plus" @click="showAddDialog = true">
            新增检测
          </el-button>
        </div>

      </el-form>


    </el-card>


    <el-card shadow="hover" class="table-card">
      <el-table :data="sampleList" border stripe :loading="tableLoading"
        :empty-text="tableLoading ? '加载中...' : '暂无样品数据'" style="width: 100" @row-click="handleRowClick">
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

        <!-- <el-table-column label="详情" align="center" width="120">
          <template #default="scope">
            <el-button type="text" size="small" icon="Eye" @click="handleViewDetail(scope.row)" text-color="#409EFF">
              查看
            </el-button>
          </template>
        </el-table-column> -->

        <el-table-column label="操作" width="200" align="center">
          <template #default="scope">
            <el-button size="mini" type="primary" icon="el-icon-view"
              @click="handleViewDetail(scope.row)">查看</el-button>
            <el-button size="mini" type="warning" icon="el-icon-refresh" @click="handleRedetect(scope.row)"
              :disabled="!scope.row.is_processed">重检测
            </el-button>
          </template>
        </el-table-column>


        <!-- <el-table-column label="操作" align="center" width="120">
          <template #default="scope">
            <el-button type="text" size="small" icon="Eye" @click="handleViewDetail(scope.row)" text-color="#409EFF">
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


    <!-- 新增检测对话框 -->
    <el-dialog title="提交新样本检测" v-model="showAddDialog" width="600px" :close-on-click-modal="false">
      <el-form ref="addFormRef" :model="addForm" :rules="addFormRules" label-width="100px">
        <el-form-item label="样本名称" prop="sample_name">
          <el-input v-model="addForm.sample_name" placeholder="请输入样本名称"></el-input>
        </el-form-item>
        <el-form-item label="采集位置" prop="location">
          <el-input v-model="addForm.location" placeholder="请输入采集位置（可选）"></el-input>
        </el-form-item>
        <el-form-item label="模型类型" prop="model_type">
          <el-select v-model="addForm.model_type" placeholder="请选择检测模型">
            <el-option label="低误差模式" value="low_error"></el-option>
            <!-- <el-option label="快速模式" value="fast"></el-option>
            <el-option label="高精度模式" value="high_precision"></el-option> -->
          </el-select>
        </el-form-item>
        <el-form-item label="样本数据" prop="sample_data">
          <el-input v-model="addForm.sample_data" type="textarea" :rows="6" placeholder="请输入JSON格式的样本数据"></el-input>
          <div class="form-hint">提示：请输入有效的JSON格式数据，例如 {"value": [1.2, 3.4, 5.6]}</div>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showAddDialog = false">取消</el-button>
        <el-button type="primary" @click="handleSubmitNewSample">提交检测</el-button>
      </template>
    </el-dialog>


    <el-dialog title="检测结果详情" v-model="detailDialogVisible" width="800px" :close-on-click-modal="false">
      <div v-if="currentDetail" class="detail-content">
        <el-descriptions column="1" border class="detail-basic">
          <el-descriptions-item label="样本ID">{{ currentDetail.id }}</el-descriptions-item>
          <el-descriptions-item label="样本名称">{{ currentDetail.sample_name }}</el-descriptions-item>
          <el-descriptions-item label="采集位置">{{ currentDetail.location || '未提供' }}</el-descriptions-item>
          <el-descriptions-item label="提交用户ID">{{ currentDetail.user_id }}</el-descriptions-item>
          <el-descriptions-item label="检测时间">{{ formatDateTime(currentDetail.processed_time) }}</el-descriptions-item>
          <el-descriptions-item label="处理状态">
            <el-tag :type="currentDetail.is_processed ? 'success' : 'warning'">
              {{ currentDetail.is_processed ? '已检测' : '未检测' }}
            </el-tag>
          </el-descriptions-item>
        </el-descriptions>

        <el-collapse v-model="activeDetailPanels">
          <el-collapse-item title="检测结果数据" name="prediction">
            <el-descriptions column="1" border>
              <el-descriptions-item label="预测值">
                <pre>{{ JSON.stringify(parseJson(currentDetail.predict_data), null, 2) }}</pre>
              </el-descriptions-item>
              <el-descriptions-item label="预测说明">
                <div v-for="(msg, index) in parsePredictMessage(currentDetail.predict_message)" :key="index"
                  class="prediction-message">
                  {{ index + 1 }}. {{ msg }}
                </div>
              </el-descriptions-item>
            </el-descriptions>
          </el-collapse-item>

          <el-collapse-item title="原始样本数据" name="raw">
            <el-descriptions column="1" border>
              <el-descriptions-item label="原始数据">
                <pre>{{ JSON.stringify(parseJson(currentDetail.sample_data), null, 2) }}</pre>
              </el-descriptions-item>
            </el-descriptions>
          </el-collapse-item>
        </el-collapse>
      </div>
    </el-dialog>


  </div>
</template>


<script setup>
import { ref, reactive, onMounted } from 'vue';
import { ElMessage, ElDialog, ElDescriptions } from 'element-plus';
import axios from 'axios';
import dayjs from 'dayjs';
import { Back } from '@element-plus/icons-vue';
import ElMessageBox from 'element-plus';




const API_BASE = 'http://127.0.0.1:5000';

const sampleList = ref([]);
const tableLoading = ref(false);
// const searchQuery = ref('');

const showAddDialog = ref(false)
const detailDialogVisible = ref(false);
const currentDetail = ref({});
const activeDetailPanels = ref(['prediction']);

const pagination = reactive({
  currentPage: 1,
  perPage: 10,
  total: 0
});

const filterForm = reactive({
  sample_id: '',
  sample_name: '',
  location: '',
  is_processed: '',
  status: ''
});


// 新增表单数据
const addForm = reactive({
  sample_name: '',
  location: '',
  model_type: 'low_error',
  sample_data: ''
});


// // 新增表单验证规则
// const addFormRules = reactive({
//   sample_name: [
//     { required: true, message: '请输入样本名称', trigger: 'blur' },
//     { min: 2, max: 50, message: '样本名称长度在2-50个字符之间', trigger: 'blur' }
//   ],
//   model_type: [
//     { required: true, message: '请选择模型类型', trigger: 'change' }
//   ],
//   sample_data: [
//     { required: true, message: '请输入样本数据', trigger: 'blur' },
//     { validator: validateJson, trigger: 'blur' }
//   ]
// });


const addFormRef = ref(null)


const fetchDetectionData = async () => {
  try {
    tableLoading.value = true;
    const params = {
      sample_id: filterForm.sample_id,
      sample_name: filterForm.sample_name.trim(),
      location: filterForm.location.trim(),
      is_processed: filterForm.is_processed || undefined,
      status: filterForm.status || undefined,
      page: pagination.currentPage,
      per_page: pagination.perPage
    };

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
  fetchDetectionData();
};


const handleSizeChange = (val) => {
  pagination.perPage = val;
  pagination.currentPage = 1;
  fetchDetectionData();
};

const handleCurrentChange = (val) => {
  pagination.currentPage = val;
  fetchDetectionData();
};


const formatTime = (time) => {
  if (!time) return '-';
  return dayjs(time).format('YYYY-MM-DD HH:mm:ss');
};


const handleViewDetail = (row) => {
  currentDetail.value = { ...row };
  detailDialogVisible.value = true;
};

const handleRowClick = (row) => {
  handleViewDetail(row);
};

// const closeDetailDialog = () => {
//   detailDialogVisible.value = false;
//   currentDetail.value = {};
// };

const handleRedetect = async (row) => {
  try {
    ElMessageBox.confirm(
      `确定要重新检测样本ID为 ${row.sample_id} 的数据吗？`,
      '确认重新检测',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    ).then(async () => {
      const requestData = {
        sample_id: row.sample_id,
        model_type: 'low_error'
      };

      const response = await axios.post(`${API_BASE}/api/view_samples`, requestData);

      // const { data } = await axios.post(`${API_BASE}/api/detect_sample`, requestData);

      if (response.data.success) {
        ElMessage.success('重新检测成功');
        fetchDetectionData();
      } else {
        ElMessage.error(response.data.message || '重新检测失败');
      }
    });
  }
  catch (error) {
    if (error === 'cancel') {
      return;
    }
    console.error('重新检测错误:', error);
    ElMessage.error('重新检测失败，请重试');
  }
};

// // 工具函数 - JSON验证
// const validateJson = (rule, value, callback) => {
//   try {
//     if (value) {
//       JSON.parse(value);
//     }
//     callback();
//   } catch (error) {
//     console.warn('JSON格式错误', error);
//     callback(new Error('请输入有效的JSON格式数据'));
//   }
// };

const parseJson = (dataStr) => {
  try {
    return typeof dataStr === 'string' ? JSON.parse(dataStr) : dataStr;
  } catch (error) {
    console.warn('JSON解析失败:', error);
    return dataStr;
  }
};

// const parsePredictMessage = (messageStr) => {
//   if (!messageStr && messageStr !== 0 && messageStr !== false) {
//     return ['无预测说明'];
//   }

//   try {
//     const str = typeof messageStr === 'string' ? messageStr : String(messageStr);

//     const parsed = JSON.parse(str);

//     if (Array.isArray(parsed)) {
//       return parsed;
//     } else if (parsed === null || parsed === undefined) {
//       return ['无预测说明'];
//     } else {
//       return [parsed];
//     }
//   } catch (error) {
//     console.warn('预测信息解析失败:', error, '原始数据:', messageStr);
//     return [messageStr.toString() || '无预测说明'];
//   }
// };

// 提交新样本检测
const handleSubmitNewSample = async () => {
  try {
    await addFormRef.value.validate();

    // // 获取当前登录用户ID
    // const storedUser = localStorage.getItem('userInfo') || sessionStorage.getItem('userInfo');
    // const userInfo = storedUser ? JSON.parse(storedUser) : null;
    // const userId = userInfo?.id || 0;

    // 构建请求数据
    const requestData = {
      new_sample: {
        // user_id: userId,
        sample_name: addForm.sample_name,
        sample_data: JSON.parse(addForm.sample_data),
        location: addForm.location
      },
      model_type: addForm.model_type
    };

    // 发送请求
    const response = await axios.post(`${API_BASE}/api/view_samples`, requestData);

    // const { data } = await axios.post(`${API_BASE}/api/detect_sample`, requestData);

    if (response.data.success) {
      ElMessage.success(response.data.message);
      showAddDialog.value = false;
      // 重置表单
      addFormRef.value.resetFields();
      // 重新加载数据
      fetchDetectionData();
    } else {
      ElMessage.error(response.data.message || '提交检测失败');
    }
  }
  catch (error) {
    console.error('提交检测错误:', error);
    if (error.name === 'ValidationError') {
      // 表单验证失败，不额外提示
      return;
    }
    ElMessage.error(error.response?.data?.message || '提交检测失败，请重试');
  }
};






onMounted(() => {
  fetchDetectionData();
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
