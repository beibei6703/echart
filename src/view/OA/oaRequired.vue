<template>
  <div class="warper">
    <div class="headerCon">
      <div class="items"  v-for="(itemcount,index) in listCount" :key="index">
        <span class="spantit">{{itemcount.desc}}</span>
        <span class="nums" :class="bgColor[index]" >{{itemcount.num}}</span>
      </div>
    </div>
    <div class="centerCon">
      <span class="centerTop">待办需求明细</span>
      <div class="formCon">
          <el-select clearable filterable placeholder="需求名称" v-model="demandName">
          <el-option
            :key="reItem.id"
            :label="reItem.requestname"
            :value="reItem.requestname"
            v-for="reItem in demandNames"
          ></el-option>
        </el-select>
        <el-select clearable placeholder="需求类型" v-model="protype">
          <el-option
            :key="item.label"
            :label="item.label"
            :value="item.label"
            v-for="item in processtypes"
          ></el-option>
        </el-select>
        <span class="timeSpan">需求提交时间:</span>
        <el-date-picker
         :picker-options="pickerOptions"
          class="timers"
            value-format="yyyy-MM-dd"
          end-placeholder="结束日期"
          range-separator="至"
          start-placeholder="开始日期"
          type="daterange"
          v-model="addTime"
        ></el-date-picker>
        <el-select clearable placeholder="流程节点" v-model="proNode">
          <el-option
            :key="itemnode.label"
            :label="itemnode.label"
            :value="itemnode.label"
            v-for="itemnode in proNodes"
          ></el-option>
        </el-select>
        <el-select clearable placeholder="紧急程度" v-model="urgen">
          <el-option
            :key="urgenItem.label"
            :label="urgenItem.label"
            :value="urgenItem.label"
            v-for="urgenItem in urgenList"
          ></el-option>
        </el-select>
         <span class="timeSpan">计划交付时间:</span>
        <el-date-picker
         :picker-options="pickerOptions"
          value-format="yyyy-MM-dd"
          class="timers"
          end-placeholder="结束日期"
          range-separator="至"
          start-placeholder="开始日期"
          type="daterange"
          v-model="needPayTime"
        ></el-date-picker>
         <el-button type="primary" @click="search">查询</el-button>
      </div>
      <div class="tables">
        <el-table :data="tableData" border @sort-change="getsort">
          <el-table-column :index="typeIndex" align="center" label="序号" type="index"></el-table-column>
          <el-table-column align="center" label="需求名称" :show-overflow-tooltip="true" prop="prdName"></el-table-column>
          <el-table-column align="center" label="需求类型" prop="prdType"></el-table-column>
          <el-table-column align="center" label="需求路径" prop="prdWay"></el-table-column>
          <el-table-column align="center" label="提交时间"  :sort-orders="['ascending', 'descending']"  sortable="custom" prop="addTime"></el-table-column>
          <el-table-column align="center" label="需求人" prop="ower"></el-table-column>
          <el-table-column align="center" label="需求处理人" prop="handler"></el-table-column>
          <el-table-column align="center" label="当前阶段" prop="node"></el-table-column>
          <el-table-column align="center" label="实施进度" width="160">
              <template slot-scope="scope">
                  <el-progress  style="height:40px;line-height:40px;" v-if="scope.row.percentage>=100" :percentage="100"></el-progress>
                  <span style="height:40px;line-height:40px" v-if="scope.row.percentage==0 || scope.row.percentage==null" >空</span>
                  <span style="height:40px;line-height:40px" v-if="scope.row.percentage<0" >已延期</span>
                  <el-progress style="height:40px;line-height:40px;" v-if="scope.row.percentage>0 && scope.row.percentage<100" :percentage="scope.row.percentage"></el-progress>
              </template>
          </el-table-column>
          <el-table-column align="center" label="紧急程度" prop="urgent"></el-table-column>
          <el-table-column align="center" label="计划交付时间"  :sort-orders="['ascending', 'descending']" sortable="custom" prop="needPayTime"></el-table-column>
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
    <chart></chart>
    <linechart></linechart>
    <chartfun></chartfun>
  </div>
</template>

<script>
import chart from './chart.vue'; // 圆饼图
import linechart from './linechart.vue'; // 折线图
import chartfun from './chartfun.vue'; // 折线图
import { getOAdata, getOADetail, findDemandName } from '@src/api/oa/index.js';

