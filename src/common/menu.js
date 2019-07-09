export default {
  menu: [
    {
      id: 1,
      name: '首页',
      icon: 'el-icon-s-home',
      uri: '/'
    },
    {
      id: 2,
      name: '班级管理',
      icon: 'el-icon-s-custom',
      item: [
        {
          id: 1,
          name: '班级',
          uri: '/classes'
        }
      ]
    },
    {
      id: 3,
      name: '学生管理',
      icon: 'el-icon-user',
      item: [
        {
          id: 1,
          name: '学生',
          uri: '/stu'
        },
        {
          id: 2,
          name: '导入学生',
          uri: '/stu/upload'
        }
      ]
    }
  ]
}
