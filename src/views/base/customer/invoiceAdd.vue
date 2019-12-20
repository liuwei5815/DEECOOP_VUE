<template>
  <el-dialog v-el-drag-dialog :title="initData.title?initData.title:'新增'" :visible.sync="isVisible" :append-to-body="inDialog" :close-on-click-modal="onModal" :close-on-press-escape="onEscape" :fullscreen="fullscreen" @open="dialogOpen" @close="dialogClose" :width="dialogWidth">
    <component v-if="showDialog" :is="dialogName" :initData="dialogData" :visible="inLinVisible" @close-dialog="closeDialog"></component>
    <div v-loading="dialogLoading">
      <el-form  :rules="rules" ref="submitForm" :model="temp" label-position="right" label-width="120px"
                style='width: 90%;padding-top: 10px;'>
        <!--公司名称-->
        <el-form-item label="名称:" prop="companyName">
          <el-input v-model="temp.companyName"/>
        </el-form-item>

        <!--发票税号-->
        <el-form-item label="税号:" prop="invoiceNumber">
          <el-input v-model="temp.invoiceNumber"/>
        </el-form-item>

        <!--地址-->
        <el-form-item label="地址:" prop="address">
          <el-input v-model="temp.address"/>
        </el-form-item>

        <!--电话-->
        <el-form-item label="电话:" prop="mobile">
          <el-input v-model="temp.mobile" />
        </el-form-item>

        <!--开户银行-->
        <el-form-item label="开户银行:" prop="bankName">
          <el-input v-model="temp.bankName"/>
        </el-form-item>

        <!--账号-->
        <el-form-item label="账号:" prop="bankCode">
          <el-input v-model="temp.bankCode" @change="checkBankCode"/>
        </el-form-item>

        <!--备注-->
        <el-form-item label="备注:" prop="remark">
          <el-input type="textarea" rows="2" v-model="temp.remark"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align: center;padding-bottom: 10px">
        <el-button type="primary" @click="save">保存</el-button>
        <el-button @click="isVisible = false">关闭</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
  import {addCustomerInvoice} from '@/api/customerInvoice'

  export default {
    name: "dialog-add",
    props: ['initData','visible'],

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
        },
        //表单必填项
        rules: {
          // companyName: [{
          //   required: true,
          //   message: '请填写公司名称',
          //   trigger: 'change'
          // }],
          // invoiceNumber: [{
          //   required: true,
          //   message: '请填写发票税号',
          //   trigger: 'change'
          // }],
          // address: [{
          //   required: true,
          //   message: '请填写地址',
          //   trigger: 'change'
          // }],
          // bankName: [{
          //   required: true,
          //   message: '请填写开户行名称',
          //   trigger: 'change'
          // }],
          // bankCode: [{
          //   required: true,
          //   message: '请填写银行账号',
          //   trigger: 'change'
          // }],
          // mobile: [{
          //   required: true,
          //   message: '请填写手机号',
          //   trigger: 'change'
          // }],
        },

        //弹窗功能
        openDialogName: '',
        showDialog: false,
        inLinVisible: false,
        // dialogData: {
        //   width: 900,
        //   height: 500,
        //   fullscreen: false,
        //   title: '',
        //   data:null,
        // },
      }
    },
    created() {
      if(this.initData.temp){
        this.temp = this.initData.temp
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

      //银行账号数值型 数据有效性
      isBankCodeNumberByValue(value) {
        if (value == null || value.trim().length == 0) {
          return false;
        }

        //全数字数字-正则表达式
        let reg = new RegExp("^[1-9][0-9]*$");
        return reg.test(value.trim())
      },
      checkBankCodeValue(value, column) {
        let msgStr = '';

        if (value != null && value.trim().length > 0 && !this.isBankCodeNumberByValue(value.trim())) {
          msgStr = column + '(' + value + ')输入错误，请输入正确的账号！';
        }
        // else if (this.isBankCodeNumberByValue(value.trim()) && value != null && value.trim().length < 16) {
        //   msgStr = column + '(' + value + ')输入错误，请输入至少16位正确的银行账号！';
        // }

        //console.log("value: " + value);
        //console.log("!isBankCodeNumberByValue: " + !this.isBankCodeNumberByValue(value.trim()));
        return msgStr;
      },
      checkBankCode(value) {
        let msgStr = this.checkBankCodeValue(value, '账号');
        if (msgStr != null && msgStr.trim().length > 0) {
          this.$message({
            type: 'warning',
            duration: 5 * 1000,
            showClose: true,
            message: msgStr,
          });
          return;
        }
      },


      // //手机号数值型 数据有效性
      // isMobileNumberByValue(value) {
      //   if (value == null || value.trim().length == 0) {
      //     return false;
      //   }
      //
      //   //1开头(11)位数字-正则表达式
      //   let reg = new RegExp("^1[\\d]{10}");
      //   return reg.test(value.trim())
      // },

      // checkMobileValue(value, column) {
      //   let msgStr = '';
      //
      //   if (value != null && value.trim().length > 0 && value.trim().length != 11) {
      //     msgStr = column + '(' + value + ')输入错误，请输入11位正确的电话号！';
      //   } else if (value != null && value.trim().length == 11 && !this.isMobileNumberByValue(value.trim())) {
      //     msgStr = column + '(' + value + ')输入错误，请输入11位正确的电话号！';
      //   }
      //
      //   return msgStr;
      // },

      // checkMobile(value) {
      //   let msgStr = this.checkMobileValue(value, '电话');
      //   if (msgStr != null && msgStr.trim().length > 0) {
      //     this.$message({
      //       type: 'warning',
      //       duration: 5 * 1000,
      //       showClose: true,
      //       message: msgStr,
      //     });
      //     return;
      //   }
      // },

      save() {
        const that = this
        this.$refs['submitForm'].validate((valid) => {
          if (valid) {
            let msgStr = "";

            // let mobile = this.temp.mobile;
            // let msgStr_1 = this.checkMobileValue(mobile, '电话');
            // if (msgStr_1 != null && msgStr_1.trim().length > 0) {msgStr = msgStr + msgStr_1;}

            let bankCode = this.temp.bankCode;
            let msgStr_2 = this.checkBankCodeValue(bankCode, '账号');
            if (msgStr_2 != null && msgStr_2.trim().length > 0) {msgStr = msgStr + ' ' + msgStr_2;}

            if (msgStr != null && msgStr.trim().length > 0) {
              this.$message({
                type: 'warning',
                duration: 5 * 1000,
                showClose: true,
                message: msgStr,
              });
              return;
            }
            //console.log("提交保存");

            that.dialogLoading = true
            addCustomerInvoice(that.temp).then(res => {
              that.dialogLoading = false
              if (res.code === 0) {
                that.$notify({
                  title: '成功',
                  message: '创建成功',
                  type: 'success',
                  duration: 2000
                })
                that.isVisible = false
                that.dialogClose({resState:'ok'})
              }
            }).catch(err => {
              //console.log(err)
              that.dialogLoading = false
            })
          }
        })
      },

      //弹窗功能
      closeDialog(data) {
        //console.log(data)
        this.showDialog = false

      },
    }

  }
</script>

