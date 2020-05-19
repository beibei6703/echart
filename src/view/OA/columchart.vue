<template>
  <!-- 柱状图 -->
  <div class="chartCon">
    <div class="chartItem">
      <span class="spantit">业务集成类流程详细数据</span>
      <div class="headerSea">
        <span class="spanText">流程名称:</span>
        <el-select filterable placeholder="请选择" v-model="processName">
          <el-option
            :key="items.id"
            :label="items.workflowname"
            :value="items.id"
            v-for="items in processList"
          ></el-option>
        </el-select>
        <span class="spanText">时间范围:</span>
        <el-date-picker
         :picker-options="pickerOptions"
          class="timersRange"
          end-placeholder="结束日期"
          range-separator="至"
          start-placeholder="开始日期"
          type="daterange"
            value-format="yyyy-MM-dd"
          v-model="times"
        ></el-date-picker>
        <el-button type="primary" @click="search">搜索</el-button>
      </div>
      <div id="barchart"></div>
    </div>
  </div>
</template>

<script>
import { getAllprocess, getprocessNodeTime } from '@src/api/oa/index.js';
import qs from 'qs';
var echarts = require('echarts');
export default {
    name: 'columchart',
    data() {
        return {
            pickerOptions: {
                shortcuts: [
                    {
                        text: '今天',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            end.setTime(end.getTime() + 3600 * 1000 * 24 * 1);
                            picker.$emit('pick', [start, end]);
                        }
                    },
                    {
                        text: '最近一周',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', [start, end]);
                        }
                    },
                    {
                        text: '最近一个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                            picker.$emit('pick', [start, end]);
                        }
                    },
                    {
                        text: '最近三个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                            picker.$emit('pick', [start, end]);
                        }
                    }
                ]
            },
            times: '',
            processList: [],
            processName: '',
            Xdata: [],
            seriesData: [],
            typeId: localStorage.getItem('id')
        };
    },
    computed: {
        getTypeId() {
            return this.$store.state.process.typeId;
        }
    },
    created() {
        this.getProcess();
        this.getprocessNodetime();
    },
    mounted() {
        this.echartsBar();
    },
    methods: {
        echartsBar(Xdata, seriesData) {
            let barMychart = echarts.init(document.getElementById('barchart'));
            barMychart.setOption({
                // 横坐标
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        // 坐标轴指示器，坐标轴触发有效
                        type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                    }
                },

                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: [
                    {
                        type: 'category',
                        data: Xdata,
                        axisTick: {
                            alignWithLabel: true
                        }
                    }
                ],
                yAxis: [
                    {
                        scale: true,
                        min: 2,
                        axisLabel: {
                            formatter: '{value} (小时)'
                        }

                    }
                ],
                series: [
                    {
                        name: '节点耗时',
                        type: 'bar',
                        barWidth: '60%',
                        data: seriesData,
                        markLine: {
                            data: [
                                {
                                    type: 'average',
                                    name: '平均值'

                                }
                            ]
                        }
                    }
                ]
            });
        },
        // 获取流程
        getProcess() {
            const parms = {
                id: this.typeId
            };
            getAllprocess(parms).then(res => {
                const data = res.data;
                if (data.success) {
                    this.processList = data.data;
                    this.processName = this.processList[5].id;
                    this.getprocessNodetime();
                }
            });
        },
        getprocessNodetime() {
            this.Xdata = [];
            this.seriesData = [];
            if (this.times) {
                var date = new Date(this.times[0]);
                var date1 = new Date(this.times[1]);
                let startDate = date.getTime() / 1000;
                let endDate = date1.getTime() / 1000;

                var parms;
                parms = qs.stringify({
                    workFlowId: this.processName,
                    startDate: startDate,
                    endDate: endDate
                });
            } else {
                parms = qs.stringify({
                    workFlowId: this.processName,
                    startDate: '',
                    endDate: ''
                });
            }
            var hours;
            getprocessNodeTime(parms).then(res => {
                const data = res.data;
                if (data.success && data.data.length) {
                    data.data.forEach(item => {
                        this.Xdata.push(item.nodename);
                        hours = (parseInt(item.time) / 60).toFixed(1);
                        this.seriesData.push(hours);
                    });
                    this.echartsBar(this.Xdata, this.seriesData);
                }
            });
        },
        search() {
            this.getprocessNodetime();
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
}
.spantit {
    display: block;
    height: 40px;
    line-height: 40px;
    font-size: 16px;
    font-weight: bold;
}
.headerSea {
    padding: 10px 0;
    display: flex;
    align-items: center;
}
.headerSea >>> .el-button {
    margin-left: 40px;
    padding: 8px 13px;
}

.headerSea >>> .el-input {
    width: 260px;
    margin-right: 15px;
    height: 30px;
}
.headerSea >>> .el-input__inner {
    width: 260px;
    height: 30px;
}
.headerSea >>> .el-input__icon {
    line-height: 30px;
}
.spanText {
    display: inline-block;
    height: 30px;
    line-height: 30px;
    margin-right: 10px;
    font-size: 12px;
}
.timersRange >>> .el-input__inner {
    padding: 0;
}
.timersRange >>> .el-range__icon {
    line-height: 22px;
}
.timersRange >>> .el-range-separator {
    width: 20px;
    line-height: 24px;
}
.timersRange >>> .el-range__close-icon {
    line-height: 24px;
}
#barchart {
    width: 100%;
    height: 350px;
}
</style>
