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

// 检测完成趋势图表配置
export const getDetectTrendOption = (data) => ({
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
            fontSize: 12
        },
        itemWidth: 10,
        itemHeight: 10
    },
    series: [
        {
            type: 'pie',
            radius: ['35%', '70%'],
            data: data,
            label: {
                show: true,
                position: 'outside',
                fontSize: 12,
                formatter: '{b}: {c}'
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

// 地点分布图表配置
export const getLocationOption = (data) => ({
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
            fontSize: 12
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
            avoidLabelOverlap: false,
            itemStyle: {
                borderRadius: 5,
            },
            label: {
                show: true,
                position: 'outside',
                fontSize: 12,
                formatter: '{b}: {c}'
            },
            data: data.map((item, index) => {
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
                scaleSize: 10
            },
            animationType: 'scale',
            animationEasing: 'elasticOut',
            animationDelay: (idx) => idx * 50
        }
    ]
});