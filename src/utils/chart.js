import * as echarts from 'echarts';

export const useChart = (ref) => {
  let chartInstance = null;

  const init = (option) => {
    // 销毁旧实例
    if (chartInstance) {
      chartInstance.dispose();
    }

    // 创建新实例
    chartInstance = echarts.init(ref.value);
    chartInstance.setOption(option);

    return chartInstance;
  };

  const update = (option) => {
    if (chartInstance) {
      chartInstance.setOption(option);
    }
  };

  const resize = () => {
    if (chartInstance) {
      chartInstance.resize();
    }
  };

  const destroy = () => {
    if (chartInstance) {
      chartInstance.dispose();
      chartInstance = null;
    }
  };

  return { init, update, resize, destroy };
};
