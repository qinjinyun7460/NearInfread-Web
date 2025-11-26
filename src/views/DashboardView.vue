<template>
  <el-card class="welcome-section">
    <div class="container">
      <h1 class="welcome-title">欢迎来到该系统，{{ userInfo.user_name }}！</h1>
      <p class="welcome-desc">
        这里是系统首页，可快速进入功能模块、查看数据统计
      </p>
    </div>
  </el-card>

  <el-card class="features-section">
    <div class="container">
      <h2 class="section-title">功能模块</h2>
      <div class="features-grid">

        <div class="feature-card" @click="$router.push('/user_manage/list')">
          <div class="card-icon green">
            <i class="el-icon-user-group"></i>
          </div>
          <h3 class="card-title">用户管理</h3>
          <p class="card-desc">管理系统用户信息，分配角色与权限</p>
          <a href="#" class="card-link">查看详情 →</a>
        </div>

        <div class="feature-card" @click="$router.push('/user_manage/loginlogs')">
          <div class="card-icon blue">
            <i class="el-icon-user-group"></i>
          </div>
          <h3 class="card-title">登录日志</h3>
          <p class="card-desc">浏览登录日志,登录数据</p>
          <a href="#" class="card-link">查看详情 →</a>
        </div>

        <div class="feature-card" @click="$router.push('/samples')">
          <div class="card-icon orange">
            <i class="el-icon-s-order"></i>
          </div>
          <h3 class="card-title">样品数据</h3>
          <p class="card-desc">查看样品数据，对样品进行检测</p>
          <a href="#" class="card-link">查看详情 →</a>
        </div>

      </div>
    </div>
  </el-card>

  <div class="dashboard-screen">
    <header class="screen-header">
      <div class="header-left">
        <div class="time-info">
          <span>数据更新时间：{{ lastUpdateTime }}</span>
        </div>

      </div>
      <div class="header-right">
        <el-select v-model="dateRangeType" @change="fetchDashboardData" size="small">
          <el-option label="今日" value="today" />
          <el-option label="本周" value="week" />
          <el-option label="本月" value="month" />
          <el-option label="全年" value="year" />
        </el-select>
        <el-button @click="refreshData" icon="Refresh" size="small">刷新</el-button>
      </div>
    </header>

    <main class="screen-content">
      <!-- <div class="row row-1">
        <div class="card stat-card total-samples">
          <div class="card-header">
            <span class="card-title"> {{ getPeriodText(dateRangeType) }}新增样品总数</span>
          </div>
          <div class="card-body">
            <div class="stat-value">{{ stats.totalSamples }}</div>
          </div>
        </div>

        <div class="card stat-card processed-samples">
          <div class="card-header">
            <span class="card-title"> {{ getPeriodText(dateRangeType) }}已检测新样品数量</span>
          </div>
          <div class="card-body">
            <div class="stat-value">{{ stats.processedSamples }}</div>
          </div>
        </div>

        <div class="card stat-card process-rate">
          <div class="card-header">
            <span class="card-title"> {{ getPeriodText(dateRangeType) }}新样品检测率</span>

          </div>
          <div class="card-body">
            <div class="stat-value">{{ stats.processRate }}%</div>
          </div>
        </div>

      </div> -->

      <div class="row row-1">

        <div class="card stat-card">
          <div class="card-header">
            <span class="card-title">{{ getPeriodText(dateRangeType) }}新增样品数量</span>
          </div>
          <div class="card-body">
            <div class="stat-value">{{ stats_total.newSamples }}</div>
            <div class="stat-trend">
              {{ (stats_total.newSamples / stats_total.totalSamples * 100).toFixed(2) }}%
            </div>
            <div class="stat-trend" :class="stats_total.sampleTrend >= 0 ? 'positive' : 'negative'">
              {{ stats_total.sampleTrend >= 0 ? '+' : '' }}{{ stats_total.sampleTrend }}%
              <span class="trend-label">环比</span>
            </div>
          </div>
        </div>
        <div class="card stat-card">
          <div class="card-header">
            <span class="card-title">{{ getPeriodText(dateRangeType) }}检测新增样品数量</span>
          </div>
          <div class="card-body">
            <div class="stat-value">{{ stats_total.processedSamples }}</div>
            <div class="stat-trend" :class="stats_total.sampleTrend >= 0 ? 'positive' : 'negative'">
              {{ stats_total.sampleTrend >= 0 ? '+' : '' }}{{ stats_total.sampleTrend }}%
              <span class="trend-label">环比</span>
            </div>
          </div>
        </div>
        <div class="card stat-card">
          <div class="card-header">
            <span class="card-title">{{ getPeriodText(dateRangeType) }}检测次数</span>
          </div>
          <div class="card-body">
            <div class="stat-value">{{ stats_total.currentProcessedCount }}</div>
          </div>
        </div>
        <div class="card stat-card">
          <div class="card-header">
            <span class="card-title">新样品检测率</span>

          </div>
          <div class="card-body">
            <div class="stat-value">{{ stats_total.processRate }}%</div>
          </div>
        </div>

      </div>

      <div class="row row-1">

        <div class="card stat-card">
          <div class="card-header">
            <span class="card-title">全部样品数量</span>
          </div>
          <div class="card-body">
            <div class="stat-value">{{ stats_total.totalSamples }}</div>
          </div>
        </div>

        <div class="card stat-card">
          <div class="card-header">
            <span class="card-title">累计检测总次数</span>
          </div>
          <div class="card-body">
            <div class="stat-value">{{ stats_total.totalProcessed }}</div>
          </div>
        </div>


      </div>

      <div class="row row-2">
        <div class="card chart-card sample-trend">
          <div class="card-header">
            <span class="card-title">样品增长趋势</span>
          </div>
          <div class="card-body">
            <div ref="sampleTrendChart" class="chart-container"></div>
          </div>
        </div>

        <div class="card chart-card detect-trend">
          <div class="card-header">
            <span class="card-title">检测完成趋势</span>
          </div>
          <div class="card-body">
            <div ref="detectTrendChart" class="chart-container"></div>
          </div>
        </div>
      </div>

      <div class="row row-3">
        <div class="card chart-card status-distribution">
          <div class="card-header">
            <span class="card-title">样品状态分布</span>
          </div>
          <div class="card-body">
            <div ref="statusChart" class="chart-container"></div>
          </div>
        </div>
        <div class="card chart-card location-distribution">
          <div class="card-header">
            <span class="card-title">采样地点分布</span>
          </div>
          <div class="card-body">
            <div ref="locationChart" class="chart-container"></div>
          </div>
        </div>
      </div>

      <!-- <div class="row row-1">

        <div class="card stat-card">
          <div class="card-header">
            <span class="card-title">{{ getPeriodText(dateRangeType) }}新增样品数量</span>
          </div>
          <div class="card-body">
            <div class="stat-value">{{ stats_total.newSamples }}</div>
            <div class="stat-trend">
              {{ (stats_total.newSamples / stats_total.totalSamples * 100).toFixed(2) }}%
            </div>
            <div class="stat-trend" :class="stats_total.sampleTrend >= 0 ? 'positive' : 'negative'">
              {{ stats_total.sampleTrend >= 0 ? '+' : '' }}{{ stats_total.sampleTrend }}%
              <span class="trend-label">环比</span>
            </div>
          </div>
        </div>
        <div class="card stat-card">
          <div class="card-header">
            <span class="card-title">{{ getPeriodText(dateRangeType) }}检测新增样品数量</span>
          </div>
          <div class="card-body">
            <div class="stat-value">{{ stats_total.processedSamples }}</div>
            <div class="stat-trend" :class="stats_total.sampleTrend >= 0 ? 'positive' : 'negative'">
              {{ stats_total.sampleTrend >= 0 ? '+' : '' }}{{ stats_total.sampleTrend }}%
              <span class="trend-label">环比</span>
            </div>
          </div>
        </div>
        <div class="card stat-card">
          <div class="card-header">
            <span class="card-title">{{ getPeriodText(dateRangeType) }}检测次数</span>
          </div>
          <div class="card-body">
            <div class="stat-value">{{ stats_total.currentProcessedCount }}</div>
          </div>
        </div>
        <div class="card stat-card">
          <div class="card-header">
            <span class="card-title">新样品检测率</span>

          </div>
          <div class="card-body">
            <div class="stat-value">{{ stats_total.processRate }}%</div>
          </div>
        </div>

      </div>

      <div class="row row-1">

        <div class="card stat-card">
          <div class="card-header">
            <span class="card-title">全部样品数量</span>
          </div>
          <div class="card-body">
            <div class="stat-value">{{ stats_total.totalSamples }}</div>
          </div>
        </div>

        <div class="card stat-card">
          <div class="card-header">
            <span class="card-title">累计检测总次数</span>
          </div>
          <div class="card-body">
            <div class="stat-value">{{ stats_total.totalProcessed }}</div>
          </div>
        </div>


      </div> -->

    </main>

  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted, watch } from 'vue';
