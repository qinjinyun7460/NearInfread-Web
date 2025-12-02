<template>
  <el-card class="welcome-card">
    <h1 class="welcome-title">欢迎来到该系统，{{ userInfo.user_name }}！</h1>
    <p class="welcome-desc">这里是系统首页，可快速查看数据统计</p>
  </el-card>
  <el-card class="features-section" shadow="never">
    <h2 class="section-title">数据统计</h2>
    <div class="dashboard-screen">
      <el-header class="screen-header">
        <div class="header-left">
          <span>数据更新时间：{{ lastUpdateTime }}</span>
        </div>
        <div class="header-right">
          <el-select v-model="dateRangeType" @change="fetchDashboardDataTotal" size="small" class="date-range-select">
            <el-option label="今日" value="today" />
            <el-option label="本周" value="week" />
            <el-option label="本月" value="month" />
            <el-option label="全年" value="year" />
          </el-select>
          <el-button @click="refreshData" icon="Refresh" size="small">刷新</el-button>
        </div>
      </el-header>
      <el-main class="screen-content">

        <div class="row row-1">
          <div class="card">
            <span class="card-title">{{ getPeriodText(dateRangeType) }}新增样品数量</span>
            <div class="card-body">
              <div class="stat-value">{{ stats_total.newSamples }}</div>
            </div>
          </div>
          <div class="card">
            <span class="card-title">{{ getPeriodText(dateRangeType) }}检测新增样品数量</span>
            <div class="card-body">
              <div class="stat-value">{{ stats_total.processedSamples }}</div>
            </div>
          </div>
          <div class="card">
            <span class="card-title">{{ getPeriodText(dateRangeType) }}检测次数</span>
            <div class="card-body">
              <div class="stat-value">{{ stats_total.currentProcessedCount }}</div>
            </div>
          </div>
          <div class="card">
            <span class="card-title">{{ getPeriodText(dateRangeType) }}新样品检测率</span>
            <div class="card-body">
              <div class="stat-value">{{ stats_total.processRate }}%</div>
            </div>
          </div>
        </div>

        <div class="row row-line">
          <div class="card chart-card">
            <span class="card-title">样品新增趋势</span>
            <div class="card-body">
              <div ref="sampleTrendChart" class="chart-container"></div>
            </div>
          </div>

          <div class="card chart-card ratio-chart-card">
            <span class="card-title">新增样品占比</span>
            <div class="card-body">
              <div ref="ratioChart" class="chart-container"></div>
              <div class="ratio-data">
                <div class="ratio-percentage blue">{{ getRatioPercentage() }}%</div>
                <div class="ratio-details">
                  <span>新增: {{ stats_total.newSamples }}</span>
                  <span>总计: {{ stats_total.totalSamples }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="card chart-card">
            <span class="card-title">检测完成趋势</span>
            <div class="card-body">
              <div ref="detectTrendChart" class="chart-container"></div>
            </div>
          </div>

          <div class="card chart-card ratio-chart-card">
            <span class="card-title">当前检测次数占比</span>
            <div class="card-body">
              <div ref="processedCountChart" class="chart-container"></div>
              <div class="ratio-data">
                <div class="ratio-percentage green">{{ getProcessedCountPercentage() }}%</div>
                <div class="ratio-details">
                  <span>当前检测次数: {{ stats_total.currentProcessedCount }}</span>
                  <span>总计: {{ stats_total.totalProcessed }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="row row-pie">
          <div class="card chart-card">
            <span class="card-title">样品检测状态分布</span>
            <div class="card-body">
              <div ref="statusChart" class="chart-container"></div>
            </div>
          </div>
          <div class="card chart-card">
            <span class="card-title">采样地点分布</span>
            <div class="card-body">
              <div ref="locationChart" class="chart-container"></div>
            </div>
          </div>
        </div>

      </el-main>
    </div>
  </el-card>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted, watch } from 'vue';
import { ElMessage } from 'element-plus';
import * as echarts from 'echarts';
import request from '@/utils/request';
import { getSampleTrendOption, getDetectTrendOption, getStatusOption, getLocationOption } from '@/components/Auth/Diagram/AllCharts';
import { useRouter } from 'vue-router';
import { getUserInfo } from '@/utils/storage';

const router = useRouter();
const userInfo = ref({});

onMounted(() => {
  const storedUser = getUserInfo();
  if (storedUser) {
    userInfo.value = storedUser;
  } else {
    ElMessage.warning('请先登录');
    router.push('/login');
  }
});

// 日期范围选择
const dateRangeType = ref('week');
const getPeriodText = (type) => {
  const periodMap = {
    'today': '今日',
    'week': '本周',
    'month': '本月',
    'year': '全年'
  };
  return periodMap[type] || '今日';
};

// 统计数据
const stats_total = reactive({
  totalSamples: 0,
  totalProcessed: 0,
  newSamples: 0,
  processedSamples: 0,
  currentProcessedCount: 0,
  processRate: 0,
  sampleTrend: 0,
  processedTrend: 0,
  processRateTrend: 0,
  locationResult: 0
});

// 时间相关
const currentDate = ref('');
const currentTime = ref('');
const lastUpdateTime = ref('');

// 图表引用
const sampleTrendChart = ref(null);
const detectTrendChart = ref(null);
const statusChart = ref(null);
const locationChart = ref(null);
const ratioChart = ref(null);
const processedCountChart = ref(null)

// 图表实例
let sampleTrendInstance = null;
let detectTrendInstance = null;
let statusInstance = null;
let locationInstance = null;
let efficiencyInstance = null;
let ratioChartInstance = null;
let ProcessedCountChartInstance = null;

// 更新时间显示
const updateTimeDisplay = () => {
  const now = new Date();
  currentDate.value = now.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  });
  currentTime.value = now.toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
};

