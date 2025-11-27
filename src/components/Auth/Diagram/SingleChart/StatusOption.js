import * as echarts from 'echarts';

// 样品状态分布图表配置
export const getStatusOption = (data) => ({
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
    },
    itemWidth: 10,
    itemHeight: 10
  },
  series: [
    {
      type: 'pie',
      radius: ['35%', '70%'],
      center: ['50%', '40%'],
      data: data,
      label: {
        show: true,
        position: 'outside',
        fontSize: 12,
        formatter: '{b}: {c}',
        color: '#ccc',
      },
      itemStyle: {
        borderRadius: 5
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