import { ElMessage } from 'element-plus';
import * as echarts from 'echarts';
import request from '@/utils/request';

import { useRouter, useRoute } from 'vue-router';
import { getUserInfo } from '@/utils/storage';

const router = useRouter();
const userInfo = ref({});
const route = useRoute()
const currentRoute = ref('')

onMounted(() => {
  const storedUser = getUserInfo();
  if (storedUser) {
    userInfo.value = storedUser;
  } else {
    ElMessage.warning('请先登录');
    router.push('/login');
  }
});

watch(
  () => route.path,
  (newPath) => {
    currentRoute.value = newPath
  },
  { immediate: true }
)


// 日期范围选择
const dateRangeType = ref('today');

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
const stats = reactive({
  totalSamples: 0,
  processedSamples: 0,
  processRate: 0,
  sampleTrend: 0,
  processedTrend: 0,
  processRateTrend: 0
});

const stats_total = reactive({
  totalSamples: 0,
  totalProcessed: 0,
  newSamples: 0,
  processedSamples: 0,
  currentProcessedCount: 0,
  processRate: 0,
  sampleTrend: 0,
  processedTrend: 0,
  processRateTrend: 0
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

// 图表实例
let sampleTrendInstance = null;
let detectTrendInstance = null;
let statusInstance = null;
let locationInstance = null;
let efficiencyInstance = null;

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

// 获取仪表盘数据
const fetchDashboardData = async () => {
  try {
    const params = { range_type: dateRangeType.value };

    const response = await request.get('/api/dashboard/stats', { params });

    if (response.data.success) {
      const { summary, charts } = response.data.data;

      // 更新统计数据
      Object.assign(stats, summary);

      // 更新图表
      updateCharts(charts);

      // 更新最后更新时间
      const now = new Date();
      lastUpdateTime.value = now.toLocaleString('zh-CN');

    }
  } catch (error) {
    console.error('获取仪表盘数据失败:', error);
    ElMessage.error('获取数据失败，请刷新重试');
  }
};


// 获取仪表盘数据整体
const fetchDashboardDataTotal = async () => {
  try {
    const params = { range_type: dateRangeType.value };

    const response = await request.get('/api/dashboard/stats_total', { params });

    if (response.data.success) {
      const { summary, charts } = response.data.data;

      // 更新统计数据
      Object.assign(stats_total, summary);

      // 更新图表
      updateCharts(charts);

      // 更新最后更新时间
      const now = new Date();
      lastUpdateTime.value = now.toLocaleString('zh-CN');

    }
  } catch (error) {
    console.error('获取仪表盘数据失败:', error);
    ElMessage.error('获取数据失败，请刷新重试');
  }
};


// 获取采样地点分布数据
const fetchLocationData = async () => {
  try {
    const response = await request.get('/api/samples/location-distribution', {
      params: { range_type: dateRangeType.value }
    });

    if (response.data.success) {
      updateLocationChart(response.data.data);
    }
  } catch (error) {
    console.error('获取地点分布数据失败:', error);
  }
};

// 初始化图表
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

// 更新图表数据
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
};

// 更新地点图表
const updateLocationChart = (data) => {
  if (locationInstance) {
    locationInstance.setOption(getLocationOption(data));
  }
};

// 样品增长趋势图表配置
const getSampleTrendOption = (data) => ({
  backgroundColor: 'transparent',
  tooltip: {
    trigger: 'axis',
    textStyle: { fontSize: 12 },
    formatter: '{b}<br/>新增样品: {c}'
  },
  grid: {
    left: '5%',
    right: '5%',
    bottom: '10%',
    top: '5%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    data: data.map(item => item.date),
    axisLabel: {
      fontSize: 11
    }
  },
  yAxis: {
    type: 'value',
    min: 0,
    axisLine: { show: false },
    axisLabel: {
      fontSize: 11
    },
  },
  series: [
    {
      data: data.map(item => item.count),
      type: 'line',
      smooth: true,
      symbol: 'circle',
      symbolSize: 6,
      lineStyle: {
        width: 3,
        color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
          { offset: 0, color: '#409EFF' },
          { offset: 1, color: '#66B1FF' }
        ])
      },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: 'rgba(64, 158, 255, 0.3)' },
          { offset: 1, color: 'rgba(64, 158, 255, 0.05)' }
        ])
      },
      itemStyle: {
        color: '#409EFF',
        borderColor: '#fff',
        borderWidth: 1
      },
      emphasis: {
        symbolSize: 10
      }
    }
  ]
});

