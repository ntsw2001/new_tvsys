<template>
  <div>
    <div id="container">
      <el-row :gutter="0">
        <el-col :span="10" :offset="7">
          <el-card id="card" style="padding-left: 30px; padding-bottom: 10px;">
            <div>
              <p id="title">404</p>
              <p id="content">你的页面走丢了！</p>
              <el-link type="info" @click="goMain" id="go-main">点击此处返回刚才的页面...</el-link>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <div class="footer">
      <div class="beian">
        <span>©2021版权所有&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
        <a href="https://beian.miit.gov.cn/" id="icp" target="_blank">苏ICP备2021018238号-1</a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    goMain() {
      let redirect = decodeURIComponent(this.$route.query.redirect || '/main');
      if (redirect !== '/') {
        this.$router.push({path: redirect});
      } else {
        this.$router.push('/main');
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.footer{
  height: 40px;
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
#container {
  height: calc(100vh - 41px);
  background: #eee;

  #card{
    margin-top: 20vh;
  }
}
#go-main {
  font-size: 20px;
}
#title {
  font-family: "HOS Medium";
  font-size: 120px;
}
#content {
  font-size: 50px;
  margin-bottom: 50px;
}
</style>