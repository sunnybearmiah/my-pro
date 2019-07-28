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
                    <template v-if="!list.hidden">
                        <!-- 类首页单层结构 -->
                        <template v-if="list.single"> 
                            <el-menu-item v-bind:key="idx" :index="list.children[0].path">
                                <i :class="list.children[0].icon"></i>
                                <span class="menuTitle" slot="title">{{ list.children[0].name }}</span>
                            </el-menu-item>
                        </template>
                        <!-- 两层结构 -->
                        <template v-else>
                            <el-submenu v-bind:key="idx" :index="list.id.toString()">
                                <template slot="title">
                                    <i :class="list.icon"></i>
                                    <span class="menuTitle">{{ list.name }}</span>
                                </template>
                                <template v-if="list.children">
                                    <el-menu-item class="submenu_item_self" v-for="(subList,k,idx) in list.children" v-bind:key="idx" :index="subList.path">
                                        <i class="el-icon-caret-right"></i>
                                        <span slot="title" class="item-menu">{{ subList.name }}</span>
                                    </el-menu-item>
                                </template>
                            </el-submenu>
                        </template>
                    </template>
                </template>
            </el-menu>
        </el-aside>
        <el-container>
            <el-header>
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
                <img src="../assets/user.png" style="height:60px; width:60px; line-height:60px"/>
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
            <!-- 此处放置el-tabs代码 -->
                <div>
                <el-tabs
                    v-model="activeIndex"
                    type="border-card"
                    closable
                    v-if="openTab.length"
                    @tab-click='tabClick'
                    @tab-remove='tabRemove'>
                    <el-tab-pane
                        :key="item.name"
                        v-for="(item, index) in openTab"
                        :label="item.name"
                        :name="item.route">
                    </el-tab-pane>
                </el-tabs>
                </div>
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
const menu = require('../router/menu')
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
    computed:{
        getMenu:function(){
            this.menuList = menu.default.menu
            return this.menuList
        },
        openTab:function() {
            return this.$store.state.openTab;
        },
        activeIndex:{
            get:function() {
                return this.$store.state.activeIndex;
            },
            set:function(val) {
                this.$store.dispatch('setFunc', val);
            }
        }
    },
    watch: {
        '$route'(to,from){
            this.getBreadcrumb()       
            //判断路由是否已经打开
            //已经打开的 ，将其置为active
            //未打开的，将其放入队列里
            let flag = false;
            for(let item of this.openTab){
            if(item.name === to.name){
                this.$store.dispatch('setFunc',to.path)
                flag = true;
                break;
            }
            }
            if(!flag){
            this.$store.dispatch('addFunc', {route: to.path, name: to.name});
            this.$store.dispatch('setFunc', to.path);
            }
        }
    },
    created:function(){
        this.getMenu
        this.getBreadcrumb()
    },
    mounted () {
        // 刷新时以当前路由做为tab加入tabs
        // 当前路由不是首页时，添加首页以及另一页到store里，并设置激活状态
        // 当当前路由是首页时，添加首页到store，并设置激活状态
        if (this.$route.path !== '/' && this.$route.path !== '/welcome') {
            this.$store.dispatch('addFunc', {route: '/welcome' , name: '首页'});
            this.$store.dispatch('addFunc', {route: this.$route.path , name: this.$route.name });
            this.$store.dispatch('setFunc', this.$route.path);
        } else {
            this.$store.dispatch('addFunc', {route: '/welcome', name: '首页'});
            this.$store.dispatch('setFunc', '/welcome');
            this.$router.push('/');
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

        },
        handleClose(key, keyPath) {

        },
         //tab标签点击时，切换相应的路由
        tabClick(tab){
            this.$router.push({path: this.activeIndex});
        },
        //移除tab标签
        tabRemove(targetName){
            //首页不删
            if(targetName == '/'||targetName == '/welcome'){
                return
            }
            this.$store.dispatch('delFunc', targetName);
            if (this.activeIndex === targetName) {
                // 设置当前激活的路由
                if (this.openTab && this.openTab.length >= 1) {
                    this.$store.dispatch('setFunc', this.openTab[this.openTab.length-1].route);
                    this.$router.push({path: this.activeIndex});
                } else {
                this.$router.push({path: '/'});
                }
            }
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
    flex: 0 0 180px;
    width: 180px;
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
    height:60px;
    background:  #409EFF;
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

/deep/.el-icon-close:before{
    margin-left:5px
}

/deep/.el-tabs__content{
    display: none;
}

/deep/.el-tabs__item{
    height:30px;
    line-height: 30px
}
</style>
