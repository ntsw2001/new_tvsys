<template>
  <div>
    <div>
      <el-card id="record-table-container">
        <div>
          <el-table stripe :data="resultList.results" class="record-table" :height="tableHeight">
            <template slot="empty">请点击左下方查询按钮查询记录！</template>
            <el-table-column prop="b_ID" label="借用ID" width="200" fixed></el-table-column>
            <el-table-column prop="b_device_name" label="设备名称" width="220" fixed></el-table-column>
            <el-table-column prop="b_date" label="借用日期" width="165"></el-table-column>
            <el-table-column prop="b_reason" label="借用缘由" width="200"></el-table-column>
            <el-table-column prop="r_assign" label="预计归还日期" width="165"></el-table-column>
            <el-table-column prop="b_place" label="借用地点" width="100"></el-table-column>
            <el-table-column prop="r_place" label="归还地点" width="100"></el-table-column>
            <el-table-column prop="r_date" label="归还日期" width="165"></el-table-column>
            <el-table-column prop="b_device" label="设备ID" width="120"></el-table-column>
            <el-table-column fixed="right" label="" width="80">
              <template slot-scope="scope">
                <el-button
                  @click.native.prevent="onReturnDialog(scope.$index, scope.row), dialogVisible = true"
                  plain
                  size="mini"
                  :disabled="!scope.row.r_date ? false : true"
                  >归还</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="table-footer">
            <el-button type="primary" @click="onGetRecords" id="records-btn">查询借用记录</el-button>
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

    <el-dialog title="归还表单" :visible.sync="dialogVisible" width="30%" :before-close="handleClose" center>
      <el-form ref="returnForm" :model="returnForm" label-width="100px" :rules="rules">
        <el-form-item label="借用ID">
          <el-input v-model="returnForm.b_ID" disabled class="dialogInput"></el-input>
        </el-form-item>
        <el-form-item label="借用设备名">
          <el-input v-model="returnForm.b_device_name" disabled class="dialogInput"></el-input>
        </el-form-item>
        <el-form-item label="借用日期">
          <el-input v-model="returnForm.b_date" disabled class="dialogInput"></el-input>
        </el-form-item>
        <el-form-item label="借用缘由">
          <el-input v-model="returnForm.b_reason" disabled class="dialogInput"></el-input>
        </el-form-item>
        <el-form-item label="归还地点" prop="r_place">
          <el-input v-model="returnForm.r_place" clearable required class="dialogInput"></el-input>
        </el-form-item>
        <el-form-item label="归还日期" prop="r_date" style="margin-bottom: 0px;">
          <el-col :span="11">
            <el-date-picker type="datetime" placeholder="归还日期" v-model="returnForm.r_date" clearable style="width: 207.28%;" value-format="yyyy-MM-ddTHH:mm:ss"></el-date-picker>
          </el-col>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false, $func.clearObj(returnForm)" style="width: 100px; margin-right: 50px;">取消</el-button>
        <el-button type="primary" @click="onReturn()" style="width: 100px;">归还</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Return",
  data() {
    return {
      tableHeight: 0,
      dialogVisible: false,
      page: 1,

      resultList: {
        count: 0,
        previous: null,
        next: null,
        results: []
      },
      returnForm: {
        index: null,
        b_ID: null,
        b_device_name: null,
        b_date: null,
        b_reason: null,
        r_date: null,
        r_place: null
      },

      rules: {
        r_date: [
          { required: true, message: '请输入归还日期！', trigger: 'blur' }
        ],
        r_place: [
          { required: true, message: '请输入归还地点！', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 失焦确认关闭
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(() => {
          this.$func.clearObj(this.returnForm);
          done();
        }).catch(() => {});
    },
    // 分页
    handleCurrentChange(val) {
      this.page = val;
      this.onQuery();
    },
    // 查询记录
    onGetRecords() {
      this.$http.returnGetRecords(this.page).then(res => {
        const data = res.data;
        if (data) {
          if (data.code === 404) {
            this.$message({
              message: '查询成功，无结果！',
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
          
          // 去除时间中的 T
          for (let item of this.resultList.results) {
            item.b_date = item.b_date.replace("T", " ");
            if (item.r_assign) {
              item.r_assign = item.r_assign.replace("T", " ");
            }
          }

        } else {
          this.$message({
            message: '查询失败，请稍后重试！',
            type: 'error',
            showClose: true
          }); 
        }
      }).catch(err => {
        console.log(err);
      });
    },
    //打开归还窗口
    onReturnDialog(index, row) {
      this.returnForm.index = index;
      this.returnForm.b_ID = row.b_ID;
      this.returnForm.b_device_name = row.b_device_name;
      this.returnForm.b_place = row.b_place;
      this.returnForm.b_date = row.b_date;
      this.returnForm.b_reason = row.b_reason;
      this.dialogVisible = true;
    },
    // 归还
    onReturn() {
      this.$refs["returnForm"].validate(valid => {
        if (!valid) {
          this.$message({
                message: '归还失败，请重试！',
                type: 'error',
                showClose: true
            });
        } else {
          const params = {
            r_date: this.returnForm.r_date,
            r_place: this.returnForm.r_place
          };
          
          this.$http.returnPut(params, this.returnForm.b_ID).then(res => {
            const data = res.data;
            if (data.code === 404) {
              this.$message({
                message: '未找到记录！',
                type: 'warning',
                showClose: true
              });
            } else if (data.code === 500) {
              this.$message({
                message: '未传递归还地点或归还时间！',
                type: 'warning',
                showClose: true
              });
            } else {
              // 确定归还后，更新状态，禁用归还按钮
              this.resultList.results[this.returnForm.index].r_date = data.r_date.replace("T", " ");
              this.resultList.results[this.returnForm.index].r_place = data.r_place;
              this.dialogVisible = false;
              this.$func.clearObj(this.returnForm);
              this.$message({
                message: '归还成功！',
                type: 'success',
                showClose: true
              });
            }
          }).catch(err => {
            this.$message({
                message: '归还失败，请重试或刷新网页！',
                type: 'error',
                showClose: true
            });
            console.log(err);
          });
        }
      })
    },
    // 动态调整表格高度以及表格容器高度
    changeHeight() {
        let tableContainerHeight = document.getElementsByClassName('el-main main')[0].clientHeight - 43;
        document.getElementById('record-table-container').style.height = tableContainerHeight + "px";
        this.tableHeight = tableContainerHeight - 79.6;
    }
  },
  mounted() {
    this.$nextTick(function() {
      this.changeHeight();
    });

    // 监听窗口大小变化，自适应表格容器高度
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
.el-form-item {
  margin-right: 0px !important;
}
.record-table {
  width: 100%;
}
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
</style>

<style scoped>
#record-table-container /deep/ .el-card__body {
  padding-top: 0px;
}
</style>