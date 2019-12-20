<template>
  <el-dialog v-el-drag-dialog :title="initData.title?initData.title:'新增'" :visible.sync="isVisible" :append-to-body="inDialog" :close-on-click-modal="onModal" :close-on-press-escape="onEscape" :fullscreen="fullscreen" @open="dialogOpen" @close="dialogClose" width="500px">
    <!--弹窗控件开始-->
    <component v-if="showDialog" :is="dialogName" :initData="dialogData" :visible="visibleState" @close-dialog="closeDialog"></component>
    <!--弹窗控件结束-->
    <div v-loading="dialogLoading">



      <el-form  :rules="rules" ref="submitForm" :model="temp" label-position="right" label-width="120px" style='width: 400px;padding-top: 10px;'>

        <el-form-item :label="tempLable.name+ ':'" prop="name">
          <el-input v-model="temp.name"></el-input>
        </el-form-item>
        <el-form-item :label="tempLable.prodName+ ':'" prop="prodName">
          <el-input v-model="temp.prodName" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item :label="tempLable.isdefault+ ':'" prop="isdefault">
          <el-switch active-value="1" inactive-value="0" v-model="temp.isdefault" ></el-switch>
        </el-form-item>
        <el-form-item :label="tempLable.remark+ ':'" prop="remark">
          <el-input v-model="temp.remark"></el-input>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align: center;padding-bottom: 10px">
        <el-button type="primary" @click="save">下一步</el-button>
        <el-button @click="isVisible = false">取消</el-button>
      </div>
    </div>
  </el-dialog>


</template>

<script>

  import {
    addBom, //新增功能
  } from '@/api/bom'
  import dialogView from './dialogView'


  export default {
    name: "dialog-add",
    props: ['initData','visible'],
    components: {
      dialogView
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
          deptName: true
        },
        tempShow: {
          deptName: true
        },
        rules: {
          name: [{
            required: true,
            message: '请填写BOM名称',
            trigger: 'change'
          }],
          prodName: [{
            required: true,
            trigger: 'change',
            message: '请选择货品',
            trigger: 'change'
          }],
        },

        //弹窗功能
        openDialogName: '',
        showDialog: false,
        visibleState: false,
        dialogData: {
          //width: '600px',
          title: '',
          temp:null,
          tempLable:null,
        },

      }
    },
    created() {
      if(this.initData.temp){
        this.temp = this.initData.temp
        this.temp.name = null
        this.temp.remark = null
      }
      this.temp['isdefault'] = '1'
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

      //弹窗功能
      closeDialog(data) {
        this.showDialog = false
        if(data.resState === 'ok'){
          this.isVisible = false
          this.dialogClose({resState:'ok'})
        }
      },

      dialogOpen(){
        this.$nextTick(() => {
          this.$refs['submitForm'].clearValidate()
        })
      },
      dialogClose(data){
        this.$emit('close-dialog',data?data:{})
      },

      save() {
        const that = this
        this.$refs['submitForm'].validate((valid) => {
          if (valid) {
            that.dialogLoading = true
            //*******************************************************用户自定义修改 start ***************************************************************************
            addBom(that.temp)
            //*******************************************************用户自定义修改 end ***************************************************************************
              .then(res => {
                that.dialogLoading = false
                if (res.code === 0) {
                  this.dialogData.temp = this.initData.temp
                  this.dialogData.temp['id'] =  res.id
                  this.dialogData.title = '编辑'
                  this.openDialogName = 'dialogView'
                  this.showDialog = true
                  this.visibleState = true


                  // that.$notify({
                  //   title: '成功',
                  //   message: '创建成功',
                  //   type: 'success',
                  //   duration: 2000
                  // })
                  // that.isVisible = false
                  // that.dialogClose({resState:'ok'})
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


<style scoped>


</style>
