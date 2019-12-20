<template>
  <div
    ref="equipmentFormula"
    class="equipmentFormula"
    :style="{width:this.setWidth}"
    v-loading="equipmentFormulaLoading">
    <div class="leftView">
      <div style="position: absolute;top: 0;left: 0;bottom: 0;" :style="{right: `-${scrollBarWidth}px`}">
        <div id="leftBtnsBox" style="height: 100%;position: relative;">
          <div ref="leftView" :style="{height: leftViewHeight}" style="overflow: auto;" @scroll="leftViewScroll($event)">
            <div>
              <div v-waves v-for="(v,i) in testList" class="leftBtnViews leftBtns" @click="selectObj(v)">
                <div class="leftBtnBoxs" v-text="v[adapted.name]"></div>
              </div>
            </div>
          </div>
          <div v-if="showLeftArrow" class="leftArrowBox">
            <div v-waves :style="{width: `calc(100% - ${scrollBarWidth}px)`}" class="leftArrowView leftBtns" @click="changeScroll">
              <svg-icon :icon-class="setIcon"></svg-icon>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="rightView">
      <div v-if="setCustomSign.length" class="customSignView"></div>
      <div class="baseSignView" v-if="isUserInput">
        <div v-for="(v,i) in baseSign" class="signView">
          <template v-if="v && v!== '='">
            <div
              class="signBox isDrop"
              v-waves
              :class="{boldContent:setContentStyle(v),boldSign:setSignStyle(v),textBtn:setTextStyle(v)}"
              @click="selectVal(v)">
              <div v-text="v" style="cursor: default"></div>
            </div>
          </template>
          <template v-else>
            <div class="signBox noDrop" v-text="v"></div>
          </template>
        </div>
      </div>
      <div class="resultView" :style="{height: isUserInput?'80px':rightBoxHeight+'px'}">
        <el-input
          v-if="isUserInput"
          placeholder="请输入内容"
          v-model="userInputStr"
          :disabled="isUserInput">
          <template slot="prepend">{{paramName + ' = '}}</template>
          <el-button slot="append" icon="el-icon-edit" title="手动编辑公式" @click="edit"></el-button>
        </el-input>
        <div v-else class="userInputView">
          <div class="userInputViewCenter">
            <el-input
              placeholder="请输入内容"
              v-model="customUserInput"
              @change="changeVal">
              <template slot="prepend">{{paramName + ' = '}}</template>
              <el-button slot="append" icon="el-icon-edit" title="关闭手动编辑" @click="edit"></el-button>
            </el-input>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {evil,getScrollBarSize} from '@/utils/common'
  import waves from '@/directive/waves/index.js'

    export default {
      name: "equipment-formula",
      props: {
        width: [String,Number],
        customSign: {
          type: Array,
          default(){
            return []
          }
        },
        renameKey: {
          type: Object,
          default(){
            return null
          }
        },
        apiObj: {
          type: Object,
          default(){
            return null
          }
        },
        paramName: {
          type: String,
          default: '',
        },
      },
      directives: {
        waves
      },
      data(){
        return {
          testList: [],
          baseSign:[
            '7','8','9','+',
            '4','5','6','-',
            '1','2','3','*',
            '(','0','.','/',
            ')','退格','清空','='
          ],
          boldContent: [
            '7','8','9',
            '4','5','6',
            '1','2','3',
            '0','.'
          ],
          boldSign: ['+','-','*','/','=','(',')'],
          resultStr: [],
          // scrollBarWidth: 0,
          leftBtnsBoxHeight: 0,
          showLeftArrow: false,
          leftScrollTop: 0,
          maxLeftScrollTop: 0,
          scrollSwitch: true,
          animateTimer: '',
          arrowState: true,
          isClick:true,
          clickTimer: '',
          resultObj: [],
          lastInput: '',
          equipmentFormulaLoading: true,
          userInputStr: '',
          isUserInput: true,
          // initUserInputs: '',
          rightBoxHeight: 0,
          customUserInput: '',
          customUserInputObjs: [],
        }
      },
      components:{

      },
      computed:{
        setWidth(){
          if(!this.width) return '600px'
          return typeof this.width === 'number'?`${this.width}px`:this.width
        },
        setCustomSign(){
          return this.customSign || []
        },
        leftViewHeight(){
          if(!this.testList.length) return '100%'
          if((this.testList.length * 45) > (this.leftBtnsBoxHeight - 45)){
            this.showLeftArrow = true
            this.maxLeftScrollTop = (this.testList.length * 45) - (this.leftBtnsBoxHeight - 45)
            return (this.leftBtnsBoxHeight - 45) + 'px'
          }else {
            this.showLeftArrow = false
            return '100%'
          }
        },
        setIcon(){
          return this.arrowState?'arrowdown':'arrowup'
        },
        adapted(){
          return this.renameKey || {
            name: 'targetName',
            id: 'id',
            code: 'targetCode',
            formula: 'targetFormula'
          }
        },
        resetresultStr(){
          return this.resultStr.map(v=>{
            if(typeof v === 'object'){
              return v[this.adapted.name]
            }
            return v
          })
        },
        setResultStr(){
          return `${this.paramName} = ${this.resetresultStr.join('')}`
        },
        // initResultStr(){
        //   return this.resultStr.concat(this.initUserInputs)
        // },
        scrollBarWidth(){
          if(this.showLeftArrow){
            return getScrollBarSize()
          }
          return 0
        }
      },
      watch:{
        leftScrollTop(){
          if(this.scrollSwitch && this.isClick){
            let step = 10,elScrollTop;
            this.scrollSwitch = false
            if(this.setIcon === 'arrowdown'){
              this.animateTimer = setInterval(_ => {
                elScrollTop = this.$refs['leftView'].scrollTop
                if(this.leftScrollTop > (elScrollTop + step)){
                  this.$refs['leftView'].scrollTop = elScrollTop + step
                }else {
                  this.$refs['leftView'].scrollTop = this.leftScrollTop
                  clearInterval(this.animateTimer)
                  this.scrollSwitch = true
                  if(this.$refs['leftView'].scrollTop >= this.maxLeftScrollTop){
                    this.arrowState = false
                  }
                }
              },16.667)
            }else {
              this.animateTimer = setInterval(_ => {
                elScrollTop = this.$refs['leftView'].scrollTop
                if(this.leftScrollTop < (elScrollTop - step)){
                  this.$refs['leftView'].scrollTop = elScrollTop - step
                }else {
                  this.$refs['leftView'].scrollTop = this.leftScrollTop
                  clearInterval(this.animateTimer)
                  this.scrollSwitch = true
                  this.arrowState = true
                }
              },16.667)
            }
          }
        },
        resetresultStr(){
          this.userInputStr = this.resetresultStr.join('')
        },
      },
      methods:{
        removeUserInput(item,index){
          this.resultStr.splice(index,1)
          if(typeof item === 'object'){
            this.resultObj = this.resultObj.filter(v=>{
              return v[this.adapted.id] !== item[this.adapted.id]
            })
          }
        },
        addUserInput(index){
          this.resultStr.splice(index,0,'')
        },
        addUserInputToLast(){
          this.resultStr.push('')
        },
        changeVal(item){
          if(!item){
            this.customUserInputObjs = []
          }


        },


        setContentStyle(v){
          return this.boldContent.indexOf(v)>-1
        },
        setSignStyle(v){
          return this.boldSign.indexOf(v)>-1
        },
        setTextStyle(v){
          if(v === '清空' || v === '退格') return true
          return false
        },

        selectVal(v){
          if(v){
            if(v === '清空'){
              this.resultStr = []
            }else if(v === '退格'){
              this.resultStr.length && this.removeUserSelect(this.resultStr.pop())
            }else {
              this.resultStr.push(v)
              this.lastInput = v
            }
          }
        },
        removeUserSelect(item){
          if(typeof item === 'object'){
            if(this.resultObj[this.resultObj.length-1][this.adapted.id] === item[this.adapted.id]){
              this.resultObj.pop()
            }
          }
        },
        selectObj(v){
          if(!this.isUserInput) {
            this.customUserInputObjs = this.customUserInputObjs.filter(cv=>{
              return cv[this.adapted.id] !== v[this.adapted.id]
            })
            this.customUserInputObjs.push(v)
            this.customUserInput += v[this.adapted.name]
          }else {
            this.resultStr.push(v)
            this.lastInput = v
            this.resultObj.push(v)
          }
        },
        changeScroll(){
          this.isClick = true
          // this.leftScrollTop = this.$refs['leftView'].scrollTop
          console.log(this.$refs['leftView'].scrollTop)
          if(this.scrollSwitch){
            const maxStep = this.maxLeftScrollTop - this.$refs['leftView'].scrollTop
            if(maxStep>0){
              if(maxStep>180){
                this.leftScrollTop += 180
              }else {
                this.leftScrollTop += maxStep
              }
            }else {
              this.leftScrollTop = 0
            }

          }
        },
        leftViewScroll(e){
          // console.log(e)
          if(this.scrollSwitch){
            this.isClick = false
            this.leftScrollTop = e.target.scrollTop
            if(e.target.scrollTop>=this.maxLeftScrollTop){
              this.arrowState = false
            }else {
              this.arrowState = true
            }
            clearTimeout(this.clickTimer)
            this.clickTimer = setTimeout(_=>{
              this.isClick = true
            },100)
          }
        },
        getData(){
          if(this.isUserInput){
            if(this.resultStr.length){
              this.$emit('databridge',{
                formulaStr: this.setResultStr,
                resultObj:this.resultObj
              })
            }else {
              this.$message.error('请先录入公式');
            }
          }else {
            if(this.customUserInput){
              this.$emit('databridge',{
                formulaStr: `${this.paramName} = ${ this.customUserInput}`,
                resultObj:this.customUserInputObjs
              })
            }else {
              this.$message.error('请先录入公式');
            }
          }
        },
        httpRequests(){
          this.$api[this.apiObj.apiName](this.apiObj.params).then(res=>{
            console.log(res)
            this.testList = res.EquipmentSensor || []
            this.equipmentFormulaLoading = false
          }).catch(err=>{
            this.equipmentFormulaLoading = false
          })
        },
        edit(){
          this.isUserInput = !this.isUserInput
          if(!this.isUserInput){
            this.customUserInput = ''
            this.customUserInputObjs = []
          }
        },
      },
      created(){
        // this.scrollBarWidth = getScrollBarSize()
        this.apiObj && this.httpRequests()
      },
      mounted(){
        this.leftScrollTop = 0
        this.leftBtnsBoxHeight = this.$el.querySelector('#leftBtnsBox').offsetHeight
        this.rightBoxHeight = this.$refs['equipmentFormula'].offsetHeight
      },
      beforeDestroy(){},
    }
