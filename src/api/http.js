import axios from 'axios'
import qs from 'qs'
import conf from './config'

let instance = axios.create({
  baseURL: conf.apiMockRap2, // api的base_url
  // baseURL: conf.apiBaseUrl_xwj,
  timeout: 10000, // 请求超时时间
  withCredentials: false
  // transformRequest: data => qs.stringify(data)
})

// 添加请求拦截器
instance.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么

  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})

/*
//本地接口
// 获取学生信息列表
export const stuInfo = params => { return instance.get('/stu', {params: params}).then(res => res.data) }
// POST方法使用非json形式传输
instance.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
// 学生信息增删改
export const addStu = params => { return instance.post('/stu/add', qs.stringify(params)).then(res => res.data) }
export const delStu = params => { return instance.post('/stu/del', qs.stringify(params)).then(res => res.data) }
export const updStu = params => { return instance.post('/stu/upd', qs.stringify(params)).then(res => res.data) }
*/
// 服务器接口
// 获取学生信息列表
export const stuInfo = params => { return instance.get('/selectAll', {params: params}).then(res => res.data) }
export const stuInfoFilter = params => { return instance.get('/selectAction', {params: params}).then(res => res.data) }

export const classInfo = params => { return instance.get('/selectAllClass', {params: params}).then(res => res.data) }
export const classInfoFilter = params => { return instance.get('/selectClasses', {params: params}).then(res => res.data) }

// POST方法使用非json形式传输
instance.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
// 学生信息增删改
export const addStu = params => { return instance.post('/insertAction', qs.stringify(params)).then(res => res.data) }
export const delStu = params => { return instance.post('/deleteAction', qs.stringify(params)).then(res => res.data) }
export const updStu = params => { return instance.post('/updateAction', qs.stringify(params)).then(res => res.data) }

// 班级信息增删改
export const addClass = params => { return instance.post('/addClasses', qs.stringify(params)).then(res => res.data) }
export const delClass = params => { return instance.post('/deleteClasses', qs.stringify(params)).then(res => res.data) }
export const updClass = params => { return instance.post('/updateClasses', qs.stringify(params)).then(res => res.data) }

// 文件上传
// instance.defaults.headers.post['Content-Type'] = 'multipart/form-data; charset=UTF-8'
export const uploadStu = params => { return instance.post('/upload', params).then(res => res.data) }

// 添加响应拦截器
instance.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  return response
}, function (error) {
  // 对响应错误做点什么
  return Promise.reject(error)
})
// 最后暴露实例
export default instance
