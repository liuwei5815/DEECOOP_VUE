<template>
  <el-dialog v-el-drag-dialog :title="initData.title?initData.title:'新增'" :visible.sync="isVisible" :append-to-body="inDialog"
             :close-on-click-modal="onModal" :close-on-press-escape="onEscape" :fullscreen="fullscreen" @open="dialogOpen" @close="dialogClose" width="400px">
    <component v-if="showDialog" :is="dialogName" :initData="dialogData" :visible="inLinVisible" @close-dialog="closeDialog"/>
    <div v-loading="dialogLoading">
      <el-form  :rules="rules" ref="submitForm" :model="formData" label-position="right" label-width="120px"
                style='width: 570px;padding-top: 10px;'>
        <!--标题-->
        <el-row>
          <el-form-item label="标题:" prop="title">
            <el-input style='width: 200px' v-model="formData.title"/>
          </el-form-item>
        </el-row>
        <!--内容-->
        <el-row>
          <el-form-item label="内容:" prop="content">
            <el-input type="textarea" rows="2" style='width: 200px' v-model="formData.content"/>
          </el-form-item>
        </el-row>
        <!--备注-->
        <el-row>
          <el-form-item label="备注:">
            <el-input type="textarea" rows="2" style='width: 200px' v-model="formData.remark"/>
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
  import {addMessage} from '@/api/message'

  export default {
    components: {
    },
    name: "dialog-add",
    props: ['initData','visible'],

    data(){
      return {
        //表单必填项
        rules: {
          title: [{
            required: true,
            message: '请填写标题',
            trigger: 'change'
          }],
          content: [{
            required: true,
            message: '请填写内容',
            trigger: 'change'
          }]
        },

        dialogLoading: true,
        isVisible: false,
        inDialog: true,
        formData: {
        },

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

      save() {
        this.$refs['submitForm'].validate(isError=>{
          if (isError) {
            this.dialogLoading = true
            addMessage(this.formData).then(res => {
              this.dialogLoading = false
              if (res.code === 0) {
                this.$notify({
                  title: '成功',
                  message: '保存成功',
                  type: 'success',
                  duration: 2000
                })
                this.isVisible = false
                this.dialogClose({resState:'ok'})
              }
            }).catch(err => {
              this.dialogLoading = false
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
