<template>
  <el-dialog v-el-drag-dialog :title="initData.title?initData.title:'新增'" :visible.sync="isVisible" :append-to-body="inDialog" :close-on-click-modal="onModal" :close-on-press-escape="onEscape" :fullscreen="fullscreen" @open="dialogOpen" @close="dialogClose" width="500px">
    <div v-loading="dialogLoading">
      <el-form  :rules="rules" ref="submitForm" :model="temp" label-position="right" label-width="120px" style='width: 400px;padding-top: 10px'>

        <el-form-item :label="'上级名称:'" >
          <el-input v-model="selectTree.name" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item :label="'选择货品:'" prop="name">
          <base-input-option v-model="temp.name" :dialog="optionData.dialog" @callback="optionSelect"></base-input-option>
        </el-form-item>
        <el-form-item :label="tempLable.spec+ ':'" prop="spec">
          <el-input v-model="temp.spec" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item :label="tempLable.genreName+ ':'" prop="genreName">
          <el-input v-model="temp.genreName" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item :label="tempLable.typeName+ ':'" prop="typeName">
          <el-input v-model="temp.typeName" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item :label="tempLable.unitName+ ':'" prop="unitName">
          <el-input v-model="temp.unitName" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item :label="'单件用量:'" prop="ratio">
          <el-input v-model="temp.ratio"></el-input>
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

  import {
    addBomTree, //新增功能
  } from '@/api/bomTree'

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
        selectTree: {
        },
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
            trigger: 'change',
            message: '请选择货品',
          }],
          ratio: [{
            required: true,
            trigger: 'change',
            validator: (rule, value, callback) => {
              var reg = /^[0-9]+(.[0-9]{1,2})?$/;
              if (!value) {
                callback(new Error('请填写用料比例'));
              }else if(!reg.test(value)) {
                callback(new Error('请填写正确的用料比例，只能填写数字！'));
              } else {
                callback();
              }
            }
          }],
        },

        //表单弹窗组件
        optionData:{
          showDialog: false,
          visible: false,
          dialog: {
            data: {//传入的基本配置和数据
              isSingle :true,//table是否单选
              title: '选择货品',
              treeUrl: '/system/dictionary/treeDictionarys',
              treeParm: {dictionaryKey: "productGenre"},
              tableUrl: '/base/product/listPageProducts',
              tableParm: {fieldCode:"code,name,spec,genreName,unitName,remark",pathId: this.initData.selectTree.pathId},
              temp: {},
            },
            dialogName:'dialogTreeOption',//打开的弹窗组件名称，注意大小写
          }
        },


      }
    },
    created() {
      if(this.initData.temp){
        this.temp = this.initData.temp
        this.temp.isdefault = '1'
      }
      if(this.initData.tempLable){
        this.tempLable = this.initData.tempLable
      }
      if(this.initData.selectTree){
        this.selectTree = this.initData.selectTree
        this.temp['parentProdId'] = this.initData.selectTree.id
        this.temp['pathId'] = this.initData.selectTree.pathId
        this.temp['bomId'] = this.initData.selectTree.bomId
        this.temp['bomTreeId'] = this.initData.selectTree.bomTreeId
        this.temp['layer'] = this.initData.selectTree.layer
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

      optionSelect(data) {
        const that = this
        that.temp = JSON.parse(JSON.stringify(that.temp))
        if(data[0]){
          that.temp.prodId = data[0].id
          that.temp.name  = data[0].name
          that.temp.genreName  = data[0].genreName
          that.temp.unitName  = data[0].unitName
          that.temp.typeName  = data[0].typeName
          that.temp.spec  = data[0].spec
        }
      },



      save() {
        const that = this
        this.$refs['submitForm'].validate((valid) => {
          if (valid) {
            that.dialogLoading = true
            //*******************************************************用户自定义修改 start ***************************************************************************
            addBomTree(that.temp)
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

    }

  }
</script>


<style scoped>


</style>