</script>

<style lang="scss" rel="text/css" scoped>
  .equipmentFormula {
    display: flex;
    border-right: 1px solid #E4E4E4;
    border-bottom: 1px solid #E4E4E4;
    >.leftView {
      flex: 1;
      position: relative;
      overflow: hidden;
      .leftBtnViews {
        height: 45px;
        background-color: #009900;
        box-sizing: border-box;
        border: 1px solid #E4E4E4;
        border-bottom: none;
        border-right: none;
        display:flex;
        justify-content: center;
        align-items: center;
        >.leftBtnBoxs {
          color: #ffffff;
          cursor: default;
        }
      }
      .leftArrowBox {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        height: 45px;
        box-shadow: 0 -4px 5px 0 #e4e4e4;
        .leftArrowView {
          box-sizing: border-box;
          border-left: 1px solid #E4E4E4;
          height: 45px;
          display:flex;
          justify-content: center;
          align-items: center;
          color: #ffffff;
          background-color: #009900;
          font-size: 30px;
        }
      }
      .leftBtns:hover {
        background-color: rgb(0,120,0);
      }
    }
    >.rightView {
      flex: 4;
      >.customSignView {

      }
      >.baseSignView {
        display: flex;
        flex-wrap:wrap;
        >.signView {
          flex:  0 0 25%;
          box-sizing: border-box;
          height: 45px;
          background-color: #fff;
          border: 1px solid #E4E4E4;
          border-bottom: none;
          border-right: none;
          >.signBox {
            height: 100%;
            display:flex;
            justify-content: center;
            align-items: center;
            position: relative;
          }
        }

      }
      >.resultView {
        padding: 10px;
        word-wrap:break-word;
        overflow: auto;
        border: 1px solid #E4E4E4;
        border-bottom: none;
        border-right: none;
        >.userInputView {
          .userInputViewCenter {
            .userInputListView {
              .el-button {
                padding: 6px 10px;
              }
            }
          }
        }
      }
    }
    /*.isDrop:hover {*/
      /*background-color: rgb(181,183,183);*/
    /*}*/
    .noDrop {
      cursor: no-drop;
      background-color: #f2f2f2;
    }
    .boldContent {
      font-size: 16px;
      font-weight: 700 !important;
    }
    .boldSign {
      font-size: 24px;
    }
    .boldContent:hover,.boldSign:hover {
      background-color: rgb(220,220,220);
    }
    .textBtn {
      color: #ffffff;
      background-color: #66CCFF;
    }
    .textBtn:hover {
      background-color: rgb(10,175,255);
    }
  }
</style>
