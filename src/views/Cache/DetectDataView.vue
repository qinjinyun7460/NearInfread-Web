<template>
  <div class="detection-page">
    <!-- 页面导航 -->
    <nav class="page-nav">
      <div class="container">
        <div class="nav-path">
          <span @click="$router.push('/')" class="path-item">首页</span>
          <i class="el-icon-arrow-right"></i>
          <span class="path-item active">检测数据管理</span>
        </div>
      </div>
    </nav>

    <!-- 页面标题 -->
    <div class="page-header">
      <div class="container">
        <h1 class="page-title">检测数据管理中心</h1>
        <p class="page-desc">查看和管理所有样本的检测记录与结果分析</p>
      </div>
    </div>

    <!-- 主要内容区 -->
    <main class="main-content">
      <div class="container">
        <!-- 功能按钮区 -->
        <div class="action-bar">
          <el-input v-model="searchQuery" placeholder="搜索样本ID或名称" clearable size="default" class="search-input"
            @keyup.enter="fetchDetectionData">
            <template #append>
              <el-button icon="el-icon-search" @click="fetchDetectionData"></el-button>
            </template>
          </el-input>

          <div class="action-buttons">
            <el-button type="primary" icon="el-icon-refresh" @click="fetchDetectionData">
              刷新数据
            </el-button>
            <el-button type="success" icon="el-icon-plus" @click="showAddDialog = true">
              新增检测
            </el-button>
          </div>
        </div>

        <!-- 数据表格 -->
        <el-table v-loading="loading" :data="detectionList" border style="width: 100%; margin-top: 20px"
          @row-click="handleRowClick">
          <el-table-column prop="id" label="样本ID" width="100" align="center"></el-table-column>
          <el-table-column prop="sample_name" label="样本名称" min-width="150"></el-table-column>
          <el-table-column prop="location" label="采集位置" min-width="120"></el-table-column>
          <el-table-column prop="user_id" label="提交用户ID" width="120" align="center"></el-table-column>
          <el-table-column prop="is_processed" label="处理状态" width="120" align="center">
            <template #default="scope">
              <el-tag :type="scope.row.is_processed ? 'success' : 'warning'">
                {{ scope.row.is_processed ? '已检测' : '未检测' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="processed_time" label="检测时间" min-width="180" align="center">
            <template #default="scope">
              {{ formatDateTime(scope.row.processed_time) || '未检测' }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200" align="center">
            <template #default="scope">
              <el-button size="mini" type="primary" icon="el-icon-view" @click="handleViewDetail(scope.row)">
                查看
              </el-button>
              <el-button size="mini" type="warning" icon="el-icon-refresh" @click="handleRedetect(scope.row)"
                :disabled="!scope.row.is_processed">
                重检测
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页 -->
        <div class="pagination" v-if="total > 0">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
            :current-page="currentPage" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" :total="total"
            layout="total, sizes, prev, pager, next, jumper"></el-pagination>
        </div>

        <!-- 空状态 -->
        <div class="empty-state" v-if="!loading && detectionList.length === 0">
          <el-empty description="暂无检测数据记录"></el-empty>
        </div>
      </div>
    </main>

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
            <el-option label="快速模式" value="fast"></el-option>
            <el-option label="高精度模式" value="high_precision"></el-option>
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

    <!-- 详情对话框 -->
    <el-dialog title="检测结果详情" v-model="showDetailDialog" width="800px" :close-on-click-modal="false">
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

      <template #footer>
        <el-button @click="showDetailDialog = false">关闭</el-button>
        <el-button type="primary" icon="el-icon-download" @click="downloadDetailReport">
          下载报告
        </el-button>
      </template>
    </el-dialog>

    <!-- 页脚 -->
    <footer class="page-footer">
      <div class="container">
        <p class="copyright">© 2025 AdminSystem. 保留所有权利</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import axios from 'axios';
import { useRouter } from 'vue-router';

// 路由实例
const router = useRouter();

// API基础地址
const API_BASE = 'http://127.0.0.1:5000';

// 表格数据
const detectionList = ref([]);
const total = ref(0);
const loading = ref(false);
const currentPage = ref(1);
const pageSize = ref(10);
const searchQuery = ref('');

// 对话框状态
const showAddDialog = ref(false);
const showDetailDialog = ref(false);
const currentDetail = ref(null);
const activeDetailPanels = ref(['prediction']);

// 新增表单数据
const addForm = reactive({
  sample_name: '',
  location: '',
  model_type: 'low_error',
  sample_data: ''
});

// 新增表单验证规则
const addFormRules = reactive({
  sample_name: [
    { required: true, message: '请输入样本名称', trigger: 'blur' },
    { min: 2, max: 50, message: '样本名称长度在2-50个字符之间', trigger: 'blur' }
  ],
  model_type: [
    { required: true, message: '请选择模型类型', trigger: 'change' }
  ],
  sample_data: [
    { required: true, message: '请输入样本数据', trigger: 'blur' },
    { validator: validateJson, trigger: 'blur' }
  ]
});

// 表单引用
const addFormRef = ref(null);

// 页面加载时获取数据
onMounted(() => {
  // 检查登录状态
  const storedUser = localStorage.getItem('userInfo') || sessionStorage.getItem('userInfo');
  if (!storedUser) {
    ElMessage.warning('请先登录系统');
    setTimeout(() => {
      router.push('/login');
    }, 1000);
    return;
  }

  fetchDetectionData();
});

// 获取检测数据列表
const fetchDetectionData = async () => {
  try {
    loading.value = true;
    const params = {
      page: currentPage.value,
      size: pageSize.value
    };

    // 如果有搜索关键词，添加到请求参数
    if (searchQuery.value) {
      params.query = searchQuery.value;
    }

    const { data } = await axios.get(`${API_BASE}/api/detection_data`, { params });

    if (data.success) {
      detectionList.value = data.data.items;
      total.value = data.data.total;
    } else {
      ElMessage.error(data.message || '获取检测数据失败');
    }
  } catch (error) {
    console.error('获取检测数据错误:', error);
    ElMessage.error('网络错误，无法获取检测数据');
  } finally {
    loading.value = false;
  }
};

// 提交新样本检测
const handleSubmitNewSample = async () => {
  try {
    await addFormRef.value.validate();

    // 获取当前登录用户ID
    const storedUser = localStorage.getItem('userInfo') || sessionStorage.getItem('userInfo');
    const userInfo = storedUser ? JSON.parse(storedUser) : null;
    const userId = userInfo?.id || 0;

    // 构建请求数据
    const requestData = {
      new_sample: {
        user_id: userId,
        sample_name: addForm.sample_name,
        sample_data: JSON.parse(addForm.sample_data),
        location: addForm.location
      },
      model_type: addForm.model_type
    };

    // 发送请求
    const { data } = await axios.post(`${API_BASE}/api/detect_sample`, requestData);

    if (data.success) {
      ElMessage.success(data.message);
      showAddDialog.value = false;
      // 重置表单
      addFormRef.value.resetFields();
      // 重新加载数据
      fetchDetectionData();
    } else {
      ElMessage.error(data.message || '提交检测失败');
    }
  } catch (error) {
    console.error('提交检测错误:', error);
    if (error.name === 'ValidationError') {
      // 表单验证失败，不额外提示
      return;
    }
    ElMessage.error(error.response?.data?.message || '提交检测失败，请重试');
  }
};

// 查看详情
const handleViewDetail = (row) => {
  currentDetail.value = { ...row };
  showDetailDialog.value = true;
};

// 表格行点击事件
const handleRowClick = (row) => {
  handleViewDetail(row);
};

// 重新检测
const handleRedetect = async (row) => {
  try {
    ElMessageBox.confirm(
      `确定要重新检测样本ID为 ${row.id} 的数据吗？`,
      '确认重新检测',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    ).then(async () => {
      // 发送重新检测请求
      const requestData = {
        sample_id: row.id,
        model_type: 'low_error' // 默认使用低误差模式，可根据需求调整
      };

      const { data } = await axios.post(`${API_BASE}/api/detect_sample`, requestData);

      if (data.success) {
        ElMessage.success('重新检测成功');
        fetchDetectionData();
      } else {
        ElMessage.error(data.message || '重新检测失败');
      }
    });
  } catch (error) {
    if (error === 'cancel') {
      // 用户取消操作
      return;
    }
    console.error('重新检测错误:', error);
    ElMessage.error('重新检测失败，请重试');
  }
};

// 下载报告
const downloadDetailReport = () => {
  if (!currentDetail.value) return;

  // 构建报告内容
  const reportData = {
    检测报告: `样本ID: ${currentDetail.value.id}`,
    样本名称: currentDetail.value.sample_name,
    检测时间: formatDateTime(currentDetail.value.processed_time),
    预测结果: parseJson(currentDetail.value.predict_data),
    预测说明: parsePredictMessage(currentDetail.value.predict_message),
    原始数据: parseJson(currentDetail.value.sample_data)
  };

  // 转换为JSON字符串
  const jsonStr = JSON.stringify(reportData, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  // 创建下载链接
  const a = document.createElement('a');
  a.href = url;
  a.download = `检测报告_${currentDetail.value.id}_${new Date().getTime()}.json`;
  document.body.appendChild(a);
  a.click();

  // 清理
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  ElMessage.success('报告下载成功');
};

// 分页相关方法
const handleSizeChange = (val) => {
  pageSize.value = val;
  currentPage.value = 1;
  fetchDetectionData();
};

const handleCurrentChange = (val) => {
  currentPage.value = val;
  fetchDetectionData();
};

// 工具函数 - JSON验证
const validateJson = (rule, value, callback) => {
  try {
    if (value) {
      JSON.parse(value);
    }
    callback();
  } catch (error) {
    console.warn('JSON格式错误', error);
    callback(new Error('请输入有效的JSON格式数据'));
  }
};

// 工具函数 - 解析JSON
const parseJson = (dataStr) => {
  try {
    return typeof dataStr === 'string' ? JSON.parse(dataStr) : dataStr;
  } catch (error) {
    console.warn('JSON解析失败:', error);
    return dataStr;
  }
};

// // 工具函数 - 解析预测信息
// const parsePredictMessage = (messageStr) => {
//   try {
//     const parsed = typeof messageStr === 'string' ? JSON.parse(messageStr) : messageStr;
//     return Array.isArray(parsed) ? parsed : [parsed];
//   } catch (error) {
//     return [messageStr || '无预测说明'];
//   }
// };


const parsePredictMessage = (messageStr) => {
  if (!messageStr && messageStr !== 0 && messageStr !== false) {
    return ['无预测说明'];
  }

  try {
    const str = typeof messageStr === 'string' ? messageStr : String(messageStr);

    const parsed = JSON.parse(str);

    if (Array.isArray(parsed)) {
      return parsed;
    } else if (parsed === null || parsed === undefined) {
      return ['无预测说明'];
    } else {
      return [parsed];
    }
  } catch (error) {
    console.warn('预测信息解析失败:', error, '原始数据:', messageStr);
    return [messageStr.toString() || '无预测说明'];
  }
};


// 工具函数 - 格式化日期时间
const formatDateTime = (dateStr) => {
  if (!dateStr) return '未知时间';

  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      return dateStr;
    }
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  } catch (error) {
    console.error('重新检测错误:', error);
    return dateStr;
  }
};

// 监听搜索关键词变化
watch(searchQuery, () => {
  // 延迟搜索，避免输入时频繁请求
  const timer = setTimeout(() => {
    currentPage.value = 1;
    fetchDetectionData();
    clearTimeout(timer);
  }, 500);
});
</script>

<style scoped>
.detection-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f5f7fa;
}

/* 导航和标题样式复用之前的设计 */
.page-nav {
  background-color: #fff;
  border-bottom: 1px solid #e5e6eb;
  padding: 12px 0;
}

.nav-path {
  display: flex;
  align-items: center;
  color: #86909c;
  font-size: 14px;
}

.path-item {
  cursor: pointer;
  transition: color 0.2s;
}

.path-item:hover {
  color: #409eff;
}

.path-item.active {
  color: #1d2129;
  font-weight: 500;
}

.nav-path i {
  margin: 0 8px;
  font-size: 12px;
}

.page-header {
  padding: 30px 0;
  background: linear-gradient(135deg, #409eff 0%, #6aa8ff 100%);
  color: #fff;
}

.page-title {
  margin: 0 0 10px;
  font-size: 28px;
  font-weight: 600;
}

.page-desc {
  margin: 0;
  font-size: 16px;
  opacity: 0.9;
  max-width: 800px;
}

/* 主要内容区 */
.main-content {
  flex: 1;
  padding: 30px 0;
}

.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* 操作栏 */
.action-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.search-input {
  width: 300px;
}

.action-buttons {
  display: flex;
  gap: 10px;
}

/* 分页样式 */
.pagination {
  margin-top: 20px;
  text-align: right;
}

/* 空状态 */
.empty-state {
  margin: 50px 0;
  text-align: center;
}

/* 详情对话框样式 */
.detail-content {
  margin-top: 10px;
}

.detail-basic {
  margin-bottom: 20px;
}

.el-collapse {
  border: 1px solid #ebeef5;
}

.el-collapse-item__content {
  padding: 15px;
}

pre {
  background-color: #f5f7fa;
  padding: 15px;
  border-radius: 4px;
  overflow-x: auto;
  font-size: 14px;
  line-height: 1.5;
  margin: 0;
}

.prediction-message {
  margin-bottom: 8px;
  line-height: 1.5;
}

/* 表单提示 */
.form-hint {
  margin-top: 5px;
  font-size: 12px;
  color: #86909c;
  line-height: 1.5;
}

/* 页脚 */
.page-footer {
  background-color: #fff;
  border-top: 1px solid #e5e6eb;
  padding: 20px 0;
  margin-top: 50px;
}

.copyright {
  margin: 0;
  text-align: center;
  color: #86909c;
  font-size: 14px;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .action-bar {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .search-input {
    width: 100%;
  }

  .action-buttons {
    width: 100%;
    justify-content: flex-end;
  }

  .page-title {
    font-size: 24px;
  }
}
</style>