// 检测完成趋势图表配置
const getDetectTrendOption = (data) => ({
  backgroundColor: 'transparent',
  tooltip: {
    trigger: 'axis',
    textStyle: { fontSize: 12 },
    formatter: '{b}<br/>完成检测: {c}'
  },
  grid: {
    left: '5%',
    right: '5%',
    bottom: '10%',
    top: '5%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    data: data.map(item => item.date),
    axisLabel: {
      fontSize: 11
    }
  },
  yAxis: {
    type: 'value',
    min: 0,
    axisLine: { show: false },
    axisLabel: {
      fontSize: 11
    },
  },
  series: [
    {
      data: data.map(item => item.count),
      type: 'line',
      smooth: true,
      symbol: 'circle',
      symbolSize: 6,
      lineStyle: {
        width: 3,
        color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
          { offset: 0, color: '#67C23A' },
          { offset: 1, color: '#85CE61' }
        ])
      },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: 'rgba(103, 194, 58, 0.3)' },
          { offset: 1, color: 'rgba(103, 194, 58, 0.05)' }
        ])
      },
      itemStyle: {
        color: '#67C23A',
        borderColor: '#fff',
        borderWidth: 1
      },
      emphasis: {
        symbolSize: 10
      }
    }
  ]
});

// 样品状态分布图表配置
const getStatusOption = (data) => ({
  backgroundColor: 'transparent',
  tooltip: {
    trigger: 'item',
    textStyle: { fontSize: 12 },
    formatter: '{b}: {c} ({d}%)'
  },
  legend: {
    orient: 'vertical',
    top: 'center',
    right: '10%',
    textStyle: {
      color: '#ccc',
      fontSize: 12
    }
  },
  series: [
    {
      name: '样品状态',
      type: 'pie',
      radius: ['30%', '70%'],
      center: ['35%', '50%'],
      data: data,
      label: {
        show: true,
        formatter: '{b}: {c}',
        color: '#fff',
        fontSize: 12
      },
      itemStyle: {
        borderRadius: 8,
        shadowBlur: 10,
        shadowColor: 'rgba(0,0,0,0.3)'
      },
      emphasis: {
        scale: true,
        scaleSize: 5
      }
    }
  ],
  color: [
    new echarts.graphic.LinearGradient(0, 0, 0, 1, [
      { offset: 0, color: '#67C23A' },
      { offset: 1, color: '#85CE61' }
    ]),
    new echarts.graphic.LinearGradient(0, 0, 0, 1, [
      { offset: 0, color: '#E6A23C' },
      { offset: 1, color: '#F0B862' }
    ])
  ]
});

