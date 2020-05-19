<template>
  <div class="wraper">
    <div class="itemCons">
      <span class="spantit">业务集成类OA流程统计数据</span>
      <div class="searchFor">
        <span class="timers">指定时间范围</span>
        <el-date-picker
          :picker-options="pickerOptions"
          align="right"
          end-placeholder="结束日期"
          range-separator="至"
          start-placeholder="开始日期"
          type="daterange"
          unlink-panels
          v-model="dateValue1"
          value-format="yyyy-MM-dd"
        ></el-date-picker>
        <el-button @click="search('1')" class="btns" type="primary">查询</el-button>
      </div>
      <div class="dataCon">
        <div class="dataItem">
          <span class="dataSpan">创建流程</span>
          <span class="nums">{{requestCount}}</span>
        </div>
        <div class="dataItem">
          <span class="dataSpan">待批准流程</span>
          <span class="nums">{{waitCount}}</span>
        </div>
        <div class="dataItem">
          <span class="dataSpan">已归档流程</span>
          <span class="nums">{{endCount}}</span>
        </div>
      </div>
    </div>
    <div class="itemCons">
      <span class="spantit">业务集成类OA流程分类数据</span>
      <div class="searchFor">
        <span class="timers">指定时间范围</span>
        <el-date-picker
          :picker-options="pickerOptions"
          align="right"
          end-placeholder="结束日期"
          range-separator="至"
          start-placeholder="开始日期"
          type="daterange"
          unlink-panels
          v-model="dateValue2"
          value-format="yyyy-MM-dd"
        ></el-date-picker>
        <el-button @click="search('2')" class="btns" type="primary">查询</el-button>
      </div>
      <div class="tables">
        <el-table :data="tableData" @sort-change="getsort" border>
          <el-table-column :index="typeIndex" align="center" label="序号" type="index"></el-table-column>
          <el-table-column align="center" label="流程名称" prop="workflowname"></el-table-column>
          <el-table-column
            :sort-orders="['ascending', 'descending']"
            align="center"
            label="创建流程总数"
            prop="requestCount"
            sortable="custom"
          ></el-table-column>
          <el-table-column
            :sort-orders="['ascending', 'descending']"
            align="center"
            label="待审核数量"
            prop="waitCount"
            sortable="custom"
          ></el-table-column>
          <el-table-column
            :sort-orders="['ascending', 'descending']"
            align="center"
            label="已归档数量"
            prop="endCount"
            sortable="custom"
          ></el-table-column>
          <el-table-column
            :sort-orders="['ascending', 'descending']"
            align="center"
            label="流程审批节点数量"
            prop="nodeCount"
            sortable="custom"
          ></el-table-column>
          <el-table-column
            :sort-orders="['ascending', 'descending']"
            align="center"
            label="流程平均耗时"
            prop="time"
            sortable="custom"
          ></el-table-column>
        </el-table>
        <div class="pageCon">
          <el-pagination
            :current-page="pageNo"
            :page-size="pageSize"
            :page-sizes="[10, 20, 30, 40]"
            :total="totalCount"
            @current-change="handleCurrentChange"
            @size-change="handleSizeChange"
            layout="total, sizes, prev, pager, next, jumper"
          ></el-pagination>
        </div>
      </div>
    </div>
    <div style="margin-top:20px">
      <columchart></columchart>
    </div>
  </div>
