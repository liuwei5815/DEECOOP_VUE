<template>
  <div style="height: 100%;padding: 10px;" class="myCoustomTable resetTransferTableStyle">
    <div v-if="stateBtn.title" style="text-align: right">
      <el-checkbox v-model="stateBtnChecked">{{stateBtn.title}}</el-checkbox>
    </div>
    <div :style="setTablesHeight">
      <base-table v-loading="tableLoading"
                  ref="selectTable"
                  :data="tableData"
                  :colConfigs="setTableConfigs.titleList"
                  :showCheckBox="true"
                  :showIndex="setTableConfigs.showIndex"
                  :pageData="pageData"
                  :currentpage.sync="currentpage"
                  :isSingle="setTableConfigs.isSingle"
                  :isSortable="setTableConfigs.isSortable"
                  :isFixed = "1"
                  @databridge="dataBridge"></base-table>
    </div>
    <div style="height: 11px"></div>
    <div ref="resultBox" style="position: relative;" :style="setTablesHeight">
      <div style="height: 100%" :style="{paddingBottom: btnsBoxHeight+'px'}">
        <base-table ref="resultTable"
                    :data="setResultTableData"
                    :colConfigs="setResultTableConfigs"
                    :showCheckBox="false"
                    :showIndex="setTableConfigs.showIndex"
                    :isSingle="setTableConfigs.isSingle"
                    :isSortable="setTableConfigs.isSortable"
                    :isFixed = "1"
                    @databridge="resultDataBridge"></base-table>
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
    components: {},
    name: "transfer-table",
    props: {
      tableConfigs: {
        type: Object,
        default: function () {
          return {}
        }
      },
      btnList: {
        type: Array,
        default: function () {
          return []
        }
      },
      upTableBtnTemplate: {
        type: Array,
        default: function () {
          return []
        }
      },
      downTableBtnTemplate: {
        type: Array,
        default: function () {
          return []
        }
      },
      apiData: {
        type: Object,
        default: function () {
          return {}
        }
      },
      stateBtn: {
        type: Object,
        default: function () {
          return {}
        }
      }
    },
    data(){
      return {
        btnsBoxHeight: 0,
        currentpage: 1,
        tableLoading: false,
        tableData: [],
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
        rowKey: '',
        tempSelectList: [],
        stateBtnChecked: false,


      }
    },
    computed: {
      setTablesHeight(){
        return this.stateBtn.title?{height: 'calc(50% - 15px)'}:{height: 'calc(50% - 6px)'}
      },
      setResultBtnState(){
        return (data) => {
          return this.resultTableData.length?false:data.state
        }
      },
      setTableConfigs(){
        const [...tempArr] = this.titleList
        return {
          titleList: this.addTableTitle(tempArr,this.upTableBtnTemplate),
          showIndex: this.tableConfigs.showIndex === undefined?false:this.tableConfigs.showIndex,
          isSingle: this.tableConfigs.isSingle === undefined?false:this.tableConfigs.isSingle,
          isSortable: this.tableConfigs.isSortable === undefined?false:this.tableConfigs.isSortable,
        }
      },
      setResultTableConfigs(){
        const [...tempArr] = this.titleList
        return this.downTableBtnTemplate.length?this.addTableTitle(tempArr,this.downTableBtnTemplate):this.addTableTitle(tempArr,[this.tableBtns])
      },
      setResultTableData(){
        return [].concat(this.resultTableData)
      }
    },
    watch: {
      currentpage: function () {
        const {...paramsObj} = this.apiData.params
        paramsObj['pageNo'] = this.currentpage
        this.httpTableMethod(this.apiData.apiName,paramsObj)
      },
      setResultTableData: function () {
        this.$emit('table-selected',this.setResultTableData)
      },
      stateBtnChecked: function () {
        const tempObj = {}
        tempObj[this.stateBtn.keyName?this.stateBtn.keyName:'isShow'] = this.stateBtnChecked
        this.httpTableMethod(this.apiData.apiName,this.apiData.params,tempObj)
      },
      'apiData.params': function () {
        console.log(this.apiData.params)
        this.httpTableMethod(this.apiData.apiName,this.apiData.params)
      }
    },
    created(){
      if(this.apiData.apiName){
        this.httpTableMethod(this.apiData.apiName,this.apiData.params)
        this.rowKey = this.tableConfigs.rowKey || 'id'
      }else {
        this.$message({
          message: '没有设置接口名',
          type: 'error',
          duration: 10000
        })
      }

    },
    mounted(){
      this.$nextTick(function () {
        this.btnsBoxHeight = this.$refs.btnsBox.clientHeight + 5
      })
    },
    methods:{
      clearTableSelected(){
        this.resultTableData = []
        this.tempSelectList = []
        this.tableData.forEach(item => {
          this.$refs.selectTable.$refs.baseTable.clearSelection()
        })
      },
      httpTableMethod(api,params,data){
        this.tableLoading = true
        this.$api[api](Object.assign({},params,data)).then(res => {
          console.log(res)
          this.getListPage(res)
          this.tableLoading = false
        }).catch(err => {
          this.tableLoading = false
        })
      },

      getListPage(res) {
        const that = this
        if (res) {
          res.result.titles = typeof res.result.titles === 'string'?JSON.parse(res.result.titles):res.result.titles
          res.result.varList = typeof res.result.varList === 'string'?JSON.parse(res.result.varList):res.result.varList
          res.result.pageData = typeof res.result.pageData === 'string'?JSON.parse(res.result.pageData):res.result.pageData
          that.titleList = filerTableTitle(res.result)
          that.pageData = res.result.pageData
          that.tableData = res.result.varList || []
          that.tempSelectList = []
          this.$nextTick(_ => {
            this.toggleRowSelected()
          })

        }
      },
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

      addTableTitle(list,joinList) {
        if(joinList && joinList.length){
          joinList.forEach(item => {
            if(isNumber(item.columnIndex)){
              list.splice(item.columnIndex,0,item)
            }else {
              if(item.columnIndex === 'first'){
                list.unshift(item)
              }else if(item.columnIndex === 'last'){
                list.push(item)
              }else {
                list.some(listItem => {
                  if(listItem.prop === item.columnIndex){
                    Object.assign(listItem,item)
                    return true
                  }
                })
              }
            }
          })
        }
        //list[0].sortable = true
        return list
      },

      dataBridge(data,row){
        this.getChecked(row,data)?this.addRowData(row):this.removeRowData(row)
        //this.updateView(data,this.currentpage)
      },

      resultDataBridge(data,state){
        console.log(data)
        console.log(state)
      },
      deleteRow(data,index){
        console.log(data)
        console.log(index)
        this.resultTableData.find((item,index) => {
          if(data[this.rowKey] === item[this.rowKey]){
            this.resultTableData.splice(index,1)
            return item
          }
        })
        this.toggleRowSelected()
      },
      updateView(list,pageIndex){
        this.resultTableData.splice(pageIndex-1,1,list)
        // if(list.length){
        //   const tempArr = []
        //   list.forEach((item,index) => {
        //     const state = this.resultTableData.some((tarItem,tarIndex)=>{
        //       console.log(item[this.rowKey])
        //       console.log(tarItem[this.rowKey])
        //       return tarItem[this.rowKey] === item[this.rowKey]
        //     })
        //     console.log(state)
        //     if(state){
        //       this.$refs.selectTable.$refs.baseTable.toggleRowSelection(item,false)
        //     }else {
        //       tempArr.push(item)
        //     }
        //   })
        //   console.log(tempArr)
        //   this.resultTableData = this.resultTableData.concat(tempArr)
        // }
      },
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
    }
  }
</script>

<style scoped>

</style>
