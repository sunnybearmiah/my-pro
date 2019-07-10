<template>
    <el-container style="height:100%; width:100%">
        <el-aside id="aside" :class="collapsed?'menu-collapsed':'menu-expanded'">
            <h5 style="text-align:center">学校管理系统</h5>
            <el-menu
                default-active="this.$route.path"
                class="el-menu-vertical-demo"
                text-color="#000405"
                active-text-color="#ffffff"
                background-color="#409EFF"
                @open="handleOpen"
                @close="handleClose"
                unique-opened
                :collapse="collapsed"
                :collapse-transition="dh"
                router>
                <template v-for="(list,k,idx) in menuList">
                    <template v-if="list.uri">
                        <el-menu-item v-bind:key="idx" :index="list.uri">
                            <i :class="list.icon"></i>
                            <span class="menuTitle" slot="title">{{ list.name }}</span>
                        </el-menu-item>
                    </template>
                    <template v-else>
                        <el-submenu v-bind:key="idx" :index="list.id.toString()">
                            <template slot="title">
                                <i :class="list.icon"></i>
                                <span class="menuTitle">{{ list.name }}</span>
                            </template>
                            <template v-if="list.item">
                                <el-menu-item class="submenu_item_self" v-for="(subList,k,idx) in list.item" v-bind:key="idx" :index="subList.uri">
                                    <i class="el-icon-caret-right"></i>
                                    <span slot="title" class="item-menu">{{ subList.name }}</span>
                                </el-menu-item>
                            </template>
                        </el-submenu>
                    </template>
                </template>
            </el-menu>
        </el-aside>
        <el-container>
            <el-header id="header">
                <div class="header_0" v-show="!collapsed">
                    <i class="icon el-icon-s-fold" @click.prevent="collapse()"></i>
                </div>
                <div class="header_0" v-show="collapsed">
                    <i class="icon el-icon-s-unfold" @click.prevent="expand()"></i>
                </div>
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
                <span>朝饮木兰之坠露，夕餐秋菊之落英</span>
            </el-footer>
        </el-container>
    </el-container>
</template>

<script>
const menu = require('../common/menu')
export default {
    name: 'home',
    data(){
       return{
           userName:'miah',
           menuList:[],
           collapsed:false,
           dh:false
       }
    },
    watch: {
        $route() {
            this.getBreadcrumb()
        }
    },
    created:function(){
        this.getMenu
        this.getBreadcrumb()
    },
    computed:{
        getMenu:function(){
            this.menuList = menu.default.menu
            return this.menuList
        }
    },
    methods: {
        collapse(){
            this.collapsed = true
        },
        expand(){
            this.collapsed = false
        },
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

<style lang="less" scoped>
.header_0{
    width: 5%;
    float: left;
    height: 100%;
    line-height: 80px;
    text-align: left
}

.icon{
    font-size: 30px
}

.menu-collapsed {
    flex: 0 0 60px;
    width: 60px;
}
.menu-expanded {
    flex: 0 0 200px;
    width: 200px;
}

.header_1{
    width: 60%;
    float: left;
    height: 100%;
    line-height: 60px;
    text-align: center
}

.el-aside{
  background: #409EFF;
  text-align: left
}

/deep/.el-header{
  background:  #409EFF;
  height:60px;
  padding:0
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
    font-weight:bold;
}

/deep/.el-menu{
    border-right: none;
    background-color: rgb(64, 158, 255);
}

/deep/.el-icon-arrow-down:before{
    content:"\E794"
}

/deep/.el-menu-item{
    height: 50px;
    line-height: 60px
}

/deep/.el-submenu__title{
    height: 50px;
    line-height: 60px
}

.submenu_item_self{
    height: 30px;
    line-height: 30px
}
</style>
