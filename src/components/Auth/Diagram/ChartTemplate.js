import * as echarts from 'echarts';

export const CHART_COLORS = {
  primary: ['#409EFF', '#66B1FF'],
  success: ['#67C23A', '#85CE61'],
  warning: ['#E6A23C', '#F0B862'],
  danger: ['#F56C6C', '#F88888'],
  purple: ['#9B87FE', '#B19FF9'],
  orange: ['#FF7D00', '#FF9E40'],
  gray: ['#8C8C8C', '#A6A6A6'],
  pink: ['#FF5C87', '#FF85A6'],
  text: '#ccc',
  grid: 'rgba(255, 255, 255, 0.1)',
  background: 'transparent'
};

const getGradientColor = (colorPair, direction = 'vertical') => {
  const [startColor, endColor] = colorPair;
  return direction === 'vertical'
    ? new echarts.graphic.LinearGradient(0, 0, 0, 1, [
      { offset: 0, color: startColor },
      { offset: 1, color: endColor }
    ])
    : new echarts.graphic.LinearGradient(0, 0, 1, 0, [
      { offset: 0, color: startColor },
      { offset: 1, color: endColor }
    ]);
};

export class ChartTemplate {
  static create(options = {}) {
    const {
      type = 'line',
      data = [],
      colorType = 'primary',
      customOptions = {},
      showTooltip = true,
      showLegend = false
    } = options;

    const baseConfig = {
      backgroundColor: CHART_COLORS.background,
      tooltip: showTooltip ? {
        trigger: type === 'pie' ? 'item' : 'axis',
        textStyle: { fontSize: 12 },
        ...customOptions.tooltip
      } : null,
      legend: showLegend ? {
        orient: 'vertical',
        top: 'center',
        right: '10%',
        textStyle: {
          color: CHART_COLORS.text,
          fontSize: 12
        },
        itemWidth: 10,
        itemHeight: 10,
        ...customOptions.legend
      } : null,
      grid: type !== 'pie' ? {
        left: '5%',
        right: '5%',
        bottom: '10%',
        top: '5%',
        containLabel: true,
        ...customOptions.grid
      } : null,
      xAxis: type !== 'pie' ? {
        type: 'category',
        data: data.map(item => item.date || item.name),
        axisLine: { lineStyle: { color: CHART_COLORS.grid } },
        axisLabel: {
          color: CHART_COLORS.text,
          fontSize: 11
        },
        ...customOptions.xAxis
      } : null,
      yAxis: type !== 'pie' ? {
        type: 'value',
        min: 0,
        axisLine: { show: false },
        axisLabel: {
          color: CHART_COLORS.text,
          fontSize: 11
        },
        splitLine: {
          lineStyle: { color: CHART_COLORS.grid }
        },
        ...customOptions.yAxis
      } : null
    };

    let seriesConfig = [];

    if (type === 'line') {
      seriesConfig = this.createLineSeries(data, colorType, customOptions);
    } else if (type === 'bar') {
      seriesConfig = this.createBarSeries(data, colorType, customOptions);
    } else if (type === 'pie') {
      seriesConfig = this.createPieSeries(data, colorType, customOptions);
    }

    return {
      ...baseConfig,
      series: seriesConfig,
      ...customOptions.extra
    };
  }

  static createLineSeries(data, colorType, options) {
    const colorPair = CHART_COLORS[colorType] || CHART_COLORS.primary;

    return [{
      data: data.map(item => item.count || item.value),
      type: 'line',
      smooth: true,
      symbol: 'circle',
      symbolSize: 6,
      lineStyle: {
        width: 3,
        color: getGradientColor(colorPair, 'horizontal')
      },
      areaStyle: {
        color: getGradientColor([
          `${colorPair[0]}33`, // 添加透明度
          `${colorPair[1]}0A`
        ])
      },
      itemStyle: {
        color: colorPair[0],
        borderColor: '#fff',
        borderWidth: 1
      },
      emphasis: {
        symbolSize: 10
      },
      ...options.series
    }];
  }

  static createBarSeries(data, colorType, options) {
    const colorPair = CHART_COLORS[colorType] || CHART_COLORS.primary;

    return [{
      data: data.map(item => item.count || item.value),
      type: 'bar',
      barWidth: '60%',
      itemStyle: {
        color: getGradientColor(colorPair),
        borderRadius: [4, 4, 0, 0]
      },
      label: {
        show: true,
        position: 'top',
        color: CHART_COLORS.text,
        fontSize: 11
      },
      ...options.series
    }];
  }

  static createPieSeries(data, colorType, options) {
    const { radius = ['35%', '70%'], center = ['50%', '50%'] } = options;

    return [{
      type: 'pie',
      radius,
      center,
      avoidLabelOverlap: false,
      data: this.formatPieData(data),
      label: {
        show: true,
        position: 'outside',
        fontSize: 12,
        color: CHART_COLORS.text,
        formatter: '{b}: {c}',
        ...options.label
      },
      labelLine: {
        show: true,
        lineStyle: {
          color: CHART_COLORS.text
        },
        ...options.labelLine
      },
      itemStyle: {
        borderRadius: 5,
        borderColor: '#162940',
        borderWidth: 1
      },
      emphasis: {
        scale: true,
        scaleSize: 10,
        shadowBlur: 20
      },
      animationType: 'scale',
      animationEasing: 'elasticOut',
      animationDelay: (idx) => idx * 50,
      ...options.series
    }];
  }

  static formatPieData(data) {
    const colorTypes = Object.keys(CHART_COLORS).filter(key =>
      Array.isArray(CHART_COLORS[key]) && CHART_COLORS[key].length === 2
    );

    return data.map((item, index) => {
      const colorKey = colorTypes[index % colorTypes.length];
      const colorPair = CHART_COLORS[colorKey];

      return {
        ...item,
        itemStyle: {
          color: getGradientColor(colorPair)
        }
      };
    });
  }
}

export const getSampleTrendOption = (data) => {
  return ChartTemplate.create({
    type: 'line',
    data,
    colorType: 'primary',
    customOptions: {
      tooltip: {
        formatter: '{b}<br/>新增样品: {c}'
      }
    }
  });
};

export const getDetectTrendOption = (data) => {
  return ChartTemplate.create({
    type: 'line',
    data,
    colorType: 'success',
    customOptions: {
      tooltip: {
        formatter: '{b}<br/>完成检测: {c}'
      }
    }
  });
};

export const getStatusOption = (data) => {
  return ChartTemplate.create({
    type: 'pie',
    data,
    showLegend: true,
    customOptions: {
      tooltip: {
        formatter: '{b}: {c} ({d}%)'
      },
      radius: ['35%', '70%'],
      label: {
        formatter: '{b}: {c}'
      }
    }
  });
};

export const getLocationOption = (data) => {
  return ChartTemplate.create({
    type: 'pie',
    data,
    showLegend: true,
    customOptions: {
      tooltip: {
        formatter: '{b}: {c} ({d}%)'
      },
      radius: ['0%', '70%'],
      legend: {
        orient: 'vertical',
        top: 'center',
        right: '10%'
      }
    }
  });
};

// 新增样品占比环形图配置
export const getRatioOption = (newSamples, totalSamples) => {
  const data = [
    { name: '新增样品', value: newSamples },
    { name: '原有样品', value: Math.max(0, totalSamples - newSamples) }
  ];

  return ChartTemplate.create({
    type: 'pie',
    data,
    showLegend: false,
    customOptions: {
      radius: ['60%', '80%'],
      label: {
        show: false
      },
      labelLine: {
        show: false
      },
      series: {
        silent: true
      }
    }
  });
};
