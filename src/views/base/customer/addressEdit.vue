<template>
  <el-dialog v-el-drag-dialog :title="initData.title?initData.title:'编辑'" :visible.sync="isVisible" :append-to-body="inDialog" :close-on-click-modal="onModal" :close-on-press-escape="onEscape" :fullscreen="fullscreen" @open="dialogOpen" @close="dialogClose" :width="dialogWidth">
    <div v-loading="dialogLoading">
      <el-form  :rules="rules" ref="submitForm" :model="temp" label-position="right" label-width="120px"
                style='width: 90%;padding-top: 10px;'>
        <!--联系姓名-->
        <el-form-item :label="tempLable.name+ ':'" prop="name">
          <el-input v-model="temp.name"/>
        </el-form-item>

        <!--手机号-->
        <el-form-item :label="tempLable.mobile+ ':'" prop="mobile">
          <el-input v-model="temp.mobile"/>
        </el-form-item>

        <!--电话号-->
        <el-form-item :label="tempLable.phone+ ':'" prop="phone">
          <el-input v-model="temp.phone" @change="checkMobile"/>
        </el-form-item>

        <!--邮箱地址-->
        <el-form-item :label="tempLable.email+ ':'" prop="email">
          <el-input v-model="temp.email"/>
        </el-form-item>

        <!--详细地址-->
        <el-form-item :label="tempLable.address+ ':'" prop="address">
          <el-input v-model="temp.address"/>
        </el-form-item>

        <!--备注-->
        <el-form-item :label="tempLable.remark+ ':'" prop="remark">
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
  import {updateCustomerAddress} from '@/api/customeAddress'
  export default {
    name: "dialog-edit",
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
          name: [{
            required: true,
            message: '请填写联系姓名',
            trigger: 'change'
          }],
          mobile: [{
            required: true,
            message: '请填写手机号',
            trigger: 'change'
          }],
          address: [{
            required: true,
            message: '请填写详细地址',
            trigger: 'change'
          }],
        },

      }
    },
    created() {
      if(this.initData.temp){
        this.temp = this.initData.temp
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

      //手机号数值型 数据有效性
      isMobileNumberByValue(value) {
        if (value == null || value.trim().length == 0) {
          return false;
        }

        //1开头(11)位数字-正则表达式
        let reg = new RegExp("^1[\\d]{10}");
        return reg.test(value.trim())
      },

      checkMobileValue(value, column) {
        let msgStr = '';

        if (value != null && value.trim().length > 0 && value.trim().length != 11) {
          msgStr = column + '(' + value + ')输入错误，请输入11位正确的手机号！';
        } else if (value != null && value.trim().length == 11 && !this.isMobileNumberByValue(value.trim())) {
          msgStr = column + '(' + value + ')输入错误，请输入11位正确的手机号！';
        }

        return msgStr;
      },

      checkMobile(value) {
        let msgStr = this.checkMobileValue(value, '手机号');
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

      //编辑保存
      save() {
        const that = this
        //var jsonStr = JSON.stringify(that.temp);
        //console.log("addressEdit save() jsonStr: " + jsonStr);

        that.$refs['submitForm'].validate((valid) => {
          if (valid) {
            let mobile = this.temp.mobile;
            let msgStr = this.checkMobileValue(mobile, '手机号');
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
            updateCustomerAddress(that.temp)
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
                //console.log(err)
                that.dialogLoading = false
              })
          }
        })
      }

    }

  }
</script>

<style scoped>

</style>
