<template>
  <el-dialog v-el-drag-dialog
             :title="initData.title?initData.title:'选择货品'"
             :visible.sync="isVisible"
             :append-to-body="inDialog"
             :close-on-click-modal="onModal"
             :close-on-press-escape="onEscape"
             :fullscreen="fullscreen"
             @open="dialogOpen"
             @close="dialogClose"
             width="1200px">
    <component v-if="showDialog" :is="dialogName" :initData="dialogData" :visible="inLinVisible" @close-dialog="closeDialog"/>

    <el-row v-loading="dialogLoading">

      <el-col :span="4" style="background-color: #F9FAFC;overflow-y: auto;padding: 8px;">
        <base-tree ref="tree"
                   :data="treeData"
                   :treeConfigs="treeConfigs"
                   @treedatabridge="treeDataBridge">
        </base-tree>
      </el-col>

      <el-col :span="20" style="height: 100%">
        <div style="height: 50px;box-sizing: border-box;padding: 7px 20px 7px 7px;">

          <el-form :inline="true" :model="tempQuery" class="form-inline" style='width: 1200px;margin: 10px auto;' label-width="90px">
            <el-col :span="5" style="max-width: 280px">
              <el-form-item :label="'货品编码：'">
                <el-input v-model="tempQuery.code" :placeholder="'货品编码'"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="5" style="max-width: 280px">
              <el-form-item :label="'货品名称：'">
                <el-input v-model="tempQuery.name" :placeholder="'货品名称'"></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="5" style="max-width: 280px">
              <el-form-item :label="'规格型号：'">
                <el-input v-model="tempQuery.spec" :placeholder="'规格型号'"></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="3" style="max-width: 90px">
              <el-form-item>
                <base-button :name="'查询'" :icon="'search'"  @myclick="this.queryTable"></base-button>
              </el-form-item>
            </el-col>
            <el-col :span="3" style="max-width: 95px">
              <el-form-item>
                <base-button :name="'重置'"  :icon="'refresh'" :plain='true' @myclick="this.resetQueryTemp"></base-button>
              </el-form-item>
            </el-col>
          </el-form>
        </div>

        <el-row :style="{'margin-top':'10px'}">
          <custom-transfer-table
            ref="trabsferTables"
            :aboveTableConfig="aboveTableConfig"
            :belowTableConfig="belowTableConfig"
            :deDuplication="false"
            :addColumns="addColumns"
            :hideColumns="hideColumns"
            :btnList="btnList"
            @table-selected="tableSelected">
          </custom-transfer-table>
        </el-row>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
  import customTransferTable from '@/components/customTransferTable'
  import searchBar from '@/components/searchBar'

  import {listPageProducts} from '@/api/product'
  import request from '@/utils/request'

  export default {
    components: {
      customTransferTable,
      searchBar
    },

    name:"productTableDialog",
    props: ['initData','visible'],

    data(){
      return {
        //默认显示列名称
        fieldCode_default:'code,name,spec,genreName,unitName,stockCount,safetyCount,lockCount,productStockCount',

        temp: {
        },
        //搜索栏数据
        tempQuery: {
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

        //树表数据集
        treeData: [],

        //树表默认参数
        treeConfigs: {
          ref: 'tree',
          showCheckBox: false,
          showIcons: false,
          showSearch: true,
          showDisable: false
        },

        //默认选中的树节点
        selectTree: {
          pid: '',
          id: '',
          layer: '',
          name: ''
        },

        //穿梭table数据
        // 配置项开始
        btnList: [
          {
            name: '确定',
            isShow: true,
            state: true,
            method: this.confrim
          },
          {
            name: '清空',
            icon: 'refresh',
            state: true,
            plain: true,
            method: this.resetQuery,
            isShow: true
          }],
        // stateBtnData: {
        // },

        //上面的表格配置项，参数同自定义基础table
        aboveTableConfig: {
          //数据接口
          apiObj: {
            apiName: 'listPageProducts',
            params: {},
          },
          //自定义列
          customColumn: [],

          //外部数据
          tempData: {
            // count: 100,
            // defaultDate: '2019-01-21'
          },

          //显示序号
          showIndex: false,

          //显示选择器
          showCheckBox: true,

          //显示列控制器
          showTableSet: false,
          //显示全部列，在列控制器开启后可用
          showAll: false,

          //左边固定的列数
          //leftFixed:2,

          //右边固定的列数
          //rightFixed:1,

          //排序配置
          sortableConfig: {
            //全局配置
            'default-sort': {//默认的排序列和列的排序顺序
              prop: 'count',//值为行数据的key
              order: 'descending'//此属性可不配置，默认为'ascending'，还可设置为'descending'
            },
            //以下属性名为行数据的key，可根据业务需求配置多个列的排序功能
            progress: {},//排序设置简易方式，key为行数据的key，值为空对象
            count: {},
          },

          //行拖拽功能
          dragTable: false,
          //是否整行拖拽
          entireRowDrag: false,//设置为true表示整行的任意位置都可以使用拖拽，默认只有按住拖拽按钮时才能拖拽一行

        },

        //下面的表格配置项，参数同自定义基础table
        belowTableConfig: {
          //数据接口（可以远程请求表格数据，注意数据不能有分页）
          // apiObj: {
          //   apiName: 'listPageLogInfo',
          //   params: {},
          // },
          //自定义列（自定义表格列需要的功能）
          customColumn: [],

          //外部数据
          tempData: {
            // count: 100,
            // defaultDate: '2019-01-21'
          },

          //显示序号
          showIndex: false,

          //显示选择器
          showCheckBox: false,

          //左边固定的列数
          //leftFixed:2,

          //右边固定的列数
          //rightFixed:1,

          //行拖拽功能
          dragTable: false,
          //是否整行拖拽
          entireRowDrag: false,//设置为true表示整行的任意位置都可以使用拖拽，默认只有按住拖拽按钮时才能拖拽一行
        },

        //增加的列（手动添加表格的列）
        addColumns: [
          // {
          //   columnIndex: 5, //表示将该配置添加到表格的第几列 (表第一列:Index:0 Index从零开始)
          //   label: '退货数量',
          //   prop: 'orderCount',
          //   componentName: 'input',
          //   width: 120,
          //   _cellConfig: {
          //     rules: [//验证规则
          //       {regexp: '^[0-9]+([.]{1}[0-9]{1,2})?$'},
          //       {greaterThan: ['0', false]},
          //     ],
          //     message: ['请输入大于零的正整数或(1,2)位小数！','不可等于零！'],//验证失败的提示语，与验证规则数组一一对应
          //   },
          // },
          // {
          //   columnIndex: 6, //表示将该配置添加到表格的第几列 (表第一列:Index:0 Index从零开始)
          //   label: '单价',
          //   prop: 'orderPrice',
          //   componentName: 'input',
          //   width: 120,
          //   _cellConfig: {
          //     rules: [//验证规则
          //       {regexp: '^[0-9]+([.]{1}[0-9]{1,4})?$'},
          //       {greaterThan: ['0', false]},
          //     ],
          //     message: ['请输入大于零的正整数或(1,4)位小数！','不可等于零！'],//验证失败的提示语，与验证规则数组一一对应
          //   },
          // },
          // {
          //   columnIndex: 7, //表示将该配置添加到表格的第几列 (表第一列:Index:0 Index从零开始)
          //   label: '退货金额',
          //   prop: 'orderSum',
          //   componentName: 'input',
          //   width: 100,
          //   _cellConfig: {
          //     compute:'self@orderCount(*)self@orderPrice',
          //   },
          // },
        ],
        //减少的列（手动删除表格的列）
        hideColumns: [
          //'remark'//表格行数据的key
        ],
        // 配置项结束

        //下面的表格里面的数据项
        tableSelectList: [],
        //穿梭table数据结束
      }
    },

    created() {
      let fieldCode = this.fieldCode_default;
      if (this.initData.fieldCode != null && this.initData.fieldCode.trim().length > 0) {fieldCode = this.initData.fieldCode.trim()}

      let queryStr = "";
      if (this.initData.queryStr != null) {queryStr = this.initData.queryStr}

      let orderStr = "";
      if (this.initData.orderStr != null) {orderStr = this.initData.orderStr} else {orderStr="prod.stock_count desc"}

      // //去除已经选择的货品id
      // let productIds = "";
      // if (this.initData.data != null && this.initData.data.length > 0) {
      //   for (let i = 0; i < this.initData.data.length; i++) {
      //     //{productId:"", productCode:"", productName:"", productSpec:"", productGenreName:"", productUnitName:"", count:""};
      //     let detail = this.initData.data[i];
      //     if (detail.productId != null && detail.productId.trim().length > 0) {
      //       productIds = productIds + detail.productId + ",";
      //     }
      //   }
      // }
      //
      // //是否需要重复 true:需要(重复数据) false:不需要(重复数据)
      // let isNeedRepeat = true;
      // if (this.initData.isNeedRepeat != null) {isNeedRepeat = this.initData.isNeedRepeat}
      // if (!isNeedRepeat) {
      //   if (productIds != null && productIds.trim().length > 0) {
      //     productIds = productIds.substring(0, productIds.lastIndexOf(","));
      //     //productIds = "'" + productIds.replace(",", "','") + "'";
      //     productIds = this.findQueryProductIds(productIds);
      //     queryStr = "prod.id not in (" + productIds + ")";
      //   }
      //   //console.log("queryStr: " + queryStr);
      // }

      this.aboveTableConfig.apiObj.params = Object.assign(
        {},
        this.aboveTableConfig.apiObj.params,
        {
          fieldCode: fieldCode,
          queryStr: queryStr,
          orderStr: orderStr,
          isdisable: "1",
        }
      );

      this.initTree()
    },

    mounted() {
      this.dialogLoading = false
      this.isVisible = this.visible
    },
    computed: {

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
      dialogOpen(){
      },

      dialogClose(data){
        this.$emit('close-dialog',data?data:{tableSelectList: this.tableSelectList})
      },

      closeDialog(data) {},


      tableSelected(list){
        this.tableSelectList = list
      },

      //////////////////////////////////////////////////////////////////////////////
      treeDataBridge(data) {
        // console.log(data)
        this.selectTree = {
          pid: data.nodeData.pid,
          id: data.nodeData.id,
          layer: data.nodeData.layer,
          name: data.nodeData.name
        }

        this.tempQuery.pid = this.selectTree.id
        this.tempQuery.layer = this.selectTree.layer
        this.aboveTableConfig.apiObj.params = Object.assign({},this.aboveTableConfig.apiObj.params,this.tempQuery)
      },

      loadTree(res){
        const newTree = []
        const root = res.result.treeList
        this.selectTree = {
          pid: root.pid,
          id: root.id,
          layer: root.layer,
          name: root.name
        }
        newTree.push(root)
        this.treeData = newTree
        this.dialogLoading = false
      },

      initTree() {
        this.dialogLoading = true
        //页面初始化列表及分页参数
        request({
          url: '/system/dictionary/treeDictionarys',
          method: 'post',
          data: {dictionaryKey: "productGenre"}
        }).then(res => {
          this.loadTree(res)
        }).catch(err => {
          this.dialogLoading = false
        })
      },

      //////////////////////////////////////////////////////////////////////////////
      // //获取货品id Sql查询字符串 例: '货品id','货品id','货品id'
      // findQueryProductIds(productIds) {
      //   let queryProductIds = '';
      //   if (productIds == null || productIds.trim().length == 0) {
      //     return queryProductIds;
      //   }
      //
      //   var productArry  = productIds.split(',');
      //   if (productArry != null && productArry.length > 0) {
      //     let arryLength = productArry.length
      //     for (let i = 0; i < productArry.length; i++) {
      //       let id_temp = "'" + productArry[i] + "'";
      //       if (i < (arryLength - 1)) {
      //         queryProductIds = queryProductIds + id_temp + ',';
      //       } else if (i == (arryLength - 1)) {
      //         queryProductIds = queryProductIds + id_temp;
      //       }
      //     }
      //   }
      //
      //   return queryProductIds;
      // },

      //查询
      queryTable(){
        this.aboveTableConfig.apiObj.params = Object.assign({},this.aboveTableConfig.apiObj.params,this.tempQuery)
      },

      //查询重置
      resetQueryTemp() {
        for(let key in this.tempQuery) {
          // console.log(key)
          this.tempQuery[key]= ''
        }
        this.aboveTableConfig.apiObj.params = Object.assign({},this.aboveTableConfig.apiObj.params,this.tempQuery)
      },

      //确定 按钮
      confrim() {
        this.$refs.trabsferTables.getTableSelected()
        this.isVisible = false;
      },
      //清空 按钮
      resetQuery(){
        this.$refs.trabsferTables.clearTableSelected()
      },

    }

  }
</script>
