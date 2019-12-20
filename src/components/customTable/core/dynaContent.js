import {searchVal, getVal} from '@/utils/baseRules'
import {isNumber} from '@/utils/validate'

import tableInput from '@/components/customTable/core/input'
import tableAutocomplete from '@/components/customTable/core/autocomplete'
import tableDate from '@/components/customTable/core/datePicker'
import tableTime from '@/components/customTable/core/timePicker'
import tableSelect from '@/components/customTable/core/select'
import tableCascader from '@/components/customTable/core/cascader'
import tableSwitch from '@/components/customTable/core/switch'
import tableDateTime from '@/components/customTable/core/dateTime'
import tableInputNumber from '@/components/customTable/core/inputNumber'
import tableProgress from '@/components/customTable/core/progress'
import tableUpload from '@/components/customTable/core/upload'
import tableTag from '@/components/customTable/core/tag'
import tableButton from '@/components/customTable/core/button'
import tableSteps from '@/components/customTable/core/customSteps'

export default {
  name: 'dynaContent',
  inject:['rootVm'],
  props: {
    scope: {
      type:Object,
      default(){
        return {}
      }
    },
    childColconfig: {
      type:Object,
      default(){
        return {}
      }
    },
    // _cellConfig: {
    //   type:Object,
    //   default(){
    //     return null
    //   }
    // },
  },
  components: {
    tableInput,
    tableAutocomplete,
    tableDate,
    tableTime,
    tableSelect,
    tableCascader,
    tableSwitch,
    tableDateTime,
    tableInputNumber,
    tableSteps,
    tableProgress,
    tableUpload,
    tableTag,
    tableButton,
  },
  data(){
    return {
      resultConfig: null,
    }
  },
  computed: {
    // setAction(){
    //   const configArr = this.childColconfig._cellConfig?Object.keys(this.childColconfig._cellConfig):[]
    //   if(!configArr.length) return null
    //   if(configArr.length === 1 && configArr.indexOf('compute')>-1){
    //     return 'computeOnly'
    //   }
    // },
    setResultConfig(){
      if(this.rootVm.dynaContentCellConfigs[this.scope.$index]) return this.rootVm.dynaContentCellConfigs[this.scope.$index][this.childColconfig.prop || this.childColconfig.columnIndex]|| null
      if(this.resultConfig) return this.resultConfig
      return null
    },
  },
  // watch:{
  //   setResultConfig:{
  //     deep: true,
  //     handler(n,o){
  //       console.log(n,'watch',this.scope)
  //     }
  //
  //   }
  // },
  methods: {
    initComponentName(str){
     let tempStr = str.charAt(0).toUpperCase() + str.substring(1,str.length);
     // tempStr.match(/[A-Z]/g).forEach(v=>{
     //   tempStr = tempStr.replace(/[A-Z]/,'-'+v.toLowerCase())
     // });
     // console.log(`table${tempStr}`)
     return `table${tempStr}`
    },
    createNodeOptions(config){
      if(config && typeof config === 'object') {
        const tempObj = {}
        const keys = Object.keys(config)
        if(keys.includes('innerText')){
          tempObj.domProps = {
            innerHTML: config.innerText.search(/self@|parent@|tempData@|sibling@/)>-1?this.computedVal(this.scope.row,config.innerText):config.innerText
          }
        }
        if(keys.includes('style')){
          tempObj.style = config.style
        }
        if(keys.includes('class')){
          tempObj.class = config.class
        }
        if(!tempObj.domProps || !Object.keys(tempObj.domProps).includes('innerHTML')){
          tempObj.domProps = {
            innerHTML: this.scope.row[this.childColconfig.prop || this.childColconfig.columnIndex]
            // innerHTML: this.$slots.default
          }
        }
        return tempObj
      }else {
        return null
      }
    },
    createComponentOptions(config){
      //console.log(config.componentName)
      if(config.componentName === 'cascader' || config.componentName === 'select'){
        const _key = '_' + (this.childColconfig.prop || this.childColconfig.columnIndex)
        config.prop = _key
        this.rootVm.createDynaCascaderOptions(_key,this.childColconfig,this.scope,config)
      }
      if(config.componentName === 'date' || config.componentName === 'dateTime'){
        this.scope.row[this.childColconfig.prop || this.childColconfig.columnIndex] = new Date()
      }
      const tempObj = {
        props: {
          scope:this.scope,
          childColconfig:config
        },
      }
      // const domProps = {
      //   innerHTML: this.scope.row[this.childColconfig.prop || this.childColconfig.columnIndex]
      // }
      // const setInners = ['button']
      // if(setInners.includes(config.componentName)){
      //   tempObj.domProps = domProps
      // }
      return tempObj
    },
    computedVal(row,str) {
      const cList = str.split(/\([\\+|\-|\\*|\\/]\)/)
      let result
      if (cList.length > 1) {
        result = getVal(cList, row, this.rootVm.setRowChain, this.rootVm.tableData[this.rootVm.dataName], str, this.rootVm.setTempData)
      }else {
        result = searchVal(cList, row, this.rootVm.setRowChain, this.rootVm.tableData[this.rootVm.dataName], '', this.rootVm.setTempData)[0]
      }
      if(!Number.isNaN(parseFloat(result))){
        result = result.toFixed(this.childColconfig._cellConfig.precision || this.rootVm.setPrecision)
      }
      return result
    },
  },
  created(){
    // console.log(this.childColconfig,this.scope)
    this.resultConfig = this.rootVm.createDynaContentConfig(this.scope.row,this.childColconfig,this.scope.$index)
    // console.log(this.resultConfig)
  },
  render(h){
    let nodeStr = '',nodeOptions = null
    if(!this.setResultConfig){
      nodeStr = 'span'
      nodeOptions = {
        domProps: {
          innerHTML: this.scope.row[this.childColconfig.prop || this.childColconfig.columnIndex]
        },
      }
    }else {
      if(this.setResultConfig.componentName && typeof this.setResultConfig.componentName === 'string'){
        nodeStr = this.initComponentName(this.setResultConfig.componentName)
        nodeOptions = this.createComponentOptions(this.setResultConfig)
      }else {
        nodeStr = 'span'
        nodeOptions = this.createNodeOptions(this.setResultConfig)
      }
    }

    return  h(nodeStr, nodeOptions)
  },
}
