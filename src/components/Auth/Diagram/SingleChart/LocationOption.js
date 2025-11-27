import * as echarts from 'echarts';

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
            color: '#ccc',
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
            center: ['50%', '40%'],
            avoidLabelOverlap: false,
            itemStyle: {
                borderRadius: 5,
            },
            label: {
                show: true,
                position: 'outside',
                fontSize: 12,
                formatter: '{b}: {c}',
                color: '#ccc',
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
                scaleSize: 10
            },
            animationType: 'scale',
            animationEasing: 'elasticOut',
            animationDelay: (idx) => idx * 50
        }
    ]
});