<template>
  <div class="sample-detail-page">
    <div class="detail-header">
      <el-button type="text" @click="handleClose">
        <el-icon>
          <ArrowLeft />
        </el-icon>
        返回样品数据
      </el-button>
    </div>

    <!-- <el-card class="detail-card" v-if="sample"> -->
    <el-card class="detail-card" v-if="sample && userMap.size > 0">
      <!-- <el-descriptions title="样品详情" :column="3" border /> -->
      <el-descriptions title="样品详情" :column="4" :style="blockMargin">
        <el-descriptions-item label="样品ID">{{ sample.sample_id }}</el-descriptions-item>

        <el-descriptions-item label="样品名称">{{ sample.sample_name }}</el-descriptions-item>

        <el-descriptions-item label="用户名">{{ userMap.get(sample.user_id) || '-' }}</el-descriptions-item>

        <el-descriptions-item label="采样地点">{{ sample.location || '-' }}</el-descriptions-item>

        <el-descriptions-item label="采样时间">{{ formatTime(sample.detect_time) }}</el-descriptions-item>

        <el-descriptions-item label="检测状态">
          <el-tag :type="sample.is_processed ? 'success' : 'info'">
            {{ sample.is_processed ? '已检测' : '未检测' }}
          </el-tag>
        </el-descriptions-item>

        <el-descriptions-item label="检测结果">{{ sample.predict_data || '-' }}</el-descriptions-item>

        <el-descriptions-item label="检测时间">{{ formatTime(sample.processed_time) || '-' }}</el-descriptions-item>

      </el-descriptions>


      <el-card shadow="never">
        <div class="detail-item two-columns">
          <div class="column table-column">
            <SampleDataTable :sample-data="normalizedSampleData" :max-height="600" empty-text="暂无数据" />
          </div>
          <div class="column chart-column">
            <div class="chart-wrapper">
              <SpectrumChart :sampleData="sample.sample_data" />
            </div>
          </div>
        </div>
      </el-card>
    </el-card>

    <div v-else-if="!sample || userMap.size === 0" class="loading-tip">加载中...</div>
    <div class="empty-tip" v-else>未找到对应样品数据</div>
  </div>
</template>


<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ArrowLeft } from '@element-plus/icons-vue';
import formatTime from '@/components/FormatTime';
import { getSampleList } from './Sample/api';
import SpectrumChart from './SpectrumChart.vue';
import SampleDataTable from './Sample/SampleDataTable.vue';




const route = useRoute();
const router = useRouter();
const sample = ref(null);


const emit = defineEmits(['closeCurrentTab']);
const handleClose = () => {
  // router.back();
  emit('closeCurrentTab', route.fullPath);
  router.push('/samples');
};

const loading = ref(true);


import { getUserList } from './user/user_api';

const userList = ref([]);
const userMap = computed(() => {
  const map = new Map();
  userList.value.forEach(user => {
    map.set(user.user_id, user.user_name);
  });
  return map;
});


const fetchUserData = async () => {
  try {
    const response = await getUserList({ page: 1, size: 1000 });
    if (response.data.success) {
      userList.value = response.data.data;
    }
  } catch (error) {
    console.error('获取用户列表失败：', error);
  }
};


const fetchSampleData = async () => {
  const sampleId = route.params.sampleId;
  let cachedSampleList = route.meta.sampleList || [];

  if (cachedSampleList.length === 0) {
    const response = await getSampleList({ page: 1, per_page: 1000 });
    if (response.data.success) {
      cachedSampleList = response.data.data;
    }
  }

  sample.value = cachedSampleList.find(item =>
    String(item.sample_id) === String(sampleId)
  );
};


onMounted(async () => {
  loading.value = true;
  await fetchUserData();
  await fetchSampleData();
});


const normalizedSampleData = computed(() => {
  const rawData = sample.value?.sample_data;
  if (!rawData) return [];

  if (typeof rawData === 'object' && !Array.isArray(rawData) && 'new_sample' in rawData) {
    return Array.isArray(rawData.new_sample) ? rawData.new_sample : [];
  }

  if (Array.isArray(rawData)) {
    return rawData;
  }

  return [];
});

</script>


<style scoped>
.sample-detail-page {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: calc(100vh - 64px);
}

.detail-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
}

.detail-card {
  background: #fff;
  padding: 20px;
}

.detail-item {
  display: flex;
  align-items: center;
}

.label {
  width: 120px;
  font-weight: 500;
  color: #606266;
}

.value {
  flex: 1;
  color: #303133;
}

.two-columns {
  display: flex;
  gap: 10px;
  align-items: flex-start;
}

.column {
  flex: 1;
  width: 0;
}

.chart-column {
  flex: 8;
}

.table-column {
  flex: 2;
}

.column .label {
  display: block;
  margin-bottom: 8px;
  width: auto;
}


.chart-wrapper {
  width: 100%;
}


.loading-tip {
  text-align: center;
  padding: 20px;
  color: #666;
}

.empty-tip {
  text-align: center;
  padding: 20px;
  color: #999;
}

@media (max-width: 1024px) {
  .two-columns {
    flex-direction: column;
  }

  .column {
    width: 100%;
    margin-bottom: 16px;
  }

  .chart-wrapper {
    height: 400px;
  }
}
</style>
