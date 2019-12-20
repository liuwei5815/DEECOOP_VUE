<template>
  <el-dialog
    v-el-drag-dialog
    :title="initData.title?initData.title:'编辑'"
    :visible.sync="isVisible"
    :append-to-body="inDialog"
    :close-on-click-modal="onModal"
    :close-on-press-escape="onEscape"
    :fullscreen="fullscreen"
    @open="dialogOpen"
    @close="dialogClose"
    width="620px"
    top="10vh"
    style="height: 90vh"
    custom-class="listDeliverClass">
    <div v-loading="dialogLoading" style="height: 100%;overflow: auto">
      <el-form  :rules="rules" ref="submitForm" :model="temp" label-position="right" label-width="120px"
                style='width: 570px;padding-top: 10px;'>

        <el-row>
          <el-col :span="12" style="padding-left: 150px">
            <!--员工照片-->
            <el-upload
              name="fileName"
              class="avatar-uploader"
              :action="actionUrl"
              :data="fileData"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload">
              <img v-if="imageUrl" :src="imageUrl" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-col>

          <el-col :span="12">
            <!--货品编码-->
            <el-form-item label="货品编码:" prop="code">
              <el-input v-model="temp.sysCode" :disabled="true"/>
            </el-form-item>
            <!--货品名称-->
            <el-form-item label="货品名称:" prop="name">
              <el-input v-model="temp.name"/>
            </el-form-item>

          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <!--企业货品编码-->
            <el-form-item label="企业货品编码:" prop="sourceCode">
              <el-input v-model="temp.sourceCode" />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <!--图号-->
            <el-form-item label="图号:" prop="pictureCode">
              <el-input v-model.number="temp.pictureCode"/>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <!--规格型号-->
            <el-form-item label="规格型号:" prop="spec">
              <el-input v-model="temp.spec"/>
            </el-form-item>
          </el-col>

          <!--货品类型-->
          <el-col :span="12">
            <el-form-item label="货品类型:" prop="typeName">
              <base-input-select v-model="productTypeData.defaultSelected" :data="productTypeData.data" @callback="productTypeSelect" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <!--库存数量-->
          <el-col :span="12">
            <el-form-item label="库存数量:" prop="stockCount">
              <el-input v-model="temp.stockCount" :disabled="true"/>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="保质期(天):" prop="validityDays">
              <el-input v-model.number="temp.validityDays"/>
            </el-form-item>
          </el-col>

        </el-row>


        <el-row>
          <el-col :span="24">
            <el-form-item label="备注:" prop="remark">
              <el-input type="textarea" rows="2" style='width: 450px' v-model="temp.remark"/>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <div style="height: 200px">
            <dyna-form ref="dynaForm" @sent-list="formListResult" :formTemp="formTemp" :props="{key:'name', value:'value'}"/>
          </div>
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
  import {updateProduct} from '@/api/product'
  import DynaForm from '@/components/dynaForm'

  export default {
    components: {
      DynaForm
    },
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
            message: '请填写货品名称',
            trigger: 'change'
          }],
          spec: [{
            required: true,
            message: '请填写规格型号',
            trigger: 'change'
          }],
          unitName: [{
            required: true,
            trigger: 'change',
            validator: (rule, value, callback) => {
              if ( this.unitData.defaultSelected.length <= 0) {
                callback(new Error('请选择计量单位'));
              } else {
                callback();
              }
            }
          }],
          validityDays: [
            { type: 'number',
              trigger: 'change',
              validator: (rule, value, callback) => {
                if ( value < 0) {
                  callback(new Error('保质期必须大于零'));
                } else {
                  callback();
                }
              }
            }],
        },

        //上传图片-接口地址
        actionUrl: "",
        //上传图片地址
        imageUrl: "",
        //上传图片-文件上传参数
        fileData: {photoDir: "product/"},

        //计量单位 unit
        unitData: {
          data: {
            selectUrl: '/system/dictionary/getDictionarys',
            selectParm: {dictionaryKey:'productUnit',isglobal:'0'},
          },
          defaultSelected: [],
        },

        //结算单位 lastUnit
        lastUnitData: {
          data: {
            selectUrl: '/system/dictionary/getDictionarys',
            selectParm: {dictionaryKey:'productUnit',isglobal:'0'},
          },
          defaultSelected: [],
        },

        //货品类型 productType
        productTypeData: {
          data: {
            selectUrl: '/system/dictionary/getDictionarys',
            selectParm: {dictionaryKey:'productType',isglobal:'0'},
          },
          defaultSelected: [],
        },

        formTemp:[],
      }
    },
    created() {
      if(this.initData.temp){
        this.temp = this.initData.temp
        if(!this.temp.validityDays){
          this.temp.validityDays = 0
        }

      }
      if(this.initData.tempLable){
        this.tempLable = this.initData.tempLable
      }

      if(this.temp.photo){
        this.imageUrl = process.env.BASE_API + this.temp.photo;
      }else{
        this.imageUrl = ''
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
      //计量单位-下拉列表值改变事件
      unitSelect(data){
        this.temp.unit = data[0]
      },

      //结算单位-下拉列表值改变事件
      lastUnitSelect(data){
        this.temp.lastUnit = data[0]
      },

      //货品类型-下拉列表值改变事件
      productTypeSelect(data){
        this.temp.type = data[0]
      },

      checkPrice(value) {
        //大于零的正整数+1位或2位小数-正则表达式
        let reg = new RegExp("^[0-9]+\\.{0,1}[0-9]{0,2}$");
        if(!reg.test(value)){
          //console.log("value: " + value + " 输入错误");
          this.$message({
            message: "单价:" + value + " 输入错误，请输入大于零的正整数或(1,2)位小数！",
            type: 'warning',
            duration: 5 * 1000
          });
          return;
        }
      },

      dialogOpen(){
        this.actionUrl = process.env.BASE_API + '/fileIO/file/uploadPhoto';

        //计量单位
        this.unitData.defaultSelected=[]
        this.unitData.defaultSelected.push(this.temp.unit)

        //结算单位
        this.lastUnitData.defaultSelected=[]
        this.lastUnitData.defaultSelected.push(this.temp.lastUnit)

        //货品类型
        this.productTypeData.defaultSelected=[]
        this.productTypeData.defaultSelected.push(this.temp.type)

        let jsonStr = this.temp.prodPropertyJsonStr;
        //console.log("jsonStr: " + jsonStr);
        if (jsonStr != null && jsonStr.trim().length > 0) {
          this.formTemp = JSON.parse(jsonStr)
        }

        this.$nextTick(() => {
          this.$refs['submitForm'].clearValidate()
        })
      },
      dialogClose(data){
        this.$emit('close-dialog',data?data:{})
      },

      //控件中获取(产品物料自定义属性)
      formListResult(list) {
        var jsonStr = "";
        if (list != null && list.length > 0) {
          jsonStr = JSON.stringify(list);
        }
        //console.log("jsonStr: " + jsonStr);
        this.temp.prodProperty = jsonStr;
      },

      //编辑保存
      save() {
        const that = this
        //获取产品物料自定义属性
        this.$refs.dynaForm.getFormList()

        that.$refs['submitForm'].validate((valid) => {
          if (valid) {
            that.dialogLoading = true
            updateProduct(that.temp)
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
              console.log(err)
              that.dialogLoading = false

            })

          }
        })
      },

      //文件上传方法:
      handleAvatarSuccess(res) {
        //jsonStr: {"code":0,"msg":"图片上传成功！","photo":"employee/photo/20180831/153569657221523e.jpg"}
        const that = this;
        if (res.code == 0) {
          let photoUrl = res.photo;
          if (photoUrl != null && photoUrl.trim().length > 0) {
            that.temp.photo = photoUrl;
            that.imageUrl = process.env.BASE_API + photoUrl;
          }
          this.$message({
            message: '图片上传成功！',
            type: 'success',
            duration: 5 * 1000
          });
        } else if (res.code != 0 && res.msg != null && res.msg.trim().length > 0) {
          this.$message.error(res.msg.trim());
        }
      },

      beforeAvatarUpload(file) {
        let fileType = file.type;
        fileType = fileType.replace("image/", "");

        if ("jpg,jpeg,png".indexOf(fileType) == -1) {
          this.$message({
            message: '上传员工照片只能是(jpg,jpeg,png)格式文件!',
            type: 'error',
            duration: 5 * 1000
          });
          return;
        }

        //最大上传文件大小(M)
        const maxFileSize = 5 * 1024 * 1024;
        if (file.size > maxFileSize) {
          this.$message({
            message: '上传员工照片大小不能超过 5MB!',
            type: 'error',
            duration: 5 * 1000
          });
          return;
        }
      }

    }

  }
</script>

<!--图片上传控件样式-->
<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 100px;
    height: 120px;
    line-height: 120px;
    text-align: center;
  }
  .avatar {
    width: 100px;
    height: 120px;
    display: block;
  }
</style>

<style scoped>

</style>
