<template>
  <div>
    <div id="query-container">
      <el-card>
        <div>
          <el-form ref="queryForm" :model="queryForm" label-width="auto" id="query-box" :inline="true" label-position="left">
            <el-form-item>
              <el-button type="primary" @click="onQuery">搜索设备</el-button>
              <el-button @click="$func.clearObj(queryForm)" plain>清空</el-button>
              <el-button type="text" style="margin-left:10px" id="closeSearchBtn" @click="closeSearch">
                {{word}}
                <em :class="showAll ? 'el-icon-arrow-up ': 'el-icon-arrow-down'"></em>
              </el-button>
            </el-form-item>
            <el-form-item label="设备ID" label-width="80px" style="padding-left: 24px;">
              <el-input v-model.trim="queryForm.d_ID" clearable  style="width: 210px;"></el-input>
            </el-form-item>
            <el-form-item label="设备名称" label-width="80px" style="padding-left: 24px;">
              <el-input v-model="queryForm.d_name" clearable style="width: 210px;"></el-input>
            </el-form-item>
            <el-form-item multiple collapse-tags label="设备状态" label-width="80px" style="padding-left: 24px;">
              <el-select multiple collapse-tags v-model="queryForm.d_status" placeholder="请选择" @change='St_changeSelect' style="width: 240px;">
                <el-checkbox v-model="checkedStatus" @change='St_selectAll' class="select-all">全选</el-checkbox>
                <el-option v-for="(item, index) in statusList" :key="index" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="可见等级" label-width="80px" v-if="$auth.isAdmin">
              <el-select multiple collapse-tags v-model="queryForm.d_see" placeholder="请选择" @change='S_changeSelect' style="width: 183.79px;">
                <el-checkbox v-model="checkedSee" @change='S_selectAll' class="select-all">全选</el-checkbox>
                <el-option v-for="item in seeList" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label=" " label-width="263.79px" style="height: 40px;" v-else>
            </el-form-item>
            <el-form-item label="设备类型" label-width="80px" style="padding-left: 24px;">
              <el-select multiple collapse-tags v-model="queryForm.d_type" placeholder="请选择" @change='C_changeSelect' style="width: 302px;">
                <el-checkbox v-model="checkedCategory" @change='C_selectAll' class="select-all">全选</el-checkbox>
                <el-option v-for="item in categoryList" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="设备所在地点" label-width="110px" style="padding-left: 24px;">
              <el-input v-model="queryForm.d_place" clearable style="width: 432px;"></el-input>
            </el-form-item>
            <el-form-item label="设备投入使用日期" label-width="140px" style="margin-bottom: 0px;">
              <el-date-picker type="month" placeholder="选择最早投入使用日期" v-model="queryForm.d_date_start" style="width: 210px;" :picker-options="pickerOptions" value-format="yyyy-MM-01"></el-date-picker>
              <span>&nbsp;&nbsp;&nbsp;至&nbsp;&nbsp;&nbsp;</span>
              <el-date-picker type="month" placeholder="选择最晚投入使用日期" v-model="queryForm.d_date_end" style="width: 210px;" :picker-options="pickerOptions" value-format="yyyy-MM-01"></el-date-picker>
            </el-form-item>
            <el-form-item label="备注" label-width="61.1px" style="padding-left: 24px; margin-bottom: 0px;">
              <el-input v-model="queryForm.d_others" clearable style="width: 552px;"></el-input>
            </el-form-item>
          </el-form>
        </div>
      </el-card>
    </div>
    <div>
      <el-card id="device-table-container">
        <div>
          <el-table stripe :data="resultList.results" class="device-table" :height="tableHeight">
            <template slot="empty">请点击上方搜索栏查询设备！</template>
            <el-table-column prop="d_ID" label="设备ID" width="120" fixed></el-table-column>
            <el-table-column prop="d_name" label="设备名称" width="250" fixed></el-table-column>
            <el-table-column prop="d_status" label="设备状态" width="100" :formatter="D_STATUS" fixed></el-table-column>
            <el-table-column prop="d_place" label="设备所在地" width="150"></el-table-column>
            <el-table-column prop="d_see" label="可见等级" width="100" :formatter="D_SEE"></el-table-column>
            <el-table-column prop="d_type" label="设备类型" width="150" :formatter="D_TYPE"></el-table-column>
            <el-table-column prop="d_date" label="投入使用日期" width="120"></el-table-column>
            <el-table-column prop="d_others" label="备注" width="auto"></el-table-column>
            <el-table-column fixed="right" label="" width="80">
              <template slot-scope="scope">
                <el-button @click.native.prevent="onLendDialog(scope.$index, scope.row), dialogVisible = true" plain size="mini" :disabled="scope.row.d_status === 0 ? true : false">借用</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            background
            @current-change="handleCurrentChange"
            :current-page="page"
            :page-size="8"
            layout="total, prev, pager, next, jumper"
            :total="resultList.count"
            class="pagination">
          </el-pagination>
        </div>
      </el-card>
    </div>
    
    <el-dialog title="借用表单" :visible.sync="dialogVisible" width="30%" :before-close="handleClose" center>
      <el-form ref="lendForm" :model="lendForm" label-width="110px" :rules="rules">
        <el-form-item label="设备ID">
          <el-input v-model="lendForm.b_device" disabled class="dialogInput"></el-input>
        </el-form-item>
        <el-form-item label="设备名称">
          <el-input v-model="lendForm.b_device_name" disabled class="dialogInput"></el-input>
        </el-form-item>
        <el-form-item label="设备所在地点">
          <el-input v-model="lendForm.b_place" disabled class="dialogInput"></el-input>
        </el-form-item>
        <el-form-item label="借用缘由" prop="b_reason">
          <el-input v-model="lendForm.b_reason" clearable required class="dialogInput"></el-input>
        </el-form-item>
        <el-form-item label="预计归还时间" style="margin-bottom: 0px;">
          <el-col :span="11">
            <el-date-picker type="datetime" placeholder="选填" v-model="lendForm.r_assign" clearable style="width: 207.28%;" value-format="yyyy-MM-ddTHH:mm:ss"></el-date-picker>
          </el-col>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false, $func.clearObj(lendForm)" style="width: 100px; margin-right: 50px;">取消</el-button>
        <el-button type="primary" @click="onLend()" style="width: 100px;">借用</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Lend",
  data() {
    return {
      // 日期栏快捷选项
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
        shortcuts: [{
          text: '本月',
          onClick(picker) {
            picker.$emit('pick', new Date());
          }
        }]
      },

      showAll: true,
      tableHeight: 0,
      dialogVisible: false,
      page: 1,

      categoryList: this.$res.device_list,
      statusList: this.$res.device_status,
      seeList: this.$res.device_see,

      checkedCategory: false,
      checkedSee: false,
      checkedStatus: false,

      resultList: {
        count: 0,
        previous: null,
        next: null,
        results: []
      },

      queryForm: {
        d_ID: null,
        d_see: [],
        d_type: [],
        d_name: null,
        d_date_start: null,
        d_date_end: null,
        d_status: [],
        d_place: null,
        d_others: null
      },
      lendForm: {
        index: null,
        b_device: null,
        b_device_name: null,
        b_reason: null,
        b_place: null,
        r_assign: null
      },

      rules: {
        b_reason: [
          { required: true, message: '请输入借用缘由！', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    // 展开搜索处理
    word: function() {
      if (this.showAll === false) {
        //对文字进行处理
        return "展开搜索";
      } else {
        return "收起搜索";
      }
    }
  },
  methods: {
    // 失焦确认关闭
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(() => {
          this.$func.clearObj(this.lendForm);
          done();
        }).catch(() => {});
    },
    // 替换数字标识
    D_SEE(row) {
      for (let i of this.seeList) {
        if (row.d_see === i.id) {
          return i.name;
        }
      }
    },
    D_STATUS(row) {
      for (let i of this.statusList) {
        if (row.d_status === i.id) {
          return i.name;
        }
      }
    },
    D_TYPE(row) {
      for (let i of this.categoryList) {
        if (row.d_type === i.id) {
          return i.name;
        }
      }
    },
    // 分页
    handleCurrentChange(val) {
      this.page = val;
      this.onQuery();
    },
    // 全选
    S_selectAll() {
      if (this.checkedSee) {
        this.seeList.map((item) => {
          // 检查某些选项是否已经勾上
          if (this.queryForm.d_see.indexOf(item.id) === -1)
            this.queryForm.d_see.push(item.id);
        });
      } else {
        this.queryForm.d_see = [];
      }
    },
    C_selectAll() {
      if (this.checkedCategory) {
        this.categoryList.map((item) => {
          // 检查某些选项是否已经勾上
          if (this.queryForm.d_type.indexOf(item.id) === -1)
            this.queryForm.d_type.push(item.id);
        });
      } else {
        this.queryForm.d_type = [];
      }
    },
    St_selectAll() {
      if (this.checkedStatus) {
        this.statusList.map((item) => {
          // 检查某些选项是否已经勾上
          if (this.queryForm.d_status.indexOf(item.id) === -1)
            this.queryForm.d_status.push(item.id);
        });
      } else {
        this.queryForm.d_status = [];
      }
    },
    // 全选功能的一些细节实现
    C_changeSelect(val) {
      if (val.length === this.categoryList.length) {
        this.checkedCategory = true
      } else {
        this.checkedCategory = false
      }
    },
    S_changeSelect(val) {
      if (val.length === this.seeList.length) {
        this.checkedSee = true
      } else {
        this.checkedSee = false
      }
    },
    St_changeSelect(val) {
      if (val.length === this.statusList.length) {
        this.checkedStatus = true
      } else {
        this.checkedStatus = false
      }
    },
    // 查询设备
    onQuery() {
      const params = {
        d_ID: this.queryForm.d_ID,
        d_see: !this.queryForm.d_see ? null : this.queryForm.d_see.toString(),
        d_type: !this.queryForm.d_type ? null : this.queryForm.d_type.toString(),
        d_name: this.queryForm.d_name,
        d_date_start: this.queryForm.d_date_start,
        d_date_end: this.queryForm.d_date_end,
        d_status: !this.queryForm.d_status ? null : this.queryForm.d_status.toString(),
        d_place: this.queryForm.d_place,
        d_others: this.queryForm.d_others
      };

      this.$http.lend_device_query(params, this.page).then(res => {
        const data = res.data;
        if (data) {
          if (data.count === 0) {
            this.$message({
              message: '无结果，请重试！',
              type: 'info',
              showClose: true
            }); 
            return;
          }
          this.$message({
            message: '搜索成功！',
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
    //打开借用窗口
    onLendDialog(index, row) {
      this.lendForm.index = index;
      this.lendForm.b_device = row.d_ID;
      this.lendForm.b_device_name = row.d_name;
      this.lendForm.b_place = row.d_place;
      this.dialogVisible = true;
    },
    // 借用
    onLend() {
      this.$refs["lendForm"].validate(valid => {
        if (!valid) {
          if (!this.lendForm.b_reason) {
            this.$message({
              message: '请输入借用缘由！',
              type: 'warning',
              showClose: true
            });
          }
          if (!this.lendForm.b_device || !this.lendForm.b_device_name || !this.lendForm.b_place) {
            this.$message({
                message: '数据错误，请刷新网页！',
                type: 'error',
                showClose: true
            });
          }
        } else {
          const params = {
            b_device: this.lendForm.b_device,
            b_date: this.$func.getDateTime(),
            b_reason: this.lendForm.b_reason,
            b_place: this.lendForm.b_place
            // r_assign: this.lendForm.r_assign,
            // r_date: null,
            // r_place: null
          };
          if (this.lendForm.r_assign) {
            params.r_assign = this.lendForm.r_assign;
          }
          
          this.$http.lend(params).then(res => {
            const data = res.data;
            if (data.code === 404) {
              this.$message({
                message: '设备不存在，请刷新页面！',
                type: 'warning',
                showClose: true
              });
            } else if (data.code === 500) {
              this.$message({
                message: '设备已借出，请刷新页面！',
                type: 'warning',
                showClose: true
              });
            } else {
              // 确定借用后，更新状态，禁用借用按钮
              this.resultList.results[this.lendForm.index].d_status = 0;
              this.dialogVisible = false;
              this.$func.clearObj(this.lendForm);
              this.$message({
                message: '借用成功！',
                type: 'success',
                showClose: true
              });
            }
          }).catch(err => {
            this.$message({
                message: '借用失败，请重试或刷新网页！',
                type: 'error',
                showClose: true
            });
            console.log(err);
          });
        }
      })
    },
    // 展开搜索区域处理
    closeSearch() {
      const baseHeight = 41;
      this.showAll = !this.showAll;
      let searchBoxHeight = document.getElementById("query-box");
      if (this.showAll === false) {
        searchBoxHeight.style.height = baseHeight + "px";
      } else {
        searchBoxHeight.style.height = "auto";
      }
      this.changeHeight();
    },
    // 动态调整表格高度以及表格容器高度
    changeHeight() {
        let queryContainer = document.getElementById("query-container");
        let tableContainerHeight = document.getElementsByClassName('el-main main')[0].clientHeight - queryContainer.offsetHeight - 63;
        document.getElementById('device-table-container').style.height = tableContainerHeight + "px";
        this.tableHeight = tableContainerHeight - 72;
    }
  },
  mounted() {
    // 展开搜索区域处理
    this.$nextTick(function() {
      this.closeSearch();
    });

    // 监听窗口大小变化，自适应表格容器高度；勿忘注销( destroyed() )，否则切换到别的页面会报错
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
.device-table {
  width: 100%;
}
#device-table-container {
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
#device-table-container /deep/ .el-card__body {
  padding-top: 0px;
}
</style>