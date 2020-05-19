
<template>
  <div class="sidebar-logo-container">
    <transition name="sidebarLogoFade">
      <div key="expand" class="sidebar-logo-link">
        <img v-if="logo" src="../assets/image/logo.png" class="sidebar-logo">
         <span class="sidebar-title">{{ title }} </span>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
    name: 'SidebarLogo',
    data() {
        return {
            title: 'IT报表系统',
            logo: 'https://wpimg.wallstcn.com/69a1c46c-eb1c-4b46-8bd4-e9e686ef5251.png'
        };
    }
};
</script>

<style lang="less" scoped>
.sidebarLogoFade-enter-active {
  transition: opacity 1.5s;
}

.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
  opacity: 0.9;
}

.sidebar-logo-container {
  position: relative;
  width: 100%;
  height: 50px;
  line-height: 50px;
  background: #001529;
  padding: 0 20px;
  overflow: hidden;

  & .sidebar-logo-link {
    height: 100%;
    width: 100%;

    & .sidebar-logo {
      width: 32px;
      height: 32px;
      vertical-align: middle;
      margin-right: 12px;
    }

    & .sidebar-title {
      display: inline-block;
      margin: 0;
      color: #fff;
      font-weight: 600;
      line-height: 50px;
      font-size: 14px;
      font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
      vertical-align: middle;
    }
  }

  &.collapse {
    .sidebar-logo {
      margin-right: 0px;
    }
  }
}
</style>
