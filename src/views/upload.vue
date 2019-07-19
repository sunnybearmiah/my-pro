<template>
<div>
    <el-card>
        <el-form>
            <el-form-item :inline="true">
                <div class="pos1">
                    <span>文件地址：</span>
                    <el-input v-model="uploadFileName" value="uploadFileName" placeholder="请单击选取文件按钮" style="width:60%"></el-input>
                    <el-button size="small" type="primary" style="margin-left:1%" @click="preview" :disabled="previewBtn">预览上传文件</el-button>
                    <div>只能上传xlsx文件，且不超过5Mb</div>
                </div>
                <div class="pos2">
                    <el-upload
                    ref="upload"
                    name="file"
                    class="upload-demo"
                    action=""
                    :on-preview="handlePreview"
                    :on-remove="handleRemove"
                    :before-remove="beforeRemove"
                    :limit="1"
                    :on-exceed="handleExceed"
                    :file-list="fileList"
                    :auto-upload="false"
                    :on-change="handleChange"
                    >
                    <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                    <el-button style="margin-left: 10px;" size="small" type="success" @click="upload" :disabled="importBtn">导入</el-button>
                    </el-upload>
                </div>
                <div class="pos3">
                    <el-button size="small" type="primary" @click="download">
                        下载导入模板
                    </el-button> 
                </div>
            </el-form-item>
        </el-form>
        <el-dialog title="选择sheet" :visible.sync="selDialogFormVisible">
            <el-form style="margin:0 120px 0 120px">
                <el-form-item label="系统检测到所选excel有多个sheet，请选择需要导入的sheet：" required>
                    <el-select v-model="sheetId" placeholder="请选择sheet名称" >
                        <el-option v-for="(val,key,index) in sheets" :key=val :label="val" :value="index">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="formOff">取 消</el-button>
                <el-button type="primary" @click="handleConfirm">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="文件检测中" :visible.sync="cheDialogVisible">
            <el-progress type="circle" :percentage="percent" :status="progressStatus"></el-progress>
        </el-dialog>
    </el-card>
    <el-dialog title="excel文件预览" :visible.sync="previewDialogVisible" width="90%" class="preview-dialog">
        <el-table
            :data="sheetConcent"
            style="width:100%"
            highlight-current-row
            max-height="400"
            border>
            <el-table-column type="index" label="序号" width="100px"></el-table-column>
            <el-table-column prop="__rowNum__" label="行号" width="100px"></el-table-column>
            <el-table-column v-for="(val,k,index) in sheetRow" v-bind:key="index" :prop="val" :label="val"></el-table-column>
        </el-table>
    </el-dialog>
    <div id="errorTb" style="display:none;float:left;width:100%">
        <div style="margin:5px">
            <el-button type="primary" size="mini" @click="handleEdit" :disabled="editBtn" class="error-left">在线编辑</el-button>
            <el-button @click="addRow"  class="error-left"
                    type="primary" :style="{ display: editOnlineClick }"
                    size="mini" 
                    icon="el-icon-circle-plus">
            </el-button>
            <el-button @click="delRows"  class="error-left"
                    type="primary" :style="{ display: editOnlineClick }"
                    size="mini" 
                    icon="el-icon-remove">
                </el-button>
            <font size="4" color="red"> 
                <b style="color:black" v-if="editOnline">在线编辑</b>
                <b v-else>检测结果错误提示</b>
            </font>
            <el-button type="primary" size="mini" @click="handleEditCancel" :disabled="editBtn" class="error-right" :style="{ display: editOnlineClick }">取消编辑</el-button>
            <el-button type="primary" size="mini" @click="upload" :disabled="editBtn" class="error-right" :style="{ display: editOnlineClick }">确认上传</el-button>
        </div>
        <el-form :model="form" :rules="rules" ref="form" status-icon>
            <el-table v-show="!editOnline"
                :data="editOff?editTable:originTable"
                style="width:100%"
                highlight-current-row
                border 
                max-height="475"
                @selection-change="selRow"
                @select="handleSelect"
                @select-all="handleSelectAll">
                <template> 
                    <el-table-column type="expand">
                        <template slot-scope="props">
                            <el-form label-position="left" class="demo-table-expand">
                                <el-form-item v-for="(val,k,index) in props.row.errorInfo" v-bind:key="index" label="错误信息描述:">
                                    <span><font color="red">{{ props.row.errorInfo[k] }}</font></span>
                                </el-form-item>
                            </el-form>
                        </template>
                    </el-table-column>
                </template>
                <el-table-column type="index" label="序号" align="center" width="100px"></el-table-column>
                <el-table-column prop="roder" label="行号" align="center" ></el-table-column>
                <el-table-column prop="no" label="学号" align="center" ></el-table-column>
                <el-table-column prop="name" label="姓名" align="center" ></el-table-column>
                <el-table-column prop="sex" label="性别" align="center" ></el-table-column>
                <el-table-column prop="class_name" label="班级" align="center" ></el-table-column>
            </el-table>
            <el-table v-show="editOnline"
                :data="form.editTable"
                style="width:100%"
                highlight-current-row
                border 
                max-height="475"
                @selection-change="selRow"
                @select="handleSelect"
                @select-all="handleSelectAll">
                <template> 
                    <el-table-column type="expand">
                        <template slot-scope="props">
                            <el-form label-position="left" class="demo-table-expand">
                                <el-form-item v-for="(val,k,index) in props.row.errorInfo" v-bind:key="index" label="错误信息描述:">
                                    <span><font color="red">{{ props.row.errorInfo[k] }}</font></span>
                                </el-form-item>
                            </el-form>
                        </template>
                    </el-table-column>
                </template>
                <el-table-column type="selection" width="45" align="center"></el-table-column>
                <el-table-column type="index" label="序号" align="center" width="70px"></el-table-column>
                <el-table-column prop="roder" label="行号" align="center" width="70px"></el-table-column>
                <el-table-column v-if="editOnline" label="学号" align="center" width="220px">
                    <template slot-scope="scope">
                        <el-form-item :prop="'editTable.' + scope.$index + '.no'" :rules='rules.no'>
                            <el-input size="small" v-model="scope.row.no" clearable></el-input>
                        </el-form-item>
                    </template>
                </el-table-column>
                <el-table-column v-if="editOnline" label="姓名" align="center" width="280px">
                    <template slot-scope="scope">
                        <el-form-item  :prop="'editTable.' + scope.$index + '.name'" :rules='rules.name'>
                            <el-input size="small" v-model="scope.row.name" clearable></el-input>
                        </el-form-item>
                    </template>
                </el-table-column>
                <el-table-column v-if="editOnline" label="性别" align="center" width="100px">
                    <template slot-scope="scope">
                            <el-form-item required>
                                <el-select v-model="scope.row.sex" placeholder="请选择性别" style="display:inline">
                                    <el-option label="男" value='男'></el-option>
                                    <el-option label="女" value='女'></el-option>
                                </el-select>
                            </el-form-item>
                    </template>
                </el-table-column>          
                <el-table-column v-if="editOnline" label="班级" align="center" >
                    <template slot-scope="scope">
                            <el-form-item :prop="'editTable.' + scope.$index + '.class_name'" :rules='rules.name'>
                                <el-input size="small" v-model="scope.row.class_name" clearable></el-input>
                            </el-form-item>
                    </template>
                </el-table-column>
            </el-table>
        </el-form>
    </div>
