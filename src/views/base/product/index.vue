<template>
  <div class="productManage">
    <search-bar
      v-if="searchList.length"
      :searchList="searchList"
      :searchConfig="searchConfig"
      @search-map="searchMap"
      @send-guid="sendGuid"></search-bar>

    <el-row style="border: 1px solid #E4E4E4;border-bottom: none;margin-top: 10px;transition: height 0.4s;-webkit-transition: height 0.4s;-moz-transition: height 0.4s;" :style="{height: tableHeight+'px'}">
      <el-col :span="4" class="treeStyle">
        <base-tree ref="tree" :data="treeData" :treeConfigs="treeConfigs" @treedatabridge="treeDataBridge"/>
      </el-col>

      <el-col :span="20" class="tableStyle">
        <div class="baseTable">
          <!--列表界面按钮动态加载-->
          <el-row class="tableTopBar">
            <el-col >
                <template v-for="(item, index) in configs.topBarBtnList">
                  <base-button v-show="item.isShow" :name='item.name' :icon='item.icon' :plain="item.plain" :state="item.state" :dialog="item.dialog"
                               @myclick="item.method"></base-button>
                </template>
            </el-col>
          </el-row>

          <!--列表界面table表头及数据动态加载-->
          <el-row class="tableContent">
            <custom-base-table
              ref="productIndex"
              :isSortable="false"
              :leftFixed="3"
              :varList="varList"
              :keyValue="false"
              :showIndex="false"
              :showTableSet="false"
              :showCheckBox="true"
              :customColumn="customColumn"
              :apiObj="apiObj"
              :mergeTitle="mergeTitle"
              :mergeColumn="mergeColumn"
              :mergeRow="mergeRow"
              :componentId="'productIndex'"
              :showAll="false"
              :keyMapping="keyMapping"
              @callmethod="callMethod"
              @databridge="databridge"></custom-base-table>
          </el-row>

        </div>
      </el-col>
    </el-row>

    <component v-if="showDialog" :is="dialogName" :initData="dialogData" :visible="visible" @close-dialog="closeDialog"></component>
  </div>
</template>

