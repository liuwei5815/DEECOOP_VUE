<template>
  <el-dialog v-el-drag-dialog :title="initData.title?initData.title:'新增'" :visible.sync="isVisible" :append-to-body="inDialog" :close-on-click-modal="onModal"
             :close-on-press-escape="onEscape" :fullscreen="fullscreen" @open="dialogOpen" @close="dialogClose" width="1200px">
    <component v-if="showDialog" :is="dialogName" :initData="dialogData" :visible="inLinVisible" @close-dialog="closeDialog"/>

    <div v-loading="dialogLoading" style="width: 100%;">

      <!--顶部搜索栏开始-->
      <!--<div style="width: 100%; padding: 0 10px;">-->
        <search-bar
          v-if="searchList.length"
          :searchList="searchList"
          :searchConfig="searchConfig"
          @search-map="searchMap"
          @send-guid="sendGuid" />
      <!--</div>-->
      <!--表格部分开始-->
      <el-row  :style="{'margin-top': searchList.length?'10px':'0'}">
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
        //默认显示列名称
        fieldCode_default:'code,name,spec,unitName,genreName,stockCount,safetyCount,lockCount,productStockCount',

        isConfirm:false,

        temp: {
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
            label: '货品编码',//搜索输入框名称，必填项
            type: 'input',//搜索输入框类型，总共四种:'input','select','date','time'，必填项
            ruleType: 'string',
            mapKey: 'code',//搜索输入框绑定的key，关键参数，必填
            configs: {},//搜索输入框配置
            placeholder: '请输入货品编码',//占位符
          },{
            label: '货品名称',
            type: 'input',
            ruleType: 'string',
            mapKey: 'name',
            configs: {},
            placeholder: '请输入货品名称'
          },
          {
            label: '规格型号',
            type: 'input',
            ruleType: 'string',
            mapKey: 'spec',
            configs: {},
            placeholder: '请输入规格型号'
          },
          // {
          //   label: '计量单位',
          //   type: 'input',
          //   ruleType: 'string',
          //   mapKey: 'unitName',
          //   configs: {},
          //   placeholder: '请输入计量单位'
          // },
          //成品、原材料、辅料、半成品
          {
            label: '货品属性',
            type: 'select',
            ruleType: 'string',
            mapKey: 'genreName',
            configs: {
              clearable: true,
              name: '',
              options: [{
                value: '成品',
                label: '成品'
              },{
                value: '原材料',
                label: '原材料'
              },{
                value: '辅料',
                label: '辅料'
              },{
                value: '半成品',
                label: '半成品'
              },{
                value: '备件',
                label: '备件'
              },{
                value: '办公用品',
                label: '办公用品'
              }]
            },
            placeholder: '请选择'
          },

          // {
          //   label: '低于安全库存',
          //   type: 'select',
          //   ruleType: 'string',
          //   mapKey: 'lowStock',
          //   configs: {
          //     clearable: true,
          //     name: '',
          //     options: [{
          //       value: '1',
          //       label: '是'
          //     },{
          //       value: '0',
          //       label: '否'
          //     }]
          //   },
          // },
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
          // {
          //   name: '清空',
          //   icon: 'refresh',
          //   state: true,
          //   plain: true,
          //   method: this.resetQuery,
          //   isShow: true
          // },
          {
            name: '取消',
            state: false,
            method: this.closeWin,
            isShow: true
          }
          ],
        apiData: {
          apiName: 'listPageProducts',
          // params: {fieldCode: "code,name,spec,unitName,genreName,cdate"},
          params: {}
        },
        tableSelectList: [],
        stateBtnData: {
          title:'是否低于安全库存',
          keyName: 'lowStock' //改变checkedBox状态后调用接口时用参数对象中的key名，不定义默认为'isShow'。
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
      //var jsonStr = JSON.stringify(this.initData.data);
      //console.log("isNeedCustomerPrice: " + (this.initData.isNeedCustomerPrice+'');

      let fieldCode = this.fieldCode_default;
      if (this.initData.fieldCode != null && this.initData.fieldCode.trim().length > 0) {fieldCode = this.initData.fieldCode.trim()}

      let queryStr = "";
      if (this.initData.queryStr != null) {queryStr = this.initData.queryStr}

      let orderStr = "";
      if (this.initData.orderStr != null) {orderStr = this.initData.orderStr}else{orderStr="prod.stock_count desc"}

      //去除已经选择的货品id
      let productIds = "";
      if (this.initData.data != null && this.initData.data.length > 0) {
        for (let i = 0; i < this.initData.data.length; i++) {
          //{productId:"", productCode:"", productName:"", productSpec:"", productGenreName:"", productUnitName:"", count:""};
          let detail = this.initData.data[i];
          if (detail.productId != null && detail.productId.trim().length > 0) {
            productIds = productIds + detail.productId + ",";
          }
        }
      }

      //是否需要重复 true:需要(重复数据) false:不需要(重复数据)
      let isNeedRepeat = true;
      if (this.initData.isNeedRepeat != null) {isNeedRepeat = this.initData.isNeedRepeat}
      if (!isNeedRepeat) {
        if (productIds != null && productIds.trim().length > 0) {
          productIds = productIds.substring(0, productIds.lastIndexOf(","));
          //productIds = "'" + productIds.replace(",", "','") + "'";
          productIds = this.findQueryProductIds(productIds);
          queryStr = "prod.id not in (" + productIds + ")";
        }
        //console.log("queryStr: " + queryStr);
      }

      let isNeedCustomerPrice = "false";
      if (this.initData.isNeedCustomerPrice != null && true == this.initData.isNeedCustomerPrice) {
        isNeedCustomerPrice = "true";
      }

      let customerId = "";
      if (this.initData.customerId != null && this.initData.customerId.trim().length > 0) {
        customerId = this.initData.customerId.trim();
      }


      let isNeedWarehouseProduct = "false"
      if (this.initData.isNeedWarehouseProduct != null) {
        isNeedWarehouseProduct = this.initData.isNeedWarehouseProduct
      }

      let warehouseId = "";
      if (this.initData.warehouseId != null) {
        warehouseId = this.initData.warehouseId
      }

      let genreNames = "";
      if (this.initData.genreNames != null) {
        genreNames = this.initData.genreNames
      }

      //库存数量查询条件
      let stockCountQuery = '';
      if (this.initData.stockCountQuery != null) {
        stockCountQuery = this.initData.stockCountQuery
      }
      //console.log("isNeedCustomerPrice: " + isNeedCustomerPrice + " customerId:" + customerId);

      //是否显示(是否低于安全库存) isShowStateBtnData:'false'
      if (this.initData.isShowStateBtnData != null && 'false' == this.initData.isShowStateBtnData) {
        this.stateBtnData = {};
      }

      //this.apiData.apiName = "listPageProducts";
      this.apiData.params = {
        fieldCode: fieldCode,
        queryStr: queryStr,
        orderStr: orderStr,
        genreNames: genreNames,
        isNeedWarehouseProduct: isNeedWarehouseProduct,
        warehouseId: warehouseId,
        isNeedCustomerPrice:isNeedCustomerPrice,
        customerId:customerId,
        stockCountQuery:stockCountQuery,
        isdisable: "1",
      };

      //querySpare 查询备件条件
      //isNeedSpare    查询结果集只含有备件
      //isNotNeedSpare 查询结果集只含有非备件 (默认属性)
      //isSpareAll     查询结果集

      //货品属性(非备件)
      //查询过滤条件
      //查询结果集只含有备件-货品属性(备件)    isNeedSpare:isNeedGenreSpare:'true'
      //查询结果集只含有非备件-货品属性(非备件) isNotNeedSpare:isNeedNotInGenreSpare:'true'

      let querySpare = this.initData.querySpare;
      if ('isNeedSpare' == querySpare) {
        this.apiData.params.isNeedGenreSpare = 'true'
      } else if ((querySpare == null || querySpare.trim().length == 0) || 'isNotNeedSpare' == querySpare) {
        this.apiData.params.isNeedNotInGenreSpare = 'true'
      }


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
        this.apiData.params = Object.assign({}, this.apiData.params, data);

        //console.log("**************************");
        //console.log(this.apiData.params);
      },

      dialogOpen(){
      },

      closeWin(){
        this.isVisible = false;
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

      //获取货品id Sql查询字符串 例: '货品id','货品id','货品id'
      findQueryProductIds(productIds) {
        let queryProductIds = '';
        if (productIds == null || productIds.trim().length == 0) {
          return queryProductIds;
        }

        var productArry  = productIds.split(',');
        if (productArry != null && productArry.length > 0) {
          let arryLength = productArry.length
          for (let i = 0; i < productArry.length; i++) {
            let id_temp = "'" + productArry[i] + "'";
            if (i < (arryLength - 1)) {
              queryProductIds = queryProductIds + id_temp + ',';
            } else if (i == (arryLength - 1)) {
              queryProductIds = queryProductIds + id_temp;
            }
          }
        }

        return queryProductIds;
      },

      //弹窗功能
      closeDialog(data) {
        this.showDialog = false
      },
    }

  }
</script>