// 地点分布图表配置
const getLocationOption = (data) => ({
  backgroundColor: 'transparent',
  tooltip: {
    trigger: 'item',
    textStyle: { fontSize: 12 },
    formatter: '{b}: {c} ({d}%)'
  },
  legend: {
    orient: 'horizontal',
    bottom: '0%',
    left: 'center',
    textStyle: {
      color: '#ccc',
      fontSize: 11
    },
    itemWidth: 10,
    itemHeight: 10
  },
  grid: {
    left: '5%',
    right: '5%',
    bottom: '15%',
    top: '5%',
    containLabel: true
  },
  series: [
    {
      type: 'pie',
      radius: ['0%', '70%'],
      center: ['50%', '40%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 8,
      },
      label: {
        show: true,
        position: 'outside',
        fontSize: 11,
        color: '#ccc',
        formatter: '{b}: {c}'
      },
      labelLine: {
        show: true,
        length: 15,
        length2: 10,
        lineStyle: {
          color: '#ccc',
          width: 1
        }
      },
      data: data.map((item, index) => {
        // 颜色映射
        const colors = [
          { color: ['#409EFF', '#66B1FF'] },
          { color: ['#9B87FE', '#B19FF9'] },
          { color: ['#F56C6C', '#F88888'] },
          { color: ['#E6A23C', '#F0B862'] },
          { color: ['#67C23A', '#85CE61'] },
          { color: ['#FF7D00', '#FF9E40'] },
          { color: ['#8C8C8C', '#A6A6A6'] },
          { color: ['#FF5C87', '#FF85A6'] }
        ];

        const colorPair = colors[index % colors.length];
        return {
          ...item,
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: colorPair.color[0] },
              { offset: 1, color: colorPair.color[1] }
            ])
          }
        };
      }),
      emphasis: {
        scale: true,
        scaleSize: 10,
        shadowBlur: 20
      },
      animationType: 'scale',
      animationEasing: 'elasticOut',
      animationDelay: (idx) => idx * 50
    }
  ]
});



