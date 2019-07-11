import Vue from 'vue'
import Router from 'vue-router'
import login from '@/views/login'
import home from '@/views/home'
import students from '@/views/students'
import classes from '@/views/classes'
import welcome from '@/views/welcome'
import upload from '@/views/upload'

Vue.use(Router)

const router = new Router({
  // 地址栏去掉#
  mode: 'history',
  routes: [
    {
      path: '/',
      name: '',
      redirect: '/welcome',
      hidden: true
    },
    {
      path: '/',
      name: '',
      component: home,
      children: [
        {path: '/welcome', component: welcome, name: '欢迎页面'}
      ]
    },
    {
      path: '/login',
      name: '登录',
      component: login
    },
    {
      path: '/',
      name: '学生管理',
      component: home,
      children: [
        {path: '/stu', name: '学生', component: students},
        {path: '/stu/upload', name: '导入学生', component: upload}
      ]
    },
    {
      path: '/',
      name: '班级管理',
      component: home,
      children: [
        {path: '/classes', name: '班级', component: classes}
      ]
    }
  ]
})

export default router
