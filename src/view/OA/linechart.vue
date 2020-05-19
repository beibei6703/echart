<template> <div class="chartCon">
    <div class="chartItem">
      <span class="spantit">待办需求数量变化趋势图</span>
      <div id="linechart">

      </div>

    </div>
  </div>

</template>

<script>
import { getOAdata } from '@src/api/oa/index.js';
var echarts = require('echarts');
export default {
    name: 'linechart',
    data() {
        return {
            Xdatas: [],
            seriesData: []

        };
    },
    created() {
        this.getalldata();
    },
    mounted() {
        this.echartsLine();
    },

    methods: {
        getalldata() {
            getOAdata().then(res => {
                const data = res.data;
                if (data.success) {
                    var todoTrandPrd = data.data.todoTrandPrd[0];
                    this.Xdatas = Object.keys(todoTrandPrd);
                    this.seriesData = Object.values(todoTrandPrd);
                    this.echartsLine();
                }
            });
        },
        echartsLine() {
            let myChartLine = echarts.init(document.getElementById('linechart'));
            myChartLine.setOption({
                tooltip: {
                    trigger: 'axis'
                },
                // 横坐标
                xAxis: {
                    type: 'category',
                    data: this.Xdatas
                },
                yAxis: {
                    type: 'value'
                },
                series: [{
                    data: this.seriesData,
                    type: 'line'
                }]

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
#linechart{
    width:100%;
    height:350px;
}

</style>