const fetchDashboardDataTotal = async () => {
  try {
    const params = { range_type: dateRangeType.value };

    const response = await request.get('/api/dashboard/stats_total', { params });

    if (response.data.success) {
      const { summary, charts } = response.data.data;

      Object.assign(stats_total, summary);// 更新统计数据

      updateCharts(charts);

      const now = new Date();
      lastUpdateTime.value = now.toLocaleString('zh-CN');

    }
  } catch (error) {
    console.error('获取仪表盘数据失败:', error);
    ElMessage.error('获取数据失败，请刷新重试');
  }
};

const initCharts = () => {
  // 样品增长趋势图
  if (sampleTrendChart.value) {
    sampleTrendInstance = echarts.init(sampleTrendChart.value);
    sampleTrendInstance.setOption(getSampleTrendOption([]));
  }

  // 检测完成趋势图
  if (detectTrendChart.value) {
    detectTrendInstance = echarts.init(detectTrendChart.value);
    detectTrendInstance.setOption(getDetectTrendOption([]));
  }

  // 样品状态分布图
  if (statusChart.value) {
    statusInstance = echarts.init(statusChart.value);
    statusInstance.setOption(getStatusOption([]));
  }

  // 地点分布图
  if (locationChart.value) {
    locationInstance = echarts.init(locationChart.value);
    locationInstance.setOption(getLocationOption([]));
  }
};

const updateCharts = (chartData) => {
  if (sampleTrendInstance && chartData?.sampleTrend) {
    sampleTrendInstance.setOption(getSampleTrendOption(chartData.sampleTrend));
  }

  if (detectTrendInstance && chartData?.detectTrend) {
    detectTrendInstance.setOption(getDetectTrendOption(chartData.detectTrend));
  }

  if (statusInstance && chartData?.sampleStatus) {
    statusInstance.setOption(getStatusOption(chartData.sampleStatus));
  }

  if (locationInstance && chartData?.locationResult) {
    locationInstance.setOption(getLocationOption(chartData.locationResult))
  }
};

const refreshData = () => {
  fetchDashboardDataTotal();
  ElMessage.success('数据已刷新');
};

const handleResize = () => {
  if (sampleTrendInstance) sampleTrendInstance.resize();
  if (detectTrendInstance) detectTrendInstance.resize();
  if (statusInstance) statusInstance.resize();
  if (locationInstance) locationInstance.resize();
  if (efficiencyInstance) efficiencyInstance.resize();
  if (ratioChartInstance) ratioChartInstance.resize();
};

onMounted(() => {
  updateTimeDisplay();
  setInterval(updateTimeDisplay, 1000);

  initCharts();

  fetchDashboardDataTotal();

  setInterval(refreshData, 300000);

  window.addEventListener('resize', handleResize);

  initRatioChart();
  window.addEventListener('resize', () => {
    if (ratioChartInstance) {
      ratioChartInstance.resize();
    }
  });
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);

  if (sampleTrendInstance) sampleTrendInstance.dispose();
  if (detectTrendInstance) detectTrendInstance.dispose();
  if (statusInstance) statusInstance.dispose();
  if (locationInstance) locationInstance.dispose();
  if (efficiencyInstance) efficiencyInstance.dispose();
  if (ratioChartInstance) ratioChartInstance.dispose();
});

watch(dateRangeType, () => {
  fetchDashboardDataTotal();
});

// 计算新增样品占比百分比
const getProportion = (partial, total) => {
  if (!total || !partial) return '0.00';
  const percentage = (partial / total) * 100;
  return percentage.toFixed(2);
};
const getRatioPercentage = () => getProportion(stats_total.newSamples, stats_total.totalSamples);
const getProcessedCountPercentage = () => getProportion(stats_total.currentProcessedCount, stats_total.totalProcessed);


// 初始化环状图
const initRatioChart = () => {
  if (ratioChart.value) {
    ratioChartInstance = echarts.init(ratioChart.value);
    updateRatioChart();
  }
  if (processedCountChart.value) {
    ProcessedCountChartInstance = echarts.init(processedCountChart.value);
    updateProcessedCountChart();

  }
};

