const DEVICE_CATEGORY_LIST = ["存储卡式摄录一体机",
                              "微单或单反",
                              "镜头",
                              "监视器",
                              "导播台",
                              "麦克风",
                              "图传", 
                              "灯",
                              "服务器",
                              "计算机",
                              "稳定器",
                              "三脚架",
                              "三脚架脚轮",
                              "电池",
                              "充电器",
                              "存储卡",
                              "读卡器",
                              "包",
                              "手柄",
                              "电缆"
                              ];

class StaticRes {
  constructor() {
    // 设备分类列表
    this.device_list = DEVICE_CATEGORY_LIST.map((value, index) => {
      return {"id": index + 1, "name": value};
    });

    // 设备可见等级列表
    this.device_see = [
      {"id": 1, "name": '常规'},
      {"id": 9, "name": '管理'}
    ]

    // 设备状态列表
    this.device_status = [
      {"id": 0, "name": '已借出'},
      {"id": 1, "name": '未借出'}
    ]

    // 预置密码表
    this.init_pass = [
      "123456"
    ]

    // 用户权限列表
    this.user_auth= [
      {"id": 1, "name": '普通用户'},
      {"id": 6, "name": '管理员'}
    ]
  }
}

export default new StaticRes();