export default {
    name: 'oaRequired',
    components: {
        chart,
        linechart,
        chartfun
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
            protype: '', // 流程类型
            input: '',
            bgColor: ['bg1', 'bg2', 'bg3', 'bg4', 'bg5', 'bg6', 'bg7'],
            addTime: '',
            needPayTime: '',
            totalCount: 0,
            pageNo: 1,
            pageSize: 10,
            tableData: [],
            listCount: [],
            processtypes: [{
                label: '新增流程'
            }, {
                label: '修改流程'
            }],
            proNode: '',
            proNodes: [
                {
                    label: '流程接口人'
                }, {
                    label: 'IT需求评估'
                }, {
                    label: '方案整理'
                }, {
                    label: '方案确认'
                }, {
                    label: '方案实施'
                }, {
                    label: '交付确认'
                }],
            urgen: '',
            urgenList: [
                {
                    label: '特别紧急'
                },
                {
                    label: '紧急'
                },
                {
                    label: '一般'
                }
            ],
            demandName: '', // 需求名称
            demandNames: [], // 需求名称列表
            sortAddTime: '',
            sortNeedPayTime: ''
        };
    },
    created() {
        this.getalldatas();
        this.getDetail();
        this.getDemandName();
    },

    methods: {
        // 拍讯
        getsort(val) {
            // 提交时间排序
            if (val.prop === 'addTime') {
                if (val.order === 'ascending') {
                    this.sortAddTime = 0;
                    this.sortNeedPayTime = '';
                    this.getDetail();
                } else if (val.order === 'descending') {
                    this.sortNeedPayTime = '';
                    this.sortAddTime = 1;
                    this.getDetail();
                }
            }
            // 计划交付时间排序
            if (val.prop === 'needPayTime') {
                if (val.order === 'ascending') {
                    this.sortAddTime = '';
                    this.sortNeedPayTime = 0;
                    this.getDetail();
                } else if (val.order === 'descending') {
                    this.sortAddTime = '';
                    this.sortNeedPayTime = 1;
                    this.getDetail();
                }
            }
        },

        getDemandName() {
            findDemandName().then(res => {
                const data = res.data;
                if (data.success && data.data) {
                    this.demandNames = data.data;
                }
            });
        },
        search() {
            this.pageNo = 1;
            this.tableData = [];
            this.getDetail();
        },
        // 表单数据查询
        getDetail() {
            const parms = {
                prdName: this.demandName,
                prdType: this.protype,
                startAddTime: this.addTime ? this.addTime[0] : '',
                endAddTime: this.addTime ? this.addTime[1] : '',
                node: this.proNode,
                urgent: this.urgen,
                startNeedPayTime: this.needPayTime ? this.needPayTime[0] : '',
                endNeedPayTime: this.needPayTime ? this.needPayTime[1] : '',
                sortAddTime: this.sortAddTime,
                sortNeedPayTime: this.sortNeedPayTime,
                pageNum: this.pageNo,
                pageSize: this.pageSize
            };
            getOADetail(parms).then(this.handleSucc.bind(this));
        },
        handleSucc(res) {
            const data = res.data;
            if (data.success && data.data.data) {
                this.totalCount = data.data.total;
                this.tableData = data.data.data;
            }
        },
        getalldatas() {
            getOAdata().then(res => {
                const data = res.data;
                if (data.success && data.data.prdTotal) {
                    this.listCount = data.data.prdTotal;
                }
            });
        },
        typeIndex(index) {
            return (index = index + (this.pageNo - 1) * this.pageSize + 1);
        },
        handleSizeChange(val) {
            this.pageSize = val;
            this.getDetail();
        },
        handleCurrentChange(val) {
            this.pageNo = val;
            this.getDetail();
        }
    }
};
</script>

<style scoped>
.warper {
    width: 100%;
    height: 100%;
}
.bg1{
    color:#60a4e8;
    border:1px solid #60a4e8;
}
.bg2{
    color:#2ac993;
    border:1px solid #2ac993;
}
.bg3{
    color:#ff5b5b;
    border:1px solid #ff5b5b;
}
.bg4{
    color:#fe8002;
    border:1px solid #fe8002;
}
.bg5{
    color:#ffbf55;
    border:1px solid #ffbf55;
}
.bg6{
    color:#73cfca;
    border:1px solid #73cfca;
}
.bg7{
    color:#8291d9;
    border:1px solid #8291d9;
}
.headerCon {
    margin-top: 20px;
    /* background: #fff; */
    padding: 15px;
    display: flex;
    height: 200px;
    justify-content: space-between;
    align-items: center;
}
.timeSpan{
    font-size: 14px;
    margin-left:10px;
    margin-right: 15px;
}
.items {
    width: 17%;
    height: 100%;
    display: flex;
    background: #fff;
    flex-direction: column;
    align-items: center;
    justify-content: center;
     box-shadow: 0 10px 20px 0 rgba(56, 82, 110, 0.06);
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
}
.items:hover{
     background: #FFFFFF;
      box-shadow: 0 6px 10px rgba(0,0,0,0.1);
      border-radius: 4px;
      transform: translate3d(0, -1px, 0);
}
.spantit {
    display: block;
    height: 40px;
    line-height: 30px;
    font-size: 14px;
}
.nums {
    font-size: 24px;
    display:inline-block;
    width:80px;
    height:80px;
    text-align: center;
    line-height: 80px;
    border-radius: 50%;
}
.centerCon {
    width: 100%;
    margin-top: 20px;
    background: #fff;
}
.centerTop {
    display: block;
    height: 50px;
    line-height: 50px;
    font-size: 16px;
    font-weight: bold;
    padding-left: 15px;
}
.formCon {
    padding-left: 15px;
}
.formCon>>>.el-button{
    padding:8px 15px;
     margin-bottom: 10px;
}
.formCon >>> .el-input {
    width: 200px;
    height: 30px;
    margin-bottom: 20px;
    margin-right: 15px;
}
.formCon >>> .el-input__inner {
    width: 200px;
    height: 30px;
    line-height: 30px;
}
.formCon >>> .el-input__icon {
    line-height: 30px;
}
.formCon >>> .el-range__icon {
    line-height: 22px;
}
.timers {
    width: 260px !important;
    margin-right: 15px;
}
.timers >>> .el-input__inner {
    padding: 0;
}
.timers >>> .el-range-separator {
    line-height: 24px;
    padding: 0;
}
 .timers>>>.el-range__close-icon{
     line-height:24px;
 }
.tables {
    padding: 0 15px;
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
.tables>>>.el-progress{
    padding:0 10px !important;
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
</style>
