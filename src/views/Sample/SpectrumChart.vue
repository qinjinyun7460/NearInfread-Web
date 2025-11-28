<template>
  <div class="spectrum-container">
    <el-card shadow="never">
      <template #header>
        <div class="chart-header">
          <span>光谱图</span>
          <el-tag v-if="!isDataValid" type="warning" size="small">数据格式不正确</el-tag>
        </div>
      </template>
      <div v-if="isChartReady" ref="chartRef" class="chart-container"></div>
      <div v-else class="chart-loading">
        <el-skeleton animated />
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, computed, nextTick } from 'vue';
import { ElMessage } from 'element-plus';
import request from '@/utils/request';
import { useChart } from '@/utils/chart';

const props = defineProps({
  sampleData: {
    type: [Array, Object],
    required: true,
    default: () => []
  }
});

const isChartReady = ref(false);
const chartRef = ref(null);


const { init: initChart, update: updateChart, resize: resizeChart, destroy: destroyChart } = useChart(chartRef);

const normalizedData = computed(() => {
  const rawData = props.sampleData;
  if (typeof rawData === 'object' && !Array.isArray(rawData) && 'new_sample' in rawData) {
    return Array.isArray(rawData.new_sample) ? rawData.new_sample : [];
  }
  if (Array.isArray(rawData)) {
    return rawData;
  }
  return [];
});

const isDataValid = computed(() => {
  return normalizedData.value.length > 0;
});

const getChartOption = (data = []) => ({

  dataZoom: [
    {
      type: 'inside',
      xAxisIndex: 0,
      start: 0,
      end: 100,
      zoomOnMouseWheel: true,
      moveOnMouseMove: true,
      moveOnMouseWheel: false
    },
    {
      type: 'inside',
      yAxisIndex: 0,
      zoomLock: false
    }
  ],

  tooltip: {
    trigger: 'axis',
    formatter: function (params) {
      const { value } = params[0];
      return `波长: ${value[0]}nm<br>吸光度: ${value[1]}`;
    }
  },
  grid: {
    top: '5%',
    left: '5%',
    right: '5%',
    bottom: '5%',
    containLabel: true
  },
  xAxis: {
    type: 'value',
    name: '波长 (nm)',
    nameLocation: 'middle',
    nameGap: 30,
    min: 1000,
    max: 1799,
    axisLabel: {
      formatter: '{value}',
      interval: 'auto',
      rotate: 0
    }
  },
  yAxis: {
    type: 'value',
    name: '吸光度',
    nameLocation: 'middle',
    nameGap: 40,
    axisLabel: {
      formatter: '{value}',
      interval: 'auto',
      margin: 15,
      fontSize: 12
    },
    min: 0,
    max: 2,
    scale: true,
    interval: 0.2,
    splitNumber: 10,
  },
  series: [
    {
      data: data,
      type: 'line',
      smooth: true,
      lineStyle: {
        width: 2,
        color: '#337ab7'
      },
      symbol: 'none',
    }
  ],
  noDataLoadingOption: {
    text: '暂无光谱数据',
    textStyle: { fontSize: 14 },
    effect: 'bubble',
    effectOption: { effect: { n: 0 } }
  }
});

const loadSpectrumData = async () => {
  if (!isDataValid.value) {
    updateChart(getChartOption([]));
    return;
  }

  try {
    const response = await request.post('/api/sample/spectrum', {
      sample_data: normalizedData.value
    });

    if (response.data.success && response.data.data?.spectrum) {
      updateChart(getChartOption(response.data.data.spectrum));
    } else {
      ElMessage.error(response.data.message || '光谱数据生成失败');
    }
  } catch (error) {
    console.error('加载光谱数据失败：', error);
    ElMessage.error('光谱图绘制失败，请检查网络');
  }
};


const dataWatcher = watch(
  () => normalizedData.value,
  async () => {
    if (isChartReady.value && chartRef.value) {
      await loadSpectrumData();
    }
  },
  { deep: true, immediate: false }
);

const handleResize = () => {
  resizeChart();
};

onMounted(async () => {

  await nextTick();

  setTimeout(() => {
    isChartReady.value = true;

    nextTick(async () => {
      initChart(getChartOption());
      loadSpectrumData();
      window.addEventListener('resize', handleResize);
    });
  }, 100);
});

onUnmounted(() => {
  dataWatcher();
  window.removeEventListener('resize', handleResize);
  destroyChart();
});
</script>

<style scoped>
.spectrum-container {
  width: 100%;
  padding: 10px;
  box-sizing: border-box;
  min-height: 620px;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chart-container {
  width: 100% !important;
  height: 600px !important;
  min-width: 600px;
  min-height: 400px;
  overflow: hidden;
  box-sizing: border-box;
}

:deep(.el-card__body) {
  padding: 20px;
  height: 100%;
}

@media (max-width: 768px) {
  .chart-container {
    height: 400px !important;
    min-width: auto;
  }

  .spectrum-container {
    min-height: 420px;
  }
}
</style>