<template>
  <div class="childrens">
    <el-table
      :ref="setTableRef"
      :data="formatedData"
      stripe
      border
      fit
      highlight-current-row
      tooltip-effect="dark"
      :row-key="getRowKey"
      :expand-row-keys="expandRowKeys"
      v-loading="setLoading"
      @expand-change="expandChange"
      @select="selectItem"
      @select-all="selectAllItem">
      <template v-if="layer<setMaxLayer">
        <el-table-column v-if="formatedData.length" type="expand" width="55" align="center">
          <template slot-scope="props">
            <!--<template v-if="props.row.children&&props.row.children.length">-->
              <children-table
                :data="props.row[childrenKey]"
                :layer="childrenLayer"
                :isLoading="props.row._loading && !defaultExpandAll"
                :colConfigs="props.row[configKey]"
                :pageData="props.row.pageData"
                :sets="setConfigs"
                :guid="setGuid"
                :parentData="[props.row]"
                :rowChain="setRowChain"
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
      </template>
      <template v-if="configs.showCheckBox && formatedData.length">
        <el-table-column type="selection" :fixed="fixedState" :selectable="selectable" width="55" align="center"></el-table-column>
      </template>
      <template v-if="configs.showIndex && formatedData.length">
        <el-table-column type="index" :index="indexMethod" :fixed="fixedState" label="序号" width="60" align="center"></el-table-column>
      </template>
      <template v-for="(colConfig,infoIndex) in colConfigs">
        <component v-if="colConfig.component" :key="infoIndex" :is="colConfig.component" :col-config="colConfig"></component>
        <el-table-column v-else show-overflow-tooltip :key="infoIndex" v-bind="colConfig" :sortable="configs.isSortable" :label="colConfig.label" align="center"></el-table-column>
      </template>
    </el-table>
    <div v-if="showPageData" class="resetPagination" style="height: 30px;text-align: center;margin-top: 5px;">
      <el-pagination
        small
        style="height: 30px"
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
  import { filerTableTitle, GUID} from '@/utils/common'
  import {isNumber} from '@/utils/validate'

  export default {
    name: 'children-table',
    components: {
      childrenTable
    },
    props: {
      data: {
        type: Array,
        default: function () {
          return []
        }
      },
      colConfigs: {
        type: Array,
        default: function () {
          return []
        }
      },
      layer: {
        type: Number,
        default: 2
      },
      maxLayer: {
        type: Number,
        default: 2
      },
      sets: {
        type: Object,
        default: function () {
          return {}
        }
      },
      parentData: {
        type: Array,
        default: function () {
          return []
        }
      },
      childrenData: {
        type: Object,
        default: function () {
          return {}
        }
      },
      pageData: {
        type: Object,
        default: function () {
          return {}
        }
      },
      guid: {
        type: String,
        default: ''
      },
      rowChain: {
        type: Array,
        default: function () {
          return []
        }
      },
      isLoading: {
        type: Boolean,
        default: true,
      },
      defaultExpandAll: [Boolean]

    },
    data() {
      return {
        fixedState: false,
        fixedList: [],
        expandRowKeys: [],
        childrenConfigs: {},
        getRowKey(row){
          return row.id
        },
        selectable(row, index) {
          return row.rowState === '1'
        },
        // childrenKey: 'children',
        // configKey: 'colConfig',
        setRowChain:[],
        currentpage: 1,
        elTimer: '',
      }
    },
    computed: {
      // ...mapGetters([
      //   'cascadeTableConfig',
      //   'cascadeTableDefault'
      // ]),
      setConfigs() {
        return this.sets
      },
      configs(){
        return this.setConfigs[this.layer] || {}
      },
      childrenLayer() {
        return this.layer + 1
      },
      setTableRef(){
        return 'childTable'+this.layer
      },
      formatedData(){
        // this.data.forEach((item,index) => {
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
        //     this.$set(this.data[index],this.childrenKey,[])
        //   }else {
        //     this.$set(this.data[index],'children',[])
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
        //     this.$set(this.data[index],this.configKey,[])
        //   }else {
        //     this.$set(this.data[index],'colConfig',[])
        //   }
        // })
        this.$emit('do-layout')
        return this.data
      },
      setLoadings() {
        const tempArr = []
        this.formatedData.forEach(item => {
          tempArr.push(false)
        })
        return tempArr
      },
      setLoading(){
        return this.isLoading
      },
      setMaxLayer() {
        return this.maxLayer
      },
      setLoadings() {
        const tempArr = []
        this.data.forEach(item => {
          tempArr.push(false)
        })
        return tempArr
      },
      setPageData() {
        return this.pageData
      },
      showPageData() {
        return (parseInt(this.setPageData.total)/parseInt(this.setPageData.size))>1
      },
      setGuid() {
        return this.guid
      },
      childrenKey() {
        return this.$store.getters[this.setGuid+'/keyList'][this.layer-1].childrenKey || 'children'
      },
      configKey() {
        return this.$store.getters[this.setGuid+'/keyList'][this.layer-1].configKey || 'colConfig'
      },
      layerKey() {
        return this.$store.getters[this.setGuid+'/keyList'][this.layer-1].layerKey || 'layer'
      },
      selectionLayer() {
        return this.$store.getters[this.guid+'/selectionLayer']
      },
      selectionList() {
        return this.$store.getters[this.guid+'/selectionList']
      }

    },
    created: function() {
      // if(this.cascadeTableConfig.isGlobalSetting){
      //   this.childrenConfigs = this.cascadeTableConfig
      // }else {
      //   this.childrenConfigs = this.cascadeTableDefault[this.childrenLayer-1]?this.cascadeTableDefault[this.childrenLayer-1]:this.cascadeTableDefault[this.cascadeTableDefault.length-1]
      // }
      this.setRowChain = this.rowChain.concat(this.parentData)
      if(this.selectionList.length){
        if(this.selectionLayer != this.layer){
          this.formatedData.forEach(item => {
            item.rowState = '0'
          })
        }else {
          if(this.configs.isSingle){
              this.selectionList.forEach(item => {
                this.formatedData.forEach(citem => {
                  item.id != citem.id && (citem.rowState = '0')
                })
              })
          }else {
            this.formatedData.forEach(item => {
              item.rowState = '1'
            })
          }
        }
      }

    },
    mounted: function () {},
    watch: {
      configs: function () {
        console.log(this.configs)
      },
      childrenData(){
        // const tempObj = Object.assign({},this.childrenData)
        // if(tempObj.layer === this.childrenLayer){
        //   const data = this.getListPage(tempObj.res,tempObj.customColumn,this.childrenLayer)
        //   this.formatedData.find(item => {
        //     item.id === tempObj.row.id && (item[this.childrenKey]=data.tableData) && (item[this.configKey]=data.titleList)
        //   })
        // }
      },
      formatedData(){
        if(this.configs.isSingle){
          clearTimeout(this.elTimer)
          this.elTimer = setTimeout(_=>{
            const el = this.$refs[this.setTableRef].$el.querySelector('.el-table__header-wrapper .el-checkbox')
            el.style.display = 'none'
          },10)
        }
      },
      selectionLayer(){
        if(this.selectionLayer != this.layer){
          if(this.selectionList.length){
            this.formatedData.forEach(item => {
              item.rowState = '0'
            })
          }else {
            this.formatedData.forEach(item => {
              item.rowState = '1'
            })
          }
        }else {
          if(this.configs.isSingle){
            if(this.selectionList.length){
              this.selectionList.forEach(item => {
                this.formatedData.forEach(citem => {
                  item.id != citem.id && (citem.rowState = '0')
                })
              })
            }else {
              this.formatedData.forEach(item => {
                item.rowState = '1'
              })
            }
          }else {
            this.formatedData.forEach(item => {
              item.rowState = '1'
            })
          }
        }
      },
    },
    methods:{
      indexMethod(index) {
        return index + 1
      },
      expandChange(row, list){
        const state = list.some(item => {
          return item.id === row.id
        })
        if(state){
          this.configs.expandOne && this.toggleRowExpands(list,row)
          row[this.childrenKey].length?'':this.sendChildrenRow(row,this.childrenLayer,this.setRowChain,this.layerKey,1),this.setLoadings[this.getRowIndex(row)] = true
        }else {
        }
        this.$refs[this.setTableRef].setCurrentRow(row)
        this.$refs[this.setTableRef].$nextTick(_ => {
          this.$refs[this.setTableRef].doLayout()
        })
        //this.$refs[this.setTableRef].doLayout()
        // if(this.configs.isExpands){
        //   if(list.length>1){
        //     list.forEach((item,index) => {
        //       if(item.id !== row.id){
        //         list.splice(index,1)
        //       }
        //     })
        //   }
        // }
        // this.$refs[this.setTableRef].setCurrentRow(row)
        // this.$refs[this.setTableRef].doLayout();
      },
      getRowIndex(row){
        return this.formatedData.findIndex(item => {
          return row.id === item.id
        })
      },
      toggleRowExpands(list,row){
        list.forEach(item => {
          this.$refs[this.setTableRef].toggleRowExpansion(item,item.id===row.id)
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

      selectItem(selection, row) {
        this.$emit('databridge',{selection,layer:this.layer,baseList:this.formatedData})
        setTimeout(()=>{
          if(this.configs.isSingle){
            if(selection.length){
              this.data.forEach(item => {
                item.rowState = '0'
              })
              selection[0].rowState = '1'
            }else {
              this.data.forEach(item => {
                item.rowState = '1'
              })
            }
          }
        },20)
      },
      selectAllItem(selection) {
        if(this.configs.isSingle){
          if(selection.length){
            for(let i =selection.length-1;i>=0;i--){
              selection.splice(i,1)
            }
            console.log(selection)
          }
        }else {
          this.$emit('databridge',{selection,layer:this.layer,baseList:this.formatedData})
        }
      },
      sendChildrenRow(row,layer,rowChain,key,currentpage){
        this.$emit('send-children-row',row,layer,rowChain,key,currentpage)
      },
      handleCurrentChange(pageNo) {
        console.log(this.setRowChain)
        console.log(pageNo)
        this.currentpage = pageNo
        this.changePage({currentpage:this.currentpage,rowChain:this.setRowChain})
        //this.sendChildrenRow(null,this.childrenLayer,pageIndex)
      },
      doLayout(){
        this.$emit('do-layout')
      },
      databridge(list) {
        this.$emit('databridge',list)
      },
      changePage(data) {
        this.$emit('change-page',data)
      }
    }
  }
</script>

<style lang="scss" rel="text/css">
  .childrens {
    .el-table__expanded-cell[class*=cell] {
      padding: 10px;
    }
    .resetPagination {
      >.el-pagination::before {
        display: none !important;
      }
    }
  }

</style>
