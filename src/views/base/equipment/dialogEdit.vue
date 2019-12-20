<template>
  <el-dialog
    v-el-drag-dialog
    :title="initData.title?initData.title:'修改'"
    :visible.sync="isVisible"
    :append-to-body="inDialog"
    :close-on-click-modal="onModal"
    :close-on-press-escape="onEscape"
    :fullscreen="fullscreen"
    @open="dialogOpen"
    @close="dialogClose"
    width="700px" top="10vh" style="height: 90vh" custom-class="listDeliverClass">
    <div v-loading="dialogLoading" style="height: 100%;overflow: auto">
      <el-form  :rules="rules" ref="submitForm" :model="temp" label-position="right" label-width="120px" style='width: 400px;padding-top: 10px;'>
        <el-row>
          <el-col :span="24" style="text-align:center;padding-bottom: 20px">
            <!--员工照片-->
            <el-upload
              name="fileName"
              class="avatar-uploader"
              :action="uploadUrl"
              :data="fileData"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload">
              <img v-if="imageUrl" :src="imageUrl" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item :label="tempLable.deptName+ ':'" prop="code" v-show="tempShow.deptName">
              <el-input v-model="temp.deptName"  :disabled="tempNotEditable.deptName"></el-input>
            </el-form-item>
            <el-form-item :label="tempLable.code+ ':'" prop="code">
              <el-input v-model="temp.code" :disabled="tempNotEditable.code"></el-input>
            </el-form-item>
            <el-form-item :label="tempLable.name+ ':'" prop="name">
              <el-input v-model="temp.name"></el-input>
            </el-form-item>
            <el-form-item :label="tempLable.spec+ ':'" prop="spec">
              <el-input v-model="temp.spec"></el-input>
            </el-form-item>
            <el-form-item :label="tempLable.typeName+ ':'" prop="typeName">
              <base-input-select style='width: 280px' :placeholder="tempLable.typeName" v-model="selectDataType.defaultSelected" :data="selectDataType.data"  @callback="typeSelect" ></base-input-select>
            </el-form-item>
            <el-form-item :label="tempLable.supplier+ ':'" prop="supplier">
              <el-input v-model="temp.supplier"></el-input>
            </el-form-item>
            <el-form-item :label="tempLable.buyDate+ ':'" prop="buyDate">
              <el-date-picker style='width: 280px' v-model="temp.buyDate" type="date" placeholder="选择日期" value-format="yyyy-MM-dd" ></el-date-picker>
            </el-form-item>
            <el-form-item :label="tempLable.remark+ ':'" prop="remark">
              <el-input v-model="temp.remark"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align: center;padding-bottom: 10px">
        <el-button type="primary" @click="save">保存</el-button>
        <el-button @click="isVisible = false">关闭</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>

  import {
    updateEquipment, //新增功能
  } from '@/api/equipment'

  export default {
    name: "dialog-add",
    props: ['initData','visible'],
    components: {
    },
    data(){
      return {
        dialogLoading: true,
        isVisible: false,
        inDialog: true,
        temp: {
        },
        tempLable: {
        },
        tempNotEditable: {
          deptName: true,
          code: true,
        },
        tempShow: {
          deptName: true
        },
        rules: {
          name: [{
            required: true,
            message: '请填写设备名称',
            trigger: 'change'
          }],
          typeName: [{
            required: true,
            trigger: 'change',
            validator: (rule, value, callback) => {
              if ( this.selectDataType.defaultSelected.length <= 0) {
                callback(new Error('请选择设备类型'));
              } else {
                callback();
              }
            }
          }],
        },

        selectDataType: {
          data: {//传入的基本配置和数据
            selectUrl: '/system/dictionary/getDictionarys',
            selectParm: {dictionaryKey:'equipmentType'},//全局
          },
          defaultSelected: [],
        },

        fileData: {photoDir: "equipment/"},
        uploadUrl: process.env.BASE_API + '/fileIO/file/uploadPhoto',
        imageUrl: '',

      }
    },
    created() {
      if(this.initData.temp){
        this.temp = this.initData.temp
        if(this.initData.temp.photo){
          this.imageUrl = process.env.BASE_API + this.initData.temp.photo
        }
        if(this.initData.temp.type){
          this.selectDataType.defaultSelected = [this.initData.temp.type]
        }
      }
      if(this.initData.tempLable){
        this.tempLable = this.initData.tempLable
      }
    },
    mounted() {
      this.dialogLoading = false
      this.isVisible = this.visible
    },
    computed: {
      dialogWidth(){
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
      dialogOpen(){
        this.$nextTick(() => {
          this.$refs['submitForm'].clearValidate()
        })
      },
      dialogClose(data){
        this.$emit('close-dialog',data?data:{})
      },

      typeSelect(data,option){
        // console.log("******"+data)
        const that = this
        if(data[0]){
          that.temp['type'] = data[0]
          that.selectDataType.defaultSelected = [data[0]]
        }else {
          that.temp['type'] = []
          that.selectDataType.defaultSelected = []
        }

      },

      //文件上传方法:
      handleAvatarSuccess(res) {
        //jsonStr: {"code":0,"msg":"图片上传成功！","photo":"employee/photo/20180831/153569657221523e.jpg"}
        const that = this;
        if (res.code == 0) {
          let photoUrl = res.photo;
          if (photoUrl != null && photoUrl.trim().length > 0) {
            that.temp.photo = photoUrl;
            that.imageUrl = process.env.BASE_API + photoUrl;
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

      save() {
        const that = this
        this.$refs['submitForm'].validate((valid) => {
          if (valid) {
            that.dialogLoading = true
            //*******************************************************用户自定义修改 start ***************************************************************************
            updateEquipment(that.temp)
            //*******************************************************用户自定义修改 end ***************************************************************************
              .then(res => {
                that.dialogLoading = false
                if (res.code === 0) {
                  that.$notify({
                    title: '成功',
                    message: '修改成功',
                    type: 'success',
                    duration: 2000
                  })
                  that.isVisible = false
                  that.dialogClose({resState:'ok'})
                }
              }).catch(err => {
              console.log(err)
              that.dialogLoading = false
            })
          }
        })
      },

    }

  }
</script>

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

<style scoped>


</style>
