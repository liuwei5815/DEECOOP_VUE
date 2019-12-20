<template>
  <el-dialog ref="myDialog" v-el-drag-dialog :title="initData.title?initData.title:'二维码'" :visible.sync="isVisible" :append-to-body="inDialog" :close-on-click-modal="onModal" :close-on-press-escape="onEscape" :fullscreen="fullscreen" @open="dialogOpen" @close="dialogClose" width="400px">
    <div v-loading="dialogLoading" style="padding-top: 10px">
      <div id="printContent" >
        <el-form  :rules="rules" ref="submitForm" :model="temp" label-position="right" label-width="120px" style='width: 400px;margin: 10px auto;'>
          <el-row>
            <el-col :span="24" style="text-align:center;padding-bottom: 20px;transition: height 0.4s;-webkit-transition: height 0.4s;-moz-transition: height 0.4s;">
              <img v-if="imageUrl" :src="imageUrl" class="avatar" style="margin: 0 auto" @load="dialogImgLoad">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="24" >

              <b style="padding-left: 35%;">{{tempLable.code}}:</b>{{temp.code}}<br>
              <b style="padding-left: 35%;">{{tempLable.name}}:</b>{{temp.name}}

            </el-col>
          </el-row>

        </el-form>
      </div>

      <div slot="footer" class="dialog-footer" style="text-align: center;padding: 15px 0 15px 0">
        <el-button type="primary" @click="download">下载</el-button>
        <el-button type="primary" @click="print">打印</el-button>
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
        },
        tempShow: {
        },
        rules:{
        },
        imageUrl: '',

      }
    },
    created() {
      console.log(this.initData)
      if(this.initData.temp){
        this.temp = this.initData.temp
        if(this.initData.temp.qrcode){
          this.imageUrl = process.env.BASE_API + this.initData.temp.qrcode
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

      download() {
        const that = this
        let url = that.imageUrl
        let link = document.createElement('a')
        link.style.display = 'none'
        link.href = url
        link.setAttribute('download', that.temp.name)
        document.body.appendChild(link)
        link.click()
      },

      // print() {
      //   let printContent = document.getElementById('printContent');
      //   let newContent =printContent.innerHTML;
      //   let oldContent = document.body.innerHTML;
      //   let html = '<!DOCTYPE html> <html> <head> <meta charset="utf-8"> <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1"> '
      //   html += '<style></style>'
      //   html += '</head><body >'
      //   html += newContent
      //   html += '</body></html>'
      //   // document.body.innerHTML = 'ssssss';
      //   document.body.innerHTML = html;
      //   window.print();
      //   window.location.reload();
      //   document.body.innerHTML = oldContent;
      //   return false;
      // },

      print() {
        let printContent = document.getElementById('printContent');
        let newContent =printContent.innerHTML;
        // console.log(printContent)
        let html = '<!DOCTYPE html> <html> <head> <meta charset="utf-8"> <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1"> '
        html += '<style></style>'
        html += '</head><body >'
        html += newContent
        html += '</body></html>'
        let win= window.open('', '打印', '');
        win.document.write(html);
        win.document.close();  // IE >= 10 不能少
        win.focus();           // IE >= 10
        win.print();
        win.close();
      },

      dialogImgLoad(){
        this.$refs['myDialog'] && this.$refs['myDialog'].reDialogStyle && this.$refs['myDialog'].reDialogStyle(this.$store.getters.systemInfo,true)
      }

    }

  }
</script>

<style>
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 100px;
    height: 120px;
    line-height: 120px;
    text-align: center;
  }
</style>

<style scoped>


</style>
