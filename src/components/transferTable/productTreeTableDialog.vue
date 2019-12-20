<template>
  <el-dialog v-el-drag-dialog :title="initData.title?initData.title:'新增'" :visible.sync="isVisible" :append-to-body="inDialog" :close-on-click-modal="onModal"
             :close-on-press-escape="onEscape" :fullscreen="fullscreen" @open="dialogOpen" @close="dialogClose" width="1200px">
    <component v-if="showDialog" :is="dialogName" :initData="dialogData" :visible="inLinVisible" @close-dialog="closeDialog"/>

    <el-row v-loading="dialogLoading">

      <el-col :span="4" style="background-color: #F9FAFC;overflow-y: auto;padding: 8px;">
        <base-tree ref="tree" :data="treeData" :treeConfigs="treeConfigs"
                   @treedatabridge="treeDataBridge"></base-tree>
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

        <el-row  :style="{'margin-top':'10px'}">
          <custom-transfer-table
            ref="trabsferTables"
            :aboveTableConfig="aboveTableConfig"
            :belowTableConfig="belowTableConfig"
            :deDuplication="false"
            :addColumns="addColumns"
            :hideColumns="hideColumns"
            :btnList="btnList"
            :stateBtn="stateBtnData"
            @table-selected="tableSelected"></custom-transfer-table>
        </el-row>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
  // import transferTable from '@/components/transferTable'
  import customTransferTable from '@/components/customTransferTable'
  import searchBar from '@/components/searchBar'
  import {listPageProducts} from '@/api/product'
  import request from '@/utils/request'
  export default {
    components: {
      customTransferTable,
      // transferTable,
      searchBar
    },

    name:"productTableDialog",
    props: ['initData','visible'],

    data(){
      return {
        temp: {
        },
        tempLable: {
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
        stateBtnData: {
          // title:'上次盘点至今变动过的货品',
          //keyName: 'state' //改变checkedBox状态后调用接口时用参数对象中的key名，不定义默认为'isShow'。
        },
        //上面的表格配置项，参数同自定义基础table
        aboveTableConfig: {
          //数据接口
          apiObj: {
            apiName: 'listPageProducts',
            params: {fieldCode: 'code,name,spec,unitName,genreName,remark'},
          },
          //自定义列
          customColumn: [//自定义列

          ],

          //外部数据
          tempData: {
            // count: 100,
            // defaultDate: '2019-01-21'
          },

          //显示序号
          showIndex: true,

          //显示选择器
          showCheckBox: true,

          //显示列控制器
          showTableSet: false,
          //显示全部列，在列控制器开启后可用
          showAll: false,

          //左边固定的列数
          leftFixed:2,

          //右边固定的列数
          rightFixed:1,

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
          customColumn: [//自定义列

          ],

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
          leftFixed:2,

          //右边固定的列数
          rightFixed:1,

          //行拖拽功能
          dragTable: false,
          //是否整行拖拽
          entireRowDrag: false,//设置为true表示整行的任意位置都可以使用拖拽，默认只有按住拖拽按钮时才能拖拽一行

        },
        //增加的列（手动添加表格的列）
        addColumns: [

          {
            columnIndex: 5,//手动增加表格列时此属性必须为数字，表示将增加的表格列添加到表格的第几列
            prop: 'ratio',//表格行数据里面的key，如果原始表格行数据里面没有此属性，那么此属性会被自动添加到行数据里面
            label: '用料比例',//表格行数据的title
            componentName: 'input',//手动添加的表格行数据需要使用的内置组件类型
            width: 120,
            //下面为使用内置组件时的配置项，用法同自定义表格
            _cellConfig: {
              //compute:'self@count(*)self@productName',
              rules: [//验证规则
                // {type: 'int'},//规则类型
                {regexp: /\d/g},
                {greaterThan: ['0',true]},
              ],
              message: ['必须为数字！','必须大于零！'],//验证失败的提示语，与验证规则数组一一对应
            }
          },
        ],
        //减少的列（手动删除表格的列）
        hideColumns: [
          'remark'//表格行数据的key
        ],
        // 配置项结束

        //下面的表格里面的数据项
        tableSelectList: [],
        //穿梭table数据结束



      }
    },

    created() {

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

      closeWin(){
        this.isVisible = false;
      },

      dialogClose(data){
        this.$emit('close-dialog',data?data:{tableSelectList: this.tableSelectList})
      },


      //弹窗功能
      closeDialog(data) {
        this.showDialog = false
      },


      //数据出口
      tableSelected(list){
        console.log(list,'tableSelected')
        this.tableSelectList = list
      },

      //穿梭table的自定义方法
      confrim(){
        //取出自定义穿梭表中的数据项
        this.$refs.trabsferTables.getTableSelected()
      },
      resetQuery(){
        // 清空自定义穿梭表中的数据项
        this.$refs.trabsferTables.clearTableSelected()
      },


      //通过搜索栏查询，加载table列表
      queryTable(){
        this.aboveTableConfig.apiObj.params = Object.assign({},this.aboveTableConfig.apiObj.params,this.tempQuery)
      },

      //查询条件重置
      resetQueryTemp() {
        for(let key in this.tempQuery) {
          // console.log(key)
          this.tempQuery[key]= ''
        }
        this.aboveTableConfig.apiObj.params = Object.assign({},this.aboveTableConfig.apiObj.params,this.tempQuery)
      },





      initTree() {
        const that = this
        that.dialogLoading = true
        //页面初始化列表及分页参数
        request({
          url: '/system/dictionary/treeDictionarys',
          method: 'post',
          data: {dictionaryKey: "productGenre"}
        }).then(res => {
          that.loadTree(res)
        }).catch(err => {
          console.log(err)
          that.dialogLoading = false
        })

      },

      loadTree(res){
        const that = this
        const newTree = []
        const root = res.result.treeList
        that.selectTree = {
          pid: root.pid,
          id: root.id,
          layer: root.layer,
          name: root.name
        }
        newTree.push(root)
        that.treeData = newTree
        that.dialogLoading = false
      },




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
    }

  }
</script>