// 更新环状图数据
const updateRatioChart = () => {
  const newSamples = stats_total.newSamples || 0;
  const existingSamples = Math.max(0, (stats_total.totalSamples || 0) - newSamples);

  const option = {
    backgroundColor: 'transparent',
    legend: {
      orient: 'vertical',
      top: '10%',
      left: '10%',
      textStyle: {
        fontSize: 12
      },
      itemWidth: 10,
      itemHeight: 10
    },
    series: [
      {
        type: 'pie',
        radius: ['60%', '80%'],
        center: ['50%', '50%'],
        silent: true,
        label: {
          show: false
        },
        labelLine: {
          show: false
        },
        data: [
          {
            value: newSamples,
            name: '新增样品',
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#409EFF' },
                { offset: 1, color: '#66B1FF' }
              ]),
              borderRadius: 4
            }
          },
          {
            value: existingSamples,
            name: '原有样品',
            itemStyle: {
              color: '#ccc',
              borderRadius: 4
            }
          }
        ],
        animationDuration: 1000,
        animationEasing: 'cubicOut'
      }
    ]
  };

  ratioChartInstance.setOption(option);
};

const updateProcessedCountChart = () => {
  const currentProcessed = stats_total.currentProcessedCount || 0;
  const existingCurrentProcessed = Math.max(0, (stats_total.totalProcessed || 0) - currentProcessed);

  const option = {
    backgroundColor: 'transparent',
    legend: {
      orient: 'vertical',
      top: '10%',
      left: '10%',
      textStyle: {
        fontSize: 12
      },
      itemWidth: 10,
      itemHeight: 10
    },
    series: [
      {
        type: 'pie',
        radius: ['60%', '80%'],
        center: ['50%', '50%'],
        silent: true,
        label: {
          show: false
        },
        labelLine: {
          show: false
        },
        data: [
          {
            value: currentProcessed,
            name: '当前检测次数',
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                { offset: 0, color: '#67C23A' },
                { offset: 1, color: '#85CE61' }
              ]),
              borderRadius: 4
            }
          },
          {
            value: existingCurrentProcessed,
            name: '其余检测次数',
            itemStyle: {
              color: '#ccc',
              borderRadius: 4
            }
          }
        ],
        animationDuration: 1000,
        animationEasing: 'cubicOut'
      }
    ]
  };

  ProcessedCountChartInstance.setOption(option);
};

// 监听数据变化更新图表
watch([() => stats_total.newSamples, () => stats_total.totalSamples], () => {
  if (ratioChartInstance) {
    updateRatioChart();
  }
});

watch([() => stats_total.currentProcessedCount, () => stats_total.totalProcessed], () => {
  if (ProcessedCountChartInstance) {
    updateProcessedCountChart();
  }
})

</script>

<style scoped>
.ratio-chart-card {
  position: relative;
}

.ratio-chart-card .card-body {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ratio-chart-card .chart-container {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}

.ratio-data {
  position: relative;
  z-index: 1;
  text-align: center;
}

.ratio-percentage {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 8px;
}

.blue {
  color: #409EFF;
}

.green {
  color: #67C23A;
}

.ratio-details {
  font-size: 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}


.welcome-card {
  background: linear-gradient(135deg, #409eff 0%, #66b1ff 100%);
  color: #fff;
  padding: 40px 0;
  text-align: center;
}

.welcome-title {
  font-size: 42px;
  font-weight: 600;
  margin-bottom: 16px;
}

.welcome-desc {
  font-size: 18px;
  margin-bottom: 16px;
}

.features-section {
  height: 100%;
  padding: 20px 0;
  background-color: #fff;
}

.section-title {
  font-size: 28px;
  font-weight: 600;
  color: #1d2129;
  text-align: center;
  margin-bottom: 20px;
  position: relative;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: -15px;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 3px;
  background-color: #409eff;
  border-radius: 3px;
}

.date-range-select {
  min-width: 60px;
}

.dashboard-screen {
  width: 100%;
  height: 100vh;
  /* height: 100%; */
  background: #fff;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.screen-header {
  padding: 10px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-left {
  display: flex;
  gap: 20px;
  margin-top: 5px;
  color: #474646;
  font-size: 14px;
}

.header-right {
  display: flex;
  gap: 10px;
}

.screen-content {
  flex: 1;
  padding: 10px 20px;
  overflow-y: auto;
}

.row {
  display: flex;
  gap: 20px;
  padding: 10px;
  height: calc(25% - 15px);
}

.row-1 {
  height: 18%;
}

.row-line {
  height: 35%;
}

.row-pie {
  height: calc(40% - 15px);
}

.card {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  position: relative;
  min-width: 200px;
}

.card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.card-title {
  padding: 12px 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 16px;
  font-weight: 600;
  color: #474646;
}

.card-body {
  flex: 1;
  padding: 15px;
  overflow: hidden;
}

.stat-value {
  font-size: 42px;
  font-weight: bold;
  text-align: center;
}


.chart-card {
  flex: 1;
}

.chart-container {
  width: 100%;
  height: 100%;
}

@media (max-width: 1600px) {
  .stat-value {
    font-size: 36px;
  }
}

@media (max-width: 1200px) {
  .row {
    flex-direction: column;
    height: auto !important;
  }

  .stat-value {
    font-size: 32px;
  }
}
</style>