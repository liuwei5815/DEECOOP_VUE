<template>
  <el-dialog v-el-drag-dialog :title="initData.title?initData.title:title" :visible.sync="isVisible" @close="dialogClose" append-to-body :width="dialogWidth">
    <div class="" style="position: relative;overflow: hidden;">
      <div class="treeBox" style="position: absolute;top: -10px;bottom: 0;overflow: hidden;transition: right 0.3s,left 0.3s;-webkit-transition: right 0.3s,left 0.3s;-moz-transition: right 0.3s,left 0.3s;" :style="[setLayout,{width:setTreeWidth,}]">
        <div style="position: relative; box-sizing: border-box;height: 100%" :style="setPadding">
          <div style="position: absolute;top: -10px;bottom: -10px;padding: 30px 10px 20px 10px;box-sizing: border-box;background-color:#EBF0F6;" :style="setFixed">
            <base-tree v-loading="treeLoading" ref="dialogTree"
                       :data="dialogTree"
                       :treeConfigs="configs"
                       :checkedList="checkedList"
                       :keyClose="false"
                       @treedatabridge="dialogDataBridge"
                       @disable-state="disableState"></base-tree>
          </div>
          <div v-if="isScrollTree" style="position: absolute;top: 50%;transform: translate(0,-50%);width: 20px;height: 20px" :style="setArrowPosition">
            <div style="position: relative; height: 100%">
              <span v-show="isRoll" title="收起侧边栏" style="position: absolute;top: 0;left: 0;right: 0;bottom: 0;" @click="isRoll=!isRoll"><i :class="setTopArrow" style="display: block;font-size: 13px;line-height: 1.5;"></i></span>
              <span v-show="!isRoll" title="展开侧边栏" style="position: absolute;top: 0;left: 0;right: 0;bottom: 0;" @click="isRoll=!isRoll"><i :class="setBottomArrow" style="display: block;font-size: 13px;line-height: 1.5;"></i></span>
            </div>
          </div>
        </div>
      </div>
      <div style="height: 100%;box-sizing: border-box;transition: padding-right 0.3s,padding-left 0.3s;-webkit-transition: padding-right 0.3s,padding-left 0.3s;-moz-transition: padding-right 0.3s,padding-left 0.3s;" :style="setTableWidth">
        <div class="el- tableBox">
          <div v-if="setSearchList.length" style="margin: 10px 10px 0 10px;">
            <search-bar
              :searchList="setSearchList"
              @search-map="searchMap"></search-bar>
          </div>
          <div style="box-sizing: border-box;padding: 10px;overflow: auto">
            <base-table v-loading="dialogLoading"
                        ref="searchTables"
                        :data="tableData"
                        :colConfigs="tableConfigs.titleList"
                        :showCheckBox="setCheckBoxState"
                        :showIndex="setIndexState"
                        :pageData="pageData"
                        :currentpage.sync="currentpage"
                        :isSingle="setSingle"
                        :isSortable="setSortable"
                        @databridge="dataBridge"></base-table>
          </div>
          <div style="text-align: center;padding: 10px 20px;box-sizing: border-box;">
            <div class="dialog-footer">
              <el-button type="primary" @click="save">确 定</el-button>
              <el-button plain type="primary" @click="clear">清 空</el-button>
            </div>
          </div>

        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
  import {filerTableTitle} from '@/utils/common'
  import {isNumber} from '@/utils/validate'
  import searchBar from '@/components/searchBar'

  export default {
    name: "searchBar-tree-and-table",
    // props: ['initData','visible'],
    components: {
      searchBar
    },
    props: {
      initData: {
        type: Object,
        default:function () {
          return null
        }
      },
      visible: {
        type: Boolean,
        default: false
      },
      showCheckBox: {
        type: Boolean,
        default: false
      },
      showIndex: {
        type: Boolean,
        default: false
      },
      searchList: {
        type: Array,
        default: function () {
          return []
        }
      },
      isSingle: {
        type: Boolean,
        default: false
      },
      isFixed: {
        type: Number,
        default: 1
      },
      isSortable: {
        type: Boolean,
        default: false
      },
      tableBtns: {
        type: Array,
        default: function () {
          return []
        }
      },
      layout: {
        type: String,
        default: 'left'
      },
      scrollTree: {
        type: Boolean,
        default: false
      },
      width: {
        type: [String,Number],
        default: 900,
      },
      treeWidth: {
        type: [String,Number],
        default: 200,
      },
      title: {
        type: String,
        default: '树表弹窗'
      }
    },
    data() {
      return {
        isVisible: false,
        dialogLoading: false,
        checkedList: [],
        userSelectData: {},
        selectData: {},
        currentpage: 1,
        tableData: [],
        pageData: {},
        tableConfigs: {
          titleList: [],
          showCheckBox: true,
          showIndex: true,
          isSingle: true,
          isSortable: true,
          isFixed: 1,
        },
        componentKeys: [],
        treeLoading: false,
        dialogTree:[],
        checkedList: [],
        isRoll: true,
        tableParamsObj: {},



      }
    },
    /*生命周期函数开始*/
    //vue实例化之前
    beforeCreate() {

    },

    //vue实例化后调用
    created() {
      this.isVisible = this.visible
      if(this.initData.apiName && (typeof this.initData.apiName === 'object')){
        this.treeLoading = true
        this.dialogLoading = true
        if(this.initData.apiName.tree.api) {
          this.httpTreeMethod(this.initData.apiName.tree.api,this.initData.apiName.tree.params)
        }else {
          this.$message({
            message: 'apiName参数错误',
            type: 'error',
            duration: 2000
          })
        }
      }else {
        this.$message({
          message: '参数错误',
          type: 'error',
          duration: 2000
        })
      }

    },

    //挂载之前
    beforeMount() {

    },
    //真实DOM挂载后，仅限组件本身的挂载，如果存在子组件，并且需求子组件全部被挂载后进行操作，需使用vm.$nextTick顶替mounted（在mounted内部调用vm.$nextTick）；
    mounted() {


    },
    /*生命周期函数结束*/
    watch: {
      currentpage: function () {
        const paramsObj = this.getParams(this.userSelectData.nodeData)
        paramsObj['pageNo'] = this.currentpage
        this.dialogLoading = true
        this.httpTableMethod(this.initData.apiName.table.api,paramsObj,this.tableParamsObj)
      },
    },
    computed: {
      configs() {
        return {
          showDisable: this.initData.showDisable?true:false,
          keyboard: this.initData.keyboard?true:false,
          showSearch: this.initData.showSearch?true:false
        }
      },
      isScrollTree(){
        return this.scrollTree
          ?this.scrollTree
          :this.initData.scrollTree === undefined
            ?false
              :this.initData.scrollTree
      },
      setTreeWidth() {
        if(this.initData.treeWidth){
          const type = typeof this.initData.treeWidth
          if(type === 'string'){
            return this.initData.treeWidth
          }else if(type === 'number'){
            return this.initData.treeWidth + 'px'
          }else {
            return '200px'
          }
        }else {
          const type = typeof this.treeWidth
          if(type === 'string'){
            return this.treeWidth
          }else if(type === 'number'){
            return this.treeWidth + 'px'
          }else {
            return '200px'
          }
        }
      },
      setLayout() {
        if(this.initData.layoutType){
          if(this.isRoll){
            return this.initData.layoutType === 'right'?{right:0}:{left:0}
          }else {
            return this.initData.layoutType === 'right'?{right:`calc(-${this.setTreeWidth} + 15px)`}:{left:`calc(-${this.setTreeWidth} + 15px)`}
          }
        }else {
          if(this.isRoll){
            return this.layout === 'right'?{right:0}:{left:0}
          }else {
            return this.layout === 'right'?{right:`calc(-${this.setTreeWidth} + 15px)`}:{left:`calc(-${this.setTreeWidth} + 15px)`}
          }
        }
      },
      setPadding() {
        if(this.initData.layoutType){
          return this.initData.layoutType === 'right'?{paddingLeft:'10px'}:{paddingRight:'10px'}
        }else {
          return this.layout === 'right'?{paddingLeft:'10px'}:{paddingRight:'10px'}
        }
      },
      setFixed() {
        if(this.initData.layoutType){
          return this.initData.layoutType === 'right'?{left:'10px',right:0,boxShadow:'-5px 0 10px -5px rgba(0,0,0,0.3)'}:{left:0,right:'10px',boxShadow:'5px 0 10px -5px rgba(0,0,0,0.3)'}
        }else {
          return this.layout === 'right'?{left:'10px',right:0,boxShadow:'-5px 0 10px -5px rgba(0,0,0,0.3)'}:{left:0,right:'10px',boxShadow:'5px 0 10px -5px rgba(0,0,0,0.3)'}
        }
      },
      setArrowPosition() {
        if(this.initData.layoutType){
          return this.initData.layoutType === 'right'?{left:'-2px'}:{right:'-10px'}
        }else {
          return this.layout === 'right'?{left:'-2px'}:{right:'-10px'}
        }
      },
      setTopArrow() {
        if(this.initData.layoutType){
          return this.initData.layoutType === 'right'?'el-icon-d-arrow-right':'el-icon-d-arrow-left'
        }else {
          return this.layout === 'right'?'el-icon-d-arrow-right':'el-icon-d-arrow-left'
        }
      },
      setBottomArrow() {
        return this.setTopArrow === 'el-icon-d-arrow-right'?'el-icon-d-arrow-left':'el-icon-d-arrow-right'
      },
      setTableWidth() {
        const tempObj = {}
        const type = 'padding-' + (this.initData.layoutType?this.initData.layoutType:this.layout)
        //console.log(type)
        tempObj[type] = this.isRoll?this.setTreeWidth:'15px'
        return tempObj
      },
      dialogWidth(){
        if(this.initData.width){
          const type = typeof this.initData.width
          if(type === 'string'){
            return this.initData.width
          }else if(type === 'number'){
            return this.initData.width + 'px'
          }else {
            return '900px'
          }
        }else {
          const type = typeof this.width
          if(type === 'string'){
            return this.width
          }else if(type === 'number'){
            return this.width + 'px'
          }else {
            return '900px'
          }
        }
      },
      setCheckBoxState(){
        return this.showCheckBox
          ?true
          :this.initData.tableOption
            ?this.initData.tableOption.showCheckBox === undefined
              ?this.tableConfigs.showCheckBox
              :this.initData.tableOption.showCheckBox
            :this.tableConfigs.showCheckBox
      },
      setIndexState() {
        return this.showIndex
          ?true
          :this.initData.tableOption
            ?this.initData.tableOption.showIndex === undefined
              ?this.tableConfigs.showIndex
              :this.initData.tableOption.showIndex
            :this.tableConfigs.showIndex
      },
      setSingle() {
        return this.isSingle
          ?true
          :this.initData.tableOption
            ?this.initData.tableOption.isSingle === undefined
              ?this.tableConfigs.isSingle
              :this.initData.tableOption.isSingle
            :this.tableConfigs.isSingle
      },
      setSortable() {
        return this.isSortable
          ?true
          :this.initData.tableOption
            ?this.initData.tableOption.isSortable === undefined
              ?this.tableConfigs.isSortable
              :this.initData.tableOption.isSortable
            :this.tableConfigs.isSortable
      },
      setSearchList() {
        return this.searchList.length
          ?this.searchList
          :this.initData.tableOption
            ?this.initData.tableOption.searchList === undefined
              ?[]
              :this.initData.tableOption.searchList
            :[]
      },

    },
    methods: {
      getParams(data){
        const tempObj = {}
        if(!data){
          data = {}
        }
        for(const k in this.initData.apiName.table.params){
          if(this.initData.apiName.table.params.hasOwnProperty(k)){
            tempObj[k] = data[k]?data[k]:''
          }
        }
        return tempObj
      },
      checkTableParams(obj){
        for(const k in obj){
          if(obj.hasOwnProperty(k)){
            if(obj[k]){
              this.tableParamsObj[k] = obj[k]
            }
          }
        }
      },
      httpTreeMethod(api,params,data){
        this.$api[api](Object.assign(params?params:{},data?data:{})).then(res => {
          console.log(res)
          this.treeLoading = false
          this.dialogTree.push(res.result.treeList)
          this.checkTableParams(this.initData.apiName.table.params)
          this.httpTableMethod(this.initData.apiName.table.api,this.getParams(this.dialogTree[0]),this.tableParamsObj)
          this.initData.apiName.table.isInit && (this.tableParamsObj={})
        }).catch(err => {
          this.dialogLoading = false
        })
      },
      httpTableMethod(api,params,data){
        this.$api[api](Object.assign(params?params:{},data?data:{})).then(res => {
          console.log(res)
          this.dialogLoading = false
          this.getListPage(res)
        }).catch(err => {
          this.dialogLoading = false
        })
      },
      searchMap(data) {
        console.log(data)
        this.dialogLoading = true
        this.httpTableMethod(this.initData.apiName.table.api,this.getParams(this.userSelectData.nodeData),Object.assign({},data,this.tableParamsObj))
      },

      getListPage(res) {
        const that = this
        if (res) {
          res.result.titles = typeof res.result.titles === 'string'?JSON.parse(res.result.titles):res.result.titles
          res.result.varList = typeof res.result.varList === 'string'?JSON.parse(res.result.varList):res.result.varList
          res.result.pageData = typeof res.result.pageData === 'string'?JSON.parse(res.result.pageData):res.result.pageData
          const data = filerTableTitle(res.result)
          const titleList = that.addTableTitle(data)
          console.log(titleList)
          that.tableConfigs.titleList = titleList
          that.pageData = res.result.pageData
          that.tableData = res.result.varList
        }
      },

      addTableTitle(list) {
        if((this.initData.tableBtns && this.initData.tableBtns.length) || this.tableBtns.length){
          (this.initData.tableBtns.length?this.initData.tableBtns:this.tableBtns).forEach(item => {
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

      dialogClose(state) {
        this.$emit('close-dialog',this.selectData,this.initData)
      },
      dataBridge(data,state) {
        this.selectData = data
      },
      dialogDataBridge(data,state) {
        this.userSelectData = data
        console.log(this.userSelectData)
        this.dialogLoading = true
        this.httpTableMethod(this.initData.apiName.table.api,this.getParams(this.userSelectData.nodeData),this.tableParamsObj)
        if(state){
          this.isVisible = false
        }
      },
      save() {
        this.isVisible = false
      },
      clear() {
        this.$emit('close-dialog', null,this.initData)
      },
      disableState(state){
        console.log(state)
        this.$api[this.initData.apiName.tree.api](Object.assign({},this.initData.apiName.tree.params,{disableState:state})).then(res => {
          this.dialogLoading = false
          this.dialogTree = this.screenData(res)
        }).catch(err => {
          this.dialogLoading = false
        })
      },
    }
  }
</script>

<style  lang="scss" rel="text/css">
  // .treeBox {

  // }
  // .tableBox {

  // }
</style>
