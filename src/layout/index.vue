<template>
  <el-container style="height: 100%">
    <sider :isCollapse="isCollapse"/>
    <el-container>
      <el-main>
        <div class="main-warp">
          <Header :isCollapse="isCollapse" @changeSide="changeSide"/>
          <router-view></router-view>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
import Header from './Header.vue';
import Sider from './Sider.vue';
export default {
    components: {
        Header,
        Sider
    },
    data() {
        return {
            isCollapse: false
        };
    },
    methods: {
        changeSide() {
            this.isCollapse = !this.isCollapse;
        }
    }
};
</script>
<style lang="less" scoped>
.main-warp{
    width:100%;
    height:100%;
}
</style>
