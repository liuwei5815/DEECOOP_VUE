<template>
  <div class="formulaEdit">
    <el-form :label-position="'right'"  ref="formulaForm" :model="formData" label-width="85px">
      <!--<el-form-item label="快捷设置：">-->
        <!--<el-row>-->
          <!--<el-button type="primary" :disabled="isParams" @click="setSelect('metering')">-->
            <!--计量单位-->
          <!--</el-button>-->
          <!--<el-button type="primary" :disabled="isParams" @click="setSelect('valuation')">-->
            <!--计价单位-->
          <!--</el-button>-->
        <!--</el-row>-->
      <!--</el-form-item>-->
      <el-form-item label="变量说明：">
        <el-input :disabled="true" v-text="messageStr" style="text-align: left"></el-input>
      </el-form-item>
      <el-form-item label="公式预览：" prop="result" :rules="resultRules">
          <el-input :disabled="true" v-model="formData.result" class="resetSpan">
            <span slot="prefix" style="width: 100%">
              <span v-text="formulaTitle"></span>
            </span>
          </el-input>
      </el-form-item>
      <el-form-item label="公式输入：">
        <el-row style="text-align: center">
            <el-col :span="5">
              <el-select
                v-model="result"
                :disabled="!!result && userShortcuts"
                popper-class="popperClass"
                placeholder="设置变量"
                @change="selected">
                <el-option
                  v-for="item in formatOptions"
                  :key="item.id"
                  :label="item.label"
                  :value="item.id">
                  <span style="float: left">{{ item.label }}</span>
                  <span v-if="item.remark" style="float: right; color: #8492a6; font-size: 13px">{{ item.remark }}</span>
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="2" style="color: #000;padding-top: 5px;">
              <el-button class="resetIcon onesIcon" :disabled="true">
                <svg-icon icon-class="equal"></svg-icon>
              </el-button>
            </el-col>
            <el-col :span="15">
              <el-popover
                title="公式键盘"
                v-model="popovervisible">
                <key-board :config="keyboardConfig" :lockVar="lockVar" :popovervisible.sync="popovervisible"></key-board>
                <el-input ref="popoverInput1" slot="reference" :readonly="true" placeholder="点击输入常量" v-model="rightStr" @focus="changeState"></el-input>
              </el-popover>
            </el-col>
            <el-col :span="2" style="color: #000;padding-top: 5px;">
            <el-button class="resetIcon onesIcon" title="重置公式" type="primary" :disabled="refreshState" @click="clearReslut">
              <svg-icon icon-class="refresh"></svg-icon>
            </el-button>
          </el-col>
            <!--<el-col :span="5">-->
              <!--<el-select-->
                <!--v-model="value"-->
                <!--:disabled="!!value && userShortcuts"-->
                <!--popper-class="popperClass"-->
                <!--placeholder="设置变量"-->
                <!--@change="selected">-->
                <!--<el-option-->
                  <!--v-for="item in formatOptions"-->
                  <!--:key="item.id"-->
                  <!--:label="item.label"-->
                  <!--:value="item.id">-->
                  <!--<span style="float: left">{{ item.label }}</span>-->
                  <!--<span v-if="item.remark" style="float: right; color: #8492a6; font-size: 13px">{{ item.remark }}</span>-->
                <!--</el-option>-->
              <!--</el-select>-->
            <!--</el-col>-->
            <!--<el-col :span="6">-->
              <!--<el-popover-->
                <!--title="公式键盘"-->
                <!--v-model="popoverVisible2">-->
                <!--<key-board :config="keyboardConfig"></key-board>-->
                <!--<el-input ref="popoverInput2" slot="reference" :readonly="true" placeholder="点击输入常量" v-model="rightStr" @focus="changeState"></el-input>-->
              <!--</el-popover>-->
            <!--</el-col>-->
        </el-row>
      </el-form-item>
    </el-form>
    <el-row class="btns">
      <el-button type="primary" @click="sendFormula">保 存</el-button>
      <!--<el-button :disabled="refreshState" @click="clearReslut">重 置</el-button>-->
      <el-button @click="closeFormula">关 闭</el-button>
    </el-row>



  </div>
