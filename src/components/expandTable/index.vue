<template>
  <div style="height: 100%" class="myCoustomTable resetExpandTableStyle">
    <div :style="{height: setTableHeight}" class="boxStyle">
      <div class="resetTableStyle" style="position: absolute;top: 0;left: 0;right: 0;bottom: 0;overflow: auto;">
        <el-table ref="baseTable"
                  :data="formatedData"
                  stripe
                  height="100%"
                  style="width: 100%;"
                  fit
                  highlight-current-row
                  tooltip-effect="dark"
                  :header-cell-class-name="setStyle"
                  :row-key="getRowKey"
                  :expand-row-keys="expandRowKeys"
                  :default-expand-all="defaultExpandAll"
                  @expand-change="expandChange"
                  @select="selectItem"
                  @select-all="selectAll">
          <el-table-column v-if="formatedData.length" type="expand" width="55" align="center">
            <template slot-scope="props">
              <!--<template v-if="props.row[childrenKey]&&props.row[childrenKey].length">-->
                <children-table
                  :data="props.row[childrenKey]"
                  :layer="layer+1"
                  :isLoading="props.row._loading && !defaultExpandAll"
                  :colConfigs="props.row[configKey]"
                  :pageData="props.row.pageData"
                  :sets="configs"
                  :guid="guid"
                  :parentData="[props.row]"
                  :rowChain="[]"
                  :maxLayer="setMaxLayer"
                  :default-expand-all="defaultExpandAll"
                  @send-children-row="sendChildrenRow"
                  @do-layout="doLayout"
                  @databridge="databridge"
                  @change-page="changePage"></children-table>
              <!--</template>-->
              <!--<template v-else>-->
                <!--<div style="text-align: center" v-loading="setLoadings[props.$index]">暂无数据</div>-->
              <!--</template>-->
            </template>
          </el-table-column>
          <template v-if="setShowCheckBox">
            <el-table-column type="selection" :selectable="selectable" width="55" align="center"></el-table-column>
          </template>
          <template v-if="setShowIndex">
            <el-table-column type="index" :index="indexMethod" label="序号" width="60" align="center"></el-table-column>
          </template>
          <template v-for="(colConfig,infoIndex) in setTitleLists">
            <component v-if="colConfig.component" :key="infoIndex" :is="colConfig.component" :col-config="colConfig"></component>
            <el-table-column v-else show-overflow-tooltip  :key="infoIndex" v-bind="colConfig" align="center"></el-table-column>
          </template>
        </el-table>
      </div>
    </div>
    <div v-if="showPageData" style="height: 40px;text-align: center;margin-top: 5px;">
      <el-pagination
        background
        @current-change="handleCurrentChange"
        :current-page.sync="setPageData.current"
        :page-size="setPageData.size"
        layout="prev, pager, next, jumper"
        :total="setPageData.total-0">
      </el-pagination>
    </div>

  </div>

</template>

