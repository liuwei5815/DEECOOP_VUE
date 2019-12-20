<template>
  <div class="customSummaryOption clearfix">
    <component
      v-send-height
      :is="customSummary.component"
      :data="setData"
      :tempData="tempData"
      :setStyle="customSummary.boxStyle" @custom-summary-value="customSummaryValue"></component>
  </div>
</template>

<script>
  import testData from '@/data/customSummary'
    export default {
      name: "custom-summary-option",
      props: {
        customSummary: {
          type: Object,
          default(){
            return {}
          }
        },
        tableData: {
          type: Array,
          default(){
            return []
          }
        },
        tempData: {
          type: Object,
          default(){
            return {}
          }
        }
      },
      data(){
        return {
          boxDefaultStyle: {
            width: '600px',
            float: 'left'
          },
          data: {},
          //tempData: {},
        }
      },
      directives:{
        'send-height':{
          inserted(el,binding,vnode){
            vnode.context.$emit('send-height',el.clientHeight)
          }
        }
      },
      computed:{
        setStyle(){
          return this.customSummary.boxStyle || this.boxDefaultStyle
        },
        // setTableData(){
        //   console.log(this.tableData)
        //   return this.tableData
        // },
        setData(){
          this.customSummary.computes && this.createFormula(this.customSummary.computes,this.tableData,this.tempData)
          return this.data
        }
      },
      created(){
        //console.log(this.customSummary)
        this.data = this.customSummary.data
        // setTimeout(_=>{
        //   this.assignmentFn(testData)
        // },3000)
        this.customSummary.apiObj && this.customSummary.apiObj.apiName && this.httpRequests()
      },
      mounted(){

      },
      methods:{
        httpRequests(){
          try {
            this.$api[this.customSummary.apiObj.apiName](Object.assign({},this.customSummary.apiObj.params)).then(res => {
              res.result && this.assignmentFn(res.result)
            }).catch(err => {
              console.log(err)
            })
          }catch(err) {console.log(err)}
        },
        assignmentFn(result){
          for(const k in this.data){
            if(this.data.hasOwnProperty(k)){
              this.data[k] = result[k]
            }
          }
        },
        createFormula(formula,list,tempData){
          for(const k in formula){
            if(formula.hasOwnProperty(k)){
              const strList = formula[k].split(/\([\\+|\-|\\*|\\/]\)/)
              if(strList.length>1){
                strList.forEach(v=>{
                  //未完成功能
                })
              }else {
                const tempStrArr = formula[k].split('@')
                tempStrArr[0] === 'table' && (this.data[k] = this.getSum(tempStrArr[1],list))
              }
            }
          }
          //console.log(this.data)
        },
        getSum(prop,list){
          let sum = 0
          list.forEach(v=>{
            sum += (v[prop]-0)
          })
          //console.log(sum)
          return sum
        },
        customSummaryValue(value){
          this.$emit('custom-summary-value',value)
        }
      }

    }
</script>

<style lang="scss" rel="text/css">
  ul {
    list-style:none;
    margin:0;
    padding: 0;
  }
  .customSummaryOption {
    .inputStyle {
      >span {
        display: inline-block;
        vertical-align: middle;
        line-height: 2.4;
      }
    }
    .el-input {
      max-width: 80% !important;
      min-width: 50% !important;
    }
    .el-input__inner {
      padding: 0 !important;
    }
    .el-form {
      display: inline-block;
      .el-form-item {
        margin: 0;
        .el-form-item__content {
          position: relative;
          overflow: hidden;
          .el-form-item__error--inline {
            position: absolute;
            top: 100%;
          }
        }
      }
    }
  }


</style>
