<template>
  <div>
    <div id="query-container">
      <el-card>
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
          <el-form-item label="可见等级" label-width="80px">
            <el-select multiple collapse-tags v-model="queryForm.d_see" placeholder="请选择" @change='S_changeSelect' style="width: 183.79px;">
              <el-checkbox v-model="checkedSee" @change='S_selectAll' class="select-all">全选</el-checkbox>
              <el-option v-for="item in seeList" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
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
            <el-input v-model="queryForm.d_others" clearable style="width: 551px;"></el-input>
          </el-form-item>
        </el-form>
      </el-card>
    </div>

    <div>
      <el-card id="device-table-container">
        <div>
          <el-table stripe :data="resultList.results" class="device-table" :height="tableHeight">
            <template slot="empty">请点击上方搜索栏查询设备！默认只搜索未借出的设备！</template>
            <el-table-column prop="d_ID" label="设备ID" width="120" fixed></el-table-column>
            <el-table-column prop="d_name" label="设备名称" width="250" fixed></el-table-column>
            <el-table-column prop="d_status" label="设备状态" width="100" :formatter="D_STATUS" fixed></el-table-column>
            <el-table-column prop="d_place" label="设备所在地" width="150"></el-table-column>
            <el-table-column prop="d_see" label="可见等级" width="100" :formatter="D_SEE"></el-table-column>
            <el-table-column prop="d_type" label="设备类型" width="150" :formatter="D_TYPE"></el-table-column>
            <el-table-column prop="d_sequence" label="设备序列" width="80"></el-table-column>
            <el-table-column prop="d_date" label="投入使用日期" width="120"></el-table-column>
            <el-table-column prop="d_others" label="备注" width="auto"></el-table-column>
            <el-table-column fixed="right" label="" width="150">
              <template slot-scope="scope">
                <el-button @click.native.prevent="onEditDialog(scope.$index, scope.row), dialogVisibleE = true" plain size="mini" :disabled="!scope.row.d_place ? true : false">编辑</el-button>
                <el-button @click.native.prevent="onDeleteDialog(scope.$index, scope.row), dialogVisibleD = true" type="danger" size="mini" :disabled="!scope.row.d_place ? true : false">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="table-footer">
            <el-button type="primary" @click="onAddDialog" id="add-btn">创建设备</el-button>
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

    <el-dialog title="编辑设备" :visible.sync="dialogVisibleE" width="30%" :before-close="handleClose" center>
      <el-form ref="deviceForm" :model="deviceForm" label-width="110px" :rules="rules">
        <el-form-item label="设备ID">
          <el-input v-model="deviceForm.d_ID" disabled class="dialogInput"></el-input>
        </el-form-item>
        <el-form-item label="设备名称" prop="d_name">
          <el-input v-model="deviceForm.d_name" class="dialogInput"></el-input>
        </el-form-item>
        <el-form-item label="可见等级" prop="d_see">
          <el-select v-model="deviceForm.d_see" placeholder="请选择" class="dialogInput">
            <el-option v-for="item in seeList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="设备类型">
          <el-select v-model="deviceForm.d_type" placeholder="请选择" class="dialogInput">
            <el-option v-for="item in categoryList" :key="item.id" :label="item.name" :value="item.id" disabled></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="设备序列">
          <el-input v-model="deviceForm.d_sequence" clearable class="dialogInput" disabled></el-input>
        </el-form-item>
        <el-form-item label="设备所在地点" prop="d_place">
          <el-input v-model="deviceForm.d_place" class="dialogInput"></el-input>
        </el-form-item>
        <el-form-item label="设备状态" prop="d_status">
          <el-select v-model="deviceForm.d_status" placeholder="请选择" class="dialogInput">
            <el-option v-for="(item, index) in statusList" :key="index" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="投入使用时间" prop="d_date">
          <el-col :span="11">
            <el-date-picker type="month" v-model="deviceForm.d_date" clearable style="width: 207.28%;" value-format="yyyy-MM"></el-date-picker>
          </el-col>
        </el-form-item>
        <el-form-item label="备注" style="margin-bottom: 0px;">
          <el-input v-model="deviceForm.d_others" clearable class="dialogInput"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleE = false, $func.clearObj(deviceForm)" style="width: 100px; margin-right: 50px;">取消</el-button>
        <el-button type="primary" @click="onEdit()" style="width: 100px;">修改</el-button>
      </span>
    </el-dialog>

    <el-dialog title="创建设备" :visible.sync="dialogVisibleA" width="30%" :before-close="handleClose" center>
      <el-form ref="deviceForm" :model="deviceForm" label-width="110px" :rules="rules">
        <el-form-item label="设备名称" prop="d_name">
          <el-input v-model="deviceForm.d_name" class="dialogInput"></el-input>
        </el-form-item>
        <el-form-item label="可见等级" prop="d_see">
          <el-select v-model="deviceForm.d_see" placeholder="请选择" class="dialogInput">
            <el-option v-for="item in seeList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="设备类型" prop="d_type">
          <el-select v-model="deviceForm.d_type" placeholder="请选择" class="dialogInput">
            <el-option v-for="item in categoryList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="设备所在地点" prop="d_place">
          <el-input v-model="deviceForm.d_place" class="dialogInput"></el-input>
        </el-form-item>
        <el-form-item label="设备状态" prop="d_status">
          <el-select v-model="deviceForm.d_status" placeholder="请选择" class="dialogInput">
            <el-option v-for="(item, index) in statusList" :key="index" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="投入使用时间" prop="d_date">
          <el-col :span="11">
            <el-date-picker type="month" v-model="deviceForm.d_date" clearable style="width: 207.28%;" value-format="yyyy-MM"></el-date-picker>
          </el-col>
        </el-form-item>
        <el-form-item label="备注" style="margin-bottom: 0px;">
          <el-input v-model="deviceForm.d_others" clearable class="dialogInput"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleA = false, $func.clearObj(deviceForm)" style="width: 100px; margin-right: 50px;">取消</el-button>
        <el-button type="primary" @click="onAdd()" style="width: 100px;">创建</el-button>
      </span>
    </el-dialog>

    <el-dialog title="删除设备" :visible.sync="dialogVisibleD" width="30%" :before-close="handleClose" center>
      <el-form ref="deviceForm" :model="deviceForm" label-width="110px" disabled>
        <el-form-item label="设备名称">
          <el-input v-model="deviceForm.d_name" class="dialogInput"></el-input>
        </el-form-item>
        <el-form-item label="可见等级">
          <el-select v-model="deviceForm.d_see" class="dialogInput">
            <el-option v-for="item in seeList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="设备类型">
          <el-select v-model="deviceForm.d_type" class="dialogInput">
            <el-option v-for="item in categoryList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="设备所在地点">
          <el-input v-model="deviceForm.d_place" class="dialogInput"></el-input>
        </el-form-item>
        <el-form-item label="设备状态">
          <el-select v-model="deviceForm.d_status" class="dialogInput">
            <el-option v-for="(item, index) in statusList" :key="index" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="投入使用时间">
          <el-col :span="11">
            <el-date-picker type="month" v-model="deviceForm.d_date" clearable style="width: 207.28%;" value-format="yyyy-MM"></el-date-picker>
          </el-col>
        </el-form-item>
        <el-form-item label="备注" style="margin-bottom: 0px;">
          <el-input v-model="deviceForm.d_others" clearable class="dialogInput"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleD = false, $func.clearObj(deviceForm)" style="width: 100px; margin-right: 50px;">取消</el-button>
        <el-button type="danger" @click="onDelete()" style="width: 100px;">删除</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Devices",
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
      dialogVisibleE: false,
      dialogVisibleD: false,
      dialogVisibleA: false,
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
      deviceForm: {
        index: null,
        d_ID: null,
        d_see: null,
        d_type: null,
        d_sequence: null,
        d_name: null,
        d_date: null,
        d_status: null,
        d_place: null,
        d_others: null
      },

      rules: {
        d_type: [
          { required: true, message: '请选择设备类型！', trigger: 'blur' }
        ],
        d_name: [
          { required: true, message: '请输入设备名！', trigger: 'blur' }
        ],
        d_place: [
          { required: true, message: '请输入设备所在地点！', trigger: 'blur' }
        ],
        d_see: [
          { required: true, message: '请选择设备可见等级！', trigger: 'blur' }
        ],
        d_status: [
          { required: true, message: '请选择设备状态！', trigger: 'blur' }
        ],
        d_date: [
          { required: true, message: '请选择投入使用时间！', trigger: 'blur' }
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
          this.$func.clearObj(this.deviceForm);
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

      this.$http.manageDeviceQuery(params, this.page).then(res => {
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
      this.deviceForm.index = index;
      this.deviceForm.d_ID = row.d_ID;
      this.deviceForm.d_name = row.d_name;
      this.deviceForm.d_place = row.d_place;
      this.deviceForm.d_see = row.d_see;
      this.deviceForm.d_type = row.d_type;
      this.deviceForm.d_sequence = row.d_sequence;
      this.deviceForm.d_date = row.d_date;
      this.deviceForm.d_status = row.d_status;
      this.deviceForm.d_others = row.d_others;
      this.dialogVisibleE = true;
    },
    // 编辑
    onEdit() {
      this.$refs["deviceForm"].validate(valid => {
        if (!valid) {
          this.$message({
            message: '请检查并重试！',
            type: 'warning',
            showClose: true
          });
        } else {
          const params = {
            d_ID: this.deviceForm.d_ID,
            d_type: this.deviceForm.d_type,
            d_sequence: this.deviceForm.d_sequence,
            d_status: this.deviceForm.d_status,
            d_name: this.deviceForm.d_name,
            d_see: this.deviceForm.d_see,
            d_date: this.deviceForm.d_date + "-01",
            d_place: this.deviceForm.d_place
          };
          if (this.deviceForm.d_others) {
            params.d_others = this.deviceForm.d_others;
          }
          
          this.$http.manageDevicePut(params, this.deviceForm.d_ID).then(res => {
            const data = res.data;
            if (data.code === 404) {
              this.$message({
                message: '设备不存在，请刷新页面！',
                type: 'warning',
                showClose: true
              });
            } else {
              // 确定编辑后，更新状态
              this.resultList.results[this.deviceForm.index].d_status = data.d_status;
              this.resultList.results[this.deviceForm.index].d_name = data.d_name;
              this.resultList.results[this.deviceForm.index].d_see = data.d_see;
              this.resultList.results[this.deviceForm.index].d_date = data.d_date;
              this.resultList.results[this.deviceForm.index].d_place = data.d_place;
              if (data.d_others) {
                  this.resultList.results[this.deviceForm.index].d_others = data.d_others;
              }

              this.dialogVisibleE = false;
              this.$func.clearObj(this.deviceForm);
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
      this.deviceForm.index = index;
      this.deviceForm.d_ID = row.d_ID;
      this.deviceForm.d_name = row.d_name;
      this.deviceForm.d_place = row.d_place;
      this.deviceForm.d_see = row.d_see;
      this.deviceForm.d_type = row.d_type;
      this.deviceForm.d_sequence = row.d_sequence;
      this.deviceForm.d_date = row.d_date;
      this.deviceForm.d_status = row.d_status;
      this.deviceForm.d_others = row.d_others;
      this.dialogVisibleD = true;
    },
    // 删除
    onDelete() {
      this.$refs["deviceForm"].validate(valid => {
        if (!valid) {
          this.$message({
            message: '数据错误，请刷新网页！',
            type: 'error',
            showClose: true
          });
        } else {
          this.$http.manageDeviceDelete(this.deviceForm.d_ID).then(res => {
            const data = res.data;
            if (!data) {
              this.dialogVisibleD = false;
              this.resultList.results[this.deviceForm.index].d_place = '';
              this.$func.clearObj(this.deviceForm);              
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
      this.$refs["deviceForm"].validate(valid => {
        if (!valid) {
          this.$message({
            message: '请检查并重试！',
            type: 'warning',
            showClose: true
          });
        } else {
          const params = {
            d_type: this.deviceForm.d_type,
            d_status: this.deviceForm.d_status,
            d_name: this.deviceForm.d_name,
            d_see: this.deviceForm.d_see,
            d_date: this.deviceForm.d_date + "-01",
            d_place: this.deviceForm.d_place
          };
          if (this.deviceForm.d_others) {
            params.d_others = this.deviceForm.d_others;
          }
          
          this.$http.manageDeviceAdd(params).then(res => {
            const data = res.data;
            if (data) {
              this.dialogVisibleA = false;
              this.$func.clearObj(this.deviceForm);
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
        document.getElementById('device-table-container').style.height = tableContainerHeight + "px";
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