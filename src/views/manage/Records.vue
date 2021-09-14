<template>
  <div>
    <div id="query-container">
      <el-card>
        <el-form ref="queryForm" :model="queryForm" label-width="auto" id="query-box" :inline="true" label-position="left">
          <el-form-item>
            <el-button type="primary" @click="onQuery">搜索记录</el-button>
            <el-button @click="$func.clearObj(queryForm)" plain>清空</el-button>
            <el-button type="text" style="margin-left:10px" id="closeSearchBtn" @click="closeSearch">
              {{word}}
              <em :class="showAll ? 'el-icon-arrow-up ': 'el-icon-arrow-down'"></em>
            </el-button>
          </el-form-item>
          <el-form-item label="借用人姓名" label-width="85px" style="margin-left: 27.41px;">
            <el-input v-model="queryForm.b_user_name" clearable class="query-input1"></el-input>
          </el-form-item>
          <el-form-item label="借用设备名" label-width="85px" style="margin-left: 25px;">
            <el-input v-model="queryForm.b_device_name" clearable class="query-input1"></el-input>
          </el-form-item>
          <el-form-item label="借用理由" label-width="70px" style="margin-left: 20px;">
            <el-input v-model="queryForm.b_reason" clearable class="query-input2"></el-input>
          </el-form-item>
          <el-form-item label="借用ID" label-width="70px">
            <el-input v-model.trim="queryForm.b_ID" clearable style="width: 193.79px;"></el-input>
          </el-form-item>
          <el-form-item label="借用人ID" label-width="85px" style="margin-left: 27.41px;">
            <el-input v-model="queryForm.b_user" clearable class="query-input1"></el-input>
          </el-form-item>
          <el-form-item label="借用设备ID" label-width="85px" style="margin-left: 25px;">
            <el-input v-model="queryForm.b_device" clearable class="query-input1"></el-input>
          </el-form-item>
          <el-form-item label="借用地点" label-width="70px" style="margin-left: 20px;">
            <el-input v-model="queryForm.b_place" clearable class="query-input2"></el-input>
          </el-form-item>
          <el-form-item label="借用日期" label-width="70px">
            <el-date-picker type="datetime" placeholder="选择最早借用日期" v-model="queryForm.b_date_start" value-format="yyyy-MM-dd HH:mm:ss" class="query-date1"></el-date-picker>
            <span>&nbsp;&nbsp;&nbsp;至&nbsp;&nbsp;&nbsp;</span>
            <el-date-picker type="datetime" placeholder="选择最晚借用日期" v-model="queryForm.b_date_end" value-format="yyyy-MM-dd HH:mm:ss" class="query-date1"></el-date-picker>
          </el-form-item>
          <el-form-item label="预计归还日期" label-width="100px" style="margin-left: 25px;">
            <el-date-picker type="datetime" placeholder="选择最早预计归还日期" v-model="queryForm.r_assign_start" value-format="yyyy-MM-dd HH:mm:ss" class="query-date2"></el-date-picker>
            <span>&nbsp;&nbsp;&nbsp;至&nbsp;&nbsp;&nbsp;</span>
            <el-date-picker type="datetime" placeholder="选择最晚预计归还日期" v-model="queryForm.r_assign_end" value-format="yyyy-MM-dd HH:mm:ss" class="query-date2"></el-date-picker>
          </el-form-item>
          <el-form-item label="归还日期" label-width="70px" style="margin-bottom: 0px;">
            <el-date-picker type="datetime" placeholder="选择最早归还日期" v-model="queryForm.r_date_start" value-format="yyyy-MM-dd HH:mm:ss" class="query-date1"></el-date-picker>
            <span>&nbsp;&nbsp;&nbsp;至&nbsp;&nbsp;&nbsp;</span>
            <el-date-picker type="datetime" placeholder="选择最晚归还日期" v-model="queryForm.r_date_end" value-format="yyyy-MM-dd HH:mm:ss" class="query-date1"></el-date-picker>
          </el-form-item>
          <el-form-item label="归还地点" label-width="85px" style="margin-bottom: 0px; margin-left: 25px;">
            <el-input v-model="queryForm.r_place" clearable style="width: 540px;"></el-input>
          </el-form-item>
        </el-form>
      </el-card>
    </div>

    <div>
      <el-card id="table-container">
        <div>
          <el-table stripe :data="resultList.results" class="record-table" :height="tableHeight">
            <template slot="empty">请点击上方搜索栏查询记录！</template>
            <el-table-column prop="b_ID" label="借用ID" width="200" fixed></el-table-column>
            <el-table-column prop="b_user_name" label="借用人姓名" width="100" fixed></el-table-column>
            <el-table-column prop="b_device_name" label="借用设备名" width="220" fixed></el-table-column>
            <el-table-column prop="b_reason" label="借用理由" width="200"></el-table-column>
            <el-table-column prop="b_user" label="借用人ID" width="120"></el-table-column>
            <el-table-column prop="b_device" label="借用设备ID" width="120"></el-table-column>
            <el-table-column prop="b_date" label="借用日期" width="165"></el-table-column>
            <el-table-column prop="b_place" label="借用地点" width="100"></el-table-column>
            <el-table-column prop="r_assign" label="预计归还日期" width="165"></el-table-column>
            <el-table-column prop="r_date" label="归还日期" width="165"></el-table-column>
            <el-table-column prop="r_place" label="归还地点" width="100"></el-table-column>
            <el-table-column fixed="right" label="" width="150">
              <template slot-scope="scope">
                <el-button @click.native.prevent="onEditDialog(scope.$index, scope.row), dialogVisibleE = true" plain size="mini" :disabled="!scope.row.b_date ? true : false">编辑</el-button>
                <el-button @click.native.prevent="onDeleteDialog(scope.$index, scope.row), dialogVisibleD = true" type="danger" size="mini" :disabled="!scope.row.b_date ? true : false">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="table-footer">
            <el-button type="primary" @click="onAddDialog" id="add-btn">创建记录</el-button>
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

    <el-dialog title="编辑记录" :visible.sync="dialogVisibleE" width="30%" :before-close="handleClose" center>
      <el-form ref="recordForm" :model="recordForm" label-width="110px" :rules="rules">
        <el-form-item label="借用ID">
          <el-input v-model="recordForm.b_ID" disabled class="dialogInput"></el-input>
        </el-form-item>
        <el-form-item label="借用者ID" prop="b_user">
          <el-input v-model="recordForm.b_user" class="dialogInput"></el-input>
        </el-form-item>
        <el-form-item label="借用者姓名">
          <el-input v-model="recordForm.b_user_name" disabled class="dialogInput"></el-input>
        </el-form-item>
        <el-form-item label="借用设备ID" prop="b_device">
          <el-input v-model="recordForm.b_device" clearable class="dialogInput"></el-input>
        </el-form-item>
        <el-form-item label="借用设备名">
          <el-input v-model="recordForm.b_device_name" disabled class="dialogInput"></el-input>
        </el-form-item>
        <el-form-item label="借用时间" prop="b_date">
          <el-col :span="11">
            <el-date-picker type="datetime" v-model="recordForm.b_date" clearable style="width: 207.28%;" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
          </el-col>
        </el-form-item>
        <el-form-item label="借用理由" prop="b_reason">
          <el-input v-model="recordForm.b_reason" class="dialogInput"></el-input>
        </el-form-item>
        <el-form-item label="借用地点" prop="b_place">
          <el-input v-model="recordForm.b_place" class="dialogInput"></el-input>
        </el-form-item>
        <el-form-item label="预计归还时间">
          <el-col :span="11">
            <el-date-picker type="datetime" v-model="recordForm.r_assign" clearable style="width: 207.28%;" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
          </el-col>
        </el-form-item>
        <el-form-item label="归还时间" prop="r_date">
          <el-col :span="11">
            <el-date-picker type="datetime" v-model="recordForm.r_date" clearable style="width: 207.28%;" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
          </el-col>
        </el-form-item>
        <el-form-item label="归还地点" style="margin-bottom: 0px;" prop="r_place">
          <el-input v-model="recordForm.r_place" class="dialogInput"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleE = false, $func.clearObj(recordForm)" style="width: 100px; margin-right: 50px;">取消</el-button>
        <el-button type="primary" @click="onEdit()" style="width: 100px;">修改</el-button>
      </span>
    </el-dialog>

    <el-dialog title="创建记录" :visible.sync="dialogVisibleA" width="30%" :before-close="handleClose" center>
      <el-form ref="recordForm" :model="recordForm" label-width="110px" :rules="rules">
        <el-form-item label="借用者ID" prop="b_user">
          <el-input v-model="recordForm.b_user" class="dialogInput"></el-input>
        </el-form-item>
        <el-form-item label="借用设备ID" prop="b_device">
          <el-input v-model="recordForm.b_device" clearable class="dialogInput"></el-input>
        </el-form-item>
        <el-form-item label="借用时间" prop="b_date">
          <el-col :span="11">
            <el-date-picker type="datetime" v-model="recordForm.b_date" clearable style="width: 207.28%;" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
          </el-col>
        </el-form-item>
        <el-form-item label="借用理由" prop="b_reason">
          <el-input v-model="recordForm.b_reason" class="dialogInput"></el-input>
        </el-form-item>
        <el-form-item label="借用地点" prop="b_place">
          <el-input v-model="recordForm.b_place" class="dialogInput"></el-input>
        </el-form-item>
        <el-form-item label="预计归还时间">
          <el-col :span="11">
            <el-date-picker type="datetime" v-model="recordForm.r_assign" clearable style="width: 207.28%;" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
          </el-col>
        </el-form-item>
        <el-form-item label="归还时间" prop="r_date">
          <el-col :span="11">
            <el-date-picker type="datetime" v-model="recordForm.r_date" clearable style="width: 207.28%;" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
          </el-col>
        </el-form-item>
        <el-form-item label="归还地点" style="margin-bottom: 0px;" prop="r_place">
          <el-input v-model="recordForm.r_place" class="dialogInput"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleA = false, $func.clearObj(recordForm)" style="width: 100px; margin-right: 50px;">取消</el-button>
        <el-button type="primary" @click="onAdd()" style="width: 100px;">创建</el-button>
      </span>
    </el-dialog>

    <el-dialog title="删除记录" :visible.sync="dialogVisibleD" width="30%" :before-close="handleClose" center>
      <el-form ref="recordForm" :model="recordForm" label-width="110px" disabled>
        <el-form-item label="借用ID">
          <el-input v-model="recordForm.b_ID" class="dialogInput"></el-input>
        </el-form-item>
        <el-form-item label="借用者ID">
          <el-input v-model="recordForm.b_user" class="dialogInput"></el-input>
        </el-form-item>
        <el-form-item label="借用者姓名">
          <el-input v-model="recordForm.b_user_name" class="dialogInput"></el-input>
        </el-form-item>
        <el-form-item label="借用设备ID">
          <el-input v-model="recordForm.b_device" clearable class="dialogInput"></el-input>
        </el-form-item>
        <el-form-item label="借用设备名">
          <el-input v-model="recordForm.b_device_name" class="dialogInput"></el-input>
        </el-form-item>
        <el-form-item label="借用时间">
          <el-col :span="11">
            <el-date-picker type="datetime" v-model="recordForm.b_date" clearable style="width: 207.28%;" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
          </el-col>
        </el-form-item>
        <el-form-item label="借用理由">
          <el-input v-model="recordForm.b_reason" class="dialogInput"></el-input>
        </el-form-item>
        <el-form-item label="借用地点">
          <el-input v-model="recordForm.b_place" class="dialogInput"></el-input>
        </el-form-item>
        <el-form-item label="预计归还时间">
          <el-col :span="11">
            <el-date-picker type="datetime" v-model="recordForm.r_assign" clearable style="width: 207.28%;" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
          </el-col>
        </el-form-item>
        <el-form-item label="归还时间">
          <el-col :span="11">
            <el-date-picker type="datetime" v-model="recordForm.r_date" clearable style="width: 207.28%;" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
          </el-col>
        </el-form-item>
        <el-form-item label="归还地点" style="margin-bottom: 0px;">
          <el-input v-model="recordForm.r_place" class="dialogInput"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleD = false, $func.clearObj(recordForm)" style="width: 100px; margin-right: 50px;">取消</el-button>
        <el-button type="danger" @click="onDelete()" style="width: 100px;">删除</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Records",
  data() {
    let valid_r_date = (rule, value, callback) => {
      if (!value && this.recordForm.r_place) {
        callback(new Error('请填写归还日期！'));
      } else {
        callback();
      }
    };
    let valid_r_place = (rule, value, callback) => {
      if (!value && this.recordForm.r_date) {
        callback(new Error('请填写归还地点！'));
      } else {
        callback();
      }
    };
    return {
      showAll: true,
      tableHeight: 0,
      dialogVisibleE: false,
      dialogVisibleD: false,
      dialogVisibleA: false,
      page: 1,

      resultList: {
        count: 0,
        previous: null,
        next: null,
        results: []
      },

      queryForm: {
        b_ID: null,
        b_user: null,
        b_user_name: null,
        b_device: null,
        b_device_name: null,
        b_reason: null,
        b_place: null,
        r_place: null,
        b_date_start: null,
        b_date_end: null,
        r_assign_start: null,
        r_assign_end: null,
        r_date_start: null,
        r_date_end: null
      },
      recordForm: {
        index: null,
        b_ID: null,
        b_user_name: null,
        b_device_name: null,
        b_date: null,
        b_reason: null,
        b_place: null,
        r_assign: null,
        r_date: null,
        r_place: null,
        b_user: null,
        b_device: null
      },

      rules: {
        b_user: [
          { required: true, message: '请输入借用者ID！', trigger: 'blur' }
        ],
        b_device: [
          { required: true, message: '请输入设备ID！', trigger: 'blur' }
        ],
        b_place: [
          { required: true, message: '请输入借用地点！', trigger: 'blur' }
        ],
        b_reason: [
          { required: true, message: '请输入借用理由！', trigger: 'blur' }
        ],
        b_date: [
          { required: true, message: '请选择借用时间！', trigger: 'blur' }
        ],
        r_date: [
          { validator: valid_r_date, trigger: 'blur' }
        ],
        r_place: [
          {validator: valid_r_place, trigger: 'blur' }
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
          this.$func.clearObj(this.recordForm);
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
        b_ID: this.queryForm.b_ID,
        b_user: this.queryForm.b_user,
        b_user_name: this.queryForm.b_user_name,
        b_device: this.queryForm.b_device,
        b_device_name: this.queryForm.b_device_name,
        b_date_start: this.queryForm.b_date_start,
        b_date_end: this.queryForm.b_date_end,
        r_date_start: this.queryForm.r_date_start,
        r_date_end: this.queryForm.r_date_end,
        r_assign_start: this.queryForm.r_assign_start,
        r_assign_end: this.queryForm.r_assign_end,
        b_place: this.queryForm.b_place,
        r_place: this.queryForm.r_place,
        b_reason: this.queryForm.b_reason
      };

      this.$http.manageRecordQuery(params, this.page).then(res => {
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

          // 去除时间中的 T
          for (let item of this.resultList.results) {
            item.b_date = item.b_date.replace("T", " ");
            if (item.r_assign) {
              item.r_assign = item.r_assign.replace("T", " ");
            }
            if (item.r_date) {
              item.r_date = item.r_date.replace("T", " ");
            }
          }

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
      this.recordForm.index = index;
      this.recordForm.b_ID = row.b_ID;
      this.recordForm.b_user = row.b_user;
      this.recordForm.b_user_name = row.b_user_name;
      this.recordForm.b_device = row.b_device;
      this.recordForm.b_device_name = row.b_device_name;
      this.recordForm.b_date = row.b_date;
      this.recordForm.r_date = row.r_date;
      this.recordForm.r_assign = row.r_assign;
      this.recordForm.b_place = row.b_place;
      this.recordForm.r_place = row.r_place;
      this.recordForm.b_reason = row.b_reason;

      this.dialogVisibleE = true;
    },
    // 编辑
    onEdit() {
      this.$refs["recordForm"].validate(valid => {
        if (!valid) {
          this.$message({
            message: '请检查并重试！',
            type: 'warning',
            showClose: true
          });
        } else {
          const params = {
            b_user: this.recordForm.b_user,
            b_device: this.recordForm.b_device,
            b_date: this.recordForm.b_date,
            b_reason: this.recordForm.b_reason,
            b_place: this.recordForm.b_place,
          };
          if (this.recordForm.r_assign) {
            params.r_assign = this.recordForm.r_assign;
          }
          if (this.recordForm.r_date) {
            params.r_date = this.recordForm.r_date;
          }
          if (this.recordForm.r_place) {
            params.r_place = this.recordForm.r_place;
          }
          
          this.$http.manageRecordPut(params, this.recordForm.b_ID).then(res => {
            const data = res.data;
            if (data.code === 404) {
              this.$message({
                message: '记录不存在，请刷新页面！',
                type: 'warning',
                showClose: true
              });
            } else {
              // 确定编辑后，更新状态
              this.resultList.results[this.recordForm.index].b_user = data.b_user;
              this.resultList.results[this.recordForm.index].b_device = data.b_device;
              this.resultList.results[this.recordForm.index].b_user_name = data.b_user_name;
              this.resultList.results[this.recordForm.index].b_device_name = data.b_device_name;
              this.resultList.results[this.recordForm.index].b_date = data.b_date.replace("T", " ");
              this.resultList.results[this.recordForm.index].b_reason = data.b_reason;
              this.resultList.results[this.recordForm.index].b_place = data.b_place;
              this.resultList.results[this.recordForm.index].r_date = data.r_date;
              this.resultList.results[this.recordForm.index].r_place = data.r_place;
              if (data.r_assign) {
                this.resultList.results[this.recordForm.index].r_assign = data.r_assign.replace("T", " ");
              } else {
                this.resultList.results[this.recordForm.index].r_assign = data.r_assign;
              }
              
              this.dialogVisibleE = false;
              this.$func.clearObj(this.recordForm);
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
      this.recordForm.index = index;
      this.recordForm.b_ID = row.b_ID;
      this.recordForm.b_user = row.b_user;
      this.recordForm.b_user_name = row.b_user_name;
      this.recordForm.b_device = row.b_device;
      this.recordForm.b_device_name = row.b_device_name;
      this.recordForm.b_date = row.b_date;
      this.recordForm.r_date = row.r_date;
      this.recordForm.r_assign = row.r_assign;
      this.recordForm.b_place = row.b_place;
      this.recordForm.r_place = row.r_place;
      this.recordForm.b_reason = row.b_reason;

      this.dialogVisibleD = true;
    },
    // 删除
    onDelete() {
      this.$refs["recordForm"].validate(valid => {
        if (!valid) {
          this.$message({
            message: '数据错误，请刷新网页！',
            type: 'error',
            showClose: true
          });
        } else {
          this.$http.manageRecordDelete(this.recordForm.b_ID).then(res => {
            const data = res.data;
            if (!data) {
              this.dialogVisibleD = false;
              this.resultList.results[this.recordForm.index].b_date = '';
              this.$func.clearObj(this.recordForm);              
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
      this.$refs["recordForm"].validate(valid => {
        if (!valid) {
          this.$message({
            message: '请检查并重试！',
            type: 'warning',
            showClose: true
          });
        } else {
          let params = {
            b_user: this.recordForm.b_user,
            b_device: this.recordForm.b_device,
            b_date: this.recordForm.b_date,
            b_reason: this.recordForm.b_reason,
            b_place: this.recordForm.b_place
          };
          if (this.recordForm.r_assign) {
            params.r_assign = this.recordForm.r_assign;
          }
          if (this.recordForm.r_date) {
            params.r_date = this.recordForm.r_date;
          }
          if (this.recordForm.r_place) {
            params.r_place = this.recordForm.r_place;
          }
          
          this.$http.manageRecordAdd(params).then(res => {
            const data = res.data;
            if (data) {
              this.dialogVisibleA = false;
              this.$func.clearObj(this.recordForm);
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
.query-date1 {
  width: 239.755px;
}
.query-date2 {
  width: 244.155px;
}
.query-input1 {
  width: 210px;
}
.query-input2 {
  width: 240px;
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
#query-box {
  overflow: hidden;
}
.el-form-item {
  margin-right: 0px !important;
}
.board-form {
  display: inline-block !important;
}
.record-table {
  width: 100%;
}
#table-container {
  margin-top: 20px;
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