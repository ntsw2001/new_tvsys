# new_tvsys
本项目是基于 tvsys（ https://github.com/ntsw2001/tvsys ）项目的个人改进版，主要重写了前端，并且对后端做了一定的优化。<br>
2021.09.14<br>
V 1.0.1

DEMO: https://newtvsys.clax.xyz <br>
初始管理员账户：998856&nbsp;&nbsp;密码：123<br>
初始普通用户账户：1&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;密码：123

## 前端
前端基于自建模板 frontend-template-init（ https://github.com/ntsw2001/frontend-template-init ）。

### 相对于之前的合作版本，主要实现了以下内容
1. 根据权限显示菜单栏，通过 VueRouter 拦截未授权的访问。
2. 页面能够自适应浏览器高度。
3. 使用了 HarmonyOS 字体系列，采用类似于 BiliBili（ https://www.bilibili.com ）新版主页的字体加载方案。
4. 摒弃了哈希模式。
5. 后端采用了 uWSGI 并配合 Nginx 实现了反向代理。（其实合作版本的前端也采用了反向代理，个人版本没做）
6. 优化了用户体验。

### 存在的不足
1. 模块化不彻底，代码复用率低。（复制粘贴太多了：管理页的对话框，所有页的查询框、结果表格其实都可以做成 component）
2. 老后端老问题。（老后端的架构设计很失败，并由此招致了一系列问题）

## 项目结构说明（前端）
1. assets 文件夹下保存了静态资源：字体：分为三个版本（现在在用的仿 bilibili 的版本；TTF 格式；Woff2 格式）;还有一个资源配置文件 res.js，方便扩展与运维。
2. router 就是 VueRouter 的配置了。
3. store 是 Vuex 的配置（这个项目没有用 Vuex）。
4. styles 是样式表文件夹：fonts 里保存了三个配置的样式表：font.css 现已废弃，别的两个是仿 bilibili 字体加载方式的核心所在；custom.css 是自定义样式表，本项目没有用，所以修改统一风格变得很麻烦；init.css 是初始化样式表，这里初始化了默认字体为 HarmonyOS_Regular。
5. utils 文件夹：auth.js 是登录认证相关；crypt.js 是加密相关；http.js 是 axios 的封装；others.js 是其他全局工具函数的封装。
6. views 文件夹：所有页面。

## 项目安装
前端：
```
git clone https://github.com/ntsw2001/new_tvsys
cd new_tvsys
npm install
```

后端：（这里的安装有问题，因为我的 Django 是在 Anaconda 的虚拟环境中构建的，部分库在 requirements.txt 中需要通过 conda 命令安装）
```
cd backend
pip install -r requirements.txt
```

### 编译与热部署
```
npm run serve
```

### 编译到生产环境
```
npm run build
```

### 语法校正
```
npm run lint
```
