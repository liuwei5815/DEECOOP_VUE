<template>
  <div style="height: 100%;padding: 10px;" class="myCoustomTable resetTransferTableStyle" v-loading="setCustomTransferTableLoading">
    <div v-if="stateBtn && stateBtn.title" style="text-align: right">
      <el-checkbox v-model="stateBtnChecked">{{stateBtn.title}}</el-checkbox>
    </div>
    <div :style="setTablesHeight">
      <custom-base-table
        ref="selectTable"
        :useScenarios="'transferTable'"
        :showIndex="aboveTableConfig.showIndex || false"
        :showCheckBox="aboveTableConfig.showCheckBox || false"
        :showTableSet="aboveTableConfig.showTableSet || false"
        :customColumn="aboveTableConfig.customColumn"
        :initData="aboveTableInitData"
        :mergeTitle="aboveTableConfig.mergeTitle"
        :componentId="'transferAboveTable'"
        :tempData="aboveTableConfig.tempData"
        :dragTable="aboveTableConfig.dragTable"
        :entireRowDrag="aboveTableConfig.entireRowDrag"
        @current-change="currentChange"
        @databridge="dataBridge"></custom-base-table>
    </div>
    <div style="height: 11px"></div>
    <div ref="resultBox" style="position: relative;" :style="setTablesHeight">
      <div style="height: 100%" :style="{paddingBottom: btnsBoxHeight+'px'}">
        <custom-base-table
          ref="resultTable"
          :useScenarios="'transferTable'"
          :showIndex="belowTableConfig.showIndex || false"
          :showCheckBox="belowTableConfig.showCheckBox || false"
          :showTableSet="belowTableConfig.showTableSet || false"
          :hidePages="belowTableConfig.hidePages || true"
          :customColumn="mixCustomColumn"
          :initData="belowTableInitData"
          :mergeTitle="belowTableConfig.mergeTitle"
          :componentId="'transferBelowTable'"
          :tempData="belowTableConfig.tempData"
          :dragTable="belowTableConfig.dragTable"
          :entireRowDrag="belowTableConfig.entireRowDrag"
          @databridge="resultDataBridge"></custom-base-table>
      </div>
      <div ref="btnsBox" style="position: absolute;bottom: 0;right: 0;">
        <template v-if="btnList.length">
          <template v-for="(item,index) in btnList">
            <base-button v-show="item.isShow" :key="index" :name='item.name' :icon='item.icon' :plain="item.plain" :state="setResultBtnState(item)"
                         @myclick="item.method"></base-button>
          </template>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
  import {filerTableTitle} from '@/utils/common'
  import {isNumber} from '@/utils/validate'
  import {deepClone} from '@/utils/deepClone'
  import customBaseTable from '@/components/customTable/baseTable'

  //	  table操作栏里面的按钮
  const operateBtns = {
    props: ['colConfig','fixed'],
    template: `<el-table-column :label="colConfig.label" :fixed="fixed" :sortable="colConfig.sortable" align="center">
      					<div slot-scope="scope" class="btnBox">
      					  <template v-for="(item, index) in colConfig.rowMethods">
      					    <el-button  type="text" class="btns" style="font-size: 12px;" :disabled="scope.row.isdisable==='0'" @click="item.method(scope.row,scope.$index)" v-text="item.name"></el-button>
                  </template>
      					</div>
    				</el-table-column>`
  }
  export default {
    components: {
      customBaseTable
    },
    name: "custom-transfer-table",
    props: {
      // tableConfigs: {
      //   type: Object,
      //   default: function () {
      //     return {}
      //   }
      // },
      btnList: {
        type: Array,
        default: function () {
          return []
        }
      },
      // upTableBtnTemplate: {
      //   type: Array,
      //   default: function () {
      //     return []
      //   }
      // },
      // downTableBtnTemplate: {
      //   type: Array,
      //   default: function () {
      //     return []
      //   }
      // },
      stateBtn: {
        type: Object,
        default: function () {
          return {}
        }
      },

      //上级表格配置
      aboveTableConfig: {
        type: Object,
        default: function () {
          return {}
        }
      },
      //下级表格配置
      belowTableConfig: {
        type: Object,
        default: function () {
          return {}
        }
      },
      addColumns: {
        type: Array,
        default: function () {
          return []
        }
      },
      hideColumns: {
        type: Array,
        default: function () {
          return []
        }
      },
      deDuplication: {
        type: Boolean,
        default: false
      },
      useDefaultBtn: {
        type: Boolean,
        default: true
      },
      rowKey: {
        type: String,
        default: 'id'
      }

    },
    data(){
      return {
        selectTableGuid: '',
        resultTableGuid: '',
        aboveTableLoading: true,
        belowTableLoading: true,
        btnsBoxHeight: 0,
        currentpage: 1,
        tableLoading: false,
        resultTableData: [],
        titleList: [],
        pageData: {},
        tableBtns: {
          columnIndex: 'last',//可接受'last'或者'first'
          prop: 'operate',
          label: '操作',
          component: operateBtns,
          rowMethods: [{
            name:'删除',
            method:this.deleteRow
          }]
        },
        tempSelectList: [],
        stateBtnChecked: false,
        aboveTableInitData: {},
        belowTableInitData: null,
        belowTableDataTimer: '',
      }
    },
    computed: {
      apiData(){
        return this.aboveTableConfig.apiObj || null
      },
      belowApiData(){
        return this.belowTableConfig.apiObj || null
      },
      setBelowTableLoading(){
        return this.belowApiData?this.belowTableLoading:false
      },
      setCustomTransferTableLoading(){
        return this.aboveTableLoading || this.setBelowTableLoading
      },
      setTablesHeight(){
        return this.stateBtn.title?{height: 'calc(50% - 15px)'}:{height: 'calc(50% - 6px)'}
      },
      setResultBtnState(){
        return (data) => {
          return this.resultTableData.length?false:data.state
        }
      },
      // setTableConfigs(){
      //   const [...tempArr] = this.titleList
      //   return {
      //     titleList: this.addTableTitle(tempArr,this.upTableBtnTemplate),
      //     showIndex: this.tableConfigs.showIndex === undefined?false:this.tableConfigs.showIndex,
      //     isSingle: this.tableConfigs.isSingle === undefined?false:this.tableConfigs.isSingle,
      //     isSortable: this.tableConfigs.isSortable === undefined?false:this.tableConfigs.isSortable,
      //   }
      // },
      mixCustomColumn(){
        return [].concat([],this.addColumns,this.belowTableConfig.customColumn||[],this.useDefaultBtn?[this.tableBtns]:[])
      },
      // setResultTableConfigs(){
      //   const [...tempArr] = this.titleList
      //   return this.downTableBtnTemplate.length?this.addTableTitle(tempArr,this.downTableBtnTemplate):this.addTableTitle(tempArr,[this.tableBtns])
      // },
      setResultTableData(){
        return [].concat(this.resultTableData)
      },
      // setBelowTableInitData(){
      //   if(this.belowTableInitData){
      //     this.belowTableInitData.varList = this.setResultTableData
      //   }
      //   return this.belowTableInitData
      // }
      selectTableData(){
        if(this.selectTableGuid) return this.$store.getters[this.selectTableGuid + '/tableData']
        return {}
      },
      tableData() {
        return this.selectTableData.tableData || []
      },
      belowTableData(){
        if(this.resultTableGuid) return this.$store.getters[this.resultTableGuid + '/tableData'].tableData || []
        return []
      },
    },
    watch: {
      // currentpage: function () {
      //   const {...paramsObj} = this.apiData.params
      //   paramsObj['pageNo'] = this.currentpage
      //   this.httpAboveTableData(this.apiData.apiName,paramsObj)
      // },
      setResultTableData: function () {
        const cloneData = deepClone(this.setResultTableData)
        ;(cloneData || []).forEach(v=>{
          this.addColumns.forEach(av=>{
            if(!v.hasOwnProperty([av.prop])){
              v[av.prop] = this.initRowDataValue(av.componentName)
            }
          })
        })
        this.$refs.resultTable.updataTableRow && this.$refs.resultTable.updataTableRow(cloneData)
      },
      stateBtnChecked: function () {
        const tempObj = {}
        tempObj[this.stateBtn.keyName?this.stateBtn.keyName:'isShow'] = this.stateBtnChecked
        this.httpAboveTableData(this.apiData.apiName,this.apiData.params,tempObj)
      },
      'apiData.params': function () {
        //console.log(this.apiData.params)
        const tempObj = {}
        tempObj[this.stateBtn.keyName?this.stateBtn.keyName:'isShow'] = this.stateBtnChecked
        this.httpAboveTableData(this.apiData.apiName,this.apiData.params,tempObj)
      },
    },
    created(){
      if(this.apiData) this.httpAboveTableData(this.apiData.apiName,this.apiData.params)
      if(this.belowApiData) this.httpBelowTableData(this.belowApiData.apiName,this.belowApiData.params)


    },
    mounted(){
      this.$nextTick(function () {
        this.selectTableGuid = this.$refs.selectTable.guid
        this.resultTableGuid = this.$refs.resultTable.guid
        this.btnsBoxHeight = this.$refs.btnsBox.clientHeight + 5
      })
    },
    methods:{
      initRowDataValue(str){
        if(!str) return ''
        if(str === 'cascader') return []
        if(str === 'inputNumber' || str === 'progress') return 0
        return ''
      },
      clearTableSelected(){
        this.resultTableData = []
        this.tempSelectList = []
        this.tableData.forEach(item => {
          this.$refs.selectTable.$refs.baseTable.clearSelection()
        })
      },
      httpAboveTableData(api,params,data){
        this.aboveTableLoading = true
        this.$api[api](Object.assign({},params,data)).then(res => {
          //console.log(res)
          this.aboveTableInitData = res
          if(!this.belowApiData && !this.belowTableInitData){
            this.belowTableInitData = this.initBelowTableData(res)
          }
          this.tempSelectList = []
          this.$nextTick(_ => {
            this.toggleRowSelected()
          })
          this.aboveTableLoading = false
        }).catch(err => {
          this.aboveTableLoading = false
        })
      },
      httpBelowTableData(api,params,data){
        this.belowTableLoading = true
        this.$api[api](Object.assign({},params,data)).then(res => {
          this.belowTableInitData = this.initBelowTableData(res)
          this.belowTableLoading = false
        }).catch(err => {
          this.belowTableLoading = false
        })
      },
      // mixBelowTableTitle(list){
      //   console.log(list)
      //   const titleList = deepClone(list)
      //   this.hideColumns.forEach(item=>{
      //     if(typeof item === 'number'){
      //       titleList.splice(parseInt(item),1)
      //     }
      //     if(typeof item === 'string'){
      //       const deIndex = titleList.findIndex(listItem => {
      //         if(listItem.prop === item) return true
      //       })
      //       deIndex>-1
      //         ?titleList.splice(deIndex,1)
      //         :''
      //     }
      //   })
      //   this.addColumns.forEach(item=>{
      //     titleList.splice(item.columnIndex,0,item)
      //   })
      //   console.log(titleList)
      //   return titleList
      // },
      initBelowTableData(data){
        if(data) {
          const res = this.belowApiData?data:deepClone(data)
          const tempArr = this.belowApiData?deepClone(typeof res.result.varList === 'string'?JSON.parse(res.result.varList):res.result.varList):[]
          res.result.titles = typeof res.result.titles === 'string'?JSON.parse(res.result.titles):res.result.titles
          res.result.hideTitles = typeof res.result.hideTitles === 'string'?JSON.parse(res.result.hideTitles):res.result.hideTitles
          this.hideColumns.forEach(v=>{
            res.result.hideTitles.findIndex(cv=>{
              return v === cv
            })>-1
              ?''
              :res.result.hideTitles.push(v)
          })
          res.result.varList = []
          //第二table有api接口时，数据项需联动
          if(this.belowApiData){
            this.addBelowTableData(tempArr)
            // this.$nextTick(_=>{
            //   this.toggleRowSelected()
            //
            // })
          }
          return res
        }
      },
      addBelowTableData(list){
        clearInterval(this.belowTableDataTimer)
        this.belowTableDataTimer = setInterval(_=>{
          if(this.selectTableData.titleList && this.selectTableData.tableData){
            clearInterval(this.belowTableDataTimer)
            this.dataBridge(list)
            this.toggleRowSelected()
          }
        },50)
      },
      // getListPage(res) {
      //   const that = this
      //   if (res) {
      //     res.result.titles = typeof res.result.titles === 'string'?JSON.parse(res.result.titles):res.result.titles
      //     res.result.varList = typeof res.result.varList === 'string'?JSON.parse(res.result.varList):res.result.varList
      //     res.result.pageData = typeof res.result.pageData === 'string'?JSON.parse(res.result.pageData):res.result.pageData
      //     that.titleList = filerTableTitle(res.result)
      //     that.pageData = res.result.pageData
      //     that.tableData = res.result.varList || []
      //     that.tempSelectList = []
      //     this.$nextTick(_ => {
      //       this.toggleRowSelected()
      //     })
      //   }
      // },
      toggleRowSelected(){
        this.tableData.forEach(tableItem => {
          const state = this.resultTableData.some(item => {
            return tableItem[this.rowKey] === item[this.rowKey]
          })
          if(state){
            this.$refs.selectTable.$refs.baseTable.toggleRowSelection(tableItem,true)
            !this.tempSelectList.some(v=>{return v[this.rowKey]===tableItem[this.rowKey]}) && this.tempSelectList.push(tableItem)
          }else {
            this.$refs.selectTable && this.$refs.selectTable.$refs.baseTable.toggleRowSelection(tableItem,false)
          }
        })
      },

      // addTableTitle(list,joinList) {
      //   if(joinList && joinList.length){
      //     joinList.forEach(item => {
      //       if(isNumber(item.columnIndex)){
      //         list.splice(item.columnIndex,0,item)
      //       }else {
      //         if(item.columnIndex === 'first'){
      //           list.unshift(item)
      //         }else if(item.columnIndex === 'last'){
      //           list.push(item)
      //         }else {
      //           list.some(listItem => {
      //             if(listItem.prop === item.columnIndex){
      //               Object.assign(listItem,item)
      //               return true
      //             }
      //           })
      //         }
      //       }
      //     })
      //   }
      //   //list[0].sortable = true
      //   return list
      // },

      currentChange(data){
        // console.log(data)
        const tempObj = {}
        tempObj[this.stateBtn.keyName?this.stateBtn.keyName:'isShow'] = this.stateBtnChecked
        this.httpAboveTableData(this.apiData.apiName,this.apiData.params,Object.assign({},{pageNo:data},tempObj))
      },

      dataBridge(data,row){
        // console.log(data,'dataBridge')
        this.getChecked(row,data)?this.addRowData(row):this.removeRowData(row)
      },

      resultDataBridge(data,state){
        // console.log(data)
        // console.log(state)
      },
      deleteRow(data,index){
        // console.log(data)
        // console.log(index)
        this.resultTableData.find((item,index) => {
          if(data[this.rowKey] === item[this.rowKey]){
            this.resultTableData.splice(index,1)
            return item
          }
        })
        this.toggleRowSelected()
      },
      // updateView(list,pageIndex){
      //   this.resultTableData.splice(pageIndex-1,1,list)
      //   // if(list.length){
      //   //   const tempArr = []
      //   //   list.forEach((item,index) => {
      //   //     const state = this.resultTableData.some((tarItem,tarIndex)=>{
      //   //       console.log(item[this.rowKey])
      //   //       console.log(tarItem[this.rowKey])
      //   //       return tarItem[this.rowKey] === item[this.rowKey]
      //   //     })
      //   //     console.log(state)
      //   //     if(state){
      //   //       this.$refs.selectTable.$refs.baseTable.toggleRowSelection(item,false)
      //   //     }else {
      //   //       tempArr.push(item)
      //   //     }
      //   //   })
      //   //   console.log(tempArr)
      //   //   this.resultTableData = this.resultTableData.concat(tempArr)
      //   // }
      // },
      getChecked(row,list){
        if(row){
          return list.some(item => {
            return row[this.rowKey] === item[this.rowKey]
          })
        }else {
          list.length && (this.tempSelectList = list)
          return list.length?true:false
        }
      },
      addRowData(data){
        data
          ?this.resultTableData.some(item => {
          return data[this.rowKey] === item[this.rowKey]
        })?'':this.resultTableData.push(data)
          :this.addAllRowData()
      },

      addAllRowData(){
        //console.log(this.resultTableData.length,'this.resultTableData.length');
        this.resultTableData.length
          ?this.tempSelectList.forEach(tempItem => {
            this.addRowData(tempItem)
          })
          :this.resultTableData = this.tempSelectList
      },

      removeRowData(data){
        data
        ? this.resultTableData.some((item,index) => {
          if(data[this.rowKey] === item[this.rowKey]){
            this.resultTableData.splice(index,1)
            return true
          }
        })
          :this.tableData.forEach(tempItem => {
            this.removeRowData(tempItem)
          })
      },

      getTableSelected(){
        this.$emit('table-selected',this.belowTableData)
      },
    }
  }
</script>
