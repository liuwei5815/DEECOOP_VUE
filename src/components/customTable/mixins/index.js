import {createRules, searchVal, getVal} from '@/utils/baseRules'
import {evil,scrollToTop,progressGradientColor} from '@/utils/common'
import {isFloat,isNumber} from '@/utils/validate'
import constant from '@/utils/constant'
import dateTool from '@/utils/dateTools'
import { createShortcuts } from '@/utils/customTableTools'
import regexp from '@/utils/regexp'
import {computeState} from '../utils'

import dialogImg from '@/components/dialog/dialogImg'
import dynaContent from '@/components/customTable/core/dynaContent'
import coreIndex from '@/components/customTable/core'

import Vue from 'vue'
import customTableSwitch from '@/components/customTable/core/tableSwitch'
const customTableSwitchComponent = Vue.extend(customTableSwitch)

//mixin
import directives from '@/components/customTable/mixins/directives'


import Sortable from 'sortablejs'
export default {
  props:{
    tableConfigList: {
      type: Array,
      default: function () {
        return []
      }
    },
    layer: {
      type: Number,
      default: 0
    },
    precision: {
      type: Number,
      default: constant.precision
    },
    keyMapping: {
      type: Object,
      default: function () {
        return {}
      }
    },
    apiObj: {
      type: Object,
      default: function () {
        return {}
      }
    },
    dynamicValue: {
      type: Object,
      default: function () {
        return null
      }
    },
    tempData: {
      type: Object,
      default: function () {
        return {}
      }
    },
    useSummary: {
      type: Boolean,
      default: false
    },
    customSummary: {
      type: Object,
      default() {
        return {}
      }
    },
    columnGlobalStyle: {
      type: Object,
      default() {
        return {}
      }
    },
    leftFixed: {
      type: Number,
      default: 0
    },
    rightFixed: {
      type: Number,
      default: 0
    },
    sortableConfig: {
      type: Object,
      default(){
        return {}
      }
    },
    showCheckBox: {
      type: Boolean,
      default: false
    },
    showIndex: {
      type: Boolean,
      default: false
    },
    pageData: {
      type: Object,
      default: function () {
        return {}
      }
    },
    isSingle: {
      type: Boolean,
      default: false
    },
    hidePages: {
      type: Boolean,
      default: false
    },
    customColumn: {
      type: Array,
      default: function () {
        return []
      }
    },
    mergeTitle: {
      type: Array,
      default: function () {
        return []
      }
    },
    mergeColumn: {
      type: Array,
      default: function () {
        return []
      }
    },
    mergeRow: {
      type: Array,
      default: function () {
        return []
      }
    },
    showTableSet: {
      type: Boolean,
      default: false
    },
    componentId: {
      type: String,
      default: ''
    },
    dragTable: {
      type: Boolean,
      default: false
    },
    entireRowDrag: {
      type: Boolean,
      default: false
    },
    internalGuid: {
      type: String,
      default: ''
    },
    tableSwitchBaseKey: {
      type: String,
      default: ''
    },
    tableSetMode: {
      type: String,
      default: 'inline'
    },
    useScenarios: {
      type: String,
      default: ''
    },
    initData: {
      type: Object,
      default: function () {
        return {}
      }
    },
    buttonStyle: {
      type: Object,
      default: function () {
        return null
      }
    },
    columnStyle: {
      type: Object,
      default: function () {
        return null
      }
    },
    postfix: {
      type: Object,
      default: function () {
        return null
      }
    },
    disableLoading: {
      type: Boolean,
      default: false
    },
    smallPage: {
      type: Boolean,
      default: false
    },
    internalRuleId: String,
  },
  mixins: [directives],
  components: {
    coreIndex,
    dialogImg,
  },
  data(){
    return {
      domTimer: '',
      scrollTimer: '',
      userInfo: null,
      guid: '',
      pageNo: 1,
      customSummaryOptionHeight: 0,
      searchObj: {},
      wrapperWidth: 0,
      tableWidth: 0,
      fixedState: false,
      tableHeaderObserver: null,
      //select选择器数据
      removalList: [],
      selectLoading: false,
      selectOptionTempList: [],
      selectOptionObj: {},
      selectOptionList: [],
      //级联选择器数据
      cascaderOptions: [],
      cascaderOptionList: [],
      cascaderOptionObj: {},
      //内容宽度自动计算
      resetContentWidthTimer: null,
      resetContentWidthList: [],
      contentWidthList: [],
      useMiddleValueList: [],
      contentTitleWidthList: [],
      useMiddleValue: false,
      layerTableWidth: 0,
      //列宽度
      columnWidth: {},

      // 自动列宽度
      constantWidth: constant.tableComponentWidth,

      headerWidthTimerList: [],

      restaurants: [],

      //自适应图片弹框
      // msgBoxImgLoading: true,
      // msgBoxImgWidth: 200,
      // msgBoxImgHeight: 100,

      pickerOptionsTimer: '',

      defaultRowStyle: {
        'border-spacing': '5px',
      },

      rowClickTimer: '',
      rowDblclickSwitch: false,
      rowDblclickRow: null,

      fixedTimer: '',

      //动态内容
      dynaContentCellConfigs: [],

      //列控制器
      userSwitchKey: '',
      tableColumnSwitch: null,
      showColList: [],
      columnSwitchBaseKey: '',


    }
  },
  // directives: {
    // 'button-width': {
    //   inserted(el, binding, vnode) {
    //     const that = vnode.context
    //     const num = binding.value.component ? binding.value.component.length : 0
    //     if (num > 1 && el.clientHeight > 60) {
    //       that.$set(that.columnWidth, binding.value.prop, Math.ceil(num / 2) * 60 + 25 + 'px')
    //     }
    //   }
    // },
    // 'auto-tran': {
    //   inserted(el, binding, vnode) {
    //     const that = vnode.context
    //     clearTimeout(that.headerWidthTimerList[binding.value.index])
    //     that.headerWidthTimerList[binding.value.index] = setTimeout(_ => {
    //       const _width = binding.value.isComponent
    //         ? parseInt(that.columnWidth[binding.value.prop])
    //         : el.clientWidth + 20
    //       that.headerWidthList.splice(binding.value.index, 1, Object.assign(binding.value, {_width}))
    //     }, 20)
    //   }
    // },
    // 'content-set': {
    //   inserted(el, binding, vnode) {
    //     const contentSet = binding.value.config._cellConfig
    //       ?binding.value.config._cellConfig.contentSet || ''
    //       :''
    //     if(contentSet){
    //       const state = contentSet.state || {}, that = vnode.context, style = contentSet.style || {}
    //       for(const k in state){
    //         if(state.hasOwnProperty(k)){
    //           for(const i in style){
    //             if(style.hasOwnProperty(i)){
    //               el.style[i] = evil(style[i].replace(k,searchVal([state[k]],binding.value.row,that.setRowChain,that.tableData[that.dataName],false,that.setTempData)[0]))
    //             }
    //           }
    //         }
    //       }
    //     }
    //   },
    // },
    // gettablewidth:{
    //   inserted(el, binding, vnode) {
    //     vnode.context.layerTableWidth = el.offsetWidth
    //   }
    // },
    // 'reset-content-width':{
    //   inserted(el, binding, vnode) {
    //     //console.log(binding.value)
    //     const that = vnode.context,val = binding.value;
    //     if(!that.resetContentWidthList[val.index]){
    //       that.$set(that.resetContentWidthList,val.index,[])
    //       that.$set(that.contentWidthList,val.index,null)
    //       that.$set(that.useMiddleValueList,val.index,false)
    //       that.$set(that.contentTitleWidthList,val.index,0)
    //     }
    //     !that.resetContentWidthList[val.index][val.rowIndex] && that.$set(that.resetContentWidthList[val.index],val.rowIndex,[])
    //     !that.resetContentWidthList[val.index][val.rowIndex][val.cIndex] && that.$set(that.resetContentWidthList[val.index][val.rowIndex],val.cIndex,0)
    //     that.resetContentWidthList[val.index][val.rowIndex][val.cIndex] += el.offsetWidth
    //     if(val.isTitle){
    //       el.offsetWidth>that.contentTitleWidthList[val.index]
    //         ?(that.contentTitleWidthList[val.index] = el.offsetWidth)
    //         :''
    //     }
    //   }
    // },
    // 'reset-text-width': {
    //   inserted(el, binding, vnode) {
    //     //console.log(el.offsetWidth,el.innerHTML,el.parentNode.style.width)
    //   }
    // },
    // 'reset-checkbox': {
    //   inserted(el, binding, vnode) {
    //     console.log(el,binding)
    //   }
    // },
    // 'custom-table-switch': {
    //   inserted(el, binding, vnode) {
    //     if(binding.value.showSwitch){
    //       const that = vnode.context, targetEl = el.parentNode.parentNode
    //       that.createTableSwitch(targetEl,binding.value)
    //     }
    //   }
    // },
  // },
  created(){
    this.userInfo = this.$storage.get('userInfo')
    this.userSwitchKey =  'coustomTableColumnSwitch' + this.userInfo.userId
    if(this.layer) {
      this.columnSwitchBaseKey = this.tableSwitchBaseKey
    }
    //console.log(this.setSortableConfig['default-sort'])
    //console.log(this.resetContentWidthList.length,'created')
    // console.log(this.layerConfig.postfix,'created')
  },
  mounted(){
    this.setColumnState()
    //console.log(this.resetContentWidthList.length,'mounted')
  },
  // beforeUpdate(){
  //   //console.log(this.resetContentWidthList.length,'beforeUpdate')
  // },
  beforeDestroy(){
    if(this.tableHeaderObserver){
      this.tableHeaderObserver.disconnect()
      this.tableHeaderObserver.takeRecords()
    }
    clearTimeout(this.fixedTimer)
    clearTimeout(this.scrollTimer)
    clearTimeout(this.rowClickTimer)
    clearInterval(this.domTimer)
    this.removalVarListTimer && clearInterval(this.removalVarListTimer)
    this.setScrollWidthTimer && clearTimeout(this.setScrollWidthTimer)
  },
  computed:{
    layerConfig() {
      return this.tableConfigList?this.tableConfigList[this.layer]||{}:{}
    },
    setWidthDiffValue(){
      return this.layerConfig.widthDiffValue || this.widthDiffValue
    },
    setButtonStyle(){
      return this.layerConfig.buttonStyle || this.buttonStyle
    },
    setColumnStyle(){
      return this.layerConfig.columnStyle || this.columnStyle
    },
    setPostfix(){
      return this.layerConfig.postfix || this.postfix
    },
    setHeaderRowStyle(){
      return this.layerConfig.headerStyle || this.headerStyle || {}
    },
    maxLayer() {
      return this.tableConfigList.length || (this.layer + 1)
    },
    setRowStyle(){
      return this.layerConfig.rowStyle || this.rowStyle || {}
    },
    setTempData() {
      return this.layerConfig.tempData || this.tempData
    },
    setApiObj() {
      return this.layerConfig.apiObj || this.apiObj
    },
    setDynamicValue() {
      return this.layerConfig.dynamicValue || this.dynamicValue
    },
    setKeyMapping() {
      return this.layerConfig.keyMapping || this.keyMapping
    },
    setPrecision() {
      return this.layerConfig.precision || this.precision
    },
    setComponentId() {
      return this.layerConfig.componentId || this.componentId
    },
    setFixedState() {
      if (this.maxLayer === (this.layer + 1) && this.fixedState) {
        return true
      } else {
        return false
      }
    },
    setLeftFixed(){
      return this.layerConfig.leftFixed || this.leftFixed
    },
    setRightFixed(){
      return this.layerConfig.rightFixed || this.rightFixed
    },
    setIsSingle() {
      return this.layerConfig.isSingle || this.isSingle
    },
    setGlobalSingle() {
      return this.layerConfig.globalSingle || this.globalSingle || false
    },
    setLayerSingle() {
      return this.layerConfig.layerSingle || this.layerSingle || false
    },
    setSortableConfig(){
      return this.layerConfig.sortableConfig || this.sortableConfig
    },
    dataName() {
      return this.layer ? 'children' : 'tableData'
    },
    setShowCheckBox() {
      return (this.tableData[this.dataName] && this.tableData[this.dataName].length) ? (this.layerConfig.showCheckBox || this.showCheckBox) : false
    },
    setShowIndex() {
      return (this.tableData[this.dataName] && this.tableData[this.dataName].length) ? (this.layerConfig.showIndex || this.showIndex) : false
    },
    setCustomColumn() {
      return this.layerConfig.customColumn || this.customColumn
    },
    setFixedList(){
      if(this.maxLayer === this.layer+1){
        const arr = this.setTitleList.map((v,i,arr)=>{
          if(i<this.setLeftFixed){
            return 'left'
          }
          if((((arr.length-1) - i)<this.setRightFixed) && !this.setDragTable){
            return 'right'
          }
          return false
        })
        //console.log(this.wrapperWidth , this.tableWidth)
        if(this.wrapperWidth < this.tableWidth){
          arr[0] = 'left'
          arr[arr.length-1] = this.setDragTable?false:'right'
        }
        arr.findIndex(v=>{
          return v === 'left' || v === 'right'
        })>-1
          ?(this.fixedState = true)
          :(this.fixedState = false)
        //console.log(arr)
        return arr || []
      }else {
        return []
      }
    },
    ruleForm() {
      return {
        tableData: this.tableData[this.dataName]
      }

      // if(this.tableData[this.dataName] && this.tableData[this.dataName].length && this.$refs.baseTable){
      //   return {
      //     tableData: this.$refs.baseTable.tableData
      //   }
      // }else {
      //   return {
      //     tableData: []
      //   }
      // }
    },
    setColumnGlobalStyle() {
      return this.layerConfig.columnGlobalStyle || this.columnGlobalStyle || false
    },
    setUseSummary() {
      return this.layerConfig.useSummary || this.useSummary
    },
    setCustomSummary() {
      return this.layerConfig.customSummary || this.customSummary
    },
    setSysSummary() {
      return this.setUseSummary && !this.setCustomSummary.component
    },
    setShowTableSet() {
      return this.layerConfig.showTableSet || this.showTableSet
    },
    setTableSetMode(){
      return this.layerConfig.tableSetMode || this.tableSetMode
    },
    columnSwitchKey(){
      if(typeof this.layer === 'number' && !this.layer){
        return this.columnSwitchBaseKey
      }else {
        return this.columnSwitchBaseKey + `Layer${this.layer}`
      }
    },
    setTableSwitch(){
      //console.log('setTableSwitch')
      const allList = (this.tableData.titleList || []).map(v => {
        return v.label
      })
      return this.$store.getters.switchState[this.userSwitchKey]
        ?(this.$store.getters.switchState[this.userSwitchKey][this.columnSwitchKey] || allList)
        :allList
    },
    setTitleList() {
      //console.log('setTitleList')
      return (this.tableData.titleList || []).map(v => {
        this.$set(v,'_isShow',this.setTableSwitch.includes(v.label))
        return v
      })
    },
    hasPageData() {
      let state = false
      if(this.tableData.pageData){
        for (const k in this.tableData.pageData) {
          if (this.tableData.pageData.hasOwnProperty(k)) {
            state = true
          }
        }
      }
      return state
    },
    setHidePages() {
      if(this.hasPageData) return this.layerConfig.hidePages || this.hidePages
      return true
    },
    setSmallPageHeight(){
      return this.smallPage?30:40
    },
    resetHeight() {
      return this.checkedViewHeight + this.customSummaryOptionHeight + (this.setHidePages?0:this.setSmallPageHeight)
    },
    setTableHeight() {
      if (!this.layer) {
        return 'calc(100% - ' + this.resetHeight + 'px)'
      } else {
        return ''
      }
    },
    setColumnWidth() {
      return this.columnWidth
    },
    setColConfigs() {
      if (this.tableData.titleList) {
        if (this.setShowTableSet && this.setTableSetMode==='outside') {
          return this.tableData.titleList.map(v => {
            v._isShow = this.showColList
              ? this.showColList.findIndex(cv => {
                return cv === v.label
              }) > -1
                ? true
                : false
              : true
            // console.log(v)
            return v
          })
        }
      } else {
        return []
      }
    },
    computedKeys() {
      const tempArr = []
      this.setCustomColumn.forEach(v => {
        v.componentName && (v.componentName === 'input' || v.componentName === 'select') && v._cellConfig && v._cellConfig.compute && tempArr.push(v)
      })
      return tempArr
    },
    dynaContentKeys(){
      const tempArr = []
      this.setCustomColumn.forEach(v => {
        v.componentName && v.componentName === 'dynaContent' && v._cellConfig && tempArr.push(v)
      })
      return tempArr
    },

    computedDateKeys() {
      const tempArr = []
      this.setCustomColumn.forEach(v => {
        v.componentName && v.componentName === 'date' && v._cellConfig && v._cellConfig.compute && tempArr.push(v)
      })
      return tempArr
    },
    createSelectOptions() {
      this.tableData[this.dataName].forEach((v, index) => {
        this.setCustomColumn.forEach(cv => {
          if (cv.componentName && cv.componentName === 'select' && cv._cellConfig) {
            !this.selectOptionTempList[index] && this.$set(this.selectOptionTempList, index, {})
            if (cv._cellConfig.asyn && cv._cellConfig.asyn.apiName) {
              this.selectOptionTempList[index][cv.prop || cv.columnIndex]
                ? ''
                : this.$set(this.selectOptionTempList[index], cv.prop || cv.columnIndex, [])
              // this.getSelectOptions(v,index,k)
            } else if (cv._cellConfig.options) {
              // tempObj[cv.columnIndex] = cv._cellConfig.options.length?cv._cellConfig.options:[]
              this.selectOptionTempList[index][cv.prop || cv.columnIndex]
                ? ''
                : this.$set(this.selectOptionTempList[index], cv.prop || cv.columnIndex, cv._cellConfig.options)
            }
          }
        })
      })
      //console.log(this.selectOptionTempList)
      return this.selectOptionTempList
    },
    createCascaderOptions() {
      this.tableData[this.dataName].forEach((v, index) => {
        this.setCustomColumn.forEach(cv => {
          if (cv.componentName && cv.componentName === 'cascader' && cv._cellConfig) {
            !this.cascaderOptions[index] && this.$set(this.cascaderOptions, index, {})
            if (cv._cellConfig.asyn && cv._cellConfig.asyn.apiName) {
              this.cascaderOptions[index][cv.prop || cv.columnIndex]
                ? ''
                : this.$set(this.cascaderOptions[index], cv.prop || cv.columnIndex, [])
            } else if (cv._cellConfig.options) {
              this.cascaderOptions[index][cv.prop || cv.columnIndex]
                ? ''
                : this.$set(this.cascaderOptions[index], cv.prop || cv.columnIndex, cv._cellConfig.options)
            }
          }
        })
      })
      //console.log(this.cascaderOptions)
      return this.cascaderOptions
    },
    setMiddleValue() {
      return this.useMiddleValueList.map((v,i) => {
        if(!v) return {
          title: {},
          body: {}
        }
        return {
          title: {
            display: 'inline-block',
            'vertical-align': 'middle',
          },
          body: {
            width: this.contentWidthList[i] - this.contentTitleWidthList[i] - 26 + 'px',
            display: 'inline-block',
            'white-space': 'normal',
            'vertical-align': 'middle',
          },
        }
      })
    },
    setDragTable(){
      //return (this.tableData[this.dataName] && this.tableData[this.dataName].length)?(this.layerConfig.dragTable || this.dragTable || false):false
      if(this.maxLayer === (this.layer + 1)){
        //穿梭框BUG
        // return (this.tableData[this.dataName] && this.tableData[this.dataName].length)?(this.layerConfig.dragTable || this.dragTable || false):false
        return this.layerConfig.dragTable || this.dragTable || false
      }else {
        return false
      }
    },
    setEntireRowDrag(){
      return this.layerConfig.entireRowDrag || this.entireRowDrag
    },
    setRowChain() {
      return this.layer ? this.rowChain.concat(this.parentData) : []
    },
    setGuid(){
      return this.layer?this.internalGuid:this.guid
    },
    setTableColumnState(){
      return this.setShowTableSet && this.setTableSetMode === 'inline'
    },
    getTableRuleList(){
      return !this.layer ? this.$store.getters[this.guid + '/tableRuleList'] : null
    },
    getTableRuleStr(){
      return !this.layer ? this.$store.getters[this.guid + '/tableRuleStr'] : null
    },
  },
  methods:{
    //初始化列展开收起
    setColumnState(){
      if(typeof this.layer === 'number' && !this.layer){
        this.columnSwitchBaseKey = this.$el.dataset.customTableId
      }
    },
    //动态单元格内容功能
    createDynaCascaderOptions(_key,childColconfig,scope,config){
      const optionsKey = config.componentName === 'cascader'?'cascaderOptions':'selectOptionTempList'
      if(config.componentName === 'select' && !config._cellConfig.multiple){
        scope.row[_key] && (scope.row[_key] = '')
      }else {
        scope.row[_key] && (scope.row[_key] = [])
      }
      !this[optionsKey][scope.$index] && this.$set(this[optionsKey],scope.$index,{})
      !this[optionsKey][scope.$index][_key] && this.$set(this[optionsKey][scope.$index],_key,[])
      if(childColconfig._cellConfig.options && childColconfig._cellConfig.options.length){
        this[optionsKey][scope.$index][_key] = childColconfig._cellConfig.options
      }
      //console.log(this[optionsKey],'createDynaCascaderOptions')
    },
    //阻止冒泡
    clickStop(e){
      e.stopPropagation()
      return false
    },
    //收起行
    narrowRow(row){
      //console.log(row)
      this.$refs.baseTable.toggleRowExpansion && this.$refs.baseTable.toggleRowExpansion(row,false)
    },
    //行点击功能
    rowClick(row, event, column={}){
      // console.log(this.maxLayer, this.setExpand,row, event)
      if(this.maxLayer>1 && this.setExpand && this.setExpandColumnWidth !== '1'){
        if(!this.tableConfigList[this.layer+1].apiObj && (row.children && !row.children.length)) return false
        clearTimeout(this.rowClickTimer)
        this.rowClickTimer = setTimeout(_=>{
          //console.log(row, event, column)
          if(column && column.label) {
            const item = this.setTitleList.find(v => {
              return v.label === column.label
            })
            if (item && item.component) return false
            //展开或者收起
            this.$refs.baseTable.toggleRowExpansion && this.$refs.baseTable.toggleRowExpansion(row)
          }else {
            if(column.type === "expand" || column.type === "selection") return false
            //展开或者收起
            this.$refs.baseTable.toggleRowExpansion && this.$refs.baseTable.toggleRowExpansion(row)
          }
        },500)
      }
    },
    rowDblclick(row){
      clearTimeout(this.rowClickTimer)
      if(this.setShowCheckBox){
        if((this.setIsSingle || this.setGlobalSingle || this.setLayerSingle) && row.rowState === '0') return false
        this.rowDblclickSwitch = true
        this.rowDblclickRow = row
        this.$refs.baseTable.toggleRowSelection && this.$refs.baseTable.toggleRowSelection(row)
        // console.log('rowDblclick',this.tableData,row)
        // this.$refs.baseTable.$emit('select',[],row)

        // this.selectItem()
      }
    },
    selectionChange(selection){
      //console.log(selection,'selectionChange')
      if(this.rowDblclickSwitch){
        this.$refs.baseTable.$emit('select',selection,this.rowDblclickRow)
        this.rowDblclickSwitch = false
        this.rowDblclickRow = null
      }
    },
    createTableSwitch(targetEl,params){
      if(!targetEl) return
      const that = this
      const switchComponent = new customTableSwitchComponent({
        propsData:{
          showSwitch: params.showSwitch,
          columnData: params.config,
          columnIndex: params.index,
        },
      })
      switchComponent.$on('change-column',function (index) {
        that.resetColumnState(index)
      })
      targetEl.appendChild(switchComponent.$mount().$el)
    },
    resetColumnState(index){
      const label = this.tableData.titleList[index].label
      let tempArr = this.setTableSwitch.slice(0)
      ;tempArr.includes(label)
        ?(tempArr = tempArr.filter(v=>{
          return v !== label
        }))
        :(tempArr.push(label))
      this.$store.commit('UPDATE_SWITCHSTATE', {
        userSwitchKey: this.userSwitchKey,
        columnSwitchKey: this.columnSwitchKey,
        list:tempArr
      })
      this.$nextTick(_ => {
        this.$refs.baseTable.doLayout()
      })
      this.initLoading = false
    },
    isEllipsis (content, contentWidth) {
      //console.log(content, contentWidth)
      let el = document.createElement('div'),elWidth;
      el.innerHTML = content
      el.style.whiteSpace = 'nowrap'
      el.style.position = 'absolute'
      el.style.opacity = 0
      document.body.appendChild(el)
      elWidth = el.clientWidth
      document.body.removeChild(el)
      return elWidth >= contentWidth * 2
    },
    callTableFn(params){
      let result = null
      const fnName = params[0],data = params[1]
      // console.log(fnName,...data)
      result = this[fnName](...data)
      //result
      return '123'
    },
    setFixed() {
      const that = this
      that.$refs.baseTable && that.$refs.baseTable.$nextTick && that.$refs.baseTable.$nextTick(() => {
        if(that.$refs.baseTable){
          clearTimeout(that.fixedTimer)
          that.fixedTimer = setTimeout(function () {
            const theadEl = that.$refs.baseTable.$el
              ?that.$refs.baseTable.$el.querySelectorAll('.el-table__header')[0]
              :that.$el.querySelectorAll('.el-table__header')[0]
            that.wrapperWidth = that.$el.clientWidth
            if(theadEl){
              that.tableHeaderObserver = new MutationObserver(that.getTableHeaderWidth)
              that.tableHeaderObserver.observe(theadEl, {
                attributes: true,
                subtree: false,
              })
            }
          }, 10)
        }
      })
    },
    getTableHeaderWidth(mutations, observer){
      if(mutations[0] && mutations[0].target){
        this.tableWidth = mutations[0].target.clientWidth
      }
    },
    indexMethod(index) {
      return index + 1
    },
    baseRules(index,row,config) {
      //console.log(index,row,this.ruleForm)
      if(config._cellConfig && config._cellConfig.rules && config._cellConfig.rules.length){
        //console.log(config._cellConfig,'config._cellConfig')
        return this.initRowRules(config._cellConfig, row, config)
      }else {
        return []
      }
      // this.tableData[this.dataName].forEach((row, index) => {
      //   const rules = {}
      //   this.setCustomColumn.forEach(v => {
      //     if (v._cellConfig && v._cellConfig.rules && v._cellConfig.rules.length) {
      //       rules[v.columnIndex] = this.initRowRules(v._cellConfig, row, v)
      //     }
      //   })
      //   tempArr.push(rules)
      // })
      // console.log(tempArr)
    },
    initRowRules(obj, row, colConfig) {
      const tempArr = []
      obj.rules.forEach((item, index) => {
        let validator = null
        index === 0 && tempArr.push({required: true, message: '请输入内容', trigger: 'blur'})
        item.required === false && (tempArr[0].required = item.required)
        item.type && tempArr.push({
          pattern: new RegExp(regexp[item.type].replace(/placeholder/g, '0,'), 'g'),
          message: obj.message[index] || '',
          trigger: 'blur'
        })
        item.regexp && tempArr.push({pattern: item.regexp, message: obj.message[index] || '', trigger: 'blur'})
        if (item.min || item.max) {
          tempArr.push({min: item.min || 0, max: item.max || '', message: obj.message[index] || '', trigger: 'blur'})
        }
        if (item.greaterThan || item.lessThan) {
          validator = createRules(item.greaterThan ? item : null, item.lessThan ? item : null, item.type, '', row, [], colConfig._cellConfig.message, colConfig._cellConfig.rules, this.tableData[this.dataName], this.setTempData, index)
        }
        if (validator) {
          validator.forEach(v => {
            tempArr.push(v)
          })
        }
      })
      //console.log(tempArr,'initRowRules')
      return tempArr
    },
    setTagState(index,row,config) {
      const stateConstant = ['success', 'info', 'warning', 'danger', 'default']
      const stateCode = row[config.prop || config.columnIndex]
      //console.log(stateCode,'setTagState',config)
      for (const k in config._cellConfig) {
        if (config._cellConfig.hasOwnProperty(k)) {
          if (parseInt(stateCode) == parseInt(config._cellConfig[k].state)) {
            return {
              type: stateConstant.indexOf(k) > -1 ? k : '',
              text: config._cellConfig[k].text,
              color: config._cellConfig[k].color || '',
            }
          }
        }
      }
      return {
        type: '',
        text: '',
        color: '',
      }
    },
    setButtonState(index,row,item) {
      return computeState(item.rowState,row,this)
    },
    // computeButtonState(str,row){
    //   let resultStr = str
    //   str && (str.match(/#[A-Za-z0-9_@]+#/g)|| []).map(v => {
    //     return searchVal([v.replace(/#/g,'')],row,this.setRowChain,this.tableData[this.dataName],false,this.setTempData)[0]
    //   }).forEach(rv => {
    //     resultStr = resultStr.replace(/#[A-Za-z0-9_@]+#/,isFloat(rv)?rv:`"${rv}"`)
    //   })
    //   try{
    //     return evil(resultStr)
    //   }catch (err){
    //     // console.log(err)
    //     return false
    //   }
    // },
    getSelectOptions(row, colConfig, index) {
      //console.log(row, colConfig, index,this.selectOptionTempList[index])
      if (colConfig._cellConfig && colConfig._cellConfig.asyn) {
        if (this.httpRemoval(row, colConfig, index, this.removalList)) {
          this.selectLoading = true
          this.$api[colConfig._cellConfig.asyn.apiName](this.setParams(row, colConfig)).then(res => {
            this.selectLoading = false
            this.selectOptionTempList[index][colConfig.prop] = res.result.options
            this.selectOptionObj[colConfig._cellConfig.asyn.apiName] = res.result.options
          }).catch(err => {
            console.log(err)
          })
        } else {
          this.selectOptionTempList[index][colConfig.prop] = this.selectOptionObj[colConfig._cellConfig.asyn.apiName]
        }
      }
    },

    getCascaderOptions(row, colConfig, index) {
      //console.log(row, colConfig, index)
      if (colConfig._cellConfig && colConfig._cellConfig.asyn && !colConfig._cellConfig.options) {
        if (this.httpRemoval(row, colConfig, index, this.cascaderOptionList)) {
          this.$api[colConfig._cellConfig.asyn.apiName](this.setParams(row, colConfig)).then(res => {
            this.cascaderOptions[index][colConfig.prop] = res.result.options
            this.cascaderOptionObj[colConfig._cellConfig.asyn.apiName] = res.result.options
          }).catch(err => {
            console.log(err)
          })
        } else {
          this.cascaderOptions[index][colConfig.prop] = this.cascaderOptionObj[colConfig._cellConfig.asyn.apiName]
        }
      }
    },
    cascaderActiveItemChange(list) {
      // console.log(list)
    },
    setParams(row, colConfig) {
      const tempObj = Object.assign({}, colConfig._cellConfig ? colConfig._cellConfig.asyn.params : colConfig.params)
      for (const k in tempObj) {
        if (tempObj.hasOwnProperty(k) && !tempObj[k]) {
          tempObj[k] = row[k] || ''
        }
      }
      // console.log(Object.assign({},tempObj))
      return Object.assign({}, tempObj)
    },
    httpRemoval(row, colConfig, index, list) {
      let state = false
      if (!list.length) {
        const obj = {
          apiName: colConfig._cellConfig.asyn.apiName,
          params: this.setParams(row, colConfig),
          timeStamp: new Date().getTime()
        }
        list.push(obj)
        state = true
      } else {
        const tempObj = this.setParams(row, colConfig)
        let item = ''
        item = list.find(v => {
          if (v.apiName === colConfig._cellConfig.asyn.apiName) {
            if ((new Date().getTime() - v.timeStamp) > 30000) {
              v.timeStamp = new Date().getTime()
              v.params = tempObj
              state = true
              return true
            } else {
              for (const k in v.params) {
                if (v.params.hasOwnProperty(k)) {
                  if (v.params[k] !== tempObj[k]) {
                    v.timeStamp = new Date().getTime()
                    v.params = tempObj
                    state = true
                    return true
                  }
                }
              }
            }
          }
        })
        if (!state && list.findIndex(v => {
            return v.apiName === colConfig._cellConfig.asyn.apiName
          }) === -1) {
          list.push({
            apiName: colConfig._cellConfig.asyn.apiName,
            params: this.setParams(row, colConfig),
            timeStamp: new Date().getTime()
          })
          state = true
        }
      }
      return state
    },
    sortChange(column, prop, order){
      this.resetTableComponentData()
    },
    resetTableComponentData(){
      this.cascaderOptions.forEach(v=>{
        v = {}
      })
      this.selectOptionTempList.forEach(v=>{
        v = {}
      })
      this.removalList = []
      this.selectOptionObj = {}
      this.cascaderOptionList = []
      this.cascaderOptionObj = {}
    },
    selectable(row, index) {
      return row.rowState === '1'
    },
    querySearchAsync(row, colConfig) {
      return (queryString, cb) => {
        const apiObj = colConfig._cellConfig.asyn || null
        apiObj && this.$api[apiObj.apiName](apiObj.params).then(res => {
          this.restaurants = res.result.options || []
          const results = queryString ? this.restaurants.filter(this.createStateFilter(queryString, row, colConfig)) : this.restaurants
          cb(results)
        }).catch(err => {
          console.log(err)
        })
      }
    },
    createStateFilter(queryString, row, colConfig) {
      return (state) => {
        return (state[colConfig._cellConfig.valueKey ? colConfig._cellConfig.valueKey : 'name'].toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
    },
    setTableCheckBoxDisplay() {
      //console.log(this.setIsSingle , this.setGlobalSingle , this.setLayerSingle , this.setShowCheckBox)
      if ((this.setIsSingle || this.setGlobalSingle || this.setLayerSingle) && this.setShowCheckBox) {
        if(this.$refs.baseTable && this.$refs.baseTable.$el){
          this.$refs.baseTable.$nextTick(_=>{
            const elList = this.$refs.baseTable.$el.querySelectorAll('.el-table__header')
            //console.log(elList)
            elList.forEach(item => {
              const el = item.querySelector('.el-checkbox')
              // console.log('1',item)
              el && (el.style.display = 'none')
            })


            // clearTimeout(this.domTimer)
            // this.domTimer = setTimeout(_=>{
            //   const elList = this.$refs.baseTable.$el.querySelectorAll('.el-table__header')
            //   //console.log(elList)
            //   elList.forEach(item => {
            //     const el = item.querySelector('.el-checkbox')
            //     // console.log('1',item)
            //     el && (el.style.display = 'none')
            //   })
            // },10)
          })
        }else {
          clearInterval(this.domTimer)
          this.domTimer = setInterval(() => {
            if(this.$refs.baseTable && this.$refs.baseTable.$nextTick){
              clearInterval(this.domTimer)
              this.$refs.baseTable.$nextTick(_=>{
                const elList = this.$refs.baseTable.$el.querySelectorAll('.el-table__header')
                elList.forEach(item => {
                  const el = item.querySelector('.el-checkbox')
                  //console.log('2',el)
                  el && (el.style.display = 'none')
                })
              })
            }
          }, 100)
        }
      }
    },
    scrollTable(){
      clearTimeout(this.scrollTimer)
      this.scrollTimer = setTimeout(_ => {
        const rootEl = this.$refs.baseTable.$el
        let bodyEl = rootEl?rootEl.querySelector('.el-table__body-wrapper'):null
        let fixedEl = rootEl?rootEl.querySelector('.el-table__body-wrapper'):null
        if(bodyEl && (bodyEl.scrollTop > 0)) scrollToTop(bodyEl)
        if(fixedEl && (fixedEl.scrollTop > 0)) scrollToTop(fixedEl)
      })
    },
    componentMethod(row,index,config){
      config && config._cellConfig && config._cellConfig.methodName && this.$emit('callmethod',{
        methodName: config._cellConfig.methodName,
        params: {row,index}
      })
    },
    customSummaryValue(value) {
      this.$emit('custom-summary-value', value)
    },
    btnAuthority() {
      const params = {
        menuId: this.$storage.get('menuId'),
        roleId: this.$storage.get('userInfo').roleIds
      }
      this.$api['initMenuButtons'](params).then(res => {
        console.log(res)
      }).catch(err => {
        console.log(err)
      })
    },
    rowSelectChange(val) {
      if (val) {
        val.config._cellConfig && val.config._cellConfig.outputData && this.$emit('databridge', val)
        // val.item._formula = 'P=N*10.5' // 测试用
        if (val.config._cellConfig && val.config._cellConfig.formulaName) {
          this.replaceFormula(val)
          this.computedCell(val.row,val.config)
          // console.log(JSON.stringify(val.row))
          // console.log(val.row.progress)
          // console.log(JSON.stringify(this.tableData.tableData[0].progress))
          // console.log(JSON.stringify(this.data.result.varList[0].progress))
        }
      }
    },
    replaceFormula(val) {
      let tempStr = val.item[val.config._cellConfig.formulaName]
      if(tempStr){
        for (const k in this.setKeyMapping.resultKey) {
          if (this.setKeyMapping.resultKey.hasOwnProperty(k)) {
            tempStr = tempStr.replace(new RegExp(k), this.setKeyMapping.resultKey[k])
          }
        }
        for (const k in this.setKeyMapping.variableKey) {
          if (this.setKeyMapping.variableKey.hasOwnProperty(k)) {
            tempStr = tempStr.replace(new RegExp('(?<![A-Za-z0-9_])' + k + '(?![A-Za-z0-9_])', 'g'), val.row[this.setKeyMapping.variableKey[k]])
          }
        }
        const tempArr = tempStr.split('=')
        val.row[tempArr[0]] = evil(tempArr[1])
      }
    },
    computedCell(row, config,index) {
      //console.log(this)
      // if (!this.computedKeys.length) {
      //   return false
      // }
      this.computedKeys.forEach(v => {
        //console.log(config.columnIndex,v)
        if((config.prop || config.columnIndex) !== (v.prop || v.columnIndex)){
          const cList = v._cellConfig.compute.split(/\([\\+|\-|\\*|\\/]\)/)
          let value
          if (cList.length > 1) {
            value = getVal(cList, row, this.setRowChain, this.tableData[this.dataName], v._cellConfig.compute, this.setTempData)
          }else {
            value = searchVal(cList, row, this.setRowChain, this.tableData[this.dataName], '', this.setTempData)[0]
          }

          if((typeof value === 'string' && isNumber(value)) || (typeof value === 'number' && !Number.isNaN(value))){
            row[v.prop || v.columnIndex] = parseFloat(value).toFixed(v._cellConfig.precision || this.setPrecision)
          }else {
            row[v.prop || v.columnIndex] = value
          }
        }
      })
      this.dynaContentCell(row, config,index)
    },

    dynaContentCell(row, config,index){
      this.dynaContentKeys.forEach(v => {

        if(v._cellConfig.compute){
          const cList = v._cellConfig.compute.split(/\([\\+|\-|\\*|\\/]\)/)
          let value
          if (cList.length > 1) {
            value = getVal(cList, row, this.setRowChain, this.tableData[this.dataName], v._cellConfig.compute, this.setTempData)
          }else {
            value = searchVal(cList, row, this.setRowChain, this.tableData[this.dataName], '', this.setTempData)[0]
          }
          if((typeof value === 'string' && isNumber(value)) || (typeof value === 'number' && !Number.isNaN(value))){
            row[v.prop || v.columnIndex] = parseFloat(value).toFixed(v._cellConfig.precision || this.setPrecision)
          }else {
            row[v.prop || v.columnIndex] = value
          }
          //console.log(row[v.prop || v.columnIndex])
        }
        if(!this.dynaContentCellConfigs[index]) {
          let _index = 0
          // this.$set(this.dynaContentCellConfigs,index,{})
          while (index >= _index){
            if(!this.dynaContentCellConfigs[_index]){
              this.dynaContentCellConfigs.splice(_index,0,{})
            }
            _index++
          }
        }
        if(!this.dynaContentCellConfigs[index][v.prop || v.columnIndex]) {
          this.$set(this.dynaContentCellConfigs[index],v.prop || v.columnIndex,null)
        }
        this.dynaContentCellConfigs[index][v.prop || v.columnIndex] = this.createDynaContentConfig(row, v,index)
      })
    },

    createDynaContentConfig(row, config,index){
      //console.log(config.componentName)
      const keyList = Object.keys(config._cellConfig)
      let configIndex,baseNum
      if(keyList.includes('states') && keyList.includes('contentConfigs')){
        // baseNum = parseFloat(row[config.prop || config.columnIndex] || 0)
        baseNum = this.setDynaContentData(row,config)
        if(typeof config._cellConfig.states === 'number'){
          baseNum < config._cellConfig.states?(configIndex = 0):''
          baseNum === config._cellConfig.states?(configIndex = 1):''
          baseNum > config._cellConfig.states?(configIndex = 2):''
        }else if(typeof config._cellConfig.states === 'string'){
          const cList = config._cellConfig.states.split(/\([\\+|\-|\\*|\\/]\)/)
          let value
          if (cList.length > 1) {
            value = getVal(cList, row, this.setRowChain, this.tableData[this.dataName], config._cellConfig.states, this.setTempData)
          }else {
            value = searchVal(cList, row, this.setRowChain, this.tableData[this.dataName], '', this.setTempData)[0]
          }
          if((typeof value === 'string' && isNumber(value)) || (typeof value === 'number' && !Number.isNaN(value))){
            value = parseFloat(value).toFixed(config._cellConfig.precision || this.setPrecision) - 0
          }else {
            value = constant._infinity
          }
          //console.log(baseNum,value)
          baseNum < value?(configIndex = 0):''
          baseNum === value?(configIndex = 1):''
          baseNum > value?(configIndex = 2):''
        }else if(Array.isArray(config._cellConfig.states)){
          configIndex = config._cellConfig.states.map(v=>{
            return computeState(v,row,this)
          }).findIndex(fv=>{
            return fv === true
          })
        }
        return config._cellConfig.contentConfigs[configIndex]
          ?Object.assign({},{columnIndex:config.prop||config.columnIndex},config._cellConfig.contentConfigs[configIndex],)
          :null
      }
      return null
    },
    setDynaContentData(row,config){
      const result = row[config.prop || config.columnIndex]
      const resType = typeof result
      //console.log(result,resType)
      let tempResult
      switch (resType){
        case 'string':
          !result && (tempResult = 0)
          isNumber(result) && (tempResult = parseFloat(result))
          !isNumber(result) && (tempResult = dateTool.timeStamp(result))
          break;
        default:
          tempResult = result
          break;
      }
      //console.log(tempResult)
      return tempResult
    },

    //上传功能
    handleExceed(config) {
      return (files, fileList) => {
        this.$message.warning(`当前限制选择 ${config._cellConfig.limit} 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
      }
    },
    handlePreview(file) {
      file.url && this.$alert(`<div style="text-align: center"><img src="${file.url}"></div>`, '', {
        dangerouslyUseHTMLString: true
      });
    },
    handleError(err, file, fileList) {
      this.$message.error(`${file.name}上传失败`)
    },
    handleSuccess(response, file, fileList) {
      this.$message({
        message: `${file.name}上传成功`,
        type: 'success'
      })
    },
    setProgressColor(rgb,index){
      if(!rgb || rgb === 'auto') return progressGradientColor(index)
      return rgb
    },
    checkedHeight(height) {
      this.checkedViewHeight = height || 0
    },
    checkedList(list) {
      // console.log(list)
      this.$store.commit('UPDATE_SWITCHSTATE', {
        userSwitchKey: this.userSwitchKey,
        columnSwitchKey: this.columnSwitchKey,
        list
      })
      this.showColList = list
      this.$nextTick(_ => {
        this.$refs.baseTable.doLayout()
      })
      this.initLoading = false
    },
    // defaultValue(str, row, colConfig) {
    //   const start = searchVal(str ? [str] : [], row, this.setRowChain, this.tableData[this.dataName], '', this.setTempData)[0] || new Date()
    //   start.length === 1 && colConfig._cellConfig.compute && (row[colConfig.prop] = this.computeVal(colConfig._cellConfig.compute, row, colConfig.prop))
    //   start.length > 1 && (row[colConfig.prop] = start[0])
    // },
    defaultValue(str, row, colConfig) {
      if(colConfig._cellConfig && colConfig._cellConfig.compute){
        row[colConfig.prop] = this.computeVal(colConfig._cellConfig.compute, row, colConfig.prop)
        return
      }else {
        return searchVal([str], row, this.setRowChain, this.tableData[this.dataName], '', this.setTempData)[0] || new Date()
      }
    },
    computeVal(str, row, prop) {
      const cList = str.split(/\([\\+|\-|\\*|\\/]\)/)
      if (cList.length > 1) {
        const result = getVal(cList, row, this.setRowChain, this.tableData[this.dataName], str, this.setTempData)
        return dateTool.formatDate(result)
      } else {
        return row[prop]
      }
    },
    datePickerChange(row,config){
       //console.log(row)
      if (!this.computedDateKeys.length) {
        return false
      }
      this.computedDateKeys.forEach(v => {
        if((config.prop || config.columnIndex) !== (v.prop || v.columnIndex)){
          const cList = v._cellConfig.compute.split(/\([\\+|\-|\\*|\\/]\)/)
          if (cList.length > 1) {
            row[v.prop || v.columnIndex] = getVal(cList, row, this.setRowChain, this.tableData[this.dataName], v._cellConfig.compute, this.setTempData)
          }else {
            row[v.prop || v.columnIndex] = searchVal(cList, row, this.setRowChain, this.tableData[this.dataName], '', this.setTempData)[0] || null
          }
        }
      })
    },
    pickerOptions(row, colConfig) {
      // console.log(row._internalId)
      const editConfig = colConfig._cellConfig
      let start, end
      editConfig.greaterThan && (start = this.formatDates(row, colConfig.prop, editConfig.greaterThan, false))
      editConfig.lessThan && (end = this.formatDates(row, colConfig.prop, editConfig.lessThan, true))
      //console.log(start,end)
      const tempObj = {}
      tempObj.disabledDate = (time) => {
        if (start && end) {
          if (time.getTime() > start && time.getTime() < end) {
            return false
          } else {
            return true
          }
        } else if (start && !end) {
          return time.getTime() < start
        } else if (!start && end) {
          return time.getTime() > (end - (3600 * 24 * 1000))
        } else {
          return false
        }
      }
      let reStart, reEnd
      start && editConfig.greaterThan[editConfig.greaterThan.length - 1] && (reStart = start + (3600 * 24 * 1000))
      end && editConfig.lessThan[editConfig.lessThan.length - 1] && (reEnd = end - (3600 * 24 * 1000))
      editConfig.shortcuts && (tempObj.shortcuts = createShortcuts(editConfig.shortcuts, reStart, reEnd))
      //console.log(tempObj)
      return tempObj
      // clearTimeout(this.pickerOptionsTimer)
      // this.pickerOptionsTimer = setTimeout(_=>{
      //   console.log(row)
      //   const editConfig = colConfig._cellConfig
      //   let start, end
      //   editConfig.greaterThan && (start = this.formatDates(row, colConfig.prop, editConfig.greaterThan, false))
      //   editConfig.lessThan && (end = this.formatDates(row, colConfig.prop, editConfig.lessThan, true))
      //   const tempObj = {}
      //   tempObj.disabledDate = (time) => {
      //     if (start && end) {
      //       if (time.getTime() > start && time.getTime() < end) {
      //         return false
      //       } else {
      //         return true
      //       }
      //     } else if (start && !end) {
      //       return time.getTime() < start
      //     } else if (!start && end) {
      //       return time.getTime() > (end - (3600 * 24 * 1000))
      //     } else {
      //       return false
      //     }
      //   }
      //   let reStart, reEnd
      //   start && editConfig.greaterThan[editConfig.greaterThan.length - 1] && (reStart = start + (3600 * 24 * 1000))
      //   end && editConfig.lessThan[editConfig.lessThan.length - 1] && (reEnd = end - (3600 * 24 * 1000))
      //   editConfig.shortcuts && (tempObj.shortcuts = createShortcuts(editConfig.shortcuts, reStart, reEnd))
      //   console.log(tempObj)
      //   return tempObj
      // })
    },
    formatDates(row, prop, strList, state) {
      const start = searchVal(strList, row, this.setRowChain, this.tableData[this.dataName], '', this.setTempData)
      //console.log(start)
      let isEqual, result
      if (typeof start[start.length - 1] === 'boolean') {
        isEqual = start.pop()
      }
      if (state) {
        result = Math.min(...start.map(v => {
          return dateTool.timeStamp(v)
        }))
        isEqual && (result += (3600 * 24 * 1000))
      } else {
        result = Math.max(...start.map(v => {
          return dateTool.timeStamp(v)
        }))
        isEqual && (result -= (3600 * 24 * 1000))
      }
      //console.log(result)
      return result
    },
    mergeColumnEvents(cItem, scope) {
      const type = cItem._cellConfig.events.type
      if (type === 'navigation') {
        this.$router.push({path: '/' + cItem._cellConfig.events.path})
      }else if(type === 'link') {
        this.linkEvent(scope.row[cItem._cellConfig.events.path]?`${this.$baseUrl + '/' + scope.row[cItem._cellConfig.events.path]}`:cItem._cellConfig.events.path)
      }else if(type === 'file') {
        const regexp = /\w(\.gif|\.jpg|\.JGP|\.png|\.bmp)$/
        const fileName = scope.row[cItem.prop || cItem.columnIndex] || ''
        if(regexp.test(fileName)){
          const h = this.$createElement;
          this.$msgbox({
            title: '预览',
            message:  h(dialogImg,{
              props: {
                config: cItem,
                row: scope.row,
              },
              key: new Date().getTime(),
            }),
            customClass: 'resetMsgBoxStyle',
            showCancelButton: true,
            dangerouslyUseHTMLString: true,
            confirmButtonText: '下载',
            cancelButtonText: '关闭',
            beforeClose: (action, instance, done) => {
              if (action === 'confirm') {
                this.downloadFile(this.$baseUrl + '/' + scope.row[cItem._cellConfig.events.path],fileName,instance,done)
              } else {
                done();
              }
            }
          }).then(action => {

          }).catch(err => {

          });
        }else {
          this.downloadFile(this.$baseUrl + '/' + scope.row[cItem._cellConfig.events.path],fileName)
        }
      }
    },
    linkEvent(src){
      window.open(src)
    },
    downloadFile(src,name,instance,done){
      const a = document.createElement('a')
      const event = new MouseEvent('click')
      a.download = name || 'downloadfile'
      a.href = src
      a.dispatchEvent(event)
      instance && (instance.confirmButtonText = '已下载')
      done && done()
    },

    customSummaryHeight(height) {
      this.customSummaryOptionHeight = height || 0
    },

    setCellStyle(data) {
      // console.log(data)
      // const cellConfig = this.cellStyle[data.column.property]
      //console.log(data.rowIndex,data.columnIndex,data.column.realWidth,data.column.minWidth,data.column.width)
      let tempObj = {}
      if (this.setExpand) {
        if (this.maxLayer === 2 && this.setExpandColumnWidth === '1') {
          tempObj = {
            'border-bottom': 'none',
            'background-color': 'inherit'
          }
        } else {
          tempObj = {
            'background-color': 'inherit'
          }
        }
      }
      if(this.setColumnStyle){
        // const item = this.setTitleList.find(v=>{
        //   console.log(v.label,data.column.label)
        //   return v.prop === data.column.property
        // })
        // console.log(item)
        this.setColumnStyle[data.column.property] && (tempObj = Object.assign(tempObj,this.setColumnStyle[data.column.property]))
      }
      return tempObj
    },
    setHeaderCellStyle(data){
      let tempObj = {}
      if(this.setColumnStyle){
        // const item = this.setTitleList.find(v=>{
        //   return v.label === data.column.label
        // })
        // console.log(item,'setHeaderCellStyle')
        this.setColumnStyle[data.column.property] && (tempObj = Object.assign(tempObj,this.setColumnStyle[data.column.property]))
      }
      return tempObj
    },

    //拖拽
    setSort() {
      this.$nextTick(_=>{
        const el = this.$refs.baseTable.$el.querySelectorAll('.el-table__body-wrapper > table > tbody')[0]
        Sortable.create(el, {
          ghostClass: 'sortable-ghost',
          handle: this.setEntireRowDrag?'':'.theDragHandle',
          animation: 150,
          setData: function(dataTransfer) {
            dataTransfer.setData('Text', '')
          },
          onEnd: evt => {
            this.$store.commit(this.setGuid + '/SORE_CHANGE', {evt,dataName:this.dataName,dataCopy:this.tableData[this.dataName].slice(),layer:this.layer})
            // if(this.componentName === 'multilevelTable'){
            //   this.$store.commit(this.setGuid + '/SORE_CHANGE', {evt,dataName:this.dataName,dataCopy:this.tableData[this.dataName].slice(),layer:this.layer})
            // }else if(this.componentName === 'singleTable'){
            //   this.tableData.tableData.splice(evt.newIndex, 0, this.tableData.tableData.splice(evt.oldIndex, 1)[0])
            // }
            this.resetTableComponentData()
          }
        })
        // console.log(this.sortable)
      })
    },

    getData() {
      if(!this.layer){
        let htmlStr = ''
        this.$store.commit(this.setGuid + '/SET_TABLERULESTR',null)
        this.getTableRuleList.forEach(v=>{
          v.cb(v.vm)
        })
        htmlStr = this.getTableRuleStr.map(v=>{
          return `<p style="padding-left: ${v.layer*10}px;white-space: nowrap;">${v.htmlStr}</p>`
        }).join('')
        htmlStr && this.$message({
          duration: 5000,
          showClose: true,
          dangerouslyUseHTMLString: true,
          message: `${htmlStr}`,
          type: 'error',
          center: true
        })
        !htmlStr && this.$emit('databridge', this.tableData[this.dataName])
      }
    },
    //多级验证
    tableRuleForm(vm){
      vm.$refs['ruleForm'].validate((valid, keys) => {
        if (!valid) {
          let htmlStr = ''
          const keyList = Object.keys(keys)
          keyList.forEach((v, index) => {
            const msgList = v.split('.')
            let label = ''
            // console.log(this.tableData,msgList)
            msgList[2] && (label = vm.tableData.titleList.find(v => {
              if(v.mergeTitles && v.mergeTitles.length){
                let cLabel = v.mergeTitles.find(cv => {
                  return cv.prop === msgList[2]
                })
                return cLabel
              }else {
                return v.prop === msgList[2]
              }
            }))
            htmlStr += `第${parseInt(msgList[1]) + 1}行<strong> ${label ? label.label || '' : ''} </strong>${keys[v][0].message}<br/>${index === keyList.length - 1 ? '' : '<br/>'}`
          })
          vm.$store.commit(this.setGuid + '/SET_TABLERULESTR',{htmlStr:htmlStr, layer:vm.layer})
        }
      })
    },

    //外部手动更新全表数据，通用方法
    updateData(params) {
      this.pageNo = 1
      this.resetContentWidthList = []
      if(!this.layer){
        if(this.setApiObj && this.setApiObj.apiName){
          this.searchObj = params || {}
          this.httpRequests()
        }else if(params.result && params.result.varList){
          this.$store.commit(this.guid + '/SET_TABLERULELIST',{cb:null, ruleId:this.layer?this.internalRuleId:'root'})
          this.computedIds = []
          this.tempCheckedList = []
          this.$store.commit(this.guid + '/SET_TABLEDATA', {
            res: params,
            vm: this})
          this.pageId = this.$storage.get('menuId')
          this.setRowExpansion(this.tableData[this.dataName][0], true)
          this.setDragTable && this.setSort()
          this.initLoading = false
          this.scrollTable()
          this.$store.commit(this.guid + '/SET_TABLERULELIST',{cb:this.tableRuleForm, ruleId:this.layer?this.internalRuleId:'root',vm:this})
          // clearTimeout(this.scrollTimer)
          // this.scrollTimer = setTimeout(_ => {
          //   const rootEl = this.$refs.baseTable.$el
          //   rootEl.querySelector('.el-table__body-wrapper').scrollTop > 0 &&
          //   scrollToTop(rootEl.querySelector('.el-table__body-wrapper')) &&
          //   scrollToTop(rootEl.querySelector('.el-table__fixed-body-wrapper'))
          // })
        }
      }
      //测试
      // this.initLoading = true
      // // this.mergeTitle.length && (this.isLoading = true)
      // setTimeout(() => {
      //   // testData.result.varList.pop()
      //   const test = JSON.parse(JSON.stringify(testData))
      //   this.data = test
      //   if (this.data.result.varList && this.data.result.varList.length > 0) {
      //     this.data.result.varList.forEach(item => {
      //       item['rowState'] = '1'
      //     })
      //   }
      //   this.pageId = this.$storage.get('menuId')
      //   // this.baseRules = this.createRult(this.customColumn)
      //   // this.ruleForm.tableData = this.tableData.tableData
      //   // this.selectOptionList = this.createSelectOptions
      //   this.initLoading = false
      //   //this.mergeTitle.length && (this.isLoading = false)
      // }, 1000)
    },
    deleteData(target) {
      target && !this.layer && this.$store.commit(this.setGuid + '/DELETE_TABLEROW', target)
    },
    pushData(data,target){
      data && !this.layer && this.$store.commit(this.setGuid + '/ADD_TABLEROW', {data,target})
    },
    reviseData(data){
      data && !this.layer && this.$store.commit(this.setGuid + '/REVISE_DATA', data)
    },
    updataTableRow(data){
      data && !this.layer && this.$store.commit(this.setGuid + '/UPDATA_TABLEROW', data)
    },
  },
  // watch: {
  //   'tableData.titleList':{
  //     deep: true,
  //     handler(n,o){
  //       console.log(n)
  //     }
  //   },
  //   setTitleList:{
  //     deep: true,
  //     handler(n,o){
  //       console.log(n)
  //     }
  //   },
  // },
}