<script>
  import searchBar from '@/components/searchBar'
  import customBaseTable from "@/components/customTable/baseTable"

  import dialogQrcode from '@/components/dialog/dialogQrcode'
  import dialogAdd from './dialogAdd'
  import dialogEdit from './dialogEdit'
  import dialogUnit from './dialogUnit'

  import {
    listPageProducts,     //分页列表查询查询
    updateDisableProduct, //启用禁用功能
    deleteProduct,        //批量删除功能
    exportExcelProducts   //Excel导出
  } from '@/api/product'

  //字典树
  import {listTreeDictionary} from '@/api/dictionary'
  //按钮权限
  import {initMenuButtons} from '@/api/button'
  //公共方法
  import {filerTableTitle,downLoad} from '@/utils/common'

  export default {
    //子组件
    components: {
      searchBar,
      customBaseTable,

      dialogQrcode,
      dialogAdd,
      dialogEdit,
      dialogUnit
    },

    data(){
      return {
        //搜索栏数据
        guid: '',
        searchList: [
          {
            label: '货品编码',
            type: 'input',
            ruleType: 'string',
            mapKey: 'code',
            configs: {},
            placeholder: '请输入货品编码',
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
          //   label: '货品属性',
          //   type: 'input',
          //   ruleType: 'string',
          //   mapKey: 'genreName',
          //   configs: {},
          //   placeholder: '请输入货品属性'
          // },
          {
            label: '货品属性',
            type: 'cascader',
            mapKey: 'genreSelect',
            configs: {
              clearable: true,
              //system/dictionary/getDictionarys
              apiName: 'getDictionarys',
              params: {
                dictionaryKey:'productGenre',
                isglobal:'1'
              }
            },
            placeholder: '请选择'
          },
          {
            label: '自定义属性',
            type: 'input',
            ruleType: 'string',
            mapKey: 'property',
            configs: {},
            placeholder: '自定义属性'
          },
          {
            label: '货品类型',
            type: 'input',
            ruleType: 'string',
            mapKey: 'typeName',
            configs: {},
            placeholder: '请输入货品类型'
          }
        ],
        searchConfig: {
          hideSearchSwitch: false,
        },
        searchObj: {},

        /////////////////////
        //左树配置
        treeData: [],

        //树表默认参数
        treeConfigs: {
          ref: 'tree',
          showCheckBox: false,
          showIcons: false,
        },

        //默认选中的树节点
        selectTree: {
          pid: '',
          id: '',
          name: ''
        },


        /////////////////////
        //表级按钮配置
        configs: {
          //表级按钮初始化
          topBarBtnList: [
            {
              name: '新增',
              nameEn: 'add',
              isShow: true,
              icon: 'add',
              method: this.addNew
            },
            {
              name: '删除',
              nameEn: 'delete',
              isShow: true,
              icon: 'delete',
              method: this.deleteBatch
            },
            {
              name: '导出',
              nameEn: 'export',
              isShow: true,
              icon: 'export',
              method: this.exportExcel
            },{
              name: '导入',
              nameEn: 'import',
              isShow: true,
              icon: 'import',
              method: this.importExcelCallBack,
              dialog: {
                enable: true,
                data: {
                  exportUrl: '/fileUpload/excelTemplet/ProductExcelImport.xlsx',
                  importUrl: '/base/product/importExcelProduct'
                },
                dialogName:'dialogImportExcel',
              }
            }
          ],
        },

        /////////////////////
        //table配置 (custom-base-table)
        tableData: [],
        varList: [],
        apiObj: {
          apiName: 'listPageProducts',
          params: {
            fieldCode: 'code,name,spec,property,genreName,' +
                        'unitName,typeName,validityDays,remark,isdisable',
            dataType: this.$storage.get('dataType'),
          }
        },
        customColumn: [
          {
            columnIndex: 'isdisable',
            componentName: 'switch',
            _cellConfig: {
              methodName: 'switchEvent',
              hideTitle: true
            }
          },{
            columnIndex: 'last',
            prop: 'operate',
            label: '操作',

            componentName: 'button',
            //方式一：
            component: [
              {
                name: '编辑',
                nameEn: 'editBtns',
                editBtns_isShow: true,
                method: this.editBtns
              },
              {
                name: '二维码',
                nameEn: 'qrcodeBtns',
                editBtns_isShow: true,
                method: this.qrcodeBtns
              },
              {
                name: '设置单位',
                nameEn: 'unitConversion',
                editBtns_isShow: true,
                method: this.unitConversion
              }
            ],
          }
        ],

        mergeTitle: [],
        mergeColumn: [],
        mergeRow: [],
        keyMapping: {},

        /////////////////////
        //弹窗功能
        openDialogName: '',
        showDialog: false,
        visible: false,
        dialogData: {
          title: '',
          data:null,
        },
        dialogLoading: true,
        temp: {},
      }
    },

    /*生命周期函数开始*/
    beforeCreate() {

    },

    //vue实例化后调用
    created() {
      this.initTree();

    },

    //挂载之前
    beforeMount() {

    },
    //真实DOM挂载后，仅限组件本身的挂载，如果存在子组件，并且需求子组件全部被挂载后进行操作，需使用vm.$nextTick顶替mounted（在mounted内部调用vm.$nextTick）；
    mounted() {

    },

    //数据更新前调用
    beforeUpdate() {

    },

    //数据更新后调用（避免使用，最好使用计算属性或watch函数）,仅限组件本身的更新，如果存在子组件，并且需求子组件全部被更新后进行操作，需使用vm.$nextTick顶替updated（在updated内部调用vm.$nextTick）；
    updated() {

    },
    /*生命周期函数结束*/

    //方法
    methods: {


      getData(){
        this.$refs.productIndex.getData()
      },
      pushData(){
        this.$refs.productIndex.updateTable()
      },

      searchMap(data) {
        this.searchObj = data
        this.apiObj.params = Object.assign({},this.apiObj.params,this.searchObj);

      },
      sendGuid(id) {
        this.guid = id
      },

      //加载树形结构
      initTree() {
        this.dialogLoading = true
        listTreeDictionary({
          dictionaryKey: "productGenre"
        }).then(res => {
          this.loadTree(res)
        }).catch(err => {
          this.dialogLoading = false
        })
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

      treeDataBridge(data) {
        //console.log("in treeDataBridge() ");
        this.selectTree = {
          pid: data.nodeData.pid,
          id: data.nodeData.id,
          layer: data.nodeData.layer,
          name: data.nodeData.name
        }

        this.apiObj.params = Object.assign({},this.apiObj.params,{genreId:this.selectTree.id})
      },

      //关闭对话框回调函数
      closeDialog(data) {
        this.showDialog = false
        if(data.resState === 'ok'){
          this.apiObj.params = Object.assign({},this.apiObj.params,{genreId:this.selectTree.id})
        }
      },

      databridge(data) {
        this.tableData = data;
      },

      //让组件调用本页面的方法
      callMethod(obj){
        obj && obj.methodName && this[obj.methodName](obj.params)
      },

      //清空Form栏位
      resetTemp() {
        const that = this
        for(let key in that.temp) {
          // console.log(key)
          that.temp[key]= ''
        }
      },

      ///////////////////////////////
      //表级按钮方法
      //新增货品
      addNew() {
        this.resetTemp()

        //(字典id):4c4bd1b59954438c8bf56facd97a0c7e  货品属性(字典名称)
        const genre = this.selectTree.id;
        if ("4c4bd1b59954438c8bf56facd97a0c7e" == genre) {
          this.$message({
            showClose: true,
            message: '请选择正确的货品！',
            duration: 5*1000
          });
          return;
        }

        this.temp.genre = this.selectTree.id;
        this.temp.genreName = this.selectTree.name;

        this.dialogData.temp = this.temp
        this.dialogData.tempLable = this.tempLable
        this.dialogData.title = '新增'
        this.openDialogName = 'dialogAdd'
        this.showDialog = true
        this.visible = true
      },

      //删除
      deleteBatch() {
        if (this.tableData == null || this.tableData.length == 0) {
          this.$message({
            type: 'warning',
            duration: 5 * 1000,
            showClose: true,
            message: '请至少选择一项货品！',
        });
          return;
        }

        this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {

          let ids = ''
          this.tableData.forEach(item => {
            ids += item.id + ','
          })
          // this.$loading({
          //   spinner: 'none',
          //   text: '云上企业'
          // })
          deleteProduct(ids)
            .then(res => {
              if (res.code === 0) {
                this.$notify({
                  title: '成功',
                  message: '删除成功',
                  type: 'success',
                  duration: 2000
                })
                this.pushData()
              }
            }).catch(err => {
            //console.log(err)
            // this.$loading().close()
          })

        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },

      //Excel文件导出
      exportExcel() {
        //获取勾选id
        let ids = "";
        if (this.tableData != null && this.tableData.length > 0) {
          this.tableData.forEach(item => {
            ids = ids + item.id + ','
          })
        }
        exportExcelProducts(ids)
          .then(res => {
            // console.log(res)
            if (!res) {
              return
            }
            downLoad(res,"产品列表导出.xls")
            // this.$message({
            //   title: '成功',
            //   message: '导出成功',
            //   type: 'success',
            //   duration: 2000
            // })
          }).catch(err => {})
      },
      //Excel文件导入
      importExcelCallBack() {
        this.apiObj.params = Object.assign({},this.apiObj.params,{genreId:this.selectTree.id})
      },

      ///////////////////////////////
      //行级按钮-编辑
      editBtns(item, index) {
        //this.resetTemp()
        //将item对象转成json字符串，然后又将字符串转成新生成的json对象，最后将这个json对象直接传递给temp。如果直接将item对象传递给temp，那后面对temp进行数据修改同时也会对item对象进行修改。为了防止这种情况，我们采用了json转换对象的间接传递。
        this.temp = JSON.parse(JSON.stringify(item))

        this.dialogData.temp = this.temp
        this.dialogData.tempLable = this.tempLable
        this.dialogData.title = '编辑'
        this.openDialogName = 'dialogEdit'
        this.showDialog = true
        this.visible = true
      },

      //行级按钮-二维码
      qrcodeBtns(item, index) {
        //this.resetTemp()
        //将item对象转成json字符串，然后又将字符串转成新生成的json对象，最后将这个json对象直接传递给temp。如果直接将item对象传递给temp，那后面对temp进行数据修改同时也会对item对象进行修改。为了防止这种情况，我们采用了json转换对象的间接传递。
        this.temp = JSON.parse(JSON.stringify(item))

        this.dialogData.temp = this.temp
        this.dialogData.tempLable = {code:'货品编码',name:'货品名称'}
        this.dialogData.title = '二维码'
        this.openDialogName = 'dialogQrcode'
        this.showDialog = true
        this.visible = true
      },

      unitConversion(item, index){
        //this.resetTemp()
        //将item对象转成json字符串，然后又将字符串转成新生成的json对象，最后将这个json对象直接传递给temp。如果直接将item对象传递给temp，那后面对temp进行数据修改同时也会对item对象进行修改。为了防止这种情况，我们采用了json转换对象的间接传递。
        this.temp = JSON.parse(JSON.stringify(item))

        this.dialogData.temp = this.temp
        this.dialogData.tempLable = this.tempLable
        this.dialogData.title = '设置单位'
        this.openDialogName = 'dialogUnit'
        this.showDialog = true
        this.visible = true
      },

      //货品启动属性变更
      switchEvent(item, index) {
        //ajax调用启用禁用后台方法
        updateDisableProduct(item.row.id, item.row.isdisable).then(res => {
          if (res.code === 0) {
            let msgStr = "";
            if ('1' == item.row.isdisable) {
              msgStr = '该货品已启用';
            } else if ('0' == item.row.isdisable) {
              msgStr = '该货品已禁用';
            }

            this.$notify({
              title: '操作成功',
              message: msgStr,
              type: 'success',
              duration: 5000
            })
          }
        }).catch(err => {
          if(item.row.isdisable === '0'){
            item.row.isdisable = '1'
          } else if (item.row.isdisable === '1') {
            item.row.isdisable = '0'
          }
        })
      },

    },

    computed: {
      tableHeight() {
        if(this.$store.getters[this.guid+'/clientData']){
          return this.$store.getters[this.guid+'/clientData'].clientHeight - (this.searchList.length?(this.$store.getters[this.guid+'/dynaHeight'] + 30 - this.$store.getters[this.guid+'/arrowBtn']):0)
        }else {
          return 0
        }
      },
      dialogName() {
        return this.openDialogName
      }
    },

    //观察者,可监听数据
    watch: {

    }
  }


</script>

<style lang="scss" rel="text/css">
  .productManage {
    position: absolute;
    top: 10px;
    left: 10px;
    right: 10px;
    bottom: 0;
    box-sizing: border-box;
    /*border: 1px solid #E4E4E4;*/
    /*border-bottom: none;*/
    .treeStyle {
      position: relative;
      background-color: #F9FAFC;
      overflow-y: auto;
      padding: 5px;
      height: 100%;
    }
    .tableStyle {
      height: 100%;
      overflow-x: auto;
      position: relative;
      .baseTable {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        > .tableTopBar {
          box-sizing: border-box;
          padding: 10px;
        }
        > .tableContent {
          height: calc(100% - 60px);
          overflow-y: auto;
          box-sizing: border-box;
          padding: 10px;
        }
      }
    }
  }
</style>
