import Vue from 'vue';
import VueRouter from 'vue-router';
import auth from '@/utils/auth';
import { Message } from 'element-ui';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Login',
    component: () => import('@/views/Login')
  },
  {
    path: '/main',
    component: () => import('@/views/Frame'),
    children: [
      {
        path: '/',
        name: 'Return',
        component: () => import('@/views/basic/Return')
      },
      {
        path: '/lend',
        name: 'Lend',
        component: () => import('@/views/basic/Lend')
      },
      {
        path: '/me',
        name: 'Me',
        component: () => import('@/views/basic/Me')
      },
      {
        path: '/manage/devices',
        name: 'Devices',
        component: () => import('@/views/manage/Devices')
      },
      {
        path: '/manage/users',
        name: 'Users',
        component: () => import('@/views/manage/Users')
      },
      {
        path: '/manage/records',
        name: 'Records',
        component: () => import('@/views/manage/Records')
      }
    ]
  },
  {
    path: '/404',
    name: '404',
    component: () => import('@/views/404')
  },
  {
    path: '*',
    name: 'NotFound',
    component: () => import('@/views/404')
  }  
];

const router = new VueRouter({
  mode: 'history',
  routes
});

// 拦截未授权的访问
router.beforeEach((to, from, next) => {
  if (to.name === 'Login') {
    next();
  } else if (!auth.isLogged) {
    Message({
      message: '请先登录！',
      type: 'warning',
      showClose: true
    });
    next({
      path: '/',
      query: {
        redirect: to.fullPath
      }
    });
  } else if (!auth.isAdmin && to.path.indexOf('manage') !== -1){
    next({
      path: '/404',
      query: {
        redirect: from.fullPath
      }
    });
  } else {
    next();
  }

  // 解决部署到服务器上后的 Uncaught (in promise) 
  // NavigationDuplicated: Avoided redundant navigation 错误
  const VueRouterPush = VueRouter.prototype.push;
  VueRouter.prototype.push = function push(location) {
    return VueRouterPush.call(this, location).catch(err => err)
  };
  const VueRouterReplace = VueRouter.prototype.replace;
  VueRouter.prototype.replace = function replace(location) {
    return VueRouterReplace.call(this, location).catch(err => err)
  };
})

export default router;