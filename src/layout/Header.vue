<template>
  <el-header class="header">
    <div class="navbar">
      <div class="side-change">
        <i class="el-icon-s-unfold" v-if="isCollapse" @click="changeSide"></i>
        <i class="el-icon-s-fold" v-else @click="changeSide"></i>
        <span class="bar-name" style="">{{$route.name}}</span>
      </div>
    </div>
  </el-header>
</template>
<script>
// import { mapGetters } from 'vuex';
export default {
    props: ['isCollapse'],

    // computed: {
    //     ...mapGetters([
    //         'userAvatar'
    //     ])
    // },
    methods: {
        changeSide() {
            this.$emit('changeSide');
        }
    }
};
</script>

<style lang="less" scoped>
.header {
  height: 64px;
  background: #fff;
  width: 100%;
  .navbar {
    height: 64px;
    background: #fff;
    width: 100%;
    i {
      padding-left: 10px;
      vertical-align: middle;
      font-size: 20px;
      color: #8f8f8f;
      cursor: pointer;
    }
    .side-change {
      display: inline-block;
      height: 64px;
      line-height: 64px;
      vertical-align: top;
    }
    .user-info {
      height: 64px;
      line-height: 64px;
      float: right;
      font-size: 14px;
      margin-right: 40px;
    }
    .user-info img {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      overflow: hidden;
      vertical-align: middle;
      margin-right: 10px;
    }
  }
}
.bar-name{
    display: inline-block;
    vertical-align: top;
    font-size: 16px;
    margin-left: 10px;
}
</style>
