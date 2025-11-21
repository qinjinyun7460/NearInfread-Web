<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <!-- 顶部导航栏 -->
    <el-container>

      <el-main class="flex-1 container mx-auto px-4 py-6">
        <AddSampleForm @sampleAdded="fetchSamples" @detectSample="handleDetectSample" class="mb-6" />

        <!-- <SampleList @detectSample="handleDetectSample" :samples="samples" :pagination="pagination" :loading="loading"
          @pageChange="handlePageChange" @sizeChange="handleSizeChange" /> -->
      </el-main>

    </el-container>

    <el-loading v-if="globalLoading" text="处理中，请稍候..." background="rgba(255, 255, 255, 0.7)" fullscreen></el-loading>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { ElMessage } from 'element-plus';
import AddSampleForm from '@/components/Auth/AddSampleForm.vue';
// import SampleList from '@/components/Auth/SampleList.vue';

// API配置
const API_BASE = 'http://127.0.0.1:5000';

// 状态管理
const samples = ref([]);
const loading = ref(false);
const globalLoading = ref(false); // 全局加载状态
const pagination = ref({
  currentPage: 1,
  perPage: 20,
  total: 0
});
const searchParams = ref({
  sampleName: '',
  isProcessed: ''
});

// 初始化加载数据
onMounted(() => {
  fetchSamples();
});

// 获取样品列表
const fetchSamples = async () => {
  try {
    loading.value = true;
    const params = {
      page: pagination.value.currentPage,
      per_page: pagination.value.perPage,
      sample_name: searchParams.value.sampleName,
      is_processed: searchParams.value.isProcessed
    };

    const response = await axios.get(`${API_BASE}/api/view_samples`, { params });
    if (response.data.success) {
      samples.value = response.data.data;
      pagination.value.total = response.data.pagination.total;
    } else {
      ElMessage.error('获取数据失败: ' + response.data.message);
    }
  } catch (error) {
    console.error('获取样品列表失败:', error);
    ElMessage.error('服务器错误，无法加载数据');
  } finally {
    loading.value = false;
  }
};

// // 处理分页变化
// const handlePageChange = (page) => {
//   pagination.value.currentPage = page;
//   fetchSamples();
// };

// // 处理每页条数变化
// const handleSizeChange = (size) => {
//   pagination.value.perPage = size;
//   pagination.value.currentPage = 1; // 重置到第一页
//   fetchSamples();
// };

// 处理样品检测
const handleDetectSample = async (sampleId, modelType) => {
  try {
    globalLoading.value = true;
    const response = await axios.post(`${API_BASE}/api/detect_sample`, {
      sample_id: sampleId,
      model_type: modelType
    });

    if (response.data.success) {
      ElMessage.success(response.data.message);
      fetchSamples(); // 重新加载数据
    } else {
      ElMessage.error('检测失败: ' + response.data.message);
    }
  } catch (error) {
    console.error('检测样品失败:', error);
    ElMessage.error('服务器错误，检测失败');
  } finally {
    globalLoading.value = false;
  }
};
</script>


<style scoped>
.el-header {
  padding: 0 20px;
  height: 60px;
  line-height: 60px;
}

.el-main {
  padding: 20px;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
}

.el-footer {
  padding: 10px 0;
  height: auto;
}

:deep(.el-loading-spinner) {
  top: 40%;
}
</style>