</template>

<script>
  import keyboard from '../tools/keyboard'
  import {evil} from '@/utils/common'

    export default {
      name: "formula-edit",
      props: {
        options:{
          type: Array,
          default(){
            return [{id:'metering', label:'N',remark:'计量单位'},{id:'valuation', label:'P',remark:'计价单位'}]
          }
        },
        state:[String]
      },
      data(){
        const checkFormula = (rule, value, callback) => {
          if (!value) {
            return callback(new Error('请输入公式'));
          }
          const result = checkStr(value)
          const resultState = checkState(value)
          if(result === 1 && !resultState){
            callback();
          }else {
            callback(new Error(result));
          }
          function checkStr(string, obj){
            string = string.replace(/\s/g, '');
            if(/^[\+\-\*\/]/.test(string)) {
              return '错误情况，运算符开头';
            }
            if(/[\+\-\*\/]$/.test(string)) {
              return '错误情况，运算符结尾';
            }
            if("" === string){
              return '错误情况，输入为空';
            }
            if( /[\+\-\*\/]{2,}/.test(string) ){
              return '错误情况，运算符连续';
            }
            if(/\(\)/.test(string)){
              return '错误情况，空括号';
            }
            if(/\.\D+/.test(string)){
              return '错误情况，小数点后面不是数字';
            }
            // if(/[^\+\-\*\/][A-Za-z]/.test(string)){
            //   return '错误情况，变量前面不是运算符';
            // }
            var stack = [];
            for(var i = 0, item; i < string.length; i++){
              item = string.charAt(i);
              if('(' === item){
                stack.push('(');
              }else if(')' === item){
                if(stack.length > 0){
                  stack.pop();
                }else{
                  return false;
                }
              }
            }
            if(0 !== stack.length){
              return '错误情况，括号不配对';
            }
            if(/\([\+\-\*\/]/.test(string)){
              return '错误情况，(后面是运算符 ';
            }
            if(/[\+\-\*\/]\)/.test(string)){
              return '错误情况，)前面是运算符';
            }
/*            if(/[^\+\-\*\/]\(+/.test(string)){
              return '错误情况，(前面不是运算符';
            }
            if(/\)+[^\+\-\*\/]/.test(string)){
              return '错误情况，)后面不是运算符';
            }*/
            if(obj){
              var tmpStr = string.replace(/[\(\)\+\-\*\/]{1,}/g, '`');
              var array = tmpStr.split('`');
              for(var i = 0, item; i < array.length; i++){
                item = array[i];
                if( /[A-Z]/i.test(item) && 'undefined' === typeof(obj[item]) ){
                  return '错误情况，变量没有来自“待选公式变量”';
                }
              }
            }
            return 1;
          }
          function checkState(value) {
            const str = value.replace(/N|P/g,1)
            let state
            try {
              state = Number.isNaN(evil(str))
            }catch {
              state = true
            }
            return state
          }
        };
        return {
          formData: {
            result: '',
          },
          result: '',
          value: '',
          metering: 'N',
          valuation: 'P',
          userShortcuts: false,
          resultRules: [{ validator: checkFormula, trigger: 'change' }],
          popovervisible: false,
          leftStr:'',
          rightStr:'',
          // keyboardConfig: {
          //   deleteKey:this.deleteKey,
          //   inputKey:this.inputKey,
          //   state: '',
          //   close:this.closePopover,
          //   endInput: this.endInput
          // },
          lockVar: false,
          keyboardConfig:[{
              type:'primary',
              method:this.inputKey,
              key:'(',
              targetKey:'rightStr',
              icon:'leftbracket'
          }, {
            type:'primary',
            method:this.inputKey,
            key:')',
            targetKey:'rightStr',
            icon:'rightbracket'
          }, {
            type:'danger',
            method:this.deleteKey,
            key:'',
            targetKey:'rightStr',
            icon:'backspace'
          }, {
            type:'primary',
            method:this.inputKey,
            key:'+',
            targetKey:'rightStr',
            icon:'formulaAdd'
          }, {
            type:'primary',
            method:this.inputKey,
            key:7,
            targetKey:'rightStr',
            icon:'number7'
          }, {
            type:'primary',
            method:this.inputKey,
            key:8,
            targetKey:'rightStr',
            icon:'number8'
          }, {
            type:'primary',
            method:this.inputKey,
            key:9,
            targetKey:'rightStr',
            icon:'number9'
          }, {
            type:'primary',
            method:this.inputKey,
            key:'/',
            targetKey:'rightStr',
            icon:'formulaDivide'
          }, {
            type:'primary',
            method:this.inputKey,
            key:4,
            targetKey:'rightStr',
            icon:'number4'
          }, {
            type:'primary',
            method:this.inputKey,
            key:5,
            targetKey:'rightStr',
            icon:'number5'
          }, {
            type:'primary',
            method:this.inputKey,
            key:6,
            targetKey:'rightStr',
            icon:'number6'
          }, {
            type:'primary',
            method:this.inputKey,
            key:'*',
            targetKey:'rightStr',
            icon:'formulaMultiply'
          }, {
            type:'primary',
            method:this.inputKey,
            key:1,
            targetKey:'rightStr',
            icon:'number1'
          }, {
            type:'primary',
            method:this.inputKey,
            key:2,
            targetKey:'rightStr',
            icon:'number2'
          }, {
            type:'primary',
            method:this.inputKey,
            key:3,
            targetKey:'rightStr',
            icon:'number3'
          }, {
            type:'primary',
            method:this.inputKey,
            key:'-',
            targetKey:'rightStr',
            icon:'formulaSubtract'
          }, {
            type:'primary',
            method:this.inputKey,
            key:'',
            targetKey:'rightStr',
            disabled: true,
            icon:'AC'
          }, {
            type:'primary',
            method:this.inputKey,
            key:0,
            targetKey:'rightStr',
            icon:'number0'
          }, {
            type:'primary',
            method:this.inputKey,
            key:'.',
            targetKey:'rightStr',
            icon:'spot'
          }, {
            type:'warning',
            method:this.inputKey,
            key:'N',
            disabled: false,
            targetKey:'rightStr',
            icon:'N'
          }
          ],
          isParams: false,
          messageStr: 'N为计量单位，P为计价单位',
        }
      },
      components:{
        'key-board': keyboard
      },
      computed:{
        setKey(){
          return this.value?this[this.value]:'N'
        },
        formatOptions(){
          return this.options.map(v=>{
            v.isdisable = false
            return v
          })
        },
        refreshState(){
            if(!this.isParams && (this.result||this.value||this.leftStr||this.rightStr)){
              return false
            }else {
              return true
            }
        },
        formulaResult(){
          // const tempArr = ['','','']
          // tempArr.splice(0,1,this.leftStr)
          // tempArr.splice(1,1,this[this.value])
          // tempArr.splice(2,1,this.rightStr)
          // return tempArr.join('')
          return this.rightStr
        },
        formulaTitle(){
          if(this.result){
            return (this[this.result] + ' =')
          }else {
            return ''
          }
        }
      },
      watch:{
        formulaResult(val){
          this.formData.result = val
        },
        value(val){
          const str = this.value?this[this.value]:'N'
          this.keyboardConfig[this.keyboardConfig.length-1].key = str
          this.keyboardConfig[this.keyboardConfig.length-1].icon = str
        },
        rightStr(){
          if(this.rightStr.match(/[N|P]/)){
            this.lockVar = true
            this.keyboardConfig[this.keyboardConfig.length-1].disabled = true
          }else {
            this.lockVar = false
            this.keyboardConfig[this.keyboardConfig.length-1].disabled = false
          }
        }
      },
      methods:{
        sendFormula(){
          this.$refs['formulaForm'].validate((valid) => {
            valid && this.result && this.value && this.$emit('send-formula',this.formulaTitle.replace(/\s/g,"") + this.formData.result)
          });
        },
        clearReslut(){
          this.rightStr = ''
        },
        closeFormula(){
          this.$emit('send-formula','')
        },
        changeState(){
          if(this.result === 'metering'){
            this.keyboardConfig.state = '2'
          }else {
            this.keyboardConfig.state = '1'
          }
        },
        closePopover(state){
          this['popoverVisible'+state] = false
        },
        deleteKey(str){
          this[str].length && (this[str] = this[str].substr(0, this[str].length - 1))
        },
        inputKey(target,val){
          this[target] += val
        },
        endInput(index){
          this['popoverVisible'+index] = false
        },
        setSelect(state){
          this.userShortcuts = true
          this.result = state
          state === 'valuation' && (this.value = 'metering')
          state === 'metering' && (this.value = 'valuation')
        },
        selected(val){
          if(!this.value){
            this.value = val==='valuation'?'metering':'valuation'
            this.userShortcuts = true
            return
          }
          if(!this.result){
            this.result = val==='valuation'?'metering':'valuation'
            this.userShortcuts = true
            return
          }
        },
        inverseFn(str){
          if(str){
            let expStr = ''
            const Nlist = str.match(/N+/g)
            const Plist = str.match(/P+/g)
            if(Nlist && Plist){
              return ''
            }else if(Nlist){
              const strList = str.match(/\((.+?)\)/g)
              if(strList){
                strList && strList.find((v,index) => {
                  if(v.indexOf('N') > -1){
                    const tempArr = str.split(v)
                    const resultArr = tempArr.map(_=>{return ''})
                    tempArr.forEach((cv,cindex) => {
                      if(cv){
                        const start = cv.charAt(0)
                        const end = cv.charAt(cv.length-1)
                        const tempObj = {}
                        if(start && /[\+\-\*\/]/.test(start)){
                          switch (start){
                            case '+':
                              tempObj.symbol = '-'
                              break;
                            case '-':
                              tempObj.symbol = '+'
                              break;
                            case '*':
                              tempObj.symbol = '/'
                              break;
                            case '/':
                              tempObj.symbol = '*'
                              break;
                          }
                          tempObj.position = 'left'
                          tempObj.str = cv.substring(1)
                        }else if(end && /[\+\-\*\/]/.test(end)){
                          switch (end){
                            case '+':
                              tempObj.symbol = '-'
                              break;
                            case '-':
                              tempObj.symbol = '+'
                              break;
                            case '*':
                              tempObj.symbol = '/'
                              break;
                            case '/':
                              tempObj.symbol = '*'
                              break;
                          }
                          tempObj.position = 'right'
                          tempObj.str = cv.substring(0,cv.length-1)
                        }
                        resultArr.splice(cindex,1,tempObj)
                      }
                    })
                    resultArr.forEach((rv,rindex) => {
                      if(rv){
                        if(rv.position === 'left'){
                          rv.str = (rv.symbol+rv.str)
                        }else if(rv.position === 'right'){
                          if(rv.symbol === '*'){
                            rv.str = (rv.str+'/')
                          }else if(rv.symbol === '+'){
                            rv.str = (rv.str+'-')
                          }else {
                            rv.str = (rv.symbol+rv.str)
                          }
                        }
                      }
                    })
                  }
                })
              }else {



              }

            }else if(Plist){

            }
          }else {
            return ''
          }
        }
      },
      created(){
        if(this.state){
          this.isParams = true
          this.userShortcuts = true
          this.state === 'n' && (this.result = 'metering') && (this.value = 'valuation')
          this.state === 'p' && (this.result = 'valuation') && (this.value = 'metering')
        }
      },
      mounted(){},
      beforeDestroy(){},
    }
</script>

<style lang="scss" rel="text/css">
  .formulaEdit {
    width: 600px;
    .el-button {
      padding: 5px;
    }
    .resetIcon {
      .svg-icon {
        width: 2em;
        height: 2em;
      }
    }
    .onesIcon {
      padding: 0 !important;
      border: none !important;
    }
    .el-button+.el-button {
      margin-left: 0;
    }
    .btns {
      text-align: center;
      .el-button {
        padding: 10px 20px;
      }
      .el-button:first-child {
        margin-right: 30px;
      }
    }
    .resetSpan {
      .el-input__inner {
        padding-left: 40px;
      }
    }
    .el-input__prefix {
      width: 40px;

    }
  }
</style>