// 刷新数据
const refreshData = () => {
  fetchDashboardData();
  fetchDashboardDataTotal();
  fetchLocationData();
  ElMessage.success('数据已刷新');
};

// 响应窗口大小变化
const handleResize = () => {
  if (sampleTrendInstance) sampleTrendInstance.resize();
  if (detectTrendInstance) detectTrendInstance.resize();
  if (statusInstance) statusInstance.resize();
  if (locationInstance) locationInstance.resize();
  if (efficiencyInstance) efficiencyInstance.resize();
};

// 初始化
onMounted(() => {
  // 更新时间显示
  updateTimeDisplay();
  setInterval(updateTimeDisplay, 1000);

  // 初始化图表
  initCharts();

  // 获取数据
  fetchDashboardData();
  fetchDashboardDataTotal();
  fetchLocationData();

  // 设置自动刷新（每5分钟）
  setInterval(refreshData, 300000);

  // 监听窗口大小变化
  window.addEventListener('resize', handleResize);
});

// 清理资源
onUnmounted(() => {
  window.removeEventListener('resize', handleResize);

  if (sampleTrendInstance) sampleTrendInstance.dispose();
  if (detectTrendInstance) detectTrendInstance.dispose();
  if (statusInstance) statusInstance.dispose();
  if (locationInstance) locationInstance.dispose();
  if (efficiencyInstance) efficiencyInstance.dispose();
});

// 监听日期范围变化
watch(dateRangeType, () => {
  fetchDashboardData();
  fetchDashboardDataTotal();
  fetchLocationData();
});
</script>

