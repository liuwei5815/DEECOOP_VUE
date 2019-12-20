<template>
  <div class="employeeContract">
    <!--界面查询搜索栏开始-->
    <search-bar
      v-if="searchList.length"
      :searchList="searchList"
      :searchConfig="searchConfig"
      @search-map="searchMap"
      @send-guid="sendGuid"></search-bar>
    <!--界面查询搜索栏结束-->

    <!--TABLE栏开始-->
    <el-row style="border: 1px solid #E4E4E4;border-bottom: none;margin-top: 10px;transition: height 0.4s;-webkit-transition: height 0.4s;-moz-transition: height 0.4s;" :style="{height: tableHeight+'px'}">
      <el-col :span="4" class="treeStyle">
        <base-tree ref="tree" :data="treeData" :treeConfigs="treeConfigs" @treedatabridge="treeDataBridge"></base-tree>
      </el-col>

      <el-col :span="20" class="tableStyle">
        <div class="baseTable">
          <!--列表界面按钮动态加载-->
          <!--
          <el-row class="tableTopBar">
            <el-col >
              <div class="tableBtns">
                <template v-for="(item, index) in configs.topBarBtnList">
                  <base-button v-show="item.isShow" :name='item.name' :icon='item.icon' :plain="item.plain" :state="item.state" :dialog="item.dialog"
                               @myclick="item.method"></base-button>
                </template>
              </div>
            </el-col>
          </el-row>
          -->

          <!--列表界面table表头及数据动态加载-->
          <el-row class="tableContent">
            <base-table :data="tableData" :colConfigs="configs.tableConfigs" :showCheckBox="configs.showCheckBox"
                        :showIndex="configs.showIndex" @databridge="dataBridge"  :pageData="pageData" :currentpage.sync="pageNo"></base-table>
          </el-row>

        </div>
      </el-col>
    </el-row>
    <!--TABLE栏结束-->

    <!--弹窗控件开始-->
    <component v-if="showDialog" :is="dialogName" :initData="dialogData" :visible="visible" @close-dialog="closeDialog"></component>

  </div>
</template>

