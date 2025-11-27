import * as echarts from 'echarts';

// 样品增长趋势图表配置
export const getSampleTrendOption = (data) => ({
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