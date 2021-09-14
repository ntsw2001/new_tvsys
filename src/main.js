import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import ElementUI from 'element-ui';

import 'element-ui/lib/theme-chalk/index.css';
import 'normalize.css/normalize.css';
import '@/styles/init.css';

// 导入自定义字体（经过分割）
import '@/styles/fonts/regular.css';
import '@/styles/fonts/medium.css';
// import '@/styles/fonts/font.css';
// import './styles/custom.css';

import 'amfe-flexible';
import 'amfe-flexible/index.js';

// 自定义封装后的库
import auth from '@/utils/auth';
import http from '@/utils/http';
import crypt from '@/utils/crypt';
import Func from '@/utils/others';

// 静态资源
import res from '@/assets/res';

Vue.config.productionTip = false;

Vue.use(ElementUI);

Vue.prototype.$auth = auth;
Vue.prototype.$http = http;
Vue.prototype.$crypt = crypt;
Vue.prototype.$func = Func;

Vue.prototype.$res = res;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
