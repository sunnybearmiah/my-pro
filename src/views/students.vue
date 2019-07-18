<template>
<div class="sec">
    <el-form :inline="true" style="width:100%">
        <el-form-item label="学号：" class="header_form">
            <el-input v-model="filter.no" placeholder="请输入学号" clearable style="width:120px"></el-input>
        </el-form-item>
        <el-form-item label="姓名：" class="header_form">
            <el-input v-model="filter.name" placeholder="请输入姓名" clearable style="width:120px"></el-input>
        </el-form-item>
        <el-form-item label="性别：" class="header_form">
           <el-select v-model="filter.sex" placeholder="请选择性别" style="width:120px">
               <el-option label="男" value='男'></el-option>
               <el-option label="女" value='女'></el-option>
           </el-select>
        </el-form-item>
        <el-form-item label="班级：" class="header_form">
           <el-select v-model="filter.classes" placeholder="请选择班级" style="width:140px">
               <el-option v-for="val in classList" :key=val.id :label="val.class_name" :value="val.class_name">
               </el-option>
           </el-select>
        </el-form-item>
        <el-form-item style="margin-left:5%" class="header_form">
            <el-button type="primary" size="small" icon="el-icon-search" @click="getStu()">搜索</el-button>
            <el-button type="primary" size="small" icon="el-icon-plus" @click="add">新增</el-button>
            <router-link to="/stu/upload">
                <el-button type="primary" size="small" icon="el-icon-upload">导入</el-button>
            </router-link>
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
        <el-table-column prop="no" label="学号"></el-table-column>
        <el-table-column prop="name" label="姓名"></el-table-column>
        <el-table-column prop="sex_name" label="性别"></el-table-column>
        <el-table-column prop="classes.class_name" label="班级"></el-table-column>
        <el-table-column fixed="right" label="操作">
            <template slot-scope="scope">
                <el-button @click.native.prevent="upd(scope.$index, scope.row)" 
                    type="primary" 
                    size="mini" 
                    icon="el-icon-edit">更新
                </el-button>
                <el-button @click.native.prevent="handleDel(scope.$index, scope.row)" 
                    type="danger" 
                    size="mini"
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
    <el-dialog title="新增学生" :visible.sync="addDialogFormVisible">
        <el-form style="margin-right:120px" :model="addForm" :rules="rulesAdd" ref="addForm">
            <el-form-item label="学号：" :label-width="formLabelWidth" prop="no">
                <el-input v-model="addForm.no" clearable placeholder="请输入学号"></el-input>
            </el-form-item>
            <el-form-item label="姓名：" :label-width="formLabelWidth" prop="name">
                <el-input v-model="addForm.name" clearable placeholder="请输入姓名"></el-input>
            </el-form-item>
            <el-form-item label="性别：" :label-width="formLabelWidth" required>
                <el-select v-model="addForm.sex" placeholder="请选择性别" style="display:inline">
                    <el-option label="男" value='男'></el-option>
                    <el-option label="女" value='女'></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="班级：" :label-width="formLabelWidth" required>
                <el-select v-model="addForm.classes" placeholder="请选择班级" style="display:inline">
                    <el-option v-for="val in classList" :key=val.id :label="val.class_name" :value="val.class_name">
                    </el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="formOff">取 消</el-button>
            <el-button type="primary" @click="handleAdd">确 定</el-button>
        </div>
    </el-dialog>
    <!-- 修改 -->
    <el-dialog title="修改学生" :visible.sync="updDialogFormVisible">
        <el-form style="margin-right:120px" :model="updForm" :rules="rulesAdd" ref="updForm">
            <el-form-item label="学号：" :label-width="formLabelWidth" required>
                <el-input v-model="updForm.no" placeholder="请输入学号" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="姓名：" :label-width="formLabelWidth" prop="name">
                <el-input v-model="updForm.name" clearable placeholder="请输入姓名"></el-input>
            </el-form-item>
            <el-form-item label="性别：" :label-width="formLabelWidth" required>
                <el-select v-model="updForm.sex" placeholder="请选择性别" style="display:inline">
                    <el-option label="男" value='男'></el-option>
                    <el-option label="女" value='女'></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="班级：" :label-width="formLabelWidth" required>
                <el-select v-model="updForm.classes" placeholder="请选择班级" style="display:inline">
                    <el-option v-for="val in classList" :key=val.id :label="val.class_name" :value="val.class_name">
                    </el-option>
                </el-select>
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
import {stuInfo,stuInfoFilter,addStu,updStu,delStu,classInfo} from '../api/http';
import { Message, MessageBox } from 'element-ui';
import {objIsNull} from '../common/common'
export default {
    data(){
        return{
            tableData:[],//列表
            total:0,
            page:1,
            num:10,
            classList:[],//班级
            filter:{
                no:'',
                name:'',
                sex:'',
                classes:''
            },
            delId:{id:''}, //删除ID,单个删除
            selection:[],   //被选中的记录
            IDs:[],  //批量删除参数
            addForm:{ //新增表单
                no:'',
                name:'',
                sex:'',
                classes:''
            },
            updForm:{ //修改表单
                id:'',
                no:'',
                name:'',
                sex:'',
                classes:''
            },
            addDialogFormVisible: false,
            updDialogFormVisible: false,
            formLabelWidth :'150px',
            rulesAdd:{
                no:[{required:true,message:'请输入学号',trigger:'blur'},
                    {pattern:/^[1-9]{1,5}[0-9]{0,1}$/,message:'学号不能超过六位整数,不能以0开头',trigger:'blur'}],
                name:[{required:true,message:'请输入名字',trigger:'blur'},
                    {pattern:/^[a-zA-Z0-9_\u4e00-\u9fa5]{1,6}$/,message:'姓名长度在1到6个字符的中文数字字母和下划线',trigger:'blur'}]
            }
        }
    },
    created:function(){
        this.getClasses();
        this.getStu();
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
            this.getStu()
        },
        handleCurrentChange(val){ //currentpage改变时
            let maxPage = Math.ceil(this.total/this.num)
            if(val>maxPage){
                val = maxPage
            }
            this.page = val
            this.getStu()
        },
        getClasses(){
            classInfo().then(res=>{
                let data = res.classes
                // console.log(data)
                if (res.status === 200 && data.length>0){
                    this.classList = data
                }else{
                    let msg = res.msg
                    Message.error(msg)
                }
            })
        },
        getStu(){ //获取列表
            let params = {
                no:this.filter.no.trim(),
                name:this.filter.name.trim(),
                sex:this.filter.sex.trim(),
                class_name:this.filter.classes.trim()
            };

            let aa = stuInfo
            let bb = stuInfoFilter
            let func = 'bb'
            // console.log(params)
            if(objIsNull(params)){
                func = 'aa'
            }
            
            let sendData=params
            sendData.page = this.page
            sendData.num = this.num
            eval(func+"(sendData)").then(res=>{
                if (res.status === 200){
                    let data = res.students
                    // console.log(data)
                    this.tableData = data
                    this.total = res.numberOfStudent
                    for(let i=0;i<data.length;i++){
                        if(data[i].sex == 1){
                            this.tableData[i].sex_name = '男'
                        }else if(data[i].sex == 0){
                            this.tableData[i].sex_name = '女'
                        }else{
                            this.tableData[i].sex_name = data[i].sex
                        }
                    }
                }else{
                    let msg = res.msg
                    Message.error(msg)
                }
            })
        },
        handleAdd(){ //新增确定按钮
            let params = {
                no:parseInt(this.addForm.no.trim()),
                name:this.addForm.name.trim(),
                sex:this.addForm.sex.trim(),
                class_name:this.addForm.classes.trim()
            };
            this.$refs["addForm"].validate((valid) =>{
                if(!valid){
                    // console.log(valid)
                    // Message.warning("表单数据填写不规范，请参照提示重新填写")
                    return
                }else{
                    addStu(params).then(res=>{
                        if (res.status ===200){
                            this.addDialogFormVisible = false;
                            this.addForm = {
                                no:'',
                                name:'',
                                sex:'',
                                classes:''
                            }
                            this.getStu();
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
                        no:'',
                        name:'',
                        sex:'',
                        classes:''
                    }
        },
        formOff(){ //弹框取消按钮
            if(this.updDialogFormVisible){
                this.updDialogFormVisible = false
                this.updForm={ //修改表单
                    id:'',
                    no:'',
                    name:'',
                    sex:'',
                    classes:''
                }
            }
            this.filter={ //查询表单
                no:'',
                name:'',
                sex:'',
                classes:''
            }
            if(this.addDialogFormVisible){
                this.addDialogFormVisible = false
                this.addForm={ //新增表单
                    no:'',
                    name:'',
                    sex:'',
                    classes:''
                }
            }
            this.getStu();
        },
        upd(index,row){ //修改按钮
            this.updDialogFormVisible = true
            this.updForm.id = row.id
            this.updForm.no = row.no
            this.updForm.name = row.name
            this.updForm.sex = row.sex
            this.updForm.classes = row.classes.class_name
        },
        handleUpd(){ //修改确认按钮
            let params = {
                id:this.updForm.id,
                no:this.updForm.no,
                name:this.updForm.name.trim(),
                sex:this.updForm.sex.trim(),
                class_name:this.updForm.classes.trim()
            };
            this.$refs["updForm"].validate((valid) =>{
                if(!valid){
                    // Message.warning("表单数据填写不规范，请参照提示重新填写")
                    return
                }else{
                    updStu(params).then(res=>{
                        if (res.status ===200){
                            this.updDialogFormVisible = false;
                            this.updForm = {
                                id:'',
                                no:'',
                                name:'',
                                sex:'',
                                classes:''
                            }
                            this.getStu();
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
            this.IDs.push(row.id)
            // console.log("+++++++++++")
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
                    this.IDs.push(this.selection[i].id)
                }
                // console.log(this.IDs)
                this.del(this.IDs)
            }
        },
        del(ids){
            let params = {IDs:ids}
            this.$confirm('此操作将永久删除记录, 是否继续?','提示',{
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(()=>{
                delStu(params).then(res=>{
                    if(res.status === 200){
                        this.delId = {id:''}
                        Message.success("删除成功")
                        this.getStu();
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
