<template>
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
    <el-dialog title="选择sheet" :visible.sync="selDialogFormVisible">
        <el-form style="margin:0 120px 0 120px">
            <el-form-item label="系统检测到所选excel有多个sheet，请选择需要导入的sheet：">
                <el-select v-model="sheetName" placeholder="请选择sheet名称" >
                    <el-option v-for="val in sheets" :key=val :label="val" :value="val">
                    </el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="formOff">取 消</el-button>
            <el-button type="primary" @click="handleConfirm">确 定</el-button>
        </div>
    </el-dialog>
</el-form>
</el-card>
</template>

<script>
import {uploadStu} from '../api/http'
import {getExcel,getSheets} from '../common/excel'
export default {
    data() {
        return {
            uploadFileName:'',
            fileList:[],
            uploadFileMsg: {},
            sheets:['a','b','c'],
            sheetName:'',
            selDialogFormVisible:false,
            importBtn:true  //导入按钮是否可用
        }
    },
    methods: {
        handleConfirm(){

        },
        formOff(){
            this.selDialogFormVisible=false
        },
        handleRemove(file, fileList) {
            console.log(file, fileList);
            this.uploadFileName = ''
            this.fileList = []
            this.uploadFileMsg = {}
        },
        handleExceed(files, fileList) { //选择文件后
            this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
        },
        beforeRemove(file, fileList) {
            return this.$confirm(`确定移除 ${ file.name }？`);
        },
        async handleChange(file,fileList){
            let type = file.raw.type
            let size = file.raw.size
            if(type !='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' && type !='application/vnd.ms-excel'){
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
            this.sheets = await getExcel(file.raw,getSheets)
            if (this.sheets.length > 1){
                this.selDialogFormVisible = true
            }
            console.log("_____________")
            console.log(this.sheets)
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
            let params = data   
            uploadStu(params).then(res=>{
                if(res.status === 200){
                    this.$message.success("文件上传成功")
                }else{
                    this.$message.error(res.msg || "文件上传失败")
                }
            })
        },
        handlePreview(file) { //点击文件列表中的文件,让他预览吧
            console.log("__________")
            console.log(file);
        },
        preview(){
            console.log("preview")
        },
        download(){
            console.log("download")
            window.open("../static/upload/template/student.xlsx","_self"); //打包之后
            window.open("../../static/upload/template/student.xlsx","_self"); //dev 环境下
        }
        //对sheet返回的json做校验
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