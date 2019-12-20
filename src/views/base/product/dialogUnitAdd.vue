<template>
  <el-dialog v-el-drag-dialog :title="initData.title?initData.title:'编辑'" :visible.sync="isVisible" :append-to-body="inDialog" :close-on-click-modal="onModal" :close-on-press-escape="onEscape" :fullscreen="fullscreen" @open="dialogOpen" @close="dialogClose" width="620px">
    <div v-loading="dialogLoading">
      <el-form  :rules="rules" ref="submitForm" :model="temp" label-position="right" label-width="120px"
                style='width: 570px;padding-top: 10px'>

        <el-row>
          <el-col :span="12" >
            <!--货品编码-->
            <el-form-item :label="'货品编码:'" prop="code">
              <el-input v-model="temp.code" :disabled="true"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <!--货品名称-->
            <el-form-item :label="'货品名称:'" prop="name">
              <el-input v-model="temp.name" :disabled="true"/>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <!--计量单位 unitName-->
          <el-col :span="12">
            <el-form-item :label="'计量单位:'">
              <el-input v-model="temp.unitName" :disabled="true"/>
            </el-form-item>
          </el-col>
          <!--计价单位(punit,punitName)  -->
          <el-col :span="12">
            <el-form-item :label="'计价单位:'" prop="punitName">
              <base-input-select v-model="unitData.defaultSelected" :data="unitData.data" @callback="unitSelect" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row >
          <el-col :span="16">
            <el-form-item :label="'计量单位转换计价单位(公式):'" prop="pnFormula" >
              <el-input type="textarea" rows="3" v-model="temp.pnFormula" :disabled="true"/>
              <el-button type="text" icon="el-icon-plus" @click="openFormulaEdit('p')">公式编辑器</el-button>
            </el-form-item>
          </el-col>
          <el-col :span="8" style="padding-top: 3px;">

            <el-radio-group v-model="Poption" style="width: 100%;" class="resetFormulaRadioStyle">
              <el-radio style="display: block;width: 100%;margin-left: 0;padding-left: 5px;" :label="1">需要四舍五入</el-radio>
              <el-radio style="display: block;width: 100%;margin-left: 0;height: 28px;line-height: 30px;padding-left: 5px;" :label="2">无需四舍五入</el-radio>
            </el-radio-group>
            <div class="resetFormulaRadioInputStyle" style="display: block;width: 100%;margin-left: 0;padding-left: 5px;">
              保留小数<el-input-number size="mini" v-model="Pprecision" :max="4" :min="0" ></el-input-number>位
            </div>

          </el-col>
        </el-row>

        <el-row >
          <el-col :span="16">
            <el-form-item :label="'计价单位转换计量单位(公式):'" prop="npFormula" >
              <el-input type="textarea" rows="3" v-model="temp.npFormula" :disabled="true"/>
              <el-button type="text" icon="el-icon-plus" @click="openFormulaEdit('n')">公式编辑器</el-button>
            </el-form-item>
          </el-col>
          <el-col :span="8" style="padding-top: 3px;">

            <el-radio-group v-model="Noption" style="width: 100%;" class="resetFormulaRadioStyle">
              <el-radio style="display: block;width: 100%;margin-left: 0;padding-left: 5px;" :label="1">需要四舍五入</el-radio>
              <el-radio style="display: block;width: 100%;margin-left: 0;height: 28px;line-height: 30px;padding-left: 5px;" :label="2">无需四舍五入</el-radio>
            </el-radio-group>
            <div class="resetFormulaRadioInputStyle" style="display: block;width: 100%;margin-left: 0;padding-left: 5px;">
              保留小数<el-input-number size="mini" v-model="Nprecision" :max="4" :min="0" ></el-input-number>位
            </div>

          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item :label="'备注:'" prop="remark">
              <el-input type="textarea" rows="2" style='width: 450px' v-model="temp.remark"/>
            </el-form-item>
          </el-col>
        </el-row>

      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align: center;padding-bottom: 10px">
        <el-button type="primary" @click="save">保存</el-button>
        <el-button @click="isVisible = false">关闭</el-button>
      </div>
    </div>

    <component v-if="showDialog" :is="dialogName" :state="formulaState" :visible="visibleState" @close-dialog="closeDialog"></component>

  </el-dialog>
</template>

