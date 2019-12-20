<template>
  <div class="equipmentManage">
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
        <!--<div style="width: 90%;margin: 5px auto">-->
          <!--<el-input v-on:keyup.enter.native="searchDeptByName" :placeholder="'部门名称'" v-model="filterTextDept" clearable>-->
            <!--<i slot="suffix" class="el-input__icon el-icon-search"></i>-->
          <!--</el-input>-->
        <!--</div>-->
        <!--<div style="padding:5px 0px 10px 20px">-->
          <!--<el-checkbox v-model="showDisableDept">显示封存部门</el-checkbox>-->
        <!--</div>-->
        <div style="padding-left: 20px;height: 100%">
          <base-tree ref="tree" :data="treeData" :treeConfigs="treeConfigs"
                     @treedatabridge="treeDataBridge" @disable-state="disableState"></base-tree>
        </div>
      </el-col>

      <el-col :span="20" class="tableStyle">
        <div class="baseTable">
          <!--列表界面按钮动态加载-->
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
    <!--弹窗控件结束-->

  </div>
</template>

<script >
  //组件
  import searchBar from '@/components/searchBar'
  import dialogAdd from './dialogAdd'
  import dialogEdit from './dialogEdit'
  import dialogQrcode from '@/components/dialog/dialogQrcode'
  import i18n from '@/lang'

  import {
    listPageEquipments,     //分页列表查询查询
    updateDisableEquipment, //启用禁用功能
    deleteEquipments,        //批量删除功能
    exportExcelEquipments   //Excel导出
  } from '@/api/equipment'
  //部门树
  import { listTreeDepartment } from '@/api/department'
  //按钮权限
  import {initMenuButtons} from '@/api/button'
  //公共方法
  import {filerTableTitle,circleTree,downLoad} from '@/utils/common'



  //	  table操作栏里面的按钮
  const operateBtns = {
    props: ['colConfig'],
    template: `<el-table-column :label="colConfig.label" :sortable="colConfig.sortable" align="center">
      					<div slot-scope="scope" class="btnBox">
      							<el-button  v-show="colConfig.editBtns_isShow" type="text" class="btns" style="font-size: 12px;" @click="colConfig.editBtns(scope.row,scope.$index)">编辑</el-button>
      							<el-button  v-show="colConfig.qrcodeBtns_isShow" type="text" class="btns" style="font-size: 12px;" @click="colConfig.qrcodeBtns(scope.row,scope.$index)">二维码</el-button>
      					</div>

    				</el-table-column>`
  }
  //	  table状态栏里面的按钮
  const stateBtns = {
    props: ['colConfig'],
    template: `<el-table-column :label="colConfig.label" :sortable="colConfig.sortable" align="center">
						<div slot-scope="scope">
    						<el-switch active-value="1" inactive-value="0" v-model="scope.row.isdisable" @change="colConfig.changeState(scope.row,scope.$index)"></el-switch>
    					</div>
    			   </el-table-column>`
  }



  export default {
    //数据
    data() {
      return {
        //搜索栏数据
        guid: '',
        searchList: [
          {
            label: '设备编码',//搜索输入框名称，必填项
            type: 'input',//搜索输入框类型，总共四种:'input','select','date','time'，必填项
            //ruleType: 'int',//效验规则，非必填项。总共11种:'code','date','time','mobile','email','url','zh','en','identity','float','int'
            //ruleOps: {//效验规则参数，非必填项
            //min: 6,//最小长度，有len参数时无效，在'code','zh','en'规则下有效。
            //max: 7,//最大长度，有len参数时无效，在'code','zh','en'规则下有效。
            //len: 5,//总长度，在'code','zh','en'规则下有效。
            //customReg: '^[A-Za-z0-9]$'//自定义效验正则，定义此项则'min','max','len'属性无效
            //},
            mapKey: 'code',//搜索输入框绑定的key，关键参数，必填
            configs: {},//搜索输入框配置
            placeholder: '设备编码',//占位符
          },{
            label: '设备名称',
            type: 'input',
            ruleType: 'string',
            mapKey: 'name',
            configs: {},
            placeholder: '设备名称'
          },{
            label: '是否启用',
            type: 'select',
            ruleType: 'string',
            mapKey: 'isdisable',
            configs: {
                  clearable: true,
                  name: '',
                  options: [{
                    value: '1',
                    label: '是'
                  },{
                    value: '0',
                    label: '否'
                  }]
            },
            placeholder: '请选择'
          },{
            label: '设备类型',
            type: 'input',
            ruleType: 'string',
            mapKey: 'typeName',
            configs: {},
            placeholder: '设备类型'
          },{
            label: '所属部门',
            type: 'input',
            ruleType: 'string',
            mapKey: 'deptName',
            configs: {},
            placeholder: '所属部门'
          },

        ],
        searchConfig: {
          hideSearchSwitch: false,//设置是否隐藏搜索列，隐藏为true,不隐藏为false，非必要设置
        },

        //弹窗功能
        openDialogName: '',
        showDialog: false,
        visible: false,
        dialogData: {
          //width: '600px',
          title: '',
          temp:null,
          tempLable:null,
        },

        /*初始化数据*/
        initConfigs: {
          //行级按钮初始化
          tableOperates: {
            prop: 'operate',
            label: '操作',
            enLabel: 'operation',
            btnName: '编辑',
            isPropName: true,
            component: operateBtns, //自定义按钮组件
            editBtns: this.editBtns, //自定义按钮方法-编辑
            editBtns_isShow: true,
            qrcodeBtns: this.qrcodeBtns, //自定义按钮方法-查看员工
            qrcodeBtns_isShow: true,
          },
        },
        configs: {

          //表级按钮初始化
          topBarBtnList: [
            {
              name: '新增',
              nameEn: 'add',
              isShow: true,
              icon: 'add',
              method: this.addNew //自定义按钮方法-新增
            },
            {
              name: '删除',
              nameEn: 'delete',
              isShow: true,
              icon: 'delete',
              plain: true,
              state: true,
              method: this.deleteBatch//自定义按钮方法-删除
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
                  exportUrl: '/fileUpload/excelTemplet/EquipmentExcelImport.xlsx',
                  importUrl: '/base/equipment/importExcelEquipments'
                },
                dialogName:'dialogImportExcel',
              }
            }
          ],
          tableConfigs: [],
          showCheckBox: false,//是否显示行级单选框
          showIndex: false    //是否显示行号
        },



        //树搜索框文本查询
        filterTextDept: '',
        //树搜索框回车查询次数
        enterTime: 0,
        //树 是否显示封存部门，默认不显示
        showDisableDept: false,
        //通过搜索框查询到的树节点集合
        treeNodes: [],

        //树表数据集
        treeData: [],

        //树表默认参数
        treeConfigs: {
          ref: 'tree',
          showCheckBox: false,
          showIcons: false,
          //showSearch: true,
          //showDisable: true
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

    //子组件
    components: {
      searchBar,
      dialogAdd,
      dialogEdit,
      dialogQrcode,
    },

    /*生命周期函数开始*/
    //vue实例化之前
    beforeCreate() {

    },

    //vue实例化后调用
    created() {
      const that = this
      //按钮初始化
      that.initButtons()

      //加载左树右表
      that.initTree()

      //加载table列表
      //that.initTable(true)
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
        this.initTable(this.selectTree.id,this.selectTree.layer)
      },
      sendGuid(id) {
        this.guid = id
      },
      //弹窗功能
      closeDialog(data) {
        // console.log(data)
        this.showDialog = false
        if(data.resState === 'ok'){
          this.refreshTable()
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
                        console.log(topBtn)
                        topBtn.isShow = false
                      }
                    })
                  }
                }

              })

            }
          }).catch(err => {
            console.log(err)
            that.$loading().close()
          })
        }
      },

      initTree() {
        const that = this
        //页面初始化列表及分页参数
        //*******************************************************用户自定义修改 start ***************************************************************************
        listTreeDepartment({
        }).then(res => {

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

          that.treeNodes = []


          //初次不显示已封存节点
          circleTree(that.treeData,that.showDisableDept,that.filterTextDept,that.treeNodes)
          that.$nextTick(function () {
            if(that.treeNodes.length>0){
              let selectTreeNode = that.treeNodes[0]
              that.selectTree = {
                pid: selectTreeNode.pid,
                id: selectTreeNode.id,
                layer: selectTreeNode.layer,
                name: selectTreeNode.name
              }
            }
            //that.$refs.tree.$children[0].setCurrentKey(that.selectTree.id)
            that.initTable(that.selectTree.id,that.selectTree.layer,true)
          })


        }).catch(err => {
          console.log(err)
          that.$loading().close()
        })

      },

      //加载树形结构
      treeDataBridge(data) {
        //console.log("in treeDataBridge() ");
        const that = this
        that.selectTree = {
          pid: data.nodeData.pid,
          id: data.nodeData.id,
          layer: data.nodeData.layer,
          name: data.nodeData.name
        }
        that.pageNo=1
        that.initTable(that.selectTree.id,that.selectTree.layer)
      },

      //树形结构-是否显示全部
      disableState(state){
        console.log(state)
      },

      //加载table列表
      initTable(pid,layer,isClosedLoading){
        const that = this

        //页面初始化列表及分页参数
        //*******************************************************用户自定义修改 start ***************************************************************************
        listPageEquipments({
          //参数
          ...that.tempQuery,
          pid: pid,
          layer: layer,
          dataType: this.$storage.get('dataType'),
          pageNo:that.pageNo
        }).then(res => {
          that.getListPage(res)
          if(isClosedLoading){
            that.$loading().close()
          }
        }).catch(err => {
          // console.log(err)
          that.$loading().close()
        })

        //部门类型下拉列表初始化
        // that.handleDeptTypeFocus()

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
          // console.log(titleList)
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
          }
        })
        console.log(that.tempLable)
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

          //列表特殊字段处理
          if (item.label ===  '是否启用') {
            item.component = stateBtns
            item.changeState = that.changeState
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



      //自定义状态列回调函数
      changeState(item, index) {
        // console.log(item)
        // console.log(index)
        const that = this
        //ajax调用启用禁用后台方法
        updateDisableEquipment(item.id,item.isdisable )
          .then(res => {
          }).catch(err => {
          console.log(err)
        })
      },

      //通过单选框触发事件 获取table组件传回的数据
      dataBridge(data) {
        // console.log("*********"+data)
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



      //行级按钮-编辑
      editBtns(item, index) {
        // console.log("*********"+JSON.stringify(item))
        this.resetTemp()
        //将item对象转成json字符串，然后又将字符串转成新生成的json对象，最后将这个json对象直接传递给temp。如果直接将item对象传递给temp，那后面对temp进行数据修改同时也会对item对象进行修改。为了防止这种情况，我们采用了json转换对象的间接传递。
        this.temp = JSON.parse(JSON.stringify(item))

        this.dialogData.temp = this.temp
        this.dialogData.temp['deptId'] = this.selectTree.id
        this.dialogData.temp['deptName'] = this.selectTree.name
        this.dialogData.tempLable = this.tempLable
        this.dialogData.title = '编辑'
        this.openDialogName = 'dialogEdit'
        this.showDialog = true
        this.visible = true
      },
      //行级按钮-二维码
      qrcodeBtns(item, index) {
        // console.log("*********"+JSON.stringify(item))
        this.resetTemp()
        //将item对象转成json字符串，然后又将字符串转成新生成的json对象，最后将这个json对象直接传递给temp。如果直接将item对象传递给temp，那后面对temp进行数据修改同时也会对item对象进行修改。为了防止这种情况，我们采用了json转换对象的间接传递。
        this.temp = JSON.parse(JSON.stringify(item))

        this.dialogData.temp = this.temp
        this.dialogData.temp['deptId'] = this.selectTree.id
        this.dialogData.temp['deptName'] = this.selectTree.name
        this.dialogData.tempLable = this.tempLable
        this.dialogData.title = '二维码'
        this.openDialogName = 'dialogQrcode'
        this.showDialog = true
        this.visible = true
      },

      //表级按钮-新增
      addNew() {
        this.resetTemp()
        this.dialogData.temp = this.temp
        this.dialogData.temp['deptId'] = this.selectTree.id
        this.dialogData.temp['deptName'] = this.selectTree.name
        this.dialogData.tempLable = this.tempLable
        this.dialogData.title = '新增'
        this.openDialogName = 'dialogAdd'
        this.showDialog = true
        this.visible = true
      },

      //form表单内容重置
      resetTemp() {
        const that = this
        for(let key in that.temp) {
          // console.log(key)
          that.temp[key]= ''
        }
      },

      //查询条件重置
      // resetQueryTemp() {
      //   const that = this
      //   for(let key in that.tempQuery) {
      //     // console.log(key)
      //     that.tempQuery[key]= ''
      //   }
      // },

      //表级按钮-删除
      deleteBatch(){

        const that = this

        that.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {

          let ids = ''
          that.selectList.forEach(item => {
            ids += item.id + ','
          })
          // that.$loading({
          //   spinner: 'none',
          //   text: '云上企业'
          // })
          deleteEquipments(ids)
            .then(res => {
              if (res.code === 0) {
                that.$notify({
                  title: '成功',
                  message: '删除成功',
                  type: 'success',
                  duration: 2000
                })
                that.refreshTable()
              }
            }).catch(err => {
            console.log(err)
            // that.$loading().close()
          })

        }).catch(() => {
          that.$message({
            type: 'info',
            message: '已取消删除'
          });
        });



      },

      //Table列表刷新
      refreshTable() {
        const that = this
        that.$axios.all([
          listPageEquipments({  ...that.tempQuery,pid: that.selectTree.id,dataType: this.$storage.get('dataType'),layer: that.selectTree.layer, pageNo: that.pageNo })
        ]).then(that.$axios.spread((res) => {
          that.getListPage(res)
        })).catch((error) => {
          console.log(error)
        })

      },




      //Excel文件导出
      exportExcel() {
        //获取勾选id
        let ids = "";
        const that = this;
        if (that.selectList != null && that.selectList.length > 0) {
          that.selectList.forEach(item => {
            ids = ids + item.id + ','
          })
        }

        //*******************************************************用户自定义修改 start ***************************************************************************
        exportExcelEquipments(ids)
        //*******************************************************用户自定义修改 end ***************************************************************************
          .then(res => {
            // console.log(res)
            if (!res) {
              return
            }
            downLoad(res,"设备信息导出.xls")
            // that.$message({
            //   title: '成功',
            //   message: '导出成功',
            //   type: 'success',
            //   duration: 2000
            // })
          }).catch(err => {
          console.log(err)
        })

      },

      //Excel文件导入
      importExcelCallBack() {
        this.refreshTable();
      },


      //树表搜索框文本查询
      searchDeptByName(){
        const that = this
        that.treeNodes = []
        //初次不显示已封存节点
        circleTree(that.treeData,that.showDisableDept,that.filterTextDept,that.treeNodes)
        that.enterTime = that.enterTime + 1
        that.$nextTick(function () {
          if(that.treeNodes.length>0){
            // console.log('active item:', that.enterTime,"++++",that.treeNodes.length)
            let selectTreeNode = that.treeNodes[that.enterTime%that.treeNodes.length]
            that.selectTree = {
              pid: selectTreeNode.pid,
              id: selectTreeNode.id,
              layer: selectTreeNode.layer,
              name: selectTreeNode.name
            }
          }
          //that.$refs.tree.$children[0].setCurrentKey(that.selectTree.id)
          that.initTable(that.selectTree.id,that.selectTree.layer)
        })
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
        that.initTable(that.selectTree.id,that.selectTree.layer)
      }
    }
  }
</script>



<style lang="scss" rel="text/css">
  .equipmentManage {
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
