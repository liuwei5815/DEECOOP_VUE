<template>
  <el-dialog v-el-drag-dialog :title="initData.title?initData.title:'新增'" :visible.sync="isVisible" :append-to-body="inDialog" :close-on-click-modal="onModal" :close-on-press-escape="onEscape" :fullscreen="fullscreen" @open="dialogOpen" @close="dialogClose" :width="dialogWidth">
    <component v-if="showDialog" :is="dialogName" :initData="dialogData" :visible="inLinVisible" @close-dialog="closeDialog"></component>
    <div v-loading="dialogLoading">
      <el-form  :rules="rules" ref="submitForm" :model="temp" label-position="left" label-width="80px"
                style='width: 80%;padding-top: 10px;'>
        <!--属性-->
        <el-form-item :label="tempLable.genreName+ ':'" prop="genreName">
          <el-input v-model="temp.genreName" :disabled="true"/>
        </el-form-item>
        <!--名称-->
        <el-form-item :label="tempLable.name+ ':'" prop="name">
          <el-input v-model="temp.name"/>
        </el-form-item>
        <!--类型(客户,供应商)-->
        <el-form-item :label="tempLable.typeName+ ':'" prop="typeName">
          <base-input-select style='width: 240px' v-model="typeData.defaultSelected" :data="typeData.data" @callback="typeSelect" />
        </el-form-item>
        <!--省直辖市-->
        <el-form-item :label="tempLable.provinceName+ ':'" prop="provinceName">
          <base-input-select style='width: 240px' v-model="provinceData.defaultSelected" :data="provinceData.data" @callback="provinceSelect" />
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
  import {addCustomer} from '@/api/customer'

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
          name: [{
            required: true,
            message: '请填写名称',
            trigger: 'change'
          }],
          // typeName: [{
          //   required: true,
          //   trigger: 'change',
          //   validator: (rule, value, callback) => {
          //     if ( this.typeData.defaultSelected.length <= 0) {
          //       callback(new Error('请选择类型'));
          //     } else {
          //       callback();
          //     }
          //   }
          // }]
        },

        // //上传图片-接口地址
        // actionUrl: "",
        // //上传图片地址
        // imageUrl: "",
        // //上传图片-文件上传参数
        // fileData: {photoDir: "product/"},

        //类型(客户,供应商)
        typeData: {},

        //客户类型
        customerTypeData: {
          data: {
            selectUrl: '/system/dictionary/getDictionarys',
            selectParm: {dictionaryKey:'customerType',isglobal:'0', isNeetOneLayer:'true'},
          },
          defaultSelected: [],
        },

        //供应商类型
        supplierTypeData: {
          data: {
            selectUrl: '/system/dictionary/getDictionarys',
            selectParm: {dictionaryKey:'supplierType',isglobal:'0', isNeetOneLayer:'true'},
          },
          defaultSelected: [],
        },

        //省直辖市
        provinceData: {
          data: {
            selectUrl: '/system/dictionary/treeDictionarys',
            selectParm: {dictionaryKey:'area',cascade: "true"},
          },
          defaultSelected: [],
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
      //类型(客户,供应商)-下拉列表值改变事件
      typeSelect(data){
        //this.temp.type = data[0]
        if(data[0]){
          this.temp['type'] = data[0]
          this.typeData.defaultSelected = [data[0]]
        }else {
          this.temp['type'] = []
          this.typeData.defaultSelected = []
        }
      },

      //省直辖市-下拉列表值改变事件
      provinceSelect(data){
        //this.temp.province = data[0]
        //console.log(option);
        //console.log(optionNames);
        if(data&&data.length>0){
          this.temp['province'] = data[data.length-1]
          this.provinceData.defaultSelected = data
        }else {
          this.temp['province'] = []
          this.provinceData.defaultSelected = []
        }
      },

      dialogOpen(){
        const genre = this.temp.genre;
        //console.log("genre: " + genre);

        //类型(客户,供应商)
        if ("df7cb67fca4148bc9632c908e4a7fdea" == genre) {
          //(字典id)df7cb67fca4148bc9632c908e4a7fdea  客户(字典名称)
          this.typeData = this.customerTypeData;
          this.temp.type = this.typeData.defaultSelected[0]

        } else if ("49c0a7ebcb4c4175bd5195837a6a9a13" == genre) {
          //(字典id)49c0a7ebcb4c4175bd5195837a6a9a13   供应商(字典名称)
          this.typeData = this.supplierTypeData;
          this.temp.type = this.typeData.defaultSelected[0]
        }

        //省直辖市-设置下拉列表默认值
        this.temp.province = this.provinceData.defaultSelected[0]

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
            addCustomer(that.temp)
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
                  that.dialogClose({resState:'ok',genre:this.temp.genre})
                }
              }).catch(err => {
              console.log(err)
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



<style scoped>

</style>
