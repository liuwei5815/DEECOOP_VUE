<template>
  <el-dialog v-el-drag-dialog :title="initData.title?initData.title:'新增'" :visible.sync="isVisible" :append-to-body="inDialog" :close-on-click-modal="onModal" :close-on-press-escape="onEscape" :fullscreen="fullscreen" @open="dialogOpen" @close="dialogClose" :width="dialogWidth">
    <component v-if="showDialog" :is="dialogName" :initData="dialogData" :visible="inLinVisible" @close-dialog="closeDialog"></component>
    <div v-loading="dialogLoading">
      <el-form  :rules="rules" ref="submitForm" :model="temp" label-position="right" label-width="120px"
                style='width: 90%;margin: 10px auto;'>

        <el-form-item :label="tempLable.code+ ':'" prop="code">
          <el-input v-model="temp.code"></el-input>
        </el-form-item>
        <el-form-item :label="tempLable.name+ ':'" prop="name">
          <el-input v-model="temp.name"></el-input>
        </el-form-item>

      </el-form>
      <el-button type="primary" @click="openInline">内层弹框</el-button>
      <div slot="footer" class="dialog-footer" style="text-align: center;padding-bottom: 10px">
        <el-button type="primary" @click="save">保存</el-button>
        <el-button @click="isVisible = false">关闭</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
  import dialogSearchDemo from './dialogSearchDemo'
  import {
    addTemplate, //新增功能
  } from '@/api/template'

    export default {
      name: "dialog-add",
      props: ['initData','visible'],
      components: {
        dialogSearchDemo,
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
          },
          rules: {
          },

          //弹窗功能
          openDialogName: '',
          showDialog: false,
          inLinVisible: false,
          dialogData: {
            width: 900,
            height: 500,
            fullscreen: false,
            title: '',
            data:null,
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
          const that = this
          this.$refs['submitForm'].validate((valid) => {
            if (valid) {
              that.dialogLoading = true
              //*******************************************************用户自定义修改 start ***************************************************************************
              addTemplate(that.temp)
              //*******************************************************用户自定义修改 end ***************************************************************************
                .then(res => {
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
                console.log(err)
                that.dialogLoading = false
              })
            }
          })
        },

        //二级弹框
        openInline(){
          this.openDialogName = 'dialogSearchDemo'
          this.showDialog = true
          this.inLinVisible = true
        },
        //弹窗功能
        closeDialog(data) {
          console.log(data)
          this.showDialog = false

        },
      }

    }
</script>

<style scoped>

</style>
