<template>
  <div style="height: 100%" class="myCoustomTable resetTreeTableStyle">
    <div :style="{height: setTableHeight}" style="position: relative;overflow: hidden">
      <div class="resetTableStyle baseTableStyle">
        <el-table ref="baseTable"
                  :data="setTableData"
                  stripe
                  height="100%"
                  style="width: 100%;"
                  fit
                  highlight-current-row
                  tooltip-effect="dark"
                  :border="layer!=0"
                  :show-header="setShowHeader()"
                  :default-expand-all="setExpand"
                  :row-key="getRowKey"
                  :expand-row-keys="expandRowKeys"
                  :row-class-name="setRowClass"
                  :header-row-class-name="setHeaderRowClass"
                  @expand-change="expandChange"
                  @do-layout="doLayout"
                  @select="selectItem"
                  @select-all="selectAll">
          <el-table-column v-if="setTableData && setTableData.length" type="expand" :width="setColumnWidth" align="center">
            <template slot-scope="props">
              <template v-if="props.row.children && props.row.children">
              <children-table
                :layer="layer+1"
                :expand-all="setExpand"
                :data="props.row.children"
                :titleList="props.row.titleList"
                :configs="configs"
                :customColumn="customColumn"
                :editable="editable"
                :precision="precision"
                :guid="guid"
                :parent="[props.row]"
                :rowChain="[]"
                :tablesHeight="initChildHeight"
                @do-layout="doLayout"
                @databridge="databridge"></children-table>
              </template>
              <template v-else>
                <div style="text-align: center">暂无数据</div>
              </template>
            </template>
          </el-table-column>
          <template v-if="setShowCheckBox">
            <el-table-column type="selection" :selectable="selectable" width="55" align="center"></el-table-column>
          </template>
          <template v-if="setShowIndex">
            <el-table-column type="index" :index="indexMethod" label="序号" width="60" align="center"></el-table-column>
          </template>
          <template v-for="(colConfig,infoIndex) in setTitleList">
            <component v-if="colConfig.component" :key="infoIndex" :is="colConfig.component" :col-config="colConfig"></component>
            <el-table-column v-else show-overflow-tooltip :key="infoIndex" v-bind="colConfig" :label="colConfig.label" align="center"></el-table-column>
          </template>
        </el-table>
      </div>
    </div>
    <!--<div v-if="showPageData" style="height: 40px;text-align: center;margin-top: 5px;">-->
      <!--<el-pagination-->
        <!--background-->
        <!--@current-change="handleCurrentChange"-->
        <!--:current-page.sync="setPageData.current"-->
        <!--:page-size="setPageData.size"-->
        <!--layout="prev, pager, next, jumper"-->
        <!--:total="setPageData.total-0">-->
      <!--</el-pagination>-->
    <!--</div>-->
  </div>

</template>

