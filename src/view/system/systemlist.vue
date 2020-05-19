<template>
  <div class="wraper">
    <div class="headerCon">
      <el-button icon="el-icon-plus" type="primary" @click="addSystem">新增系统</el-button>
    </div>
    <div class="tables">
      <el-table :data="tableData" border>
        <el-table-column align="center" label="系统名称" prop="name"></el-table-column>
        <el-table-column align="center" label="系统管理员" prop="adminName"></el-table-column>
        <el-table-column align="center" label="系统描述" :show-overflow-tooltip="true" prop="description"></el-table-column>
        <el-table-column align="center" label="启用" prop="isEnable">
          <template slot-scope="scope">
            <el-switch :active-value="1" :inactive-value="0" v-model="scope.row.isEnable" @change="getchanges(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column align="center" label="更新时间" prop="gmtModified"></el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button @click="handleClick(scope.row)" size="small" type="text">编辑</el-button>
            <el-button @click="getMenus" size="small" type="text">菜单管理</el-button>
            <el-button @click="deleteSystem(scope.row)" size="small" type="text">删除</el-button>
          </template>
        </el-table-column>
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
    <el-dialog :before-close="handleClose" :visible.sync="dialogVisible" title="确认提示" width="30%">
      <span class="context">是否确定删除对应的系统?</span>
      <span class="dialog-footer" slot="footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button @click="confirmDelet" type="primary">确 定</el-button>
      </span>
    </el-dialog>
    <systemDialog v-if="isSystemDialog" :isSystemDialog="isSystemDialog" @getDialig="getSysDialig"></systemDialog>
  </div>
</template>

<script>
import { getSystemList, getdeleteSystem, getsystemUpdate } from '@src/api/system/index.js';
import systemDialog from '../dialog/systemDialog';
export default {
    name: 'systemlist',
    components: {
        systemDialog
    },
    data() {
        return {
            isSystemDialog: false,
            totalCount: 0,
            pageNo: 1,
            pageSize: 10,
            tableData: [],
            dialogVisible: false,
            systemId: ''
        };
    },
    created() {
        this.getsystemlist();
    },
    methods: {
        getchanges(row) {
            const parms = {
                id: row.id,
                name: row.name,
                administrator: row.administrator,
                description: row.description,
                address: row.address,
                isEnable: row.isEnable
            };
            getsystemUpdate(parms).then(res => {
                const data = res.data;
                if (data.success) {
                    this.successMsg(data.message);
                    this.getsystemlist();
                    this.$store.dispatch('getsystems');
                } else {
                    this.errorMsg(data.message);
                }
            });
        },
        getsystemlist() {
            this.pageNo = 1;
            this.totalCount = 0;
            this.tableData = [];
            const parms = {
                // name:this.systemName,
                pageNo: this.pageNo,
                pageSize: this.pageSize
            };
            getSystemList(parms).then(this.handleTableSucc.bind(this));
        },
        handleTableSucc(res) {
            const data = res.data;
            if (data.success && data.data.list) {
                this.tableData = data.data.list;
                this.totalCount = data.data.total;
            } else {
                this.errorMsg(data.message);
            }
        },
        handleClick(val) {
            this.$router.push({path: '/systemInfo', query: {systemInfo: JSON.stringify(val)}});
        },
        handleSizeChange(val) {
            this.pageSize = val;
            const parms = {
                // name:this.systemName,
                pageNo: this.pageNo,
                pageSize: this.pageSize
            };
            getSystemList(parms).then(this.handleTableSucc.bind(this));
        },
        handleCurrentChange(val) {
            this.pageNo = val;
            const parms = {
                // name:this.systemName,
                pageNo: this.pageNo,
                pageSize: this.pageSize
            };
            getSystemList(parms).then(this.handleTableSucc.bind(this));
        },
        // 新增系统
        addSystem() {
            this.isSystemDialog = true;
        },
        getSysDialig() {
            this.isSystemDialog = false;
            this.getsystemlist();
        },
        handleClose(done) {
            done();
        },
        // 菜单管理
        getMenus() {
            this.$router.push('/menu');
        },
        deleteSystem(row) {
            this.dialogVisible = true;
            this.systemId = row.id;
        },
        confirmDelet() {
            getdeleteSystem(this.systemId).then(res => {
                this.dialogVisible = false;
                const data = res.data;
                if (data.success) {
                    this.getsystemlist();
                    this.successMsg(data.message);
                    this.$store.dispatch('getsystems');
                } else {
                    this.errorMsg(data.message);
                }
            });
        }
    }
};
</script>

<style scoped>
@import '../../styles/system.css';
.headerCon {
    height: 40px;
    line-height: 40px;
    padding-left: 20px;
    background: #fff;
}
.headerCon >>> .el-button {
    padding: 8px 13px;
}
.context {
    font-size: 16px;
    font-weight: bold;
    margin-left: 20px;
}
.dialog-footer >>> .el-button {
    padding: 8px 15px;
}
</style>