</template>
<script>
import { getprocessData } from '@src/api/oa/index.js';
import qs from 'qs';
import columchart from './columchart.vue';
export default {
    name: 'OAflow',
    components: {
        columchart
    },
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
            dateValue1: '',
            dateValue2: '',
            totalCount: 0,
            pageNo: 1,
            pageSize: 10,
            tableData: [],
            requestCount: 0,
            endCount: 0,
            waitCount: 0,
            sortByType: '',
            sort: '',
            typeId: localStorage.getItem('id')
        };
    },
    computed: {
        getAllProcess() {
            return this.$store.state.process.allProcess;
        },
        timeDefault() {
            var date = new Date();
            var s1 = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + (date.getDate() - 1);
            var s2 = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
            var arrdate = [s1, s2];
            return arrdate;
        }
    },
    created() {},
    mounted() {
        this.getTypeId();
        this.dateValue1 = this.timeDefault;
        this.dateValue2 = this.timeDefault;
        if (this.dateValue1) {
            this.getdata1();
        }
        if (this.dateValue2) {
            this.getdata2();
        }
    },
    methods: {
        getTypeId() {
            if (this.getAllProcess && this.getAllProcess.length > 0) {
                for (var i = 0; i < this.getAllProcess.length; i++) {
                    if (this.getAllProcess[i].typename === '商品-业务集成类') {
                        localStorage.setItem('id', this.getAllProcess[i].id);
                        return;
                    }
                }
            }
        },
        getsort(val) {
            if (val.prop === 'requestCount') {
                this.sortByType = 1;
                if (val.order === 'ascending') {
                    this.sort = 0;
                    this.getdata2();
                }
                if (val.order === 'descending') {
                    this.sort = 1;
                    this.getdata2();
                }
            }
            // 待审核数量
            if (val.prop === 'waitCount') {
                this.sortByType = 2;
                if (val.order === 'ascending') {
                    this.sort = 0;
                    this.getdata2();
                }
                if (val.order === 'descending') {
                    this.sort = 1;
                    this.getdata2();
                }
            }
            // 已归档数量
            if (val.prop === 'endCount') {
                this.sortByType = 3;
                if (val.order === 'ascending') {
                    this.sort = 0;
                    this.getdata2();
                }
                if (val.order === 'descending') {
                    this.sort = 1;
                    this.getdata2();
                }
            }
            // 流程审批节点
            if (val.prop === 'nodeCount') {
                this.sortByType = 4;
                if (val.order === 'ascending') {
                    this.sort = 0;
                    this.getdata2();
                }
                if (val.order === 'descending') {
                    this.sort = 1;
                    this.getdata2();
                }
            }
            // 流程平均耗时
            if (val.prop === 'time') {
                this.sortByType = 5;
                if (val.order === 'ascending') {
                    this.sort = 0;
                    this.getdata2();
                }
                if (val.order === 'descending') {
                    this.sort = 1;
                    this.getdata2();
                }
            }
        },
        search(num) {
            if (num === '2') {
                this.pageNo = 1;
                this.totalCount = 0;
                this.tableData = [];
                this.getdata2();
            } else if (num === '1') {
                this.getdata1();
            }
        },
        // table数据
        getdata2() {
            if (this.dateValue2) {
                var date = new Date(this.dateValue2[0]);
                var date1 = new Date(this.dateValue2[1]);
                let startDate = date.getTime() / 1000;
                let endDate = date1.getTime() / 1000;
                var parms;
                parms = qs.stringify({
                    typeId: this.typeId,
                    startDate: startDate,
                    endDate: endDate,
                    pageNum: this.pageNo,
                    pageSize: this.pageSize,
                    sort: this.sort,
                    sortByType: this.sortByType
                });
            } else {
                parms = qs.stringify({
                    typeId: this.typeId,
                    startDate: '',
                    endDate: '',
                    pageNum: this.pageNo,
                    pageSize: this.pageSize,
                    sort: this.sort,
                    sortByType: this.sortByType
                });
            }
            getprocessData(parms).then(this.handleSucc2.bind(this));
        },
        // 顶部所有流程数据
        getdata1() {
            if (this.dateValue1) {
                var date = new Date(this.dateValue1[0]);
                var date1 = new Date(this.dateValue1[1]);
                let startDate = date.getTime() / 1000;
                let endDate = date1.getTime() / 1000;
                var parms;
                parms = qs.stringify({
                    typeId: this.typeId,
                    startDate: startDate,
                    endDate: endDate,
                    pageNum: 0,
                    pageSize: 0
                });
            } else {
                parms = qs.stringify({
                    typeId: this.typeId,
                    startDate: '',
                    endDate: '',
                    pageNum: 0,
                    pageSize: 0
                });
            }
            getprocessData(parms).then(this.handleSucc1.bind(this));
        },
        handleSucc2(res) {
            const data = res.data;
            if (data.success && data.data) {
                this.totalCount = data.data.total;
                this.tableData = data.data.data;
            }
        },
        handleSucc1(res) {
            this.requestCount = 0;
            this.endCount = 0;
            this.waitCount = 0;
            const data = res.data;
            if (data.success && data.data) {
                data.data.forEach(item => {
                    this.requestCount = parseInt(item.requestCount) + this.requestCount;
                    this.endCount = parseInt(item.endCount) + this.endCount;
                    this.waitCount = parseInt(item.waitCount) + this.waitCount;
                });
            }
        },
        typeIndex(index) {
            return (index = index + (this.pageNo - 1) * this.pageSize + 1);
        },
        handleSizeChange(val) {
            this.pageSize = val;
            this.getdata2();
        },
        handleCurrentChange(val) {
            this.pageNo = val;
            this.getdata2();
        }
    }
};
</script>

<style scoped>
.warper {
    width: 100%;
    height: 100%;
}
.itemCons {
    padding: 0 15px;
    background: #fff;
    margin-bottom: 20px;
}
.spantit {
    height: 50px;
    line-height: 50px;
    font-size: 16px;
    font-weight: bold;
}
.searchFor {
    display: flex;
    align-items: center;
    padding: 20px 0;
    /* height:30px; */
}
.searchFor > span {
    display: inline-block;
    height: 30px;
    font-size: 12px;
    line-height: 30px;
}
.timers {
    margin-right: 10px;
}
.searchFor >>> .el-date-editor {
    height: 30px;
    margin: 0 20px 0 15px;
}
.searchFor >>> .el-input__inner {
    height: 30px;
}
.searchFor >>> .el-input__icon {
    line-height: 24px;
}
.searchFor >>> .el-range__icon {
    line-height: 24px;
}
.searchFor >>> .el-range-separator {
    line-height: 24px;
}
.dataCon {
    height: 200px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
}
.dataItem {
    width: 28%;
    height: 180px;
    display: flex;
    border: 1px solid #ccc;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}
.dataItem > span {
    display: inline-block;
    height: 40px;
    line-height: 40px;
    font-size: 16px;
    /* font-weight: bold */
}
.nums {
    color: #409eff;
}
.tables {
    /* padding: 0 15px; */
    padding-bottom: 50px;
    background: #fff;
}

.tables >>> .el-table th {
    padding: 0 !important;
    font-weight: 500;
    font-size: 12px;
    color: #666666;
    background: #f3f5f7;
}

.tables >>> .el-table::before {
    display: none;
}

.tables >>> .el-table::before {
    display: none;
}

.tables >>> .el-table td {
    padding: 0 !important;
    font-size: 12px;
    color: #4a4c4d;
}

.tables >>> .cell {
    height: 40px;
    padding: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    line-height: 40px;
}
.pageCon {
    width: 100%;
    margin-top: 20px;
}
.pageCon >>> .el-pagination {
    float: right;
    font-size: 12px;
    color: #606266 !important;
}
.btns {
    padding: 8px 15px;
    /* margin-left:10px; */
}
</style>