<script>
  import childrenTable from "./childrenTable"
  import { filerTableTitle, GUID, treeFormTableStore,updateExpandTableView,unCreateStore} from '@/utils/common'
  import {isNumber} from '@/utils/validate'
  import regexp from '@/utils/regexp'

  // 测试数据
  // import testData from '@/data/tableData'
  // import testData from '@/data/dateData'
  // import testData from '@/data/timeData'
  import testData from '@/data/selectData'


  //table操作栏里面的按钮
  const operateBtns = {
    props: ['colConfig'],
    template: `<el-table-column :label="colConfig.label" align="center">
      					<div slot-scope="scope" class="btnBox">
      					  <template v-for="item in colConfig.methods">
      							<el-button  type="text" class="btns" style="font-size: 12px;" :disabled="scope.row.isdisable==='0'" @click="item(scope.row,scope.$index,scope)">删除</el-button>
      						</template>
      					</div>
    				</el-table-column>`
  }

  export default {
    name: 'tree-form-table',
    props: {
      initData: {
        type: Object,
        default: function () {
          return {}
        }
      },
      // childrenData: {
      //   type: Object,
      //   default: function () {
      //     return {}
      //   }
      // },
      configs: {
        type: Object,
        default: function () {
          return {}
        }
      },
      layer: {
        type: Number,
        default: 0
      },
      apiObj: {
        type: Object,
        default: function () {
          return {}
        }
      },
      // updateViewData: {
      //   type: Object,
      //   default: function () {
      //     return {}
      //   }
      // },
      'expand-all': {
        type: Boolean,
        default: true
      },
      customColumn: {
        type: Object,
        default: function () {
          return {}
        }
      },
      editable: [Object,Array],
      childHeight: [String,Number],
      precision: {
        type: Number,
        default: 2
      },
      data: {
        type: Array,
        default: function () {
          return []
        }
      },
      titleList: {
        type: Array,
        default: function () {
          return []
        }
      },
      addedData: {
        type: Object,
        default: function () {
          return {}
        }
      },
      deleteKey: {
        type: String,
        default: 'id'
      }
    },
    data() {
      return {
        wrapperWidth: 0,
        tableWidth: 0,
        fixedList: [],
        expandRowKeys: [],
        getRowKey(row){
          return row.id
        },
        tableObj: {},
        inlineColumn: {
          '1':[{
            columnIndex: 'last',
            prop: 'operate',
            label: '操作',
            component: operateBtns,
            methods: [this.deleteRow]
          }]
        },
        guid: '',
        editTableLayer:-1,
      }
    },
    components: {
      childrenTable
    },
    computed: {
      initChildHeight(){
        return this.childHeight || 'auto'
      },
      setTableHeight() {
        return this.showPageData?'calc(100% - 40px)':'100%'
      },
      setShowCheckBox() {
        if(this.configs[this.layer] && this.configs[this.layer].showCheckBox && this.setTableData && this.setTableData.length){
          return true
        }else {
          return false
        }
      },
      setShowIndex() {
        if(this.configs[this.layer] && this.configs[this.layer].showIndex && this.setTableData && this.setTableData.length){
          return true
        }else {
          return false
        }
      },
      expandOne() {
        if(this.configs[this.layer] && this.configs[this.layer].expandOne){
          return true
        }else {
          return false
        }
      },
      formatedCustomColumn() {
        for(const k in this.inlineColumn){
          if(!this.customColumn[k]){
            this.customColumn[k] = this.inlineColumn[k]
          }
        }
        return this.customColumn
      },
      tableData() {
        return this.$store.getters[this.guid+'/dataTree']
      },
      setTitleList() {
        return this.tableData.titleList
      },
      setTableData() {
        return this.tableData.tableData
      },
      setExpand() {
        return this['expandAll']
      },
      setColumnWidth() {
        return this.setExpand?'1':'50'
      },
    },
    created: function() {
      if(this.layer === 0){
        this.guid = GUID()
        treeFormTableStore(this)
        if(this.apiObj.apiName){
          // console.log(testData)
          // setTimeout(()=>{
          //   this.$store.commit(this.guid+'/SET_DATATREE',this.formatedTable({res:testData}))
          // },1000)

          this.$api[this.apiObj.apiName](Object.assign({},this.apiObj.params)).then(res => {
            this.$store.commit(this.guid+'/SET_DATATREE',this.formatedTable({res}))
          }).catch(err => {
            console.log(err)
          })
        }
      }else {

      }
    },
    mounted: function () {

    },
    beforeDestroy() {
      unCreateStore(this.$store,this.guid)
    },
    watch: {
      addedData(){
        console.log(this.addedData)
        const tempObj = JSON.parse(JSON.stringify(this.addedData))
        tempObj.rowData._editConfig = Object.assign({},this.editable)
        this.$store.commit(this.guid+'/ADD_ROW',tempObj)
      },
      'apiObj.params'(){
        this.$api[this.apiObj.apiName](Object.assign({},this.apiObj.params)).then(res => {
          this.$store.commit(this.guid+'/SET_DATATREE',this.formatedTable({res}))
        }).catch(err => {
          console.log(err)
        })
      }
    },
    methods:{
      upDateView(params){
        this.$api[this.apiObj.apiName](Object.assign({},this.apiObj.params,params?params:undefined)).then(res => {
          this.$store.commit(this.guid+'/SET_DATATREE',this.formatedTable({res}))
        }).catch(err => {
          console.log(err)
        })
      },
      getData(){
        !this.layer && this.$emit('get-data',this.tableData)
      },
      formatedTable(res) {
        if(!this.layer){
          const tempObj = JSON.parse(JSON.stringify(res))
          const tempData = this.getListPage(tempObj.res,this.formatedCustomColumn,this.layer)
          tempData.tableData && tempData.tableData.length && this.formatEditTable(tempData.tableData)
          return tempData
        }else {
          return {}
        }
      },
      formatEditTable(list){
        this.editTableLayer++
        list.forEach(v => {
          if(v.children && v.children.length){
            this.formatEditTable(v.children)
          }
          if(this.editTableLayer>0){
            if(Array.isArray(this.editable)){
              const tempObj = {}
              this.editable.forEach(item => {
                tempObj[item] = {
                  type: this.automaticInference(item,v)
                }
              })
              v._editConfig = tempObj
            }else if(typeof this.editable === 'object') {
              Object.keys(this.editable).forEach(str => {
                if(Object.keys(v).indexOf(str)>-1){
                  v._editConfig = Object.assign({},this.editable)
                }
              })
            }
          }
        })
      },
      automaticInference(prop,row){
        const testStr = row[prop]
        let type = ''
        if((testStr === '1' || testStr === '0') && prop === 'isdisable'){
          type = 'switch'
        }else if(new RegExp(regexp['date'].replace(/placeholder/g,'0,'),'g').test(testStr)){
          type = 'date'
        }else if(new RegExp(regexp['time'].replace(/placeholder/g,'0,'),'g').test(testStr)){
          type = 'time'
        }else {
          type = 'input'
        }
        return type
      },
      deleteRow(row,index){
        this.$store.commit(this.guid+'/DELETE_ROW',row)
        this.$nextTick(_=>{
          this.$refs.baseTable.doLayout()
        })
      },
      setShowHeader() {
        if(this.layer){
          return this.setTableData.length !== 0
        }else {
          return true
        }
      },
      setRowClass() {
        if(this.setExpand){
          return 'row-expand-cover'
        }
      },
      setHeaderRowClass() {
        if(this.setExpand){
          return 'header-expand-cover'
        }
      },
      selectable(row, index) {
        return  row.rowState === '1'
      },
      expandChange(row, list){
        const state = list.some(item => {
          return item.id === row.id
        })
        if(state){
          this.expandOne && this.toggleRowExpands(list,row)
        }
        this.$refs.baseTable.setCurrentRow(row)
        this.$refs.baseTable.$nextTick(_ => {
          this.$refs.baseTable.doLayout()
        })
      },
      toggleRowExpands(list,row){
        list.forEach(item => {
          this.$refs.baseTable.toggleRowExpansion(item,item.id===row.id)
        })
      },
      getListPage(res,customColumn,layer) {
        const that = this
        if (res) {
          res.result.titles = typeof res.result.titles === 'string'?JSON.parse(res.result.titles):res.result.titles
          res.result.varList = typeof res.result.varList === 'string'?JSON.parse(res.result.varList):res.result.varList
          res.result.pageData = typeof res.result.pageData === 'string'?JSON.parse(res.result.pageData):res.result.pageData
          const data = filerTableTitle(res.result)
          const titleList = that.addTableTitle(data,customColumn,layer)
            res.result.varList.forEach(item => {
              if(item.titles && item.hideTitles && item.children){
                const tempObj = {
                  result:{
                    titles: item.titles,
                    hideTitles: item.hideTitles,
                    varList: item.children,
                    pageData: {}
                  }
                }
                const res = this.getListPage(tempObj,customColumn,layer+1)
                item.titleList = res.titleList
                item.pageData = res.pageData
              }
            })
          return {
            titleList,
            pageData: res.result.pageData,
            tableData: res.result.varList
          }
        }else {
          return {}
        }
      },

      addTableTitle(list,customColumn,layer) {
        if(customColumn[layer] && Array.isArray(customColumn[layer])){
          customColumn[layer].forEach(item => {
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
        return list
      },
      indexMethod(index) {
        return index + 1
      },
      selectItem(selection, row) {
        this.$emit('databridge',selection)
        // if(this.isSingle){
        //   if(selection.length){
        //     this.data.forEach(item => {
        //       item.isdisable = '0'
        //     })
        //     selection[0].isdisable = '1'
        //   }else {
        //     this.data.forEach(item => {
        //       item.isdisable = '1'
        //     })
        //   }
        // }
      },
      selectAll(selection) {
        this.$emit('databridge',selection)
      },
      databridge(data) {
        this.$emit('databridge',data)
      },
      handleCurrentChange(pageIndex) {
        this.$emit('update:currentpage', pageIndex)
      },
      doLayout(){

        this.$refs.baseTable.$nextTick(_ => {

          this.$refs.baseTable.doLayout()
        })
      },
      // changePage(data) {
      //   console.log(data)
      //   updateExpandTableView({_that:this,currentpage:data.currentpage,rowChain:data.rowChain})
      // }
    }
  }
</script>

<style lang="scss" rel="text/css">
  .el-table__expanded-cell[class*=cell] {
    padding: 0 10px 10px 10px;
  }
  .resetTableStyle {
    >.el-table {
      >.el-table__body-wrapper{
        >table {
          border-spacing: 0 10px;
        }
      }
    }
  }
  .baseTableStyle {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
  .row-expand-cover td:first-child {
    border-right: none;
  }
  .row-expand-cover td:first-child .cell {
    display: none;
  }
  .header-expand-cover th:first-child {
    border-right: none;
  }


</style>
