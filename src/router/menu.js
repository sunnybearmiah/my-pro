import login from '@/views/login'
import home from '@/views/home'
import students from '@/views/students'
import classes from '@/views/classes'
import welcome from '@/views/welcome'
import upload from '@/views/upload'

import mlb from '@/views/dispatch/mlb'
import mlb_detail from '@/views/dispatch/mlb_detail'

export default {
  menu: [
    {
      path: '/login',
      name: '登录',
      component: login,
      hidden: true
    },
    {
      path: '/',
      name: '',
      redirect: '/welcome',
      hidden: true  // 菜单展示
    },
    {
      id: 1,
      path: '/',
      name: '',
      component: home,
      single: true, // 单层结构标志
      children: [
        {id: 1, path: '/welcome', component: welcome, name: '首页', icon: 'el-icon-s-home'}
      ]
    },
    {
      id: 2,
      path: '/',
      name: '学生管理',
      component: home,
      icon: 'el-icon-user-solid',
      children: [
        {id: 1, path: '/stu', name: '学生', component: students},
        {id: 2, path: '/stu/upload', name: '导入学生', component: upload}
      ]
    },
    {
      id: 3,
      path: '/',
      name: '班级管理',
      component: home,
      icon: 'el-icon-s-custom',
      children: [
        {id: 1, path: '/classes', name: '班级', component: classes}
      ]
    },
    {
      id: 4,
      path: '/',
      name: '调度管理',
      component: home,
      icon: 'el-icon-s-cooperation',
      children: [
        {id: 1, path: '/mlb', name: '单板房总调度', component: mlb},
        {id: 2, path: '/:id/detail', name: '单板房总调度明细', component: mlb_detail, hidden: true}
      ]
    }
  ]
}
