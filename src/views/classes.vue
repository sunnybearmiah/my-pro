<template>
    <div class="sec">
    <el-form :inline="true" style="width:100%">
        <!-- <el-form-item label="ID：">
            <el-input v-model="filter.ID" placeholder="请输入ID" style="width:120px"></el-input>
        </el-form-item> -->
        <el-form-item label="班级：" class="header_form">
            <el-input v-model="filter.class_name" placeholder="请输入班级名称" style="width:200px"></el-input>
        </el-form-item>
        <el-form-item style="margin-left:25%" class="header_form">
            <el-button type="primary" size="small" icon="el-icon-search" @click="getClass()">搜索</el-button>
            <el-button type="primary" size="small" icon="el-icon-plus" @click="add">新增</el-button>
            <el-button type="primary" size="small" icon="el-icon-delete" @click="batDel">批量删除</el-button>
        </el-form-item>
    </el-form>
    <el-table
        :data="tableData"
        style="width:100%"
        highlight-current-row
        max-height="475"
        @select="handleSelect"
        @select-all="handleSelectAll">
        <el-table-column type="selection"></el-table-column>
        <el-table-column type="index" label="序号" width="100"></el-table-column>
        <el-table-column prop="c_id" label="ID"></el-table-column>
        <el-table-column prop="class_name" label="名称"></el-table-column>
        <el-table-column fixed="right" label="操作">
            <template slot-scope="scope">
                <el-button @click.native.prevent="upd(scope.$index, scope.row)" 
                    type="primary" 
                    size="small" 
                    icon="el-icon-edit">更新
                </el-button>
                <el-button @click.native.prevent="handleDel(scope.$index, scope.row)" 
                    type="danger" 
                    size="small"
                    icon="el-icon-delete">删除
                </el-button>
            </template>
        </el-table-column>
    </el-table>
    <div class="part">
        <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page"
        :page-sizes="[10, 15, 20, 25]"
        :page-size="10"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
        </el-pagination>
    </div>
    <!-- 新增 -->
    <el-dialog title="新增班级" :visible.sync="addDialogFormVisible">
        <el-form style="margin-right:120px" :model="addForm" :rules="rulesAdd" ref="addForm">
            <el-form-item label="班级：" :label-width="formLabelWidth" prop="class_name">
                <el-input v-model="addForm.class_name" placeholder="请输入班级"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="formOff">取 消</el-button>
            <el-button type="primary" @click="handleAdd">确 定</el-button>
        </div>
    </el-dialog>
    <!-- 修改 -->
    <el-dialog title="修改班级" :visible.sync="updDialogFormVisible">
        <el-form style="margin-right:120px" :model="updForm" :rules="rulesAdd" ref="updForm">
            <el-form-item label="班级：" :label-width="formLabelWidth" prop="class_name">
                <el-input v-model="updForm.class_name" placeholder="请输入班级"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="formOff">取 消</el-button>
            <el-button type="primary" @click="handleUpd">确 定</el-button>
        </div>
    </el-dialog>
</div>
</template>

