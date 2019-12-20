<template>
  <el-dialog v-el-drag-dialog :title="initData.title?initData.title:'新增'" :visible.sync="isVisible" :append-to-body="inDialog"
             :close-on-click-modal="onModal" :close-on-press-escape="onEscape" :fullscreen="fullscreen" @open="dialogOpen" @close="dialogClose" width="400px">
    <component v-if="showDialog" :is="dialogName" :initData="dialogData" :visible="inLinVisible" @close-dialog="closeDialog"/>
    <div v-loading="dialogLoading" style="padding-top: 10px">
      <el-form  :rules="rules" ref="submitForm" :model="formData" label-position="right" label-width="120px"
                style='width: 570px;'>
        <!--code 企业编码-->
        <el-row>
          <el-form-item label="企业编码:">
            <el-input style='width: 200px' v-model="formData.code" :readonly="true"/>
          </el-form-item>
        </el-row>
        <!--企业名称-->
        <el-row>
          <el-form-item label="企业名称:">
            <el-input style='width: 200px' v-model="formData.name"/>
          </el-form-item>
        </el-row>
        <!--企业简称-->
        <el-row>
          <el-form-item label="企业简称:">
            <el-input style='width: 200px' v-model="formData.companyShortname"/>
          </el-form-item>
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
  import {updateCompanyByCompanyUser} from '@/api/company'

  export default {
    components: {
    },
    name: "dialog-add",
    props: ['initData','visible'],

    data(){
      return {
        initialPeriodDate: null,
        paymentPeriodDate: null,

        //表单必填项
        rules: {
          initialPeriodDate: [{
            required: true,
            message: '请填写初始付款期间',
            trigger: 'change'
          }]
        },

        dialogLoading: true,
        isVisible: false,
        inDialog: true,
        formData: {
        },
        // tempLable: {
        // },
        // tempNotEditable: {
        // },

        //弹窗功能
        openDialogName: '',
        showDialog: false,
        inLinVisible: false,
        formTemp:[],
      }
    },
    created() {
      if(this.initData.rowData){
        this.formData = this.initData.rowData
        this.initialPeriodDate = new Date(this.initData.rowData.initialPeriodDate);

        if (this.initData.rowData.paymentPeriodDate != null) {
          this.paymentPeriodDate = new Date(this.initData.rowData.paymentPeriodDate);
        }
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

      // changeInitialPeriodDate(value) {
      //   if (value != null) {
      //     this.initialPeriodDate = new Date(value);
      //     this.formData.initialPeriodDate = value;
      //   }
      // },

      // changePaymentPeriodDate(value) {
      //   this.paymentPeriodDate = new Date(value);
      //   this.formData.paymentPeriodDate = value;
      // },

      // isErrorByPeriodDate() {
      //   //初始付款期间 initialPeriodDate
      //   let initialPeriodDate = this.initialPeriodDate.getTime();
      //   //console.log("initialPeriodDate:" + initialPeriodDate);
      //
      //   //当前付款期间 paymentPeriodDate
      //   if (this.paymentPeriodDate != null) {
      //     let paymentPeriodDate = this.paymentPeriodDate.getTime();
      //     //console.log("paymentPeriodDate:" + paymentPeriodDate);
      //
      //     if ((paymentPeriodDate - initialPeriodDate) < 0) {
      //       this.$message({
      //         message: "当前付款期间不可小于初始付款期间！",
      //         type: 'warning',
      //         duration: 5 * 1000
      //       });
      //       return true;
      //     }
      //   }
      //
      //   return false
      // },

      save() {
        this.$refs['submitForm'].validate(isError=>{
          if (isError) {
            updateCompanyByCompanyUser(this.formData).then(res => {
              this.dialogLoading = false
              if (res.code === 0) {
                this.$notify({
                  title: '成功',
                  message: '操作成功',
                  type: 'success',
                  duration: 2000
                })
                this.isVisible = false
                this.dialogClose({resState:'ok'})
              }
            }).catch(err => {
              //this.dialogLoading = false
            })
          }
        })
      },

      //弹窗功能
      closeDialog(data) {
        //console.log(data)
        //this.showDialog = false

      },
    }

  }
</script>