<script >
  //组件
  import searchBar from '@/components/searchBar'
  //修改员工合同到期日期
  import employeeContractEdit from './employeeContractEdit'
  import employeeInfo from './employeeInfo'

  // 部门岗位树
  import {treeDeptPosts} from '@/api/post'
  import {listPageEmployees} from '@/api/employee'

  //按钮权限
  import {initMenuButtons} from '@/api/button'
  //公共方法
  import {filerTableTitle,downLoad} from '@/utils/common'
  import i18n from '@/lang'

  //table操作栏里面的按钮
  const operateBtns = {
    props: ['colConfig'],
    template: `<el-table-column :label="colConfig.label" :sortable="colConfig.sortable" align="center">
      					<div slot-scope="scope" class="btnBox">
      							<el-button v-show="colConfig.editByRow_isShow" type="text" class="btns" style="font-size: 12px;" @click="colConfig.editByRow(scope.row,scope.$index)">编辑</el-button>
      							<el-button v-show="colConfig.infoByRow_isShow" type="text" class="btns" style="font-size: 12px;" @click="colConfig.infoByRow(scope.row,scope.$index)">详情</el-button>
      					</div>

    				</el-table-column>`
  }

  export default {
    //子组件
    components: {
      searchBar,
      employeeContractEdit,
      employeeInfo
    },

    //数据
    data() {
      return {
        //搜索栏数据
        guid: '',
        searchList: [
          {
            label: '员工编号',
            type: 'input',
            ruleType: 'string',
            mapKey: 'code',
            configs: {},
            placeholder: '员工编号'
          },{
            label: '姓名',
            type: 'input',
            ruleType: 'string',
            mapKey: 'name',
            configs: {},
            placeholder: '员工姓名'
          },{
            label: '合同到期起',
            type: 'date',
            ruleType: 'date',
            mapKey: 'contractDateBegin',
            configs: {
              clearable: true,
              name: '',
              type: 'date',
              pickerOptions: {
                //可用的时间范围，字符串数组，前一个为可用的开始时间，后一个为可用的结束时间
                //disabledDate: ['2018-09-15','2018-10-20']
                hidePicker: true,
              }
            },
            placeholder: '请选择'
          },{
            label: '合同到期止',
            type: 'date',
            ruleType: 'date',
            mapKey: 'contractDateEnd',
            configs: {
              clearable: true,
              name: '',
              type: 'date',
              pickerOptions: {
                //可用的时间范围，字符串数组，前一个为可用的开始时间，后一个为可用的结束时间
                //disabledDate: ['2018-09-15','2018-10-20']
                hidePicker: true,
              }
            },
            placeholder: '请选择'
          }
        ],
        searchConfig: {
          hideSearchSwitch: false,//设置是否隐藏搜索列，隐藏为true,不隐藏为false，非必要设置
        },

        //弹窗功能
        openDialogName: '',
        showDialog: false,
        visible: false,
        dialogData: {
          title: '',
          temp:null,
          tempLable:null,
          nodeId: null
        },

        /*初始化数据*/
        initConfigs: {
          //行级按钮初始化
          tableOperates: {
            prop: 'operate',
            label: '操作',
            enLabel: 'operation',
            isPropName: true,
            component: operateBtns,

            editByRow: this.editByRow,
            editByRow_isShow: true,

            infoByRow: this.infoByRow,
            infoByRow_isShow: true,
          },
        },
        configs: {
          //表级按钮初始化
          topBarBtnList: [
            // {
            //   name: '新增',
            //   nameEn: 'add',
            //   isShow: true,
            //   icon: 'add',
            //   method: this.addWarehouse //自定义按钮方法-新增
            // },
          ],
          tableConfigs: [],
          showCheckBox: false,//是否显示行级单选框
          showIndex: false    //是否显示行号
        },

        //树表数据集
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

        //table数据集
        tableData: [],
        //行数据选择列表
        selectList: null,

        // form表单字段值map集合
        temp: {
        },
        // form查询字段值map集合
        tempQuery: {
        },
        // form表单标签名称map集合
        tempLable: {
        },

        //分页参数集合及当前默认页面
        pageData: null,
        pageNo: 1,
      }
    },

    /*生命周期函数开始*/
    //vue实例化之前
    beforeCreate() {

    },

    //vue实例化后调用
    created() {
      //按钮初始化
      this.initButtons()

      //加载左树右表
      this.initTree()
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
      //搜索栏功能
      searchMap(data) {
        this.tempQuery = data
        this.pageNo = 1
        this.initTable(null, this.selectTree.id)
      },
      sendGuid(id) {
        this.guid = id
      },

      //关闭对话框回调
      closeDialog(data) {
        this.showDialog = false
        if(data.resState === 'ok'){
          this.initTree()
        }
      },

      initButtons(){
        const that = this
        const roleId = that.$storage.get('userInfo').roleIds
        const menuId = that.$storage.get('menuId');
        if(roleId){
          that.$loading({
            spinner: 'none',
            text: '云上企业'
          })
          //初始化按钮
          initMenuButtons({
            //参数
            menuId: menuId,
            roleId: roleId
          }).then(res => {
            let buttonList =  res.buttonList
            if(buttonList){

              buttonList.forEach(item => {

                if(that.initConfigs){
                  if(that.initConfigs.tableOperates){
                    for (let key in that.initConfigs.tableOperates) {
                      if(key.indexOf(item.nameEn)>=0 && key.indexOf("isShow")>0){
                        that.initConfigs.tableOperates[key] = false
                      }
                    }
                  }
                }

                if(that.customColumn){
                  for (let children in that.customColumn) {
                    if(children){
                      let childrenList = that.customColumn[children]
                      if(childrenList.length>0){
                        childrenList.forEach(option => {
                          if(option){
                            for (let key in option) {
                              if(key.indexOf(item.nameEn)>=0 && key.indexOf("isShow")>0){
                                option[key] = false
                              }
                            }
                          }
                        })
                      }
                    }
                  }
                }

                if(that.configs){
                  if(that.configs.queryBarBtnList){
                    that.configs.queryBarBtnList.forEach(queryBtn=> {
                      if(queryBtn.nameEn==item.nameEn){
                        queryBtn.isShow = false
                      }
                    })
                  }

                  if(that.configs.topBarBtnList){
                    that.configs.topBarBtnList.forEach(topBtn=> {
                      if(topBtn.nameEn==item.nameEn){
                        //console.log(topBtn)
                        topBtn.isShow = false
                      }
                    })
                  }
                }

              })

            }
          }).catch(err => {
            //console.log(err)
            that.$loading().close()
          })
        }
      },

      //初始化字典树
      initTree() {
        const that = this
        //let postDisable = "1"
        //let deptDisable = "1"

        //页面初始化列表及分页参数
        treeDeptPosts({
          postDisable: '1',
          deptDisable: '1',
          deptID: that.$storage.get('userInfo').companyId
        }).then(res => {
          const newTree = []
          const root = res.result.treeList
          that.selectTree = {
            pid: root.pid,
            id: root.id,
            name: root.name,
            type: root.type,
            layer: root.layer,
            deptName: root.deptName,
            postName: root.postName
          }

          newTree.push(root)
          that.treeData = newTree
          that.initTable(that.selectTree.id, that.selectTree.type, that.selectTree.layer,true)

          //that.initTable(true, that.selectTree.id)
          that.$nextTick(function () {
            that.$refs.tree.$children[0].setCurrentKey(that.selectTree.id)
          })
          // that.$loading().close()
        }).catch(err => {
          that.$loading().close()
        })
      },

      //加载树形结构
      treeDataBridge(data) {
        const that = this
        that.selectTree = {
          pid: data.nodeData.pid,
          id: data.nodeData.id,
          name: data.nodeData.name,
          type: data.nodeData.type,
          layer: data.nodeData.layer,
          deptName: data.nodeData.deptName,
          postName: data.nodeData.postName
        }
        that.pageNo=1
        that.initTable(that.selectTree.id, that.selectTree.type, that.selectTree.layer)
      },
      // disableState(isdisable){
      //   // console.log(isdisable)
      //   this.initTree()
      //   // const that = this
      //   // circleTree(that.treeData,isdisable,that.filterTextDept,that.treeNodes)
      // },

      //加载table列表
      initTable(id, type, layer, isClosedLoading){
        const that = this

        //页面初始化列表及分页参数
        listPageEmployees({
          ...that.tempQuery,
          fieldCode: 'code,name,sexName,deptName,' +
                      'entryDate,contractDate,contractDay,remark',
          id: id,
          type: type,
          layer: layer,
          dataType: this.$storage.get('dataType'),
          //isdisableByQuery: 1:在职 0:离职
          isdisableByQuery: '1',
          orderStr: 'employeeContract.contractDay asc',
          pageNo: that.pageNo
        }).then(res => {
          if(isClosedLoading){
            that.$loading().close()
          }
          that.getListPage(res)
        }).catch(err => {
          //console.log(err)
          that.$loading().close()
        })
      },

      //加载table列头及列表数据
      getListPage(res) {
        const that = this
        if (res) {
          //分页参数
          that.pageData = res.result.pageData

          //列表标签可编辑属性、国际化初始化
          that.initTempData(res.result.titles)

          const data = filerTableTitle(res.result)
          const titleList = that.addTableTitle(data)
          that.configs.tableConfigs = titleList
          that.configs.showCheckBox = true
          that.tableData = res.result.varList

          that.configs.topBarBtnList.forEach(item => {
            if(item.nameEn=='delete'){
              item.state = true  //删除按钮的状态变更
            }
          })
        }
      },

      initTempData(titles){
        const that = this
        titles.forEach(item => {
          for(let k in item) {
            let label = item[k]
            if(label.indexOf("_")>0){
              if(i18n.locale == "en"){
                label = label.substring(label.indexOf("_")+1)
              }else if(i18n.locale == "zh"){
                label = label.substring(0,label.indexOf("_"))
              }
            }
            //from表单常规字段国际化处理   注意尽量使表单字段key要与列表查询的key保持一致
            that.tempLable[k]=label;
            //from表单常规字段不可编辑状态设置   注意尽量使表单字段key要与列表查询的key保持一致
            // that.tempNotEditable[k]=false;

          }
        })
        //console.log(that.tempLable)
      },

      //自定义状态列
      addTableTitle(list) {
        const that = this
        list.forEach(item => {
          //title国际化处理
          let labelName = item.label
          if(labelName.indexOf("_")>0){
            if(i18n.locale == "en"){
              item.label = labelName.substring(labelName.indexOf("_")+1)
            }else if(i18n.locale == "zh"){
              item.label = labelName.substring(0,labelName.indexOf("_"))
            }
          }

        })
        that.internationalConfig()
        list.push(that.initConfigs.tableOperates)
        return list
      },

      //国际化设置
      internationalConfig(){
        const that = this
        if(i18n.locale == "en"){
          //列表操作列国际化处理
          that.initConfigs.tableOperates.label="OPERATE"
          //form表单特殊字段国际化处理
          // that.tempLable[key]=英文名
        }else if(i18n.locale == "zh"){
          //列表操作列国际化处理
          that.initConfigs.tableOperates.label="操作"
          //form表单特殊字段国际化处理
          // that.tempLable[key]=中文名
        }
      },

      //通过单选框触发事件 获取table组件传回的数据
      dataBridge(data) {
        const that = this
        that.selectList = data
        if (data.length) {
          that.configs.topBarBtnList.forEach(item => {
            if(item.nameEn=='delete'){
              item.state = false  //删除按钮的状态变更
            }
          })
        } else {
          that.configs.topBarBtnList.forEach(item => {
            if(item.nameEn=='delete'){
              item.state = true  //删除按钮的状态变更
            }
          })
        }
      },
      /////////////////////////////////////////////////////////////////////////////////////////////////////////////////

      //行级按钮-编辑
      editByRow(item, index) {
        let rowData = JSON.parse(JSON.stringify(item));

        this.dialogData.rowData = rowData;
        this.dialogData.title = '员工合同到期日期变更'
        this.openDialogName = "employeeContractEdit";
        this.showDialog = true
        this.visible = true
      },

      infoByRow(item, index) {
        let rowData = JSON.parse(JSON.stringify(item));

        this.dialogData.rowData = rowData;
        this.dialogData.title = '详情'
        this.openDialogName = "employeeInfo";
        this.showDialog = true
        this.visible = true
      },

      //
      // findEditByRowdata(rowData) {
      //   let layer = rowData.layer;
      //   //实体库 2d75e49bcb9911e884ad00163e105f05
      //   //虚拟库 56f5e83dcb9911e884ad00163e105f05
      //   let pid = rowData.pid;
      //   //单位属性(1:内部单位 2:外部单位)
      //   //let virtualGenre = rowData.virtualGenre;
      //
      //   let EditPage = "";
      //   if ("0,1".indexOf(layer) != -1) {
      //     this.$message({
      //       showClose: true,
      //       message: '系统数据不可修改!',
      //       duration: 5 * 1000
      //     });
      //     return;
      //   } else if ("2" == layer) {
      //     //实体库 2d75e49bcb9911e884ad00163e105f05 warehouseEntityEdit
      //     //虚拟库 56f5e83dcb9911e884ad00163e105f05 warehouseVirtualEdit
      //     if ("2d75e49bcb9911e884ad00163e105f05" == pid) {
      //       EditPage = "warehouseEntityEdit";
      //       return EditPage;
      //     } else if ("56f5e83dcb9911e884ad00163e105f05" == pid) {
      //       EditPage = "warehouseVirtualEdit";
      //       return EditPage;
      //     }
      //   } else if (3 <= layer) {
      //     EditPage = "warehousePositionEdit";
      //   }
      //
      //   return EditPage;
      // },

      // //行级按钮-二维码
      // qrcodeByRow(item, index) {
      //   //this.resetTemp()
      //   //将item对象转成json字符串，然后又将字符串转成新生成的json对象，最后将这个json对象直接传递给temp。如果直接将item对象传递给temp，那后面对temp进行数据修改同时也会对item对象进行修改。为了防止这种情况，我们采用了json转换对象的间接传递。
      //   this.temp = JSON.parse(JSON.stringify(item))
      //
      //   this.dialogData.temp = this.temp
      //   this.dialogData.tempLable = this.tempLable
      //   this.dialogData.title = '二维码'
      //   this.openDialogName = 'dialogQrcode'
      //   this.showDialog = true
      //   this.visible = true
      // },

      // deleteByRow(item, index) {
      //   let rowData = JSON.parse(JSON.stringify(item));
      //
      //   this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
      //     confirmButtonText: '确定',
      //     cancelButtonText: '取消',
      //     type: 'warning'
      //   }).then(() => {
      //     deleteWarehouse(rowData.id)
      //       .then(res => {
      //         if (res.code === 0) {
      //           this.$notify({
      //             title: '成功',
      //             message: '删除成功',
      //             type: 'success',
      //             duration: 2000
      //           })
      //           this.initTree()
      //         }
      //       }).catch(err => {
      //       //console.log(err)
      //     })
      //   }).catch(() => {
      //     this.$message({
      //       type: 'info',
      //       message: '已取消删除'
      //     });
      //   });
      // },

      // //Table列表刷新
      // refreshTable() {
      //   const that = this
      //   that.$axios.all([
      //     listPageWarehouse({
      //       ...that.tempQuery,
      //       nodeId: that.selectTree.id,
      //       pageNo:that.pageNo
      //     })
      //   ]).then(that.$axios.spread((res) => {
      //     that.getListPage(res)
      //   })).catch((error) => {
      //     //console.log(error)
      //   })
      // },

      //创建仓库
      addWarehouse() {

      },


    },

    //计算属性
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

    //观察者,可监听数据，属性和方法
    watch: {
      pageNo: function () {
        const that = this
        that.initTable(null, that.selectTree.id)
      }
    }
  }
</script>


<style lang="scss" rel="text/css">
  .employeeContract {
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
          height: 100%;
          overflow-y: auto;
          box-sizing: border-box;
          padding: 10px;
        }
      }
    }
  }
</style>
