<template>
  <div class="menu">
    <div class="headerCon">
      <el-button @click="addFirmenu" icon="el-icon-plus" type="primary">新增一级菜单</el-button>
      <div class="leftInput">
        <el-input placeholder="系統/菜单名称" v-model="inputName">
          <i class="el-input__icon el-icon-search" slot="prefix"></i>
        </el-input>
        <el-button @click="getSearch">搜索</el-button>
      </div>
    </div>
    <div class="tables">
      <el-table :data="tableData" @sort-change="getsort" border>
        <el-table-column align="center" label="系统名称" prop="systemName"></el-table-column>
        <el-table-column align="center" label="菜单名称" prop="name"></el-table-column>
        <el-table-column align="center" label="菜单类型">
          <template slot-scope="scope">
            <span v-if=" scope.row.level===1">一级菜单</span>
            <span v-if=" scope.row.level===2">二级菜单</span>
            <!-- <span v-if=" scope.row.level===3">三级菜单</span> -->
          </template>
        </el-table-column>
        <el-table-column align="center" label="上一级菜单">
          <template slot-scope="scope">
            <span v-if="scope.row.parentName">{{scope.row.parentName}}</span>
            <span v-else>无</span>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" label="菜单访问地址" prop="address"></el-table-column>
        <el-table-column
          :sort-orders="['ascending', 'descending']"
          align="center"
          label="更新时间"
          prop="gmtModified"
          sortable="custom"
        ></el-table-column>
        <el-table-column align="center" label="操作" width="180">
          <template slot-scope="scope">
            <el-button
              :disabled="scope.row.level===2?true:false"
              @click="addSecMenu(scope.row)"
              size="small"
              type="text"
            >新建二级菜单</el-button>
            <el-button @click="handleEdit(scope.row)" size="small" type="text">编辑</el-button>
            <el-button @click="deletMenu(scope.row)" size="small" type="text">删除</el-button>
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
    <firMenu
      :isFirmenuDialog="isFirmenuDialog"
      :menuItem="menuItem"
      @getDialog="getDialogs"
      v-if="isFirmenuDialog"
    ></firMenu>
    <secMenu
      :isSecMenuDialog="isSecMenuDialog"
      :menuItem="menuItem"
      @getDialogSec="getSecDialogs"
      v-if="isSecMenuDialog"
    ></secMenu>
  </div>
</template>

<script>
import { getMenuList, getMenudelete } from '@src/api/menu/index.js';
import firMenu from '../dialog/firmenu';
import secMenu from '../dialog/secmenu';

export default {
    name: 'menuManage',
    components: {
        firMenu,
        secMenu
    },
    data() {
        return {
            inputName: '',
            isFirmenuDialog: false,
            isSecMenuDialog: false,
            totalCount: 0,
            pageNo: 1,
            pageSize: 10,
            tableData: [],
            menuItem: {},
            order: 'gmt_modified',
            orderType: ''
        };
    },
    created() {
        this.getMenus();
    },
    methods: {
        getSearch() {
            this.tableData = [];
            this.pageNo = 1;
            this.getMenus();
        },
        getsort(val) {
            if (val.order === 'ascending') {
                this.orderType = 'ASC';
                this.getMenus();
            } else {
                this.orderType = 'DESC';
                this.getMenus();
            }
        },
        // 获取菜单列表
        getMenus() {
            const parms = {
                keyword: this.inputName,
                order: this.order,
                orderType: this.orderType,
                pageSize: this.pageSize,
                pageNo: this.pageNo
            };
            getMenuList(parms).then(this.handleTable.bind(this));
        },
        handleTable(res) {
            const data = res.data;
            if (data.success && data.data.list) {
                this.totalCount = data.data.total;
                this.tableData = data.data.list;
            }
        },
        handleSizeChange(val) {
            this.pageSize = val;
            const parms = {
                keyword: this.inputName,
                order: this.order,
                orderType: this.orderType,
                pageNo: this.pageNo,
                pageSize: this.pageSize
            };
            getMenuList(parms).then(this.handleTable.bind(this));
        },
        handleCurrentChange(val) {
            this.pageNo = val;
            const parms = {
                keyword: this.inputName,
                pageNo: this.pageNo,
                order: this.order,
                orderType: this.orderType,
                pageSize: this.pageSize
            };
            getMenuList(parms).then(this.handleTable.bind(this));
        },
        // 新增一级菜单
        addFirmenu() {
            this.menuItem = {};
            this.isFirmenuDialog = true;
        },
        getDialogs() {
            this.isFirmenuDialog = false;
            this.getMenus();
        },
        getSecDialogs() {
            this.isSecMenuDialog = false;
            this.getMenus();
        },
        handleEdit(row) {
            this.menuItem = row;
            this.$store.commit('changeType', 'edit');
            // localStorage.setItem("type",'edit')
            if (row.level === 1) {
                this.isFirmenuDialog = true;
            } else {
                this.isSecMenuDialog = true;
                this.$store.commit('changeType', 'edit');
                // localStorage.setItem("type",'edit')
            }
        },
        addSecMenu(row) {
            this.menuItem = row;
            // localStorage.setItem("type",'add')
            this.$store.commit('changeType', 'add');
            this.isSecMenuDialog = true;
        },
        deletMenu(row) {
            getMenudelete(row.id).then(res => {
                const data = res.data;
                if (data.success) {
                    this.successMsg(data.message);
                    this.$store.dispatch('getsystems');
                    this.getMenus();
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
    padding-left: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #fff;
}
.leftInput {
    height: 40px;
    width: 300px;
    display: flex;
    justify-content: center;
    align-items: center;
}
.leftInput >>> .el-button {
    padding: 8px 15px;
}
.leftInput >>> .el-input {
    width: 200px;
    height: 30px;
    margin-right: 10px;
}
.leftInput >>> .el-icon-search {
    line-height: 30px;
}
.leftInput >>> .el-input__inner {
    width: 200px;
    height: 30px;
}
.headerCon >>> .el-button {
    padding: 8px 15px;
}
</style>
