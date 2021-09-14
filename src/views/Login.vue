<template>
<div class="login-container">
  <div class="loginBlock">
    <el-row :gutter="0">
      <el-col :span="6" :offset="9">
        <el-card class="login-card">
          <div slot="header" class="login-title">
            <h1>欢迎登录<br>设备管理系统</h1>
          </div>
          <div>
            <el-form ref="loginForm" :model="loginForm" label-position="top" label-width="0px" :rules="rules">
              <el-form-item label="" prop="u_ID" class="input-uid">
                <el-input clearable
                          v-model.trim="loginForm.u_ID"
                          placeholder="学号/工号"
                          prefix-icon="el-icon-user"></el-input>
              </el-form-item>
              <el-form-item label="" prop="u_pass" class="input-pass">
                <el-input clearable
                          v-model.trim="loginForm.u_pass"
                          placeholder="密码"
                          :type="pass_type"
                          prefix-icon="el-icon-lock">
                <em slot="suffix" class="el-input__icon el-icon-view" @click="showPass"></em>
              </el-input>
              </el-form-item>
            </el-form>
            <el-button type="primary" @click="onLogin" class="loginButton">登录</el-button>
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
  name: "Login",
  data() {
    return {
      pass_type: "password",
      loginForm: {
        u_ID: null,
        u_pass: null
      },
      rules: {
        // 这里的名字务必和 loginForm 里的名字一一对应，不能乱写
        u_ID: [
          { required: true, message: '请输入学号或工号！', trigger: 'blur' }
        ],
        u_pass: [
          { required: true, message: '请输入密码！', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    showPass() {
      //密码的显示与否
      let e = document.getElementsByClassName('el-input__icon el-icon-view')[0];
      if (this.pass_type === "text") {
        this.pass_type = "password";
        e.setAttribute('style', 'color: #c0c4cc');
      } else {
        this.pass_type = "text";
        e.setAttribute('style', 'color: #409EFF');
      }
    },
    onLogin() {
      this.$refs["loginForm"].validate(valid => {
        if (!valid) {
          this.$message({
            message: '学号或工号或密码不能为空！',
            type: 'warning',
            showClose: true
          });
        } else {
          const params = {
            u_ID: this.loginForm.u_ID,
            // u_pass: this.$crypt.encrypt(this.loginForm.u_pass)
            u_pass: this.loginForm.u_pass
          };
          this.$http.login(params).then(res => {
            const data = res.data;
            if (data.code === 200) {
              const u_name = data.u_name;
              const token = data.token;
              const u_auth = data.u_auth;
              this.$auth.setUser(u_name, this.loginForm.u_ID);
              this.$auth.setToken(token);
              this.$auth.setAuth(u_auth);

              // 若中途未登录访问，登录成功后返回登录前路由；
              // 对于非管理用户访问管理页的行为实行拦截，只重定向到主页，如果是非管理页则正常重定向。
              let redirect = decodeURIComponent(this.$route.query.redirect || '/main');
              if (u_auth === 1 && redirect.indexOf('manage') !== -1) {
                this.$router.push('/main');
              } else {
                this.$router.push({path: redirect});
              }
              
              this.$message({
                message: '登录成功！',
                type: 'success',
                showClose: true
              });
            } else if (data.code === 500) {
              this.$message({
                message: '学号或工号或密码错误，请重试！',
                type: 'warning',
                showClose: true
              });
            } else {
              this.$message({
                message: '登陆失败，请稍后重试！',
                type: 'error',
                showClose: true
              });
            }
          }).catch(err => {
            this.$message({
              message: '登陆失败，请稍后重试！',
              type: 'error',
              showClose: true
            });
            console.log(err);
          });
        }
      })
    }
  }
};
</script>

<style scoped lang="scss">
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
.el-form-item label {
  width: 0px;
}
.loginBlock {
  height: calc(100vh - 41px);
}
.login-container {
  height: 100vh;
  background: #eee;

  .login-card{
    margin-top: 20vh;
  }
}
.login-title, .login-card {
  text-align: center;
}
.login-title {
  padding-top: 20px;
  padding-bottom: 20px;
  font-family: "HOS Medium";
}
.loginButton {
  width: 40%;
}
.input-uid, .input-pass {
  margin-top: 10px;
  margin-left: 10%;
  margin-right: 10%;
}
</style>