<style scoped>
.welcome-section {
  background: linear-gradient(135deg, #409eff 0%, #66b1ff 100%);
  color: #fff;
  padding: 80px 0;
  text-align: center;
}

.welcome-title {
  font-size: 42px;
  font-weight: 600;
  margin-bottom: 16px;
}

.welcome-desc {
  font-size: 18px;
  opacity: 0.9;
  margin-bottom: 32px;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
}

.primary-btn {
  background-color: #fff;
  color: #409eff;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);
}

.primary-btn:hover {
  background-color: #f5f7fa;
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(64, 158, 255, 0.4);
}

.features-section {
  padding: 80px 0;
  background-color: #fff;
}

.section-title {
  font-size: 28px;
  font-weight: 600;
  color: #1d2129;
  text-align: center;
  margin-bottom: 50px;
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

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
}

.feature-card {
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  padding: 30px;
  transition: all 0.3s;
  border: 1px solid #f5f7fa;
  cursor: pointer;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
  border-color: #e6f7ff;
}

.card-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  font-size: 24px;
  color: #fff;
}

.card-icon.blue {
  background-color: rgba(64, 158, 255, 0.15);
  color: #409eff;
}

.card-icon.green {
  background-color: rgba(103, 194, 58, 0.15);
  color: #67c23a;
}

.card-icon.orange {
  background-color: rgba(230, 162, 60, 0.15);
  color: #e6a23c;
}

.card-icon.purple {
  background-color: rgba(160, 132, 247, 0.15);
  color: #a084f7;
}

.card-title {
  font-size: 18px;
  font-weight: 500;
  color: #1d2129;
  margin-bottom: 10px;
}

.card-desc {
  font-size: 14px;
  color: #606266;
  line-height: 1.6;
  margin-bottom: 20px;
}

.card-link {
  font-size: 14px;
  color: #409eff;
  text-decoration: none;
  display: inline-block;
  transition: color 0.3s;
}

.card-link:hover {
  color: #66b1ff;
}


.dashboard-screen {
  width: 100%;
  height: 100vh;
  background: #fff;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.screen-header {
  padding: 15px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-left h1 {
  margin: 0;
  font-size: 24px;
}

.time-info {
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
  padding: 20px;
  overflow-y: auto;
}

.row {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  height: calc(25% - 15px);
}

.row-1 {
  height: 18%;
}

.row-2,
.row-3,
.row-4 {
  height: calc(27% - 15px);
}

.card {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  position: relative;
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

.card-header {
  padding: 12px 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  color: #474646;
}

.card-body {
  flex: 1;
  padding: 15px;
  overflow: hidden;
}

.stat-card {
  flex: 1;
  min-width: 200px;
}

.stat-card.total-samples .card-icon {
  color: #409EFF;
}

.stat-card.processed-samples .card-icon {
  color: #67C23A;
}

.stat-card.process-rate .card-icon {
  color: #E6A23C;
}

.stat-card.detect-speed .card-icon {
  color: #F56C6C;
}

.stat-value {
  font-size: 42px;
  font-weight: bold;
  text-align: center;
  margin: 10px 0;
  background: #474646;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.stat-trend {
  text-align: center;
  font-size: 14px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px;
}

.positive {
  color: #67C23A;
}

.negative {
  color: #F56C6C;
}

.trend-label {
  color: #474646;
  font-size: 12px;
}

.chart-card {
  flex: 1;
}

.chart-container {
  width: 100%;
  height: 100%;
}

.table-card {
  flex: 1;
}

.el-table {
  --el-table-text-color: #ccc;
  --el-table-header-text-color: #e0e0e0;
  --el-table-row-hover-bg-color: rgba(64, 158, 255, 0.1);
  --el-table-border-color: rgba(255, 255, 255, 0.1);
  --el-table-header-text-color: #ccc;
  background: transparent;
}

.el-table th {
  background: rgba(16, 30, 50, 0.5) !important;
}

.el-table tr {
  background: transparent !important;
}

.el-table td {
  border-bottom: 1px solid rgba(255, 255, 255, 0.05) !important;
}

.status-normal {
  color: #67C23A;
}

/* 响应式调整 */
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