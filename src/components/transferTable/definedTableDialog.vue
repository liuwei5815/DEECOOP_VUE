<template>
  <el-dialog v-el-drag-dialog :title="initData.title?initData.title:'新增'" :visible.sync="isVisible" :append-to-body="inDialog" :close-on-click-modal="onModal"
             :close-on-press-escape="onEscape" :fullscreen="fullscreen" @open="dialogOpen" @close="dialogClose" width="1200px">
    <component v-if="showDialog" :is="dialogName" :initData="dialogData" :visible="inLinVisible" @close-dialog="closeDialog"/>

    <div v-loading="dialogLoading" style="margin-top: 15px;margin-left: 10px">

      <!--顶部搜索栏开始-->
      <search-bar
        v-if="searchList.length"
        :searchList="searchList"
        :searchConfig="searchConfig"
        @search-map="searchMap"
        @send-guid="sendGuid" />

      <!--表格部分开始-->
      <el-row
        :style="{'margin-top': searchList.length?'10px':'0'}">
          <transfer-table
            ref="trabsferTables"
            :tableConfigs="tableConfigs"
            :btnList="btnList"
            :stateBtn="stateBtnData"
            :apiData="apiData"
            @table-selected="tableSelected" />
      </el-row>

    </div>
  </el-dialog>
</template>

<script>
  import transferTable from '@/components/transferTable'
  import searchBar from '@/components/searchBar'
  import {listPageProducts} from '@/api/product'

  export default {
    components: {
      transferTable,
      searchBar
    },

    name:"productTableDialog",
    props: ['initData','visible'],

    data(){
      return {
        isConfirm:false,

        temp: {
          productIds:"",
        },
        tempLable: {
        },

        //表单必填项
        rules: {
        },

        //搜索栏数据
        guid: '',
        tempQuery: {
        },
        searchList: [
          {
            label: '编码',//搜索输入框名称，必填项
            type: 'input',//搜索输入框类型，总共四种:'input','select','date','time'，必填项
            ruleType: 'string',
            mapKey: 'code',//搜索输入框绑定的key，关键参数，必填
            configs: {},//搜索输入框配置
            placeholder: '请输入编码',//占位符
          },{
            label: '名称',
            type: 'input',
            ruleType: 'string',
            mapKey: 'name',
            configs: {},
            placeholder: '请输入名称'
          },
        ],
        searchConfig: {
          hideSearchSwitch: false,//设置是否隐藏搜索列，隐藏为true,不隐藏为false，非必要设置
        },

        //弹窗功能
        dialogLoading: true,
        isVisible: false,
        inDialog: true,
        openDialogName: '',
        showDialog: false,
        inLinVisible: false,
        dialogData: {
          title: '',
          data:null,
        },

        //分页参数集合及当前默认页面
        pageData: null,
        pageNo: 1,

        //穿梭table数据
        btnList: [{
            name: '确定',
            isShow: true,
            state: true,
            method: this.toAddWarehouseIn
          },
          {
            name: '清空',
            icon: 'refresh',
            state: true,
            plain: true,
            method: this.resetQuery,
            isShow: true
          }],
        apiData: {
          apiName: 'listPageProducts',
          //params: {fieldCode: "code,name,spec,unitName,genreName,cdate"}
          params: {}
        },
        tableSelectList: [],
        stateBtnData: {
          //title:'上次盘点至今变动过的货品',
          //keyName: 'state' //改变checkedBox状态后调用接口时用参数对象中的key名，不定义默认为'isShow'。
        },
        tableConfigs: {
          showIndex: true//序号
          //isSingle: true,//单选
          //isSortable: true,//排序
        },
        tempList:[]
      }
    },

    created() {
      let queryStr = "";
      if (this.initData.queryStr != null) {queryStr = this.initData.queryStr}
      let fieldCode = "";
      if (this.initData.fieldCode != null) {fieldCode = this.initData.fieldCode}else{fieldCode="code,name,spec,unitName,genreName,stockCount,safetyCount,lockCount,productStockCount,cdate"}
      let orderStr = "";
      if (this.initData.orderStr != null) {orderStr = this.initData.orderStr}else{orderStr="prod.stock_count desc"}
      let apiName = "";
      if (this.initData.apiName != null) {apiName = this.initData.apiName}else{apiName="listPageProducts"}

      if(this.initData.searchList != null&&this.initData.searchList.length>0){
        this.searchList = this.initData.searchList
      }

      this.apiData.apiName = apiName
      this.apiData.params = {fieldCode: fieldCode, queryStr: queryStr, orderStr: orderStr};
    },

    mounted() {
      this.dialogLoading = false
      this.isVisible = this.visible
    },
    computed: {
      tableHeight() {
      },

      dialogWidth(){
        if(this.initData.width){
          const widthType = typeof this.initData.width
          if(widthType === 'number'){
            return this.initData.width+'px'
          }else if(widthType === 'string'){
            const num = parseInt(this.initData.width)
            if(num){
              return num>100?'100%':(num+'%')
            }else {
              return '300px'
            }
          }else {
            return '300px'
          }
        }else {
          return '300px'
        }
      },
      fullscreen(){
        return this.initData.fullscreen?true:false
      },
      onModal() {
        return this.initData['close-on-click-modal']?true:false
      },
      onEscape() {
        return this.initData['close-on-press-escape']?true:false
      },
      dialogName() {
        return this.openDialogName
      }
    },

    methods: {
      sendGuid(id) {
        this.guid = id
      },

      //查询按钮
      searchMap(data) {
        console.log(data)
        this.apiData.params = Object.assign({},this.apiData.params,data);
      },

      dialogOpen(){
      },

      dialogClose(data){
        this.$emit('close-dialog',data?data:{isConfirm: this.isConfirm, selectList:this.tempList})
      },

      toAddWarehouseIn() {
        this.isConfirm = true;
        this.isVisible = false;
      },

      resetQuery(){
        this.$refs.trabsferTables.clearTableSelected()
      },

      tableSelected(list){
        this.tempList = list
      },

      //弹窗功能
      closeDialog(data) {
        this.showDialog = false
      },
    }

  }
</script>