<script>
  import childrenTable from './childrenTable'
  import { filerTableTitle, GUID, expandTableStore,updateExpandTableView,unCreateStore} from '@/utils/common'
  import {isNumber} from '@/utils/validate'

  export default {
    name: 'expand-table',
    props: {
      initData: {
        type: Object,
        default: function () {
          return {}
        }
      },
      childrenData: {
        type: Object,
        default: function () {
          return {}
        }
      },
      configs: {
        type: Object,
        default: function () {
          return {}
        }
      },
      maxLayer: {
        type: Number,
        default: 2
      },
      apiObj: {
        type: Object,
        default: function () {
          return {}
        }
      },
      updateViewData: {
        type: Object,
        default: function () {
          return {}
        }
      },
      defaultExpandAll: [Boolean]
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
        guid: '',
        // childrenKey: 'children',
        // configKey: 'colConfig',
        layer: 1,
        tableData: [],
      }
    },
    components: {
      childrenTable
    },
    computed: {
      setTableHeight() {
        return this.showPageData?'calc(100% - 40px)':'100%'
      },
      setShowCheckBox() {
        if(this.configs[1] && this.configs[1].showCheckBox && this.formatedData.length){
          return true
        }else {
          return false
        }
      },
      setShowIndex() {
        if(this.configs[1] && this.configs[1].showIndex && this.formatedData.length){
          return true
        }else {
          return false
        }
      },
      expandOne() {
        if(this.configs[1] && this.configs[1].expandOne){
          return true
        }else {
          return false
        }
      },
      setLoadings() {
        const tempArr = []
        this.tableData.forEach(item => {
          tempArr.push(false)
        })
        return tempArr
      },
      formatedData(){
        // this.tableData.forEach((item,index) => {
        //   if(item.children){
        //     let i = 0
        //     while (i < 1000){
        //       if(item['children'+i]){
        //         i++
        //       }else {
        //         this.childrenKey = 'children'+i
        //         i = 1000
        //       }
        //     }
        //     this.$set(this.tableData[index],this.childrenKey,[])
        //   }else {
        //     this.$set(this.tableData[index],'children',[])
        //   }
        //   if(item.colConfig){
        //     let i = 0
        //     while (i < 1000){
        //       if(item['colConfig'+i]){
        //         i++
        //       }else {
        //         this.configKey = 'colConfig'+i
        //         i = 1000
        //       }
        //     }
        //     this.$set(this.tableData[index],this.configKey,[])
        //   }else {
        //     this.$set(this.tableData[index],'colConfig',[])
        //   }
        // })
        return this.$store.getters[this.guid+'/dataTree'] || []
      },
      setMaxLayer() {
        return this.maxLayer
      },
      childrenKey() {
        return this.$store.getters[this.guid+'/keyList'][this.layer-1].childrenKey || 'children'
      },
      configKey() {
        return this.$store.getters[this.guid+'/keyList'][this.layer-1].configKey || 'colConfig'
      },
      layerKey() {
        return this.$store.getters[this.guid+'/keyList'][this.layer-1].layerKey || 'layer'
      },
      // rowChain() {
      //   return this.$store.getters[this.guid+'/rowChain']
      // },
      setTitleLists() {
        return this.$store.getters[this.guid+'/baseTitleList']
      },
      setPageData() {
        return this.$store.getters[this.guid+'/basePageData']
      },
      showPageData() {
        return (parseInt(this.setPageData.total)/parseInt(this.setPageData.size))>1
      },
      selectionLayer() {
        return this.$store.getters[this.guid+'/selectionLayer']
      },
      selectionList() {
        return this.$store.getters[this.guid+'/selectionList']
      }
    },
    created: function() {
      // if(!this.childrenConfigs.length){
      //   const configs = {
      //     showCheckBox: this.showCheckBox,
      //     showIndex: this.showIndex,
      //     isSingle: this.isSingle,
      //     isSortable: this.isSortable,
      //     isGlobalSetting: true
      //   }
      //   this.SET_CASCADETABLE(configs)
      // }else {
      //   this.SET_CASCADETABLEDEFAULT(this.childrenConfigs)
      // }
      this.guid = GUID()
      expandTableStore(this,this.guid,this.maxLayer)

    },
    mounted: function () {
      // this.$refs.baseTable.$nextTick(()=>{
      //   const el = this.$refs.baseTable.$el.querySelector('.el-table>.el-table__header-wrapper')
      //   el.style.display = 'none'
      // })
    },
    beforeDestroy() {
      unCreateStore(this.$store,this.guid)
    },
    watch: {
      initData(){
        this.formatedData.length && this.formatedData.forEach(item => {
          this.$refs.baseTable.toggleRowExpansion(item,false)
        })
        const tempObj = Object.assign({},this.initData)
        const tempData = this.getListPage(JSON.parse(JSON.stringify(tempObj.res)),tempObj.customColumn,1)
        this.$store.commit(this.guid+'/SET_DATATREE',[tempData,this.layer])
        this.$store.commit(this.guid+'/SET_CUSTOMCOL',tempObj.customColumn)
      },
      childrenData(){
        const tempObj = Object.assign({},this.childrenData)
        this.$store.commit(this.guid+'/UPDATA_DATATREE',tempObj)
        // if(tempObj.layer === (this.layer+1)){
        //   const data = this.getListPage(tempObj.res,tempObj.customColumn,this.layer+1)
        //   this.formatedData.find(item => {
        //     item.id === tempObj.row.id && (item[this.childrenKey]=data.tableData) && (item[this.configKey]=data.titleList)
        //   })
        // }
      },
      // updateViewData:{
      //   handler(newValue){
      //     console.log(newValue)
      //     updateExpandTableView(newValue)
      //   },
      //   deep: true
      // },
      updateViewData(){
        console.log(this.updateViewData)
        updateExpandTableView(this.updateViewData)
      }
    },
    methods:{
      selectable(row, index) {
        return  row.rowState === '1'
      },
      // ...mapMutations(['SET_CASCADETABLE','SET_CASCADETABLEDEFAULT']),
      expandChange(row, list){
        const state = list.some(item => {
          return item.id === row.id
        })
        if(state){
          this.expandOne && this.toggleRowExpands(list,row)
          row[this.childrenKey].length?'':this.sendChildrenRow(row,this.layer+1,[],this.layerKey,1),this.setLoadings[this.getRowIndex(row)] = true
        }else {
        }
        this.$refs.baseTable.setCurrentRow(row)
        this.$refs.baseTable.$nextTick(_ => {
          this.$refs.baseTable.doLayout()
        })

      },
      getRowIndex(row){
        return this.formatedData.findIndex(item => {
          return row.id === item.id
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

      setStyle(row) {},
      indexMethod(index) {
        return index + 1
      },
      tableRowClassName(row,index) {
        row.index = index
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
        this.$store.commit(this.guid+'/CHANGE_CHECKEDBOXSTATE',data)
        this.$emit('databridge',this.selectionList)
      },

      handleCurrentChange(pageIndex) {
        this.$emit('update:currentpage', pageIndex)
      },
      sendChildrenRow(row,layer,rowChain,key,currentpage){
        this.$emit('send-children-row',row,layer,rowChain,key,currentpage)
      },
      doLayout(){
        this.$refs.baseTable.$nextTick(_ => {
          this.$refs.baseTable.doLayout()
        })
      },
      changePage(data) {
        console.log(data)
        updateExpandTableView({_that:this,currentpage:data.currentpage,rowChain:data.rowChain})
      }
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
  .boxStyle {
    position: relative;
    overflow: hidden;
  }

</style>