</div>
</template>

<script>
import {uploadStu} from '../api/http'
import {getExcel,getSheets,shToJson} from '../common/excel'
export default {
    data() {
        return {
            form:{
                errorTable:[{
                    roder:null,
                    no:'',
                    name:'',
                    sex:'',
                    class_name:''
                },{
                    roder:null,
                    no:'',
                    name:'',
                    sex:'',
                    class_name:''
                }],
                editTable:[{
                    roder:null,
                    no:'',
                    name:'',
                    sex:'',
                    class_name:''
                },{
                    roder:null,
                    no:'',
                    name:'',
                    sex:'',
                    class_name:''
                }]
            },
            selection:[],
            uploadFileName:'', //文件名
            fileList:[],
            uploadFileMsg: {},
            sheets:[],
            sheetName:'',
            sheetId:0,
            sheetConcent:[],
            sheetRow:[],
            selDialogFormVisible:false,
            errorTable:[],
            cheDialogVisible:false,
            percent:0,
            progressStatus:"success",
            previewDialogVisible:false,
            previewBtn:true,
            importBtn:true,  //导入按钮是否可用
            editBtn:true,
            editTable:[],
            originTable:[],
            maxRow : null,
            editOnlineClick:"none",
            editOff:false,//是否暂存编辑
            editOnline:false, //在线编辑功能是否点击
            rules:{
                no:[{required:true,message:'请输入学号',trigger:'blur'},
                    {pattern:/^[1-9]{1,5}[0-9]{0,1}$/,message:'学号不能超过六位整数,不能以0开头',trigger:'blur'}],
                name:[{required:true,message:'请输入名字',trigger:'blur'},
                    {pattern:/^[a-zA-Z0-9_\u4e00-\u9fa5]{1,6}$/,message:'名字长度在1到6个字符的中文数字字母和下划线',trigger:'blur'}]
            }
        }
    },
    watch:{
        editTable:function(newEditTable,oldEditTable){
            this.form.editTable = newEditTable.slice()
        },
        errorTable:function(newVal,oldVal){
            this.form.errorTable = newVal.slice()
        }
    },
    methods: {
        handleSelectAll(selection){
            this.selection = selection
        },
        handleSelect(selection,row){ //被选中就添加，反选删除
            this.selection = selection
        },
        selRow(row){  //修改行
            this.selection = row
        },
        handleEditCancel(){  //取消在线编辑
            this.$confirm('取消编辑是否暂存本次编辑的数据以便下次继续编辑？','提示',{
                confirmButtonText: '暂存',
                cancelButtonText: '不暂存',
                type: 'warning'
            }).then(()=>{
                this.editOnline = false
                this.editOnlineClick = 'none'
                this.editOff = true
            }).catch(() => {
                this.editOff = false
                this.editTable = []
                console.log(this.originTable)
                this.editTable = this.editTable.concat(this.originTable)
                console.log(this.editTable)
                this.editOnline = false
                this.editOnlineClick = 'none'
                this.$message.info('已还原数据')  
            })     
        },
        addRow(){  //添加一行
            this.maxRow = this.maxRow+1
            this.editTable.unshift({
                roder : this.maxRow+'#',
                no : null,
                name : '',
                sex : '',
                class_name : ''
            })
        },
        delRows(){  //删除行
            if(this.selection.length==0){
                this.$message.warning("未选中任何记录。")
                return
            }
            for(let i=0;i<this.selection.length;i++){
                let val = this.selection
                val.forEach((val, index) => {
                    this.editTable.forEach((v, i) => {
                        if (val.roder == v.roder) {
                            // i 为选中的索引
                            this.editTable.splice(i, 1)
                        }
                    })
                })
            }
            // this.$refs.editTable.clearSelection()
        },
        handleEdit(){  //点击在线编辑按钮
            this.editOnline = true
            this.editOnlineClick = ''
        },
        async handleConfirm(){ //确定sheet
            this.sheetName = this.sheets[this.sheetId]
     
            let result = await getExcel(this.uploadFileMsg.raw,shToJson,[this.sheetName])
            this.sheetConcent = result[1]
            this.sheetRow = result[0]
            this.maxRow = result[2]  //最大行数

            this.checkContent()
            if(this.errorTable.length === 0){
                this.$message.success("上传文件格式校验成功，请点击上传按钮上传文件")
                this.importBtn = false //允许导入
            }else{
                //展示表格
                this.progressStatus = "warning"
                this.cheDialogVisible = false
                let errorDiv = document.getElementById("errorTb")
                errorDiv.style.display = 'block'
                this.editBtn = false
            }
            this.previewBtn = false
        },
        formOff(){
            this.selDialogFormVisible=false
        },
        handleRemove(file, fileList) {
            this.uploadFileName = ''
            this.fileList = []
            this.uploadFileMsg = {}
            this.sheetName = ''
            this.sheetConcent = []
            this.sheetRow = []
            this.sheets = []
            this.errorTable = []
            this.editTable = []
            this.originTable = []
            this.cheDialogVisible = false
            this.previewDialogVisible = false
            this.previewBtnv = true
            this.editBtn = true
            let errorDiv = document.getElementById("errorTb")
            errorDiv.style.display = 'none'
        },
        handleExceed(files, fileList) { //选择文件后
            this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
        },
        beforeRemove(file, fileList) {
            return this.$confirm(`确定移除 ${ file.name }？`);
        },
        async handleChange(file,fileList){  //选取文件后确定sheet
            let type = file.raw.type
            let size = file.raw.size
            if(type !='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'){
                this.fileList = []
                this.$message.warning("上传的文件只能是excel文件")
                return
            }
            if((size/1024/1024)>5){
                this.fileList = []
                this.$message.warning("上传的文件大小必须小于5Mb")
                return
            }
            console.log(file)
            this.uploadFileName = file.name
            this.uploadFileMsg = file
            this.fileList.push(file)
            this.sheets = await getExcel(file.raw,getSheets,[])
            if (this.sheets.length > 1){ //选择sheet弹窗
                this.selDialogFormVisible = true
            }else if(this.sheets.length ===0){    //没有sheet
                this.$message.warning("上传的文件内容为空，请检查")
                return
            }else{ //只有一个sheet
                this.sheetName = this.sheets[0]
                let result = await getExcel(this.uploadFileMsg.raw,shToJson,[this.sheetName])
                this.sheetConcent = result[1] //内容
                this.sheetRow = result[0] //表头
                this.maxRow = result[2]  //最大行数
             
                if(this.checkContent()){
                    this.cheDialogVisible = false
                    this.$message.success("上传文件格式校验成功，请点击上传按钮上传文件")
                    this.importBtn = false //允许导入

                }else{
                    //展示表格
                    this.progressStatus = "warning"
                    this.cheDialogVisible = false
                    let errorDiv = document.getElementById("errorTb")
                    errorDiv.style.display = 'block'
                    this.editBtn = false
                }
            }
            this.previewBtn = false
        },
        // application/vnd.openxmlformats-officedocument.spreadsheetml.sheet    .xlsx
        // application/vnd.ms-excel        .xls
        upload(){ //导入
            // if(!this.uploadFileMsg || this.fileList.length===0){
            //     this.$message.warning("当前没有可导入的文件，请先选择1个文件")
            //     return
            // }
            if(this.editTable.length==0){
                this.$message.warning("当前没有数据可以导入")
                return
            }
            // let data = new FormData()
            // data.append("file",this.uploadFileMsg.raw) //二进制数据传输
            // data.append("sheetID",this.sheetId)
            this.$refs["form"].validate((valid) =>{
                if(!valid){
                    // console.log(valid)
                    this.$message.warning("表单数据填写不规范，请参照提示重新填写")
                    return
                }else{
                    let params = this.editTable   
                    
                    uploadStu(params).then(res=>{
                        if(res.status === 200){
                            this.$message.success("数据导入成功")
                        }else{
                            this.errorTable = res.wrongList
                            this.errorTable.forEach((val,idx)=>{
                                this.editTable.forEach((v,i)=>{
                                    if(val.roder == v.roder){
                                        this.editTable[i].errorInfo = this.errorTable[idx].errorInfo
                                    }
                                })
                            })
                            let errorDiv = document.getElementById("errorTb")
                            errorDiv.style.display = 'block'
                            this.$message.error(res.msg || "数据导入失败")
                        }
                    })
                }
            })
        },
        handlePreview(file) { //点击文件列表中的文件,让他预览吧
            this.previewDialogVisible = true
        },
        preview(){ //预览
            this.previewDialogVisible = true
        },
        download(){
            window.open("../static/upload/template/student.xlsx","_self"); //打包之后
            window.open("../../static/upload/template/student.xlsx","_self"); //dev 环境下
        },
        //对sheet返回的json做校验
        checkContent(){
            let res = false
            this.cheDialogVisible = true
            //先校验格式 10%
            let title = ['id','no','name','sex','classes']
            let row = this.sheetRow
            let exists = false
            for (let i=0;i<title.length;i++){
                let col = title[i]
                exists = false
                for(let k in row){
                    if(col === row[k]){
                        exists = true
                        break
                    }
                }

                if(!exists){
                    this.progressStatus = "warning"
                    this.cheDialogVisible = false
                    this.$message.warning("上传的文件请严格按照模板填写，模板表头不可修改且内容均不能为空。")
                    this.previewBtn = false
                    break
                }
                this.percent = this.percent + 2.5
            }
            if(!exists){
                return res
            }
            //再校验内容 90%
            let noPatt = /^[1-9]{1,5}[0-9]{0,1}$/
            let namePatt = /^[a-zA-Z0-9_\u4e00-\u9fa5]{1,6}$/
            let sexPatt = /男|女/
            for(let i=0;i<this.sheetConcent.length;i++){
                let errorInfo = []
                let rows = this.sheetConcent[i]
                let no = (rows.no)?rows.no:''
                let name = (rows.name)?(rows.name).toString().trim():''
                let sex = (rows.sex)?rows.sex.trim():''
                let classes = (rows.classes)? rows.classes.trim():''
                let errorRow = {   
                    roder:rows.__rowNum__,
                    no:no,
                    name:name,
                    sex:sex,
                    class_name:classes
                }
            // this.form.originalData.unshift(errorRow)  //fail 公用errorRow的地址
                if(!noPatt.test(no)){
                    let msg = "学号no内容只能是1到6个的数字组成。"
                    errorInfo.push(msg)
                }
                if(!namePatt.test(name)){
                    let msg = "姓名name内容只能是1到6个的数字、字母、下划线、中文组成。"
                    errorInfo.push(msg)
                }
                if(!sexPatt.test(sex)){
                    let msg = "性别sex内容只能是男或女。"
                    errorInfo.push(msg)
                }
                if(!namePatt.test(classes)){
                    let msg = "班级classes内容只能是1到6个的数字、字母、下划线、中文组成。"
                    errorInfo.push(msg)
                }
                
                if(errorInfo.length>0){
                    errorRow.errorInfo = errorInfo
                    this.errorTable.push(errorRow)
                    this.editTable.unshift(errorRow)
                    // this.originTable.unshift(errorRow)
                    this.originTable.unshift({  // 不公用地址
                        roder:rows.__rowNum__,
                        no:no,
                        name:name,
                        sex:sex,
                        class_name:classes,
                        errorInfo:errorInfo
                    })
                }else{
                    this.editTable.push(errorRow)
                    // this.originTable.push(errorRow)
                    this.originTable.unshift({
                        roder:rows.__rowNum__,
                        no:no,
                        name:name,
                        sex:sex,
                        class_name:classes
                    })
                }
                // console.log(this.errorTable)
                // console.log(this.editOnline)
                // console.log(this.editTable)
                // console.log(this.originTable)
                this.percent = this.percent + ((i+1)/this.sheetConcent.length)*0.9
            }
            if(this.errorTable.length>0){
                return false
            }else{
                return true
            }
        }
    }
  }
</script>
 
<style lang="less" scoped>
.pos1{
    width:50%;
    float:left
}

.pos2{
    width:40%;
    float:left
}

.pos3{
    width:10%;
    float:left
}

.demo-table-expand {
    font-size: 0;
}

.demo-table-expand label {
    width: 90px;
    color: #99a9bf;
}

.demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
}

/deep/.el-dialog__body{
    padding:10px 20px 20px
}

.error-left{
    margin-left: 10px;
    float: left;
}

.error-right{
    margin-right: 10px;
    float: right;
}
</style>
<style lang="less" src="../css/table.less" scoped></style>