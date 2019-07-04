<template>
    <el-container style="height:100%; width:100%">
        <el-aside id="aside" style="width:200px">
            <h5 style="text-align:center">自定义</h5>
            <el-menu
            default-active="this.$route.path"
            class="el-menu-vertical-demo"
            @open="handleOpen"
            @close="handleClose"
            unique-opened
            background-color="#409EFF"
            text-color="#000405"
            active-text-color="#ffffff"
            router>
                <el-menu-item index="/">
                    <i class="el-icon-s-home"></i>
                    <span class="menuTitle" slot="title">首页</span>
                </el-menu-item>
                <el-submenu index="2">
                    <template slot="title">
                        <i class="el-icon-s-custom"></i>
                        <span class="menuTitle">班级管理</span>
                    </template>
                    <el-menu-item index="/classes">
                        <span slot="title">班级</span>
                    </el-menu-item>
                </el-submenu>
                <el-submenu index="3">
                    <template slot="title">
                        <i class="el-icon-user"></i>
                        <span class="menuTitle">学生管理</span>
                    </template>
                    <el-menu-item index="/stu">
                        <span slot="title">学生</span>
                    </el-menu-item>
                    <el-menu-item index="/stu/upload">
                        <span slot="title">导入学生</span>
                    </el-menu-item>
                </el-submenu>
            </el-menu>
        </el-aside>
        <el-container>
            <el-header id="header">
                <div class="header_1">
                    <el-breadcrumb id="head_bread" separator-class="el-icon-arrow-right">
                        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                        <el-breadcrumb-item v-for="item in levelList" :key="item.path">{{item.name}}</el-breadcrumb-item>
                    </el-breadcrumb>
                </div>
                <div class="header_2">
                <img src="../assets/user.png" style="height:5%; width:5%; line-height:60px"/>
                    <el-dropdown>
                        <span class="el-dropdown-link">
                            {{userName}}
                        </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item>个人中心</el-dropdown-item>
                            <el-dropdown-item>设置</el-dropdown-item>
                            <el-dropdown-item>退出登录</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </div>
            </el-header>
            <el-main id="main">
                <router-view/>
            </el-main>
            <el-footer id="footer" style="height:30px">
                <span>夜阑卧听风吹雨，铁马冰河入梦来</span>
            </el-footer>
        </el-container>
    </el-container>
</template>

<script>
export default {
    name: 'home',
    data(){
       return{
           userName:'miah'
       }
    },
    watch: {
        $route() {
            this.getBreadcrumb()
        }
    },
    created:function(){
        this.getBreadcrumb()
    },
    methods: {
        getBreadcrumb() {
            //$route.matched一个数组 包含当前路由的所有嵌套路径片段的路由记录
            let matched = this.$route.matched.filter(item => item.name)
            this.levelList = matched
        },
        handleOpen(key, keyPath) {
            console.log("handleOpen:")
            console.log(key, keyPath);
        },
        handleClose(key, keyPath) {
            console.log("handleClose:")
            console.log(key, keyPath);
        }
    }
}
</script>

<style scoped>
.header_1{
    width: 70%;
    float: left;
    height: 100%;
    line-height: 60px;
    text-align: center
}

.el-aside{
  background: #409EFF;
  text-align: left
}

.el-header{
  background:  #409EFF;
  height:60px
}

.el-main{
  background: #ffffff;
  padding:5px
}

.el-footer{
  background: #409EFF;
  text-align: center;
  color:#C0C4CC
}

.el-breadcrumb{
    /* height:50px; */
    line-height: 60px;
    padding-left: 1%;
    width: 100%
}

.el-dropdown{
    padding-left: 1%;
    line-height: 60px;
    position: absolute;
}

.menuTitle{
    font-size: 15px;
    font-weight:bold
}
</style>
