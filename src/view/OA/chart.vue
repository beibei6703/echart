<template>
  <div class="chartCon">
    <div class="chartItem">
      <span class="spantit">待办需求分类及占比情况</span>
      <div class="items">
        <div id="piechart"></div>
        <div id="annulus"></div>
      </div>

    </div>
  </div>
</template>

<script>
import { getOAdata } from '@src/api/oa/index.js';
var echarts = require('echarts');
export default {
    name: 'chart',
    data() {
        return {
            todoPrd: [],
            pielegend: [],
            emergencyPrd: [],
            anlegend: []

        };
    },
    mounted() {
        this.getall();
        this.echarts();
        this.echartAn();
    },
    methods: {
        // 获取echart数据
        getall() {
            getOAdata().then(res => {
                const data = res.data;
                if (data.success && data.data) {
                    this.todoPrd = data.data.todoPrd;
                    this.todoPrd.forEach(item => {
                        this.pielegend.push(item.name);
                    });
                    this.echarts();
                    this.emergencyPrd = data.data.emergencyPrd;
                    this.emergencyPrd.forEach(items => {
                        this.anlegend.push(items.name);
                    });
                    this.echartAn();
                }
            });
        },
        echarts() {
            let myChart = echarts.init(document.getElementById('piechart'));
            // 绘制表格
            myChart.setOption({
                title: {
                    text: '待办需求分类及占比情况',
                    bottom: '10',
                    left: '40%'
                },
                tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b} : {c} ({d}%)'
                },
                // 左侧提示列
                legend: {
                    orient: 'vertical',
                    left: 'left',
                    bottom: '0',
                    data: this.pielegend
                },
                series: [
                    {
                        name: '待办需求分类及占比情况',
                        type: 'pie',
                        radius: '60%',
                        center: ['62%', 'center'],
                        data: this.todoPrd,
                        emphasis: {
                            itemStyle: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        },
                        label: {
                            // 普通样式。
                            normal: {
                                show: true
                                // 标签的文字。
                            }
                            // 高亮样式。
                        }
                    }
                ]
            });
        },
        // 圆环
        echartAn() {
            let myChartAn = echarts.init(document.getElementById('annulus'));
            myChartAn.setOption({
                title: {
                    text: '需求紧急程度',
                    bottom: '10',
                    left: 'center'
                },

                tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b}: {c} ({d}%)'
                },
                legend: {
                    orient: 'vertical',
                    left: 10,
                    bottom: '0',
                    data: this.anlegend

                },
                series: [
                    {
                        name: '需求紧急程度',
                        type: 'pie',
                        // left:20,
                        radius: ['45%', '60%'],
                        avoidLabelOverlap: false,
                        data: this.emergencyPrd
                    }
                ]

            });
        }
    }
};
</script>

<style scoped>
.chartCon {
    margin-top: 20px;

}
.chartItem {
    margin-bottom: 20px;
    background: #fff;
    padding-left: 15px;
     padding-bottom:20px;
}
.spantit {
    display: block;
    height: 40px;
    line-height: 40px;
    font-size: 16px;
    font-weight: bold;
}
#piechart {
    width: 480px;
    height: 350px;
    /* margin-right: 30px; */
}
.items{
    display:flex;
    align-items: center;
    justify-content: space-around;
}
#annulus{
    width: 450px;
    height: 350px;
}
</style>