<script>
  import {saveProductUnit} from '@/api/productUnit'
  import formulaDialog from '@/components/formulaEdit/dialog'

  export default {
    components: {
      formulaDialog
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
          pnFormula: [{
            required: true,
            trigger: 'change',
            validator: (rule, value, callback) => {
              if ( !this.temp.pnFormula) {
                callback(new Error('请填写计量单位转计价单位公式！'));
              } else {
                callback();
              }
            }
          }],

          npFormula: [{
            required: true,
            trigger: 'change',
            validator: (rule, value, callback) => {
              if ( !this.temp.npFormula) {
                callback(new Error('请填写计价单位转计量单位公式！'));
              } else {
                callback();
              }
            }

          }],

          punitName: [{
            required: true,
            trigger: 'change',
            validator: (rule, value, callback) => {
              if ( this.unitData.defaultSelected.length <= 0) {
                callback(new Error('请选择计价单位'));
              } else {
                callback();
              }
            }
          }],
        },


        //计量单位 unit
        unitData: {
          data: {
            selectUrl: '/system/dictionary/getDictionarys',
            selectParm: {dictionaryKey:'productUnit',isglobal:'0'},
          },
          defaultSelected: [],
        },

        formTemp:[],


        //公式编辑器弹窗
        showDialog: false,
        visibleState: false,
        dialogName: '',
        formulaState: '',

        Poption: '',
        Noption: '',
        Pprecision: 0,
        Nprecision: 0,
      }
    },
    created() {
      if(this.initData.temp){
        this.temp = this.initData.temp
        this.temp.remark = ''
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

      n2pIsScale(){
        return this.Poption === 1
      },
      p2nIsScale(){
        return this.Noption === 1
      },
      n2pDecimalCount(){
        //return this.n2pIsScale?this.Pprecision:0
        return this.Pprecision;
      },
      p2nDecimalCount(){
        //return this.p2nIsScale?this.Nprecision:0
        return this.Nprecision;
      },
    },

    methods: {
      // inputNumberChange(val){
      //   if(!val){
      //     this.Poption = 2
      //   }else {
      //     this.Poption = 1
      //   }
      // },
      //
      // NinputNumberChange(val){
      //   if(!val){
      //     this.Noption = 2
      //   }else {
      //     this.Noption = 1
      //   }
      // },

      closeDialog(data){
        this.visibleState = false
        this.showDialog = false
        if(data){
          if(this.formulaState === 'n'){
            this.temp.npFormula = data
          }else {
            this.temp.pnFormula = data
          }
        }
      },

      openFormulaEdit(state){
        this.dialogName = 'formulaDialog'
        this.showDialog = true
        this.formulaState = state
        this.visibleState = true
      },

      dialogOpen(){
        this.unitData.defaultSelected = [this.initData.temp.unit]
        this.temp['punit'] = this.initData.temp.unit
      },
    //计量单位-下拉列表值改变事件
      unitSelect(data){
        const that = this
        if(data[0]){
          that.temp['punit'] = data[0]
          that.unitData.defaultSelected = [data[0]]
        }else {
          that.temp['punit'] = []
          that.unitData.defaultSelected = []
        }
      },

      dialogClose(data){
        this.$emit('close-dialog',data?data:{})
      },

      //编辑保存
      save() {
        const that = this
        //获取产品物料自定义属性
        that.$refs['submitForm'].validate((valid) => {
          if (valid) {
            that.dialogLoading = true;

            let pnFormula = that.temp.npFormula;
            let npFormula = that.temp.pnFormula;

            let n2pIsScale = 'N';
            let bool_n2pIsScale = this.n2pIsScale;
            if (bool_n2pIsScale != null && bool_n2pIsScale) {
              n2pIsScale = 'Y';
            }

            let p2nIsScale = 'N';
            let bool_p2nIsScale = this.p2nIsScale;
            if (bool_p2nIsScale != null && bool_p2nIsScale) {
              p2nIsScale = 'Y';
            }

            let addData = {
              productId:that.temp.id,
              unit:that.temp.punit,
              remark:that.temp.remark,

              //计量转计价单位
              npFormula:npFormula,
              n2pIsScale: n2pIsScale,
              n2pDecimalCount: this.n2pDecimalCount,

              //计价转计量单位
              pnFormula:pnFormula,
              p2nIsScale: p2nIsScale,
              p2nDecimalCount: this.p2nDecimalCount,
            };
            //console.log('**************************** addData:');
            //console.log(addData);

            saveProductUnit(addData).then(res => {
              that.dialogLoading = false
              if (res.code === 0) {
                that.$notify({
                  title: '成功',
                  message: '操作成功',
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
      },
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

