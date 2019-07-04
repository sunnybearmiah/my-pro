<template>
  <el-form>
    <el-form-item label="用户名：" label-width="100px" style="padding-top:15%">
      <el-input v-model="userName" placeholder="请输入用户名" clearable></el-input>
    </el-form-item>
    <el-form-item label="密码：" label-width="100px">
      <el-input v-model="pwd" type="password" placeholder="请输入密码" clearable show-password></el-input>
    </el-form-item>
    <el-button type="primary" plain style="margin-left:15%">登录</el-button>
    <el-button type="primary" plain style="margin-left:8%">注册</el-button>
    <el-link type="info">忘记密码？</el-link>
  </el-form>
</template>

<style scoped>
.el-form{
  text-align: center;
  width: 50%;
  height: 80%;
  margin: 8% auto;
  /* border: 2px solid #409EFF; */
}

.el-form-item{
  line-height: 1%;
  width: 70%;
  padding-left:10%
}

.el-link{
  margin-left:15%
}
</style>

<script>
export default {
  data(){
    return {
      userName:'',
      pwd:''
    }
  }
}
</script>
