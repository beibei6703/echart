<template>
  <el-aside :class="isCollapse ? 'side side-close' : 'side side-open'">
    <Logo />
    <el-menu
      :collapse="isCollapse"
      :default-active="defaultActive"
      :default-openeds="defaultOpeneds"
      @close="handleClose"
      @open="handleOpen"
      active-text-color="#fff"
      background-color="#001529"
      class="sider-menu"
      router
      text-color="rgba(255, 255, 255, 0.65)"
      v-if="systemMenuList.length"
    >
      <!-- <el-menu-item index="/OAflow">业务继承类</el-menu-item>
      <el-menu-item index="/OArequired">oa需求报表</el-menu-item>-->
      <div :key="index" v-for="(systemItem,index) in systemMenuList">
        <el-submenu :index="`${index}`" v-if="systemItem.name!=='系统设置'">
          <template slot="title">
            <i class="el-icon-user-solid"></i>
            <span>{{systemItem.name}}</span>
          </template>
          <div :key="index1" v-for="( levelItem, index1 ) in systemItem.children">
            <el-menu-item
              :index="levelItem.address.split('#')[1]"
              v-if="systemItem.children && levelItem.address && levelItem.children.length===0"
            >{{levelItem.name}}</el-menu-item>
            <div v-if="levelItem.children.length>0">
              <el-submenu :index="`${index}-${index1}`">
                <template slot="title">{{levelItem.name}}</template>
                <el-menu-item
                  :index="Item2.address.split('#')[1]"
                  :key="index2"
                  @click="getTypeId(Item2.name)"
                  v-for="(Item2,index2) in levelItem.children"
                >{{Item2.name}}</el-menu-item>
              </el-submenu>
            </div>
          </div>
        </el-submenu>
        <el-submenu :index="`${index}`" v-if="systemItem.name==='系统设置' && getShow===true">
          <template slot="title">
            <i class="el-icon-setting"></i>
            <span>{{systemItem.name}}</span>
          </template>
          <div :key="index1" v-for="( levelItem, index1 ) in systemItem.children">
            <el-menu-item
              :index="levelItem.address.split('#')[1]"
              v-if="systemItem.children && levelItem.address && levelItem.children.length===0"
            >{{levelItem.name}}</el-menu-item>
            <div v-if="levelItem.children.length>0">
              <el-submenu :index="`${index}-${index1}`">
                <template slot="title">{{levelItem.name}}</template>
                <el-menu-item
                  :index="Item2.address.split('#')[1]"
                  :key="index2"
                  @click="getTypeId(Item2.name)"
                  v-for="(Item2,index2) in levelItem.children"
                >{{Item2.name}}</el-menu-item>
              </el-submenu>
            </div>
          </div>
        </el-submenu>
      </div>
      <!-- <el-submenu index="20" v-if="getShow && getShow !==null">
        <template slot="title">
          <i class="el-icon-setting"></i>
          <span>系统设置</span>
        </template>
        <el-menu-item index="/systemlist"  v-if="getShow && getShow !==null">系统列表</el-menu-item>
        <el-menu-item index="/menuManage"  v-if="getShow && getShow !==null">菜单管理</el-menu-item>
      </el-submenu>-->
    </el-menu>
  </el-aside>
</template>
<script>
import Logo from './Logo';
import { ifRender } from '@src/utils/permission';
// import { getMenuList } from '@src/api/menu/index.js';
// import { getSystemList } from '@src/api/system/index.js';
export default {
    props: ['isCollapse'],
    components: {
        Logo
    },
    data() {
        return {
            ifRender,
            defaultActive: '',
            defaultOpeneds: []
        };
    },
    computed: {
        // 流程类别
        getAllProcess() {
            return this.$store.state.process.allProcess;
        },
        // 系统菜单
        systemMenuList() {
            return this.$store.state.process.systemMenuList;
        },
        getShow() {
            return this.$store.state.authority.Isshow;
        }
    },
    watch: {
        $route(to, from) {
            this.defaultActive = this.$router.history.current.path;
        }
    },
    created() {
        this.defaultActive = this.$router.history.current.path;
        // this.getsystems();
        // 获取系统菜单
        this.$store.dispatch('getsystems');
    },
    methods: {
        handleOpen(key, keyPath) {
            this.defaultOpeneds.push(key);
        },
        handleClose(key, keyPath) {
            this.defaultOpeneds.splice(this.defaultOpeneds.indexOf(key), 1);
        },
        // 点击左侧菜单获取对应流程id
        getTypeId(name) {
            if (this.getAllProcess && this.getAllProcess.length > 0) {
                for (var i = 0; i < this.getAllProcess.length; i++) {
                    if (this.getAllProcess[i].typename.indexOf(name) !== -1) {
                        localStorage.setItem('id', this.getAllProcess[i].id);
                        return;
                    }
                }
            }
        }
    }
};
</script>
<style lang="less" scoped>
.side {
    background: #001529;
    transition: all 0.3s linear;
    width: 78px;
    &::-webkit-scrollbar {
        width: 0px;
    }
}
.side-close {
    width: 60px !important;
}
.side-open {
    width: 200px !important;
}
.sider-menu {
    width: 100%;
}
.el-submenu__title span {
    padding-left: 7px !important;
}
</style>
