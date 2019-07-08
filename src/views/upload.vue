<template>
<div>
    <el-card>
        <el-form>
            <el-form-item :inline="true">
                <div class="pos1">
                    <span>文件地址：</span>
                    <el-input v-model="uploadFileName" value="uploadFileName" placeholder="请单击选取文件按钮" style="width:60%"></el-input>
                    <el-button size="small" type="primary" style="margin-left:1%" @click="preview">预览</el-button>
                    <div>只能上传xls/xlsx文件，且不超过500kb</div>
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
        <el-dialog title="预览" :visible.sync="previewDialogVisible">

        </el-dialog>
    </el-card>
    <div id="errorTb" style="display:none;">
        <el-table
            :data="errorTable"
            style="width:100%"
            highlight-current-row
            max-height="475">
            <el-table-column type="index" label="序号" width="50"></el-table-column>
            <el-table-column prop="roder" label="行号" width="50"></el-table-column>
            <el-table-column prop="no" label="学号" width="100"></el-table-column>
            <el-table-column prop="name" label="姓名" width="100"></el-table-column>
            <el-table-column prop="sex" label="性别" width="100"></el-table-column>
            <el-table-column prop="class_name" label="班级" width="100"></el-table-column>
            <el-table-column prop="errorInfo" label="错误信息"></el-table-column>
        </el-table>
    </div>
</div>
</template>

<script>
import {uploadStu} from '../api/http'
import {getExcel,getSheets,shToJson} from '../common/excel'
export default {
    data() {
        return {
            uploadFileName:'', //文件名
            fileList:[],
            uploadFileMsg: {},
            sheets:[],
            sheetName:'',
            sheetId:0,
            sheetConcent:[],
            selDialogFormVisible:false,
            errorTable:[],
            cheDialogVisible:false,
            percent:0,
            progressStatus:"success",
            previewDialogVisible:false,
            importBtn:true  //导入按钮是否可用
        }
    },
    methods: {
        async handleConfirm(){
            this.sheetName = this.sheets[this.sheetId]
            console.log(this.sheetName)
            this.sheetConcent = await getExcel(this.uploadFileMsg.raw,shToJson,[this.sheetName])
            console.log(sheetConcent)
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
            }
        },
        formOff(){
            this.selDialogFormVisible=false
        },
        handleRemove(file, fileList) {
            console.log(file, fileList);
            this.uploadFileName = ''
            this.fileList = []
            this.uploadFileMsg = {}
            this.sheetName = ''
            this.sheetConcent = []
            this.sheets = []
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
            if((size/1024)>500){
                this.fileList = []
                this.$message.warning("上传的文件大小必须小于500kb")
                return
            }
            this.uploadFileName = file.name
            this.uploadFileMsg = file
            this.fileList.push(file)
            this.sheets = await getExcel(file.raw,getSheets,[])
            if (this.sheets.length > 1){
                this.selDialogFormVisible = true
            }else if(this.sheets.length ===0){
                this.$message.warning("上传的文件内容为空，请检查")
                return
            }else{
                this.sheetName = this.sheets[0]
                this.sheetConcent = await getExcel(file.raw,shToJson,[this.sheetName])
                console.log(this.sheetConcent)
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
                }
            }
        },
        // application/vnd.openxmlformats-officedocument.spreadsheetml.sheet    .xlsx
        // application/vnd.ms-excel        .xls
        upload(){ //导入
            if(!this.uploadFileMsg || this.fileList.length===0){
                this.$message.warning("当前没有可导入的文件，请先选择1个文件")
                return
            }
            let data = new FormData()
            data.append("file",this.uploadFileMsg.raw) //二进制数据传输
            data.append("sheetID",this.sheetId)
            let params = data   
            uploadStu(params).then(res=>{
                if(res.status === 200){
                    this.$message.success("文件上传成功")
                }else{
                    this.errorTable = res.wrongList
                    let errorDiv = document.getElementById("errorTb")
                    errorDiv.style.display = 'block'
                    this.$message.error(res.msg || "文件上传失败")
                }
            })
        },
        handlePreview(file) { //点击文件列表中的文件,让他预览吧
            console.log("__________")
            console.log(file);
        },
        preview(){ //预览
            console.log("preview")
        },
        download(){
            console.log("download")
            window.open("../static/upload/template/student.xlsx","_self"); //打包之后
            window.open("../../static/upload/template/student.xlsx","_self"); //dev 环境下
        },
        //对sheet返回的json做校验
        checkContent(){
            this.cheDialogVisible = true
            //先校验格式 10%
            let title = ['no','name','sex','classes']
            let row = this.sheetConcent[0]
            for (let i=0;i<title.length;i++){
                let col = title[i]
                let exists = false
                for(let k in row){
                    if(col === k.trim()){
                        exists = true
                        break
                    }
                }
                if(!exists){
                    this.progressStatus = "warning"
                    this.$message.warning("上传的文件请严格按照模板填写，模板表头不可修改")
                    this.cheDialogVisible = false
                    break
                    return
                }
                this.percent = this.percent + 2.5
            }
            //再校验内容 90%
            let noPatt = /^[1-9]{1,5}[0-9]{0,1}$/
            let namePatt = /^[a-zA-Z0-9_\u4e00-\u9fa5]{1,6}$/
            let sexPatt = /男|女/
            for(let i=0;i<this.sheetConcent.length;i++){
                let errorInfo = []
                let rows = this.sheetConcent[i]
                let no = rows.no
                let name = (rows.name).toString().trim()
                let sex = rows.sex.trim()
                let classes = rows.classes.trim()
                let errorRow = {
                    roder:rows.__rowNum__,
                    no:no,
                    name:name,
                    sex:sex,
                    class_name:classes
                }

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
                }
                this.percent = this.percent + ((i+1)/this.sheetConcent.length)*0.9
            }
            console.log(this.errorTable)
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
</style>