<template>
  <div>
    <el-card style="width: 440px">
      <div slot="header" style="font-size: 20px; font-family: HOS Medium;">修改密码</div>
      <div>
        <el-form ref="passForm" :model="passForm" label-width="100px" :rules="rules">
          <el-form-item label="原密码" prop="old">
            <el-input v-model.trim="passForm.old" :type="old_pass_type" clearable>
              <em slot="suffix" class="el-input__icon el-icon-view" @click="showPassOld"></em>
            </el-input>
          </el-form-item>
          <el-form-item label="新密码" prop="new">
            <el-input v-model.trim="passForm.new" :type="new_pass_type" clearable>
              <em slot="suffix" class="el-input__icon el-icon-view" @click="showPassNew"></em>
            </el-input>
          </el-form-item>
          <el-form-item label="确认新密码" prop="again">
            <el-input v-model.trim="passForm.again" type="password" clearable></el-input>
          </el-form-item>
          <el-button type="primary" @click="onModifyPass" style="width: 100px; margin-left: 150px;">确定修改</el-button>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "Me",
  data() {
    let valid_new = (rule, value, callback) => {
      if (value === this.passForm.old) {
        callback(new Error('请勿与旧密码一致！'));
      } else if (this.$res.init_pass.indexOf(value) !== -1) {
        callback(new Error('请勿使用低安全系数密码！'));
      } else {
        callback();
      }
    };
    let valid_again = (rule, value, callback) => {
      if (value !== this.passForm.new) {
        callback(new Error('与新密码不一致！'));
      } else {
        callback();
      }
    };
    return {
      old_pass_type: 'password',
      new_pass_type: 'password',
      tmp_pass: null,

      passForm: {
        old: null,
        new: null,
        again: null
      },
      rules: {
        old: [
          { required: true, message: '请输入密码！', trigger: 'blur' }
        ],
        new: [
          { required: true, message: '请输入密码！', trigger: 'blur' },
          { validator: valid_new, trigger: 'blur' }
        ],
        again: [
          { required: true, message: '请确认密码！', trigger: 'blur' },
          { validator: valid_again, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    showPassOld() {
      let e = document.getElementsByClassName('el-input__icon el-icon-view')[0];
      if (this.old_pass_type === "text") {
        this.old_pass_type = "password";
        e.setAttribute('style', 'color: #c0c4cc');
      } else {
        this.old_pass_type = "text";
        e.setAttribute('style', 'color: #409EFF');
      }
    },
    showPassNew() {
      let e = document.getElementsByClassName('el-input__icon el-icon-view')[1];
      if (this.new_pass_type === "text") {
        this.new_pass_type = "password";
        e.setAttribute('style', 'color: #c0c4cc');
      } else {
        this.new_pass_type = "text";
        e.setAttribute('style', 'color: #409EFF');
      }
    },
    onModifyPass() {
      this.$refs["passForm"].validate(valid => {
        if (!valid) {
          this.$message({
            message: '请检查错误并重试！',
            type: 'warning',
            showClose: true
          });
        } else {
          const params = {
            u_pass_old: this.passForm.old,
            // new: this.$crypt.encrypt(this.passForm.new)
            u_pass_new: this.passForm.new
          };
          this.$http.modify(params).then(res => {
            const data = res.data;
            if (data.code === 200) {
              this.$message({
                  message: '修改成功！',
                  type: 'success',
                  showClose: true
              });
              this.$func.clearObj(this.passForm);
            } else if (data.code === 403) {
                this.$message({
                  message: '请勿设置低安全系数的密码！',
                  type: 'warning',
                  showClose: true
                });
            } else if (data.code === 500) {
                this.$message({
                  message: '原密码不正确',
                  type: 'warning',
                  showClose: true
                });
            } else {
              this.$message({
                message: '修改失败，请稍后重试！',
                type: 'error',
                showClose: true
              });
            }
          }).catch(err => {
            console.log(err);
          });
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.el-form-item .el-input{
  width: 290px;
}
</style>