<script>
import {classInfo,classInfoFilter,addClass,updClass,delClass} from '../api/http';
import { Message } from 'element-ui';
import {objIsNull} from '../common/common'
export default {
    data(){
        return{
            tableData:[],//列表
            total:0,
            page:1,
            num:10,
            filter:{
                id:'',
                class_name:''
            },
            delId:{c_id:''}, //删除ID
            selection:[],   //被选中的记录
            IDs:[],  //批量删除参数
            addForm:{ //新增表单
                class_name:''
            },
            updForm:{ //修改表单
                id:'',
                class_name:''
            },
            addDialogFormVisible: false,
            updDialogFormVisible: false,
            formLabelWidth :'150px',
            rulesAdd:{
                class_name:[{required:true,message:'请输入名字',trigger:'blur'},
                    {min:1,max:6,message:'名字长度在1到6个字符',trigger:'blur'}]
            }
        }
    },
    created:function(){
        this.getClasses()
    },
    methods:{
        handleSelectAll(selection){
            this.selection = selection
        },
        handleSelect(selection,row){ //被选中就添加，反选删除
            this.selection = selection
        },
        handleSizeChange(val){ //pagesize改变时
            if(val<=0){
                val = 1
            }
            this.num = val
            this.page = 1
            this.getClasses()
        },
        handleCurrentChange(val){ //currentpage改变时
            let maxPage = Math.ceil(this.total/this.num)
            if(val>maxPage){
                val = maxPage
            }
            this.page = val
            this.getClasses()
        },
        getClasses(){
            let params = {
                id:this.filter.id,
                class_name:this.filter.class_name
            }
            let aa = classInfo
            let bb = classInfoFilter
            let func = "bb"
            if(objIsNull(params)){
                func = "aa"
            }

            let sendData = params
            sendData.num = this.num
            sendData.page = this.page
            eval(func+"(sendData)").then(res=>{
                let data = res.classes
                // console.log(data)
                if (res.status === 200){
                    this.tableData = data
                    this.total = res.numberOfClasses
                }else{
                    let msg = res.msg
                    Message.error(msg)
                }
            })
        },
        handleAdd(){ //新增确定按钮
            let params = {
                class_name:this.addForm.class_name
            };
            this.$refs["addForm"].validate((valid) =>{
                if(!valid){
                    // Message.warning("表单数据填写不规范，请参照提示重新填写")
                    return
                }else{
                    addClass(params).then(res=>{
                        if (res.status ===200){
                            this.addDialogFormVisible = false;
                            this.addForm = {
                                class_name:''
                            }
                            this.getClasses();
                            Message.success("新增成功")
                        }else{
                            let msg = res.msg
                            Message.error(msg)
                        }
                    })
                }
            })
        },
        add(){ //新增按钮
            this.addDialogFormVisible=true
            this.addForm = {
                class_name:''
            }
        },
        formOff(){ //弹框取消按钮
            if(this.updDialogFormVisible){
                this.updDialogFormVisible = false
                this.updForm={ //修改表单
                    id:'',
                    class_name:''
                }
            }
            this.filter={ //查询表单
                id:'',
                class_name:''
            }
            if(this.addDialogFormVisible){
                this.addDialogFormVisible = false
                this.addForm={ //新增表单
                    class_name:''
                }
            }
            this.getClasses();
        },
        upd(index,row){ //修改按钮
            this.updDialogFormVisible = true
            this.updForm.id = row.c_id
            this.updForm.class_name = row.class_name
        },
        handleUpd(){ //修改确认按钮
            let params = {
                c_id:this.updForm.id,
                class_name:this.updForm.class_name
            };
            this.$refs["updForm"].validate((valid) =>{
                if(!valid){
                    // Message.warning("表单数据填写不规范，请参照提示重新填写")
                    return
                }else{
                    updClass(params).then(res=>{
                        if (res.status ===200){
                            this.updDialogFormVisible = false;
                            this.updForm = {
                                id:'',
                                class_name:''
                            }
                            this.getClasses();
                            Message.success("修改成功")
                        }else{
                            let msg = res.msg
                            Message.error(msg)
                        }
                    })
                }
            })
        },
        handleDel(index,row){//删除按钮 
            this.IDs = []
            this.IDs.push(row.c_id)
            // console.log(this.IDs)
            this.del(this.IDs)
        },
        batDel(){//批量删除按钮
            this.IDs = []
            if(this.selection.length<0){
                Message.warning("没有选中任何记录")
                return
            }else{
                for(let i=0;i<this.selection.length;i++){
                    this.IDs.push(this.selection[i].c_id)
                }
                // console.log(this.IDs)
                this.del(this.IDs)
            }
        },
        del(ids){
            let params = {c_ids:ids}
            this.$confirm('此操作将永久删除该记录, 是否继续?','提示',{
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(()=>{
                delClass(params).then(res=>{
                    if(res.status === 200){
                        this.delId = {c_id:''}
                        this.IDs = []
                        Message.success("删除成功")
                        this.getClasses();
                    }else{
                        let msg = res.msg
                        Message.error(msg)
                    }
                })
            }).catch(() => {
                Message.info('已取消删除')         
            })     
        }
    }
}
</script>

<style lang="less" src="../css/table.less" scoped></style>