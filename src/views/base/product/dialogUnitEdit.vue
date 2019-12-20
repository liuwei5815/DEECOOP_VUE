<template>
  <el-dialog v-el-drag-dialog :title="initData.title?initData.title:'编辑'" :visible.sync="isVisible" :append-to-body="inDialog" :close-on-click-modal="onModal" :close-on-press-escape="onEscape" :fullscreen="fullscreen" @open="dialogOpen" @close="dialogClose" width="620px">
    <div v-loading="dialogLoading">
      <el-form  :rules="rules" ref="submitForm" :model="temp" label-position="right" label-width="120px"
                style='width: 570px;padding-top: 10px'>

        <el-row>
          <!--计量单位 unit-->

          <el-col :span="12">
            <el-form-item :label="'计量单位:'" prop="unitName" v-show="temp.type=='计价单位'">
              <el-input v-model="temp.unitName" :disabled="true"/>
            </el-form-item>
          </el-col>
          <!--结算单位 lastUnit-->
          <el-col :span="12">
            <!--规格型号-->
            <el-form-item :label="tempLable.punitName+ ':'" prop="punitName">
              <base-input-select v-model="unitData.defaultSelected" :data="unitData.data" @callback="unitSelect" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row v-show="temp.type=='计价单位'">
          <el-col :span="16">
            <el-form-item :label="'计量单位转换计价单位(公式):'" prop="pnFormula">
              <el-input type="textarea" rows="3" style='' v-model="temp.pnFormula" :disabled="true"/>
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

        <el-row v-show="temp.type=='计价单位'">
          <el-col :span="16">
            <el-form-item :label="'计价单位转换计量单位(公式):'" prop="npFormula">
              <el-input type="textarea" rows="3" style='' v-model="temp.npFormula" :disabled="true"/>
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
  import {updateProductUnit} from '@/api/productUnit'
  import formulaDialog from '@/components/formulaEdit/dialog'

  export default {
    components: {
      // DynaForm
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
      }
      if(this.initData.tempLable){
        this.tempLable = this.initData.tempLable
      }

      //n2p:计量转计价:Pprecision
      if ('Y' == this.temp.n2pIsScale) {
        this.Poption = 1;
      } else if ('N' == this.temp.n2pIsScale) {
        this.Poption = 2;
      } else {
        this.Poption = 1;
      }
      this.Pprecision = this.temp.n2pDecimalCount;

      //p2n:计价转计量:Nprecision
      if ('Y' == this.temp.p2nIsScale) {
        this.Noption = 1;
      } else if ('N' == this.temp.p2nIsScale) {
        this.Noption = 2;
      } else {
        this.Noption = 1;
      }
      this.Nprecision = this.temp.p2nDecimalCount;
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
        this.unitData.defaultSelected = [this.initData.temp.punit]
        this.temp['unit'] = this.initData.temp.punit
      },
    //计量单位-下拉列表值改变事件
      unitSelect(data){
        const that = this
        if(data[0]){
          that.temp['unit'] = data[0]
          that.unitData.defaultSelected = [data[0]]
        }else {
          that.temp['unit'] = []
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
            that.dialogLoading = true

            let pnFormula = that.temp.npFormula;
            let npFormula = that.temp.pnFormula;

            that.temp.pnFormula = pnFormula;
            that.temp.npFormula = npFormula;

            let n2pIsScale = 'N';
            let bool_n2pIsScale = this.n2pIsScale;
            if (bool_n2pIsScale != null && bool_n2pIsScale) {
              n2pIsScale = 'Y';
            }
            that.temp.n2pIsScale = n2pIsScale
            that.temp.n2pDecimalCount = this.n2pDecimalCount

            let p2nIsScale = 'N';
            let bool_p2nIsScale = this.p2nIsScale;
            if (bool_p2nIsScale != null && bool_p2nIsScale) {
              p2nIsScale = 'Y';
            }
            that.temp.p2nIsScale = p2nIsScale
            that.temp.p2nDecimalCount = this.p2nDecimalCount
            //console.log('**************************** that.temp:');
            //console.log(that.temp);

            updateProductUnit(that.temp).then(res => {
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

