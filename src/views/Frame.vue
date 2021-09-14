<template>
  <div>
    <el-container class="frame-container">
      <el-aside width="201px" class="aside">
        <el-menu :default-active="activedMenu" class="menu" :router="true">
          <el-menu-item index="/main">
            <em class="el-icon-document"></em>
            <span slot="title">归还</span>
          </el-menu-item>
          <el-menu-item index="/lend">
            <em class="el-icon-video-camera"></em>
            <span slot="title">借用</span>
          </el-menu-item>
          <el-submenu index="/manage/devices" v-if="$auth.isAdmin">
            <template slot="title">
              <em class="el-icon-s-operation"></em><span>管理</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="/manage/records">记录</el-menu-item>
              <el-menu-item index="/manage/devices">设备</el-menu-item>
              <el-menu-item index="/manage/users">用户</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-menu-item index="/me">
            <em class="el-icon-setting"></em>
            <span slot="title">个人中心</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-container>
        <el-header class="header">
          <div class="header-content">
            <div class="welcome">欢迎，{{$auth.user}}</div>
            <el-button type="primary" plain class="logout-btn" @click="logout">注销</el-button>
          </div>
        </el-header>
        <el-main class="main">
          <router-view></router-view>
        </el-main>
        <el-footer class="footer">
          <div class="beian">
            <span>©2021版权所有&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
            <a href="https://beian.miit.gov.cn/" id="icp" target="_blank">苏ICP备2021018238号-1</a>
          </div>
        </el-footer>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  name: "Main",
  data() {
    return {
      activedMenu: this.getActive()
    }
  },
  methods: {
    logout() {
      this.$auth.rmAll();
      this.$router.replace('/');
      this.$message({
        message: '注销成功！',
        type: 'success',
        showClose: true
      });
    },
    // 校正菜单栏和路由的关系
    getActive() {
      if (this.$route.path.indexOf('/main') === 0) {
        return '/main';
      } else if (this.$route.path.indexOf('/lend') === 0) {
        return '/lend';
      } else if (this.$route.path.indexOf('/me') === 0) {
        return '/me';
      } else if (this.$route.path.indexOf('/manage/devices') === 0) {
        return '/manage/devices';
      } else if (this.$route.path.indexOf('/manage/users') === 0) {
        return '/manage/users';
      } else if (this.$route.path.indexOf('/manage/records') === 0) {
        return '/manage/records';
      } else {
        return '/main';
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.frame-container {
  height: 100vh;
  .aside{
    background: #fff;
    border-right: 1px solid #d8dce5;
  }
  .header{
    height: 56px !important;
    overflow: hidden;
    background: #fff;
    border-bottom: 1px solid #d8dce5;
    .header-content {
      padding-top: 9px;
      overflow: hidden;
      float: right;
      .welcome {
        display: inline;
        margin-right: 10px;
      }
      .logout-btn {
        display: inline;
        border: none;
      }
    }
  }
  .main{
    background: #eee;
  }
  .footer{
    height: 40px !important;
    text-align: center;
    border-top: 1px solid #d8dce5;
    background: #eee;
    .beian {
      margin: 12px 0;
      font-size: 14px;
      color: #888;
      #icp {
        color: #888;
      }
      #icp:hover {
        color: #aaa;
      }
    }
  }
}
.menu {
  border: none;
}
</style>