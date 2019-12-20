<template>
  <el-dialog
    v-el-drag-dialog :title="initData.title?initData.title:''"
    :visible.sync="isVisible"
    :append-to-body="inDialog"
    :close-on-click-modal="onModal"
    :close-on-press-escape="onEscape"
    :fullscreen="fullscreen" @open="dialogOpen" @close="dialogClose" width="350px">
    <component v-if="showDialog" :is="dialogName" :initData="dialogData" :visible="inLinVisible" @close-dialog="closeDialog"/>

    <div v-loading="dialogLoading" style='margin: 10px auto;width: 100%;'>
      <el-form :rules="rules" ref="submitForm" :model="formData" label-position="right" label-width="120px">
        <el-row>
          <el-form-item label="员工编号:" prop="code" >
            <el-input style='width: 200px' v-model="formData.code" :readonly="true"></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="员工姓名:" prop="name" >
            <el-input style='width: 200px' v-model="formData.name" :readonly="true"></el-input>
          </el-form-item>
        </el-row>

        <el-row>
          <el-form-item label="合同到期日期:" prop="newContractDate">
            <el-date-picker style='width: 200px' v-model="formData.newContractDate" type="date" placeholder="选择日期" value-format="yyyy-MM-dd" />
          </el-form-item>
        </el-row>

        <el-row>
          <el-form-item label="备注:">
            <el-input style='width: 200px' type="textarea" rows="2" v-model="formData.remark"/>
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
  import {updateEmployeeByContractDate} from '@/api/employee'

  export default {
    //子组件
    components: {},

    name: "dialog-add",
    props: ['initData','visible'],

    data(){
      return {
        //表单必填项
        rules: {
          newContractDate: [{
            required: true,
            trigger: 'change',
            message: '请选择日期'
          }],
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

        formData: {employeeId:'', code:'', name:'', contractDate:'', newContractDate:'', remark:''},
      }
    },
    created() {
      let rowData = this.initData.rowData;

      this.formData.employeeId = rowData.employeeId;
      this.formData.code = rowData.code;
      this.formData.name = rowData.name;
      this.formData.contractDate = rowData.contractDate;
      this.formData.newContractDate = rowData.contractDate;
      this.formData.remark = rowData.remark;
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

      save() {
        this.$refs['submitForm'].validate((valid) => {
          if (valid) {
            updateEmployeeByContractDate({
              employeeId: this.formData.employeeId,
              remark: this.formData.remark,
              contractDateStr: this.formData.contractDate,
              newContractDateStr: this.formData.newContractDate
            }).then(res => {
              this.dialogLoading = false
              if (res.code === 0) {
                this.$notify({
                  title: '成功',
                  message: '创建成功',
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

    },

    //观察者,可监听数据，属性和方法
    watch: {}
  }
</script>
