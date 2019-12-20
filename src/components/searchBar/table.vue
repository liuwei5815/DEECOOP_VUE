<template>
  <el-dialog v-el-drag-dialog :title="initData.title?initData.title:'title未定义'" :visible.sync="isVisible" @close="dialogClose" append-to-body :width="dialogWidth">
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
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="save">确 定</el-button>
      <el-button plain type="primary" @click="clear">清 空</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import {filerTableTitle} from '@/utils/common'
  import {isNumber} from '@/utils/validate'
  import searchBar from '@/components/searchBar'

  export default {
    name: "searchBar-table",
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
        type: Object,
        default: function () {
          return {}
        }
      }
    },
    data() {
      return {
        isVisible: false,
        dialogLoading: false,
        configs: {
          showDisable: true,
          keyboard: true,
        },
        checkedList: [],
        userSelectData: {},
        currentpage: 1,
        tableData: [],
        pageData: {},
        tableConfigs: {
          titleList: [],
          showCheckBox: false,
          showIndex: false,
          isSingle: false,
          isSortable: false,
          isFixed: 1,
        },
        componentKeys: [],



      }
    },
    /*生命周期函数开始*/
    //vue实例化之前
    beforeCreate() {

    },

    //vue实例化后调用
    created() {
      this.isVisible = this.visible
      if(this.initData.apiName){
        this.dialogLoading = true
        if(typeof this.initData.apiName === 'string') {
          this.httpMethod(this.initData.apiName,this.initData.params)
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
        console.log(this.currentpage)
      },
    },
    computed: {
      dialogWidth(){
        if(this.initData.width){
          const type = typeof this.initData.width
          if(type === 'string'){
            return this.initData.width
          }else if(type === 'number'){
            return this.initData.width + 'px'
          }else {
            return '800px'
          }
        }else {
          return '800px'
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
      }

    },
    methods: {
      httpMethod(api,params,data){
        this.$api[api](Object.assign(params?params:{},data?data:{})).then(res => {
          console.log(res)
          this.dialogLoading = false
          this.getListPage(res)
          this.$loading().close && this.$loading().close()
        }).catch(err => {
          this.dialogLoading = false
          this.$loading().close && this.$loading().close()
        })
      },
      searchMap(data) {
        console.log(data)
        if(this.initData.apiName){
          this.httpMethod(this.initData.apiName,this.initData.params,data)
        }
      },

      getListPage(res) {
        const that = this
        if (res) {
          res.result.titles = JSON.parse(res.result.titles)
          res.result.varList = JSON.parse(res.result.varList)
          res.result.pageData = JSON.parse(res.result.pageData)
          const data = filerTableTitle(res.result)
          const titleList = that.addTableTitle(data)
          console.log(titleList)
          that.tableConfigs.titleList = titleList
          that.tableConfigs.showCheckBox = true
          that.tableConfigs.showIndex = true
          that.tableConfigs.isSingle = true
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
        this.$emit('close-dialog',this.userSelectData,this.initData)
      },
      dataBridge(data,state) {
        this.userSelectData = data
      },
      save() {
        this.isVisible = false
      },
      clear() {
        this.$emit('close-dialog', null,this.initData)
      },
    }
  }
</script>

<style scoped>

</style>
