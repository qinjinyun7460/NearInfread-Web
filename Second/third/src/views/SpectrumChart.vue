<template>
  <div class="spectrum-container">
    <el-card shadow="never">
      <template #header>
        <div class="chart-header">
          <span>光谱图</span>
          <el-tag v-if="!isDataValid" type="warning" size="small">数据格式不正确</el-tag>
        </div>
      </template>
      <div id="spectrumChart" class="chart-container"></div>
    </el-card>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, watch, computed } from 'vue';
import * as echarts from 'echarts';
import { ElMessage } from 'element-plus';
import request from '@/utils/request';

const props = defineProps({
  sampleData: {
    type: [Array, Object],
    required: true,
    default: () => []
  }
});

let chartInstance = null;

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

const initChart = () => {
  const chartDom = document.getElementById('spectrumChart');
  if (chartInstance) {
    chartInstance.dispose();
  }
  chartInstance = echarts.init(chartDom);

  const option = {
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
        interval: 'auto'
      }
    },
    series: [
      {
        data: [],
        type: 'line',
        smooth: true,
        lineStyle: {
          width: 2,
          color: '#337ab7'
        },
        symbol: 'none',
        // areaStyle: {
        //   color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        //     { offset: 0, color: 'rgba(51, 122, 183, 0.2)' },
        //     { offset: 1, color: 'rgba(51, 122, 183, 0)' }
        //   ])
        // }
      }
    ],

    noDataLoadingOption: {
      text: '暂无光谱数据',
      textStyle: { fontSize: 14 },
      effect: 'bubble',
      effectOption: { effect: { n: 0 } }
    }
  };

  chartInstance.setOption(option);
};

const loadSpectrumData = async () => {
  if (!isDataValid.value) {
    chartInstance.setOption({ series: [{ data: [] }] });
    return;
  }

  try {
    const response = await request.post('/api/sample/spectrum', {
      sample_data: normalizedData.value
    });

    if (response.data.success && response.data.data?.spectrum) {
      chartInstance.setOption({
        series: [
          {
            data: response.data.data.spectrum
          }
        ]
      });
    } else {
      ElMessage.error(response.data.message || '光谱数据生成失败');
    }
  } catch (error) {
    console.error('加载光谱数据失败：', error);
    ElMessage.error('光谱图绘制失败，请检查网络');
  }
};

watch(
  () => normalizedData.value,
  () => {
    if (chartInstance) {
      loadSpectrumData();
    }
  },
  { deep: true }
);


onMounted(() => {
  initChart();
  window.addEventListener('resize', handleResize);
  loadSpectrumData();
});


onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
  if (chartInstance) {
    chartInstance.dispose();
    chartInstance = null;
  }
});


const handleResize = () => {
  chartInstance?.resize();
};
</script>



<style scoped>
.spectrum-container {
  width: 100%;
  padding: 10px;
  box-sizing: border-box;
}

/* .chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
} */

.chart-container {
  width: auto;
  height: 600px;
  min-width: 600px;
  overflow: hidden;
}

@media (max-width: 768px) {
  .chart-container {
    height: 400px;
    min-width: auto;
  }
}
</style>
