<template>
  <div class="chartCon">
    <div class="chartItem">
      <!-- <span class="spantit">待办需求分类及占比情况</span> -->
      <div class="items">
        <div id="chartpie"></div>
        <div id="chartsfun"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { getOAdata } from '@src/api/oa/index.js';
var echarts = require('echarts');
export default {
    name: 'chartfun',
    data() {
        return {
            payTiemPrd: [],
            legendlist: [],
            payResultPrd: [],
            legendlist2: []
        };
    },
    mounted() {
        this.getalldata();
        this.echarts();
        this.echartfun();
    },
    methods: {
        getalldata() {
            getOAdata().then(res => {
                const data = res.data;
                if (data.success && data.data.payTiemPrd) {
                    this.payTiemPrd = data.data.payTiemPrd;
                    this.payResultPrd = data.data.payResultPrd;
                    // console.log(this.payTiemPrd)
                    this.payTiemPrd.forEach(items => {
                        this.legendlist.push(items.name);
                    });
                    this.payResultPrd.forEach(item2 => {
                        this.legendlist2.push(item2.name);
                    });
                    this.echarts();
                    this.echartfun();
                }
            });
        },

        echarts() {
            let chartpie = echarts.init(document.getElementById('chartpie'));
            // 绘制表格
            chartpie.setOption({
                title: {
                    text: '需求交付时效占比',
                    bottom: '10',
                    left: 'center'
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
                    data: this.legendlist
                },
                series: [
                    {
                        name: '需求交付时效占比',
                        type: 'pie',
                        radius: '60%',
                        // center: ['50%', '60%'],
                        data: this.payTiemPrd,
                        emphasis: {
                            itemStyle: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }

                    }
                ]
            });
        },
        // 圆环
        echartfun() {
            let myChartfun = echarts.init(document.getElementById('chartsfun'));
            myChartfun.setOption({
                title: {
                    text: '需求交付满意度占比',
                    bottom: '10',
                    left: 'center'
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
                    data: this.legendlist2
                },
                series: [
                    {
                        name: '需求交付满意度占比',
                        type: 'pie',
                        radius: '60%',
                        // center: ['50%', '60%'],
                        data: this.payResultPrd,
                        emphasis: {
                            itemStyle: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }

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
#chartpie {
    width: 450px;
    height: 350px;
    /* margin-right: 30px; */
}
.items {
    display: flex;
    align-items: center;
    justify-content: space-around;
}
#chartsfun {
    width: 450px;
    height: 350px;
}
</style>
