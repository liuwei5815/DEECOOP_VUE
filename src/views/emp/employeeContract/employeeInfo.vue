<template>
  <el-dialog
    v-el-drag-dialog :title="initData.title?initData.title:''"
    :visible.sync="isVisible"
    :append-to-body="inDialog"
    :close-on-click-modal="onModal"
    :close-on-press-escape="onEscape"
    :fullscreen="fullscreen" @open="dialogOpen" @close="dialogClose" width="600px">
    <component v-if="showDialog" :is="dialogName" :initData="dialogData" :visible="inLinVisible" @close-dialog="closeDialog"/>

    <div v-loading="dialogLoading" style='margin: 10px auto;width: 100%;'>
        <el-form :rules="rules" ref="submitForm" :model="temp" label-position="right" label-width="120px"
                 style='width: 570px;padding-top: 10px;'>
        <el-row>
          <el-col :span="12">
            <!--员工照片-->
            <div style="padding-left: 120px">
              <el-upload
                name="fileName"
                class="avatar-uploader"
                :action="temp.uploadUrl"
                :data="fileData"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload">
                <img v-if="imageUrl" :src="imageUrl" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </div>
          </el-col>
          <el-col :span="12">
            <!--员工编号-->
            <el-form-item label="员工编号:" prop="code">
              <el-input v-model="temp.code" :readonly="true"></el-input>
            </el-form-item>
            <!--员工姓名-->
            <el-form-item label="姓名:" prop="name">
              <el-input v-model="temp.name" :readonly="true"></el-input>
            </el-form-item>
            <!--性别-->
            <el-form-item label="性别:" prop="sexName">
              <el-select v-model="temp.sex" :disabled="true">
                <el-option :label="'男'" value="1"></el-option>
                <el-option :label="'女'" value="0"></el-option>
              </el-select>
            </el-form-item>

          </el-col>
        </el-row>

          <el-row>
            <!--部门-->
            <el-col :span="12">
              <el-form-item label="部门:" prop="deptName">
                <el-input v-model="temp.deptName" :readonly="true"></el-input>
              </el-form-item>
            </el-col>
            <!--岗位-->
            <el-col :span="12">
              <el-form-item label="岗位:" prop="postName">
                <el-input v-model="temp.postName" :readonly="true"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <!--手机号 mobile-->
            <el-col :span="12">
              <el-form-item label="手机号:" prop="mobile">
                <el-input v-model="temp.mobile" :readonly="true"></el-input>
              </el-form-item>
            </el-col>
            <!--邮箱 email-->
            <el-col :span="12">
              <el-form-item label="邮箱:" prop="email">
                <el-input v-model="temp.email" :readonly="true"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <!--出生日期 birthday-->
            <el-col :span="12">
              <el-form-item label="出生日期:" prop="birthday">
                <el-date-picker style='width: 165px' v-model="temp.birthday" type="date" placeholder="选择日期" value-format="yyyy-MM-dd" :readonly="true"/>
              </el-form-item>
            </el-col>
            <!--入职日期 entryDate-->
            <el-col :span="12">
              <el-form-item label="入职日期:" prop="entryDate">
                <el-date-picker style='width: 165px' v-model="temp.entryDate" type="date" placeholder="选择日期" value-format="yyyy-MM-dd" :readonly="true"/>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <!--籍贯 nativePlace-->
            <el-col :span="12">
              <el-form-item label="籍贯:" prop="nativePlace">
                <el-input v-model="temp.nativePlace" :readonly="true"></el-input>
              </el-form-item>
            </el-col>
            <!--政治面貌 politicalName-->
            <el-col :span="12">
              <el-form-item label="政治面貌:" prop="politicalName">
                <base-input-select style='width: 165px' v-model="politicalData.defaultSelected" :data="politicalData.data" :disabled="true"/>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <!--身份证号 identityNumber-->
            <el-col :span="12">
              <el-form-item label="身份证号:" prop="identityNumber">
                <el-input v-model="temp.identityNumber" :readonly="true"></el-input>
              </el-form-item>
            </el-col>
            <!--婚姻状况 maritalName-->
            <el-col :span="12">
              <el-form-item label="婚姻状况:" prop="maritalName">
                <el-select v-model="temp.marital" :disabled="true">
                  <el-option :label="'未婚'" value="0"></el-option>
                  <el-option :label="'已婚'" value="1"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row >
            <el-col :span="24">
              <el-form-item label="备注:" prop="remark">
                <el-input type="textarea" :rows="2" v-model="temp.remark" :readonly="true"></el-input>
              </el-form-item>
            </el-col>
          </el-row>


      </el-form>

      <div slot="footer" class="dialog-footer" style="text-align: center;padding-bottom: 10px">
        <el-button @click="isVisible = false">关闭</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
  //import {updateEmployeeByContractDate} from '@/api/employee'

  export default {
    //子组件
    components: {},

    name: "dialog-add",
    props: ['initData','visible'],

    data(){
      return {
        //表单必填项
        rules: {
        },

        //弹窗功能
        openDialogName: '',
        showDialog: false,
        inLinVisible: false,
        dialogData: {
          title: ''
        },
        dialogLoading: true,
        isVisible: false,
        inDialog: true,

        //formData: {employeeId:'', code:'', name:'', contractDate:'', newContractDate:'', remark:''},
        temp: {},

        //上传员工图片-文件上传参数
        fileData: {photoDir: "employee/"},
        //员工照片上传后地址
        imageUrl: '',

        //政治面貌
        politicalData: {
          data: {
            selectUrl: '/system/dictionary/getDictionarys',
            selectParm: {dictionaryKey:'political',isglobal:'0'},
          },
          defaultSelected: ['ebb2eae0e5c3479aa1b19a9251917077'],
        },
      }
    },
    created() {
      //let rowData = this.initData.rowData;
      this.temp = this.initData.rowData;

      // this.formData.employeeId = rowData.employeeId;
      // this.formData.code = rowData.code;
      // this.formData.name = rowData.name;
      // this.formData.contractDate = rowData.contractDate;
      // this.formData.newContractDate = rowData.contractDate;
      // this.formData.remark = rowData.remark;
    },

    mounted() {
      this.dialogLoading = false
      this.isVisible = this.visible
    },

    computed: {
      dialogWidth() {
        if(this.initData.width){
          const widthType = typeof this.initData.width
          if(widthType === 'number'){
            return this.initData.width+'px'
          }else if(widthType === 'string'){
            const num = parseInt(this.initData.width)
            if(num){
              return num>100?'100%':(num+'%')
            }else {
              return '300px'
            }
          }else {
            return '300px'
          }
        }else {
          return '300px'
        }
      },
      fullscreen(){
        return this.initData.fullscreen?true:false
      },
      onModal() {
        return this.initData['close-on-click-modal']?true:false
      },
      onEscape() {
        return this.initData['close-on-press-escape']?true:false
      },
      dialogName() {
        return this.openDialogName
      }
    },

    methods: {
      dataBridge(data) {

      },

      dialogOpen() {
        this.$nextTick(() => {
          this.$refs['submitForm'].clearValidate()
        })
      },

      dialogClose(data){
        this.$emit('close-dialog',data?data:{})
      },

      deleteBtns(row, index){
        this.tableData.splice(index, 1);
      },

      //关闭对话框回调
      closeDialog(data) {},

      // save() {
      //   this.$refs['submitForm'].validate((valid) => {
      //     if (valid) {
      //       updateEmployeeByContractDate({
      //         employeeId: this.formData.employeeId,
      //         remark: this.formData.remark,
      //         contractDateStr: this.formData.contractDate,
      //         newContractDateStr: this.formData.newContractDate
      //       }).then(res => {
      //         this.dialogLoading = false
      //         if (res.code === 0) {
      //           this.$notify({
      //             title: '成功',
      //             message: '创建成功',
      //             type: 'success',
      //             duration: 2000
      //           })
      //           this.isVisible = false
      //           this.dialogClose({resState:'ok'})
      //         }
      //       }).catch(err => {
      //         //this.dialogLoading = false
      //       })
      //     }
      //   })
      // },

      //文件上传方法:
      handleAvatarSuccess(res) {
        //jsonStr: {"code":0,"msg":"图片上传成功！","photo":"employee/photo/20180831/153569657221523e.jpg"}
        console.log(res)
        const that = this;
        if (res.code == 0) {
          let photoUrl = res.photo;
          if (photoUrl != null && photoUrl.trim().length > 0) {
            that.temp.photo = photoUrl;
            that.imageUrl = process.env.BASE_API + photoUrl;
            console.log(that.imageUrl)
          }
          this.$message({
            message: '图片上传成功！',
            type: 'success',
            duration: 5 * 1000
          });
        } else if (res.code != 0 && res.msg != null && res.msg.trim().length > 0) {
          this.$message.error(res.msg.trim());
        }
      },

      beforeAvatarUpload(file) {
        let fileType = file.type;
        fileType = fileType.replace("image/", "");

        if ("jpg,jpeg,png".indexOf(fileType) == -1) {
          this.$message({
            message: '上传员工照片只能是(jpg,jpeg,png)格式文件!',
            type: 'error',
            duration: 5 * 1000
          });
          return;
        }

        //最大上传文件大小(M)
        const maxFileSize = 5 * 1024 * 1024;
        if (file.size > maxFileSize) {
          this.$message({
            message: '上传员工照片大小不能超过 5MB!',
            type: 'error',
            duration: 5 * 1000
          });
          return;
        }
      },

    },

    //观察者,可监听数据，属性和方法
    watch: {}
  }
</script>

<!--员工照片-上传控件样式-->
<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 100px;
    height: 120px;
    line-height: 120px;
    text-align: center;
  }
  .avatar {
    width: 100px;
    height: 120px;
    display: block;
  }
</style>
