<template>
  <div>
    <div id="query-container">
      <el-card>
        <el-form ref="queryForm" :model="queryForm" label-width="auto" id="query-box" :inline="true" label-position="right">
          <el-form-item>
            <el-button type="primary" @click="onQuery">搜索用户</el-button>
            <el-button @click="$func.clearObj(queryForm)" plain>清空</el-button>
          </el-form-item>
          <el-form-item label="用户ID" label-width="100px" style="margin-left: 25px;">
            <el-input v-model="queryForm.u_ID" clearable style="width: 230px;"></el-input>
          </el-form-item>
          <el-form-item label="用户名" label-width="100px">
            <el-input v-model="queryForm.u_name" clearable style="width: 230px;"></el-input>
          </el-form-item>
          <el-form-item label="用户权限" label-width="100px">
            <el-select multiple collapse-tags v-model="queryForm.u_auth" placeholder="请选择" @change='changeSelect' style="width: 290px;">
              <el-checkbox v-model="checked" @change='selectAll' class="select-all">全选</el-checkbox>
              <el-option v-for="item in authList" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-card>
    </div>

    <div>
      <el-card id="table-container">
        <div>
          <el-table stripe :data="resultList.results" class="user-table" :height="tableHeight">
            <template slot="empty">请点击上方搜索栏查询用户！</template>
            <el-table-column prop="u_ID" label="用户ID" width="200" fixed></el-table-column>
            <el-table-column prop="u_name" label="用户名" width="500" fixed></el-table-column>
            <el-table-column prop="u_auth" label="用户权限" width="auto" :formatter="U_AUTH"></el-table-column>
            <el-table-column fixed="right" label="" width="150">
              <template slot-scope="scope">
                <el-button @click.native.prevent="onEditDialog(scope.$index, scope.row), dialogVisibleE = true" plain size="mini" :disabled="(!scope.row.u_ID || scope.row.u_ID === $auth.uid) ? true : false">编辑</el-button>
                <el-button @click.native.prevent="onDeleteDialog(scope.$index, scope.row), dialogVisibleD = true" type="danger" size="mini" :disabled="(!scope.row.u_ID || scope.row.u_ID === $auth.uid) ? true : false">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="table-footer">
            <el-button type="primary" @click="onAddDialog" id="add-btn">创建用户</el-button>
            <el-pagination
              background
              @current-change="handleCurrentChange"
              :current-page="page"
              :page-size="8"
              layout="total, prev, pager, next, jumper"
              :total="resultList.count"
              ></el-pagination>
          </div>
        </div>
      </el-card>
    </div>

    <el-dialog title="编辑用户" :visible.sync="dialogVisibleE" width="30%" :before-close="handleClose" center>
      <el-form ref="userForm" :model="userForm" label-width="100px" :rules="rules">
        <el-form-item label="用户ID">
          <el-input v-model="userForm.u_ID" disabled class="dialogInput"></el-input>
        </el-form-item>
        <el-form-item label="用户名" prop="u_name">
          <el-input v-model="userForm.u_name" class="dialogInput"></el-input>
        </el-form-item>
        <el-form-item label="用户权限" prop="u_auth">
          <el-select v-model="userForm.u_auth" placeholder="请选择" class="dialogInput">
            <el-option v-for="item in authList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-button type="primary" @click="resetPass" style="width: 130px; margin-left: 137.875px; margin-bottom: 0px;">重置密码</el-button>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleE = false, $func.clearObj(userForm)" style="width: 80px; margin-right: 50px;">取消</el-button>
        <el-button type="primary" @click="onEdit" style="width: 80px;">修改</el-button>
      </span>
    </el-dialog>

    <el-dialog title="创建用户" :visible.sync="dialogVisibleA" width="30%" :before-close="handleClose" center>
      <el-form ref="userForm" :model="userForm" label-width="100px" :rules="rules">
        <el-form-item label="用户ID" prop="u_ID">
          <el-input v-model="userForm.u_ID" class="dialogInput"></el-input>
        </el-form-item>
        <el-form-item label="用户名" prop="u_name">
          <el-input v-model="userForm.u_name" class="dialogInput"></el-input>
        </el-form-item>
        <el-form-item label="用户权限" prop="u_auth" style="margin-bottom: 0px;">
          <el-select v-model="userForm.u_auth" placeholder="请选择" class="dialogInput" style="margin-bottom: 0px;">
            <el-option v-for="item in authList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleA = false, $func.clearObj(userForm)" style="width: 80px; margin-right: 50px;">取消</el-button>
        <el-button type="primary" @click="onAdd" style="width: 80px;">创建</el-button>
      </span>
    </el-dialog>

    <el-dialog title="删除用户" :visible.sync="dialogVisibleD" width="30%" :before-close="handleClose" center>
      <el-form ref="userForm" :model="userForm" label-width="100px" disabled>
        <el-form-item label="用户ID">
          <el-input v-model="userForm.u_ID" class="dialogInput"></el-input>
        </el-form-item>
        <el-form-item label="用户名">
          <el-input v-model="userForm.u_name" class="dialogInput"></el-input>
        </el-form-item>
        <el-form-item label="用户权限" style="margin-bottom: 0px;">
          <el-select v-model="userForm.u_auth" class="dialogInput" style="margin-bottom: 0px;">
            <el-option v-for="item in authList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleD = false, $func.clearObj(userForm)" style="width: 80px; margin-right: 50px;">取消</el-button>
        <el-button type="danger" @click="onDelete" style="width: 80px;">删除</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Users",
  data() {
    return {
      tableHeight: 0,
      dialogVisibleE: false,
      dialogVisibleD: false,
      dialogVisibleA: false,
      page: 1,

      authList: this.$res.user_auth,
      checked: false,

      resultList: {
        count: 0,
        previous: null,
        next: null,
        results: []
      },

      queryForm: {
        u_ID: null,
        u_name: null,
        u_auth: []
      },
      userForm: {
        index: null,
        u_ID: null,
        u_name: null,
        u_auth: null
      },

      rules: {
        u_ID: [
          { required: true, message: '请输入用户ID！', trigger: 'blur' }
        ],
        u_name: [
          { required: true, message: '请输入用户名！', trigger: 'blur' }
        ],
        u_auth: [
          { required: true, message: '请选择用户等级！', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 重置密码
    resetPass() {
      const params = {
        u_ID: this.userForm.u_ID
      };
      this.$http.reset(params).then(res => {
        const data = res.data;
        if (data.code === 200) {
          this.$message({
            message: '重置成功！',
            type: 'success',
            showClose: true
          });
        } else {
          this.$message({
            message: '重置失败！',
            type: 'error',
            showClose: true
          });
        }
      }).catch(err => {
        this.$message({
          message: '重置失败！',
          type: 'error',
          showClose: true
        });
        console.log(err);
      })
    },
    // 替换数字标识
    U_AUTH(row) {
      for (let i of this.authList) {
        if (row.u_auth === i.id) {
          return i.name;
        }
      }
    },
    // 全选
    selectAll() {
      if (this.checked) {
        this.authList.map((item) => {
          // 检查某些选项是否已经勾上
          if (this.queryForm.u_auth.indexOf(item.id) === -1)
            this.queryForm.u_auth.push(item.id);
        });
      } else {
        this.queryForm.u_auth = [];
      }
    },
    // 全选功能的一些细节实现
    changeSelect(val) {
      if (val.length === this.authList.length) {
        this.checked = true
      } else {
        this.checked = false
      }
    },
    // 失焦确认关闭
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(() => {
          this.$func.clearObj(this.userForm);
          done();
        }).catch(() => {});
    },
    // 分页
    handleCurrentChange(val) {
      this.page = val;
      this.onQuery();
    },
    // 查询记录
    onQuery() {
      const params = {
        u_ID: this.queryForm.u_ID,
        u_name: this.queryForm.u_name,
        u_auth: !this.queryForm.u_auth ? null : this.queryForm.u_auth.toString()
      };

      this.$http.manageUserQuery(params, this.page).then(res => {
        const data = res.data;
        if (data) {
          if (data.count === 0) {
            this.$message({
              message: '无结果！',
              type: 'info',
              showClose: true
            }); 
            return;
          }
          this.$message({
            message: '查询成功！',
            type: 'success',
            showClose: true
          });
          this.resultList.count = data.count;
          this.resultList.previous = data.previous;
          this.resultList.next = data.next;
          this.resultList.results = data.results;
        } else {
          this.$message({
            message: '搜索失败，请稍后重试！',
            type: 'error',
            showClose: true
          }); 
        }
      }).catch(err => {
        this.$message({
          message: '搜索失败，请稍后重试！',
          type: 'error',
          showClose: true
        }); 
        console.log(err);
      });
    },
    //打开编辑窗口
    onEditDialog(index, row) {
      this.userForm.index = index;
      this.userForm.u_ID = row.u_ID;
      this.userForm.u_name = row.u_name;
      this.userForm.u_auth = row.u_auth;

      this.dialogVisibleE = true;
    },
    // 编辑
    onEdit() {
      this.$refs["userForm"].validate(valid => {
        if (!valid) {
          this.$message({
            message: '请检查并重试！',
            type: 'error',
            showClose: true
          });
        } else {
          const params = {
            u_ID: this.userForm.u_ID,
            u_name: this.userForm.u_name,
            u_auth: this.userForm.u_auth,
          };
          
          this.$http.manageUserPut(params, this.userForm.u_ID).then(res => {
            const data = res.data;
            if (data.code === 404) {
              this.$message({
                message: '用户不存在，请刷新页面！',
                type: 'warning',
                showClose: true
              });
            } else {
              // 确定编辑后，更新状态
              this.resultList.results[this.userForm.index].u_ID = data.u_ID;
              this.resultList.results[this.userForm.index].u_name = data.u_name;
              this.resultList.results[this.userForm.index].u_auth = data.u_auth;
              
              this.dialogVisibleE = false;
              this.$func.clearObj(this.userForm);
              this.$message({
                message: '编辑成功！',
                type: 'success',
                showClose: true
              });
            }
          }).catch(err => {
            this.$message({
              message: '编辑失败，请重试或刷新网页！',
              type: 'error',
              showClose: true
            });
            console.log(err);
          });
        }
      })
    },
    //打开删除窗口
    onDeleteDialog(index, row) {
      this.userForm.index = index;
      this.userForm.u_ID = row.u_ID;
      this.userForm.u_name = row.u_name;
      this.userForm.u_auth = row.u_auth;

      this.dialogVisibleD = true;
    },
    // 删除
    onDelete() {
      this.$refs["userForm"].validate(valid => {
        if (!valid) {
          this.$message({
            message: '数据错误，请刷新网页！',
            type: 'error',
            showClose: true
          });
        } else {
          this.$http.manageUserDelete(this.userForm.u_ID).then(res => {
            const data = res.data;
            if (!data) {
              this.dialogVisibleD = false;
              this.resultList.results[this.userForm.index].u_ID = '';
              this.$func.clearObj(this.userForm);              
              this.$message({
                message: '删除成功！',
                type: 'success',
                showClose: true
              });
            } else {
              this.$message({
                message: '删除失败，请重试！',
                type: 'error',
                showClose: true
              });
              
            }
          }).catch(err => {
            this.$message({
              message: '删除失败，请重试或刷新网页！',
              type: 'error',
              showClose: true
            });
            console.log(err);
          });
        }
      })
    },
    //打开创建窗口
    onAddDialog() {
      this.dialogVisibleA = true;
    },
    // 创建
    onAdd() {
      this.$refs["userForm"].validate(valid => {
        if (!valid) {
          this.$message({
            message: '请检查并重试！',
            type: 'warning',
            showClose: true
          });
        } else {
          let params = {
            u_ID: this.userForm.u_ID,
            u_name: this.userForm.u_name,
            u_pass: "123456",
            u_auth: this.userForm.u_auth
          };
          
          this.$http.manageUserAdd(params).then(res => {
            const data = res.data;
            if (data) {
              this.dialogVisibleA = false;
              this.$func.clearObj(this.userForm);
              this.onQuery();
              this.$message({
                message: '创建成功！',
                type: 'success',
                showClose: true
              });
            } else {
              this.$message({
                message: '创建失败，请重试！',
                type: 'error',
                showClose: true
              });
              
            }
          }).catch(err => {
            this.$message({
              message: '创建失败，请重试或刷新网页！',
              type: 'error',
              showClose: true
            });
            console.log(err);
          });
        }
      })
    },
    // 搜索区域处理
    closeSearch() {
      const baseHeight = 41;
      let searchBoxHeight = document.getElementById("query-box");
      searchBoxHeight.style.height = baseHeight + "px";
      this.changeHeight();
    },
    // 动态调整表格高度以及表格容器高度
    changeHeight() {
        let queryContainer = document.getElementById("query-container");
        let tableContainerHeight = document.getElementsByClassName('el-main main')[0].clientHeight - queryContainer.offsetHeight - 63;
        document.getElementById('table-container').style.height = tableContainerHeight + "px";
        this.tableHeight = tableContainerHeight - 72;
    }
  },
  mounted() {
    // 展开搜索区域处理
    this.$nextTick(function() {
      this.closeSearch();
    });

    // 监听窗口大小变化，自适应表格容器高度；勿忘注销，否则切换到别的页面会报错
    let that = this;
    window.onresize = () => {
      return (() => {
        that.changeHeight();
      })();
      //这里分号前面的 () 很重要，删去则不能实现自适应高度变化。
    };
  },
  destroyed(){
    window.onresize = null;
  }
}
</script>

<style scoped lang="scss">
.table-footer {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-left: 5px;
  margin-top: 20px;
}
.dialogInput {
  width: 95%;
}
#query-box {
  overflow: hidden;
}
.el-form-item {
  margin-right: 0px !important;
}
.board-form {
  display: inline-block !important;
}
.user-table {
  width: 100%;
}
#table-container {
  margin-top: 20px;
}
.el-checkbox {
    text-align: left;
    width: auto;
    padding-left: 20px;
    padding-bottom: 5px;
    padding-top: 5px;
}
.pagination {
  margin-top: 20px;
  text-align: right;
}
</style>

<style scoped>
#table-container /deep/ .el-card__body {
  padding-top: 0px;
}
</style>