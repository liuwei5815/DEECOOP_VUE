<template>
  <el-dialog v-el-drag-dialog :title="title" :visible.sync="isVisible" width="500px" top="40px" @close="dialogClose" append-to-body >
    <div style="text-align: left;padding-left: 50px;padding-top: 20px;line-height: 20px"  v-loading="dialogTopLoading">
      <span style="font-size: 16px;padding-bottom: 5px">操作步骤：</span><br/>
      1.<a :href="exportUrl" style="color: #169BD5">点击此处下载模板</a><br/>
      2.按示例填写需要导入的数据信息<br/>
      3.请将Excel模板中示例信息删除<br/>
      4.上传过程中不要多次提交或刷新页面<br/>
      5.Excel导入文件只能支持(xls,xlsx)格式，且文件大小不能超过10M<br/><br/>
      <el-upload
        name="excelFile"
        class="upload-demo"
        ref="upload"
        :action="importUrl"
        :on-change="importExcelChangeFile"
        :before-upload="importExcelBeforeUpload"
        :on-success="importExcelSuccess"
        :on-error="importExcelError"
        :data="excelData"
        :file-list="excelFileList"
        :auto-upload="false">
        <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
        <el-button style="" size="small" type="success" @click="importExcelSubmit">导入</el-button>
      </el-upload>
      <br/><br/>
    </div>
  </el-dialog>
</template>

<script>


  export default {

    name: "dialog-import-excel",
    props: ['initData','visible'],

    //数据
    data() {
      return {
        /*初始化数据*/
        dialogTopLoading: false,
        isVisible: false,
        title: '文件导入',
        importUrl:'',
        exportUrl:'',
        userInfo: null,
        excelFileList: [],
        excelData: {},
      }
    },

    //子组件
    components: {
      // baseTable
    },

    /*生命周期函数开始*/
    //vue实例化之前
    beforeCreate() {

    },

    //vue实例化后调用
    created() {
      const that = this

      if(that.initData.title){
        that.title = that.initData.title
      }
      that.importUrl = process.env.BASE_API + that.initData.importUrl
      that.exportUrl = process.env.BASE_API + that.initData.exportUrl

      // console.log(that.$storage.get('userInfo'));
      if(that.initData.excelData){
        that.excelData = that.initData.excelData
      }
      if(that.$storage.get('userInfo')){
        that.excelData['companyId'] = that.$storage.get('userInfo').companyId
        that.excelData['userId'] = that.$storage.get('userInfo').userId
      }

    },

    //挂载之前
    beforeMount() {

    },
    //真实DOM挂载后，仅限组件本身的挂载，如果存在子组件，并且需求子组件全部被挂载后进行操作，需使用vm.$nextTick顶替mounted（在mounted内部调用vm.$nextTick）；
    mounted() {
      this.isVisible = this.visible
    },

    //数据更新前调用
    beforeUpdate() {

    },

    //数据更新后调用（避免使用，最好使用计算属性或watch函数）,仅限组件本身的更新，如果存在子组件，并且需求子组件全部被更新后进行操作，需使用vm.$nextTick顶替updated（在updated内部调用vm.$nextTick）；
    updated() {

    },
    /*生命周期函数结束*/


    //方法
    methods: {


      dialogClose() {
        this.$emit('close-dialog',this.initData)
      },



      importExcelChangeFile(file, fileList) {
        this.excelFileList = [fileList[fileList.length-1]];
      },

      importExcelBeforeUpload(file) {
        if (this.excelFileList != null && this.excelFileList.length > 1) {
          this.$message({
            showClose: true,
            message: '只能选择一个导入文件，请删除多余的导入列表！',
            type: 'warning',
            duration: 5 * 1000
          });
        }



        //Excel导入文件格式验证
        let fileName = file.name;
        let fileSuffix = "";
        if (fileName.indexOf(".") != -1) {
          fileSuffix = fileName.substr(fileName.indexOf(".") + 1, fileName.length);
        }
        //console.log("fileSuffix: " + fileSuffix);

        if ("xls,xlsx".indexOf(fileSuffix) == -1) {
          this.$message({
            showClose: true,
            message: 'Excel导入文件只能支持(xls,xlsx)格式!',
            type: 'error',
            duration: 5 * 1000
          });
          return;
        }

        //Excel导入文件大小验证-(单位M)
        const maxFileSize = 10 * 1024 * 1024;
        if (file.size > maxFileSize) {
          this.$message({
            showClose: true,
            message: 'Excel导入文件大小不能超过 5MB!',
            type: 'error',
            duration: 5 * 1000
          });
          return;
        }
      },

      importExcelError(res){
        console.log("!!!!!!!!!!",res)
      },

      importExcelSuccess(res) {

        this.dialogTopLoading = false
        // console.log("#######1111",this.excelFileList)
        let message = "";
        if (res.msg != null  && res.msg.trim().length > 0) {
          message = res.msg.trim();
        }
        if (res.code == 0) {
          this.isVisible = false
          this.$message({
            showClose: true,
            message: message,
            type: 'success',
            duration: 5 * 1000
          });
          this.refreshTable();
        } else if (res.code != 0) {
          // console.log("#######")
          this.$message({
            showClose: true,
            message: message,
            type: 'error',
            duration: 0
          });
        }
        this.$refs['upload'].clearFiles();

      },

      importExcelSubmit() {
        // console.log("#######")
        if (this.excelFileList) {
          if(this.excelFileList[0]){
            // console.log("#######2222",this.excelFileList)
            this.dialogTopLoading = true
            this.$refs.upload.submit();
          }else {
            this.$message({
              showClose: true,
              message: '请选择导入文件！',
              type: 'warning',
              duration: 5 * 1000
            });
            return;
          }
        }else {
          this.$message({
            showClose: true,
            message: '请选择导入文件！',
            type: 'warning',
            duration: 5 * 1000
          });
          return;
        }

      },
    },

    //计算属性
    computed: {

    },

    //观察者,可监听数据，属性和方法
    watch: {

    }
  }


</script>

<style>

</style>
