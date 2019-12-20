<template>
  <div class="menuManage">
    <el-row style="height: 100%;">
      <el-col :span="4" class="treeStyle">
        <!--<el-tree :data="treeData" :props="defaultProps" style="background-color: inherit;"></el-tree>-->
        <base-tree
          ref="tree"
          :data="treeData"
          :expandedKeyList="treeCurrentState"
          :treeConfigs="configs.treeConfigs"
          :propName="configs.treeConfigs.propName"
          @treedatabridge="treeDataBridge"></base-tree>
      </el-col>
      <el-col :span="20" class="tableStyle">
        <div class="baseTable">
          <el-row class="tableTopBar">
            <el-col :span="18">
              <div class="tableBtns">
                <template v-for="(item, index) in configs.topBarBtnList">
                  <base-button v-show="item.isShow" :name='item.name' :icon='item.icon' :plain="item.plain" :state="item.state"
                               @myclick="item.method"></base-button>
                </template>
              </div>
            </el-col>
            <el-col :span="6" style="text-align: right;">
              <div class="tableSearch">
                <el-input
                  placeholder="菜单名称"
                  v-model="searchInput"
                  class="input-with-select"
                  clearable
                  @clear="clearSearch">
                  <el-button slot="append" icon="el-icon-search" @click="searchData"></el-button>
                </el-input>
              </div>
            </el-col>
          </el-row>
          <el-row class="tableContent">
            <base-table
              :data="tableData"
              :colConfigs="configs.tableConfigs"
              :showCheckBox="configs.showCheckBox"
              :showIndex="configs.showIndex"
              :propName="configs.propName"
              :pageData="pageData"
              :currentpage.sync="currentpage"
              :hidePages="true"
              @databridge="dataBridge"></base-table>
          </el-row>
        </div>
      </el-col>
    </el-row>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="440px">
      <el-form :rules="rules" ref="menuForm" :model="temp" label-position="left" label-width="120px"
               style='width: 400px;margin: 20px auto;'>
        <el-form-item label="上级菜单：" prop="type">
          <el-input placeholder="（无）此项为顶级" v-model="temp.type" :disabled="temp.typeState">
            <!--<i slot="suffix" class="el-input__icon el-icon-search"></i>-->
          </el-input>
        </el-form-item>
        <el-form-item label="菜单名称：" prop="name">
          <el-input v-model="temp.name"></el-input>
        </el-form-item>
        <el-form-item label="显示顺序：" prop="serialNumber">
          <el-input v-model="temp.serialNumber"></el-input>
        </el-form-item>
        <el-form-item label="页面路径：" prop="url">
          <el-input v-model="temp.url"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">保 存</el-button>
        <el-button v-else type="primary" @click="updateData">保 存</el-button>
        <el-button @click="dialogFormVisible = false">关 闭</el-button>
      </div>
    </el-dialog>

    <el-dialog v-el-drag-dialog title="按钮管理" :visible.sync="dialogBtnVisible" width="800px">
      <el-dialog v-el-drag-dialog width="440px" :title="btnTextMap[btnDialogStatus]" :visible.sync="dialogBtnInnerVisible" append-to-body>
        <el-form :rules="btnRules" ref="btnForm" :model="btnTemp" label-position="left" label-width="120px"
                 style='width: 400px;margin: 20px auto;'>
          <el-form-item label="按钮名称" prop="name">
            <el-input v-model="btnTemp.name"></el-input>
          </el-form-item>
          <el-form-item label="英文名称" prop="nameEn">
            <el-input v-model="btnTemp.nameEn"></el-input>
          </el-form-item>
          <!--
          <el-form-item label="显示顺序" prop="serialNumber">
            <el-input v-model="btnTemp.serialNumber"></el-input>
          </el-form-item>
          -->
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button v-if="btnDialogStatus=='create'" type="primary" @click="createBtns">保 存</el-button>
          <el-button v-else type="primary" @click="updateBtns">保 存</el-button>
          <el-button @click="dialogBtnInnerVisible = false">关 闭</el-button>
        </div>
      </el-dialog>
      <div class="menuDialogTitle">
        <div class="menuDialogTitleView">
          <span>当前所属菜单：</span><span>{{ menuDialogTemp.menuName}}</span>
        </div>
        <div class="menuDialogTitleView">
          <template v-for="(item, index) in configs.menuDialogBtnList">
            <base-button :name='item.name' :icon='item.icon' :plain="item.plain" :state="item.state"
                         @myclick="item.method"></base-button>
          </template>
        </div>
      </div>
      <div class="menuDialogBody">
        <base-table
          v-loading="menuDialogTemp.tableLoading"
          :data="menuBtns"
          :colConfigs="configs.menuDialogConfigs"
          :showCheckBox="menuDialogTemp.showCheckBox"
          :showIndex="menuDialogTemp.showIndex"
          :propName="configs.propName"
          @databridge="menuDataBridge"></base-table>
      </div>
      <!--<div slot="footer" class="dialog-footer">-->
      <!--<el-button type="primary" :disabled="!menuBtns.length" @click="saveBtnList">{{$t('save')}}</el-button>-->
      <!--<el-button @click="dialogBtnVisible = false">{{$t('close')}}</el-button>-->
      <!--</div>-->
    </el-dialog>

  </div>

</template>

<script>

  //	API
  import {
    getListPageMenus,
    addSysMenu,
    gettreemeuns,
    deleteSysMenus,
    updateSysMenu,
    updateSysMenuDisable,
    updateDisableMenu
  } from '@/api/menu'

  import {
    addMeunButton,
    updateMeunButton,
    updateDisableMeunButton,
    deleteMeunButtons,
    listPageMenuButtons
  } from '@/api/button'
  //按钮权限
  import {initMenuButtons} from '@/api/button'
  //	公共方法
  import request from '@/utils/request'
  import {filerTableTitle} from '@/utils/common'
  //	import mystorage from '@/utils/storage'

  //	  table操作栏里面的按钮
  const operateBtns = {
    props: ['colConfig'],
    template: `<el-table-column :label="colConfig.label" :sortable="colConfig.sortable" align="center">
      					<div slot-scope="scope" class="btnBox">
      							<el-button v-show="colConfig.editMenu_isShow" type="text" class="btns" style="font-size: 12px;" @click="colConfig.editMenu(scope.row,scope.$index)">编辑</el-button>
      							<el-button v-show="colConfig.editBtns_isShow" type="text" class="btns" style="font-size: 12px;" @click="colConfig.editBtns(scope.row,scope.$index)">按钮管理</el-button>
      					</div>
    				</el-table-column>`
  }
  //	  table状态栏里面的按钮
  const stateBtns = {
    props: ['colConfig'],
    template: `<el-table-column :label="colConfig.label" :sortable="colConfig.sortable" align="center">
						<div slot-scope="scope">
    						<el-switch active-value="1" inactive-value="0" v-model="scope.row.isdisable" @change="colConfig.rootMenuState(scope.row,scope.$index)"></el-switch>
    					</div>
    			   </el-table-column>`
  }
  //	  table菜单名称里面的按钮
  const menuNameBtns = {
    props: ['colConfig'],
    template: `<el-table-column :label="colConfig.label" :sortable="colConfig.sortable" align="center">
						<div slot-scope="scope" class="btnBox">
      						<el-button  type="text" class="btns" style="font-size: 12px;" @click="colConfig.childrenTree(scope.row,scope.$index)">{{scope.row.name}}</el-button>
      					</div>
    			   </el-table-column>`
  }

  //	  按钮操作栏里面的按钮
  const dialogBtns = {
    props: ['colConfig'],
    template: `<el-table-column :label="colConfig.label" :sortable="colConfig.sortable" align="center">
      					<div slot-scope="scope" class="btnBox">
      							<el-button  type="text" class="btns" style="font-size: 12px;" @click="colConfig.editMenu(scope.row,scope.$index)">编辑</el-button>
      					</div>
    				</el-table-column>`
  }

  export default {
    //数据
    data() {

      return {




        // 初始化数据
        initConfigs: {
          tableOperates: {
            prop: 'operate',
            label: '操作',
            enLabel: 'operation',
            isPropName: true,
            component: operateBtns, //自定义内容
            editMenu: this.editMenu, //自定义方法
            editBtns: this.editBtns, //自定义方法
            editMenu_isShow: true,
            editBtns_isShow: true,
          },

        },
        tableData: [],
        configs: {
          topBarBtnList: [{
            name: '新增',
            nameEn: 'add',
            isShow: true,
            icon: 'add',
            method: this.addMenu
          },
            {
              name: '删除',
              nameEn: 'delete',
              isShow: true,
              icon: 'delete',
              plain: true,
              state: true,
              method: this.deleteMenu
            }, {
              name: '返回',
              nameEn: 'goback',
              isShow: true,
              icon: 'goback',
              plain: true,
              state: true,
              method: this.parentMenu
            },
          ],
          tableConfigs: [],
          showCheckBox: true,
          showIndex: false,
          propName: 'menuManage',
          treeConfigs: {
            ref: 'tree',
            showCheckBox: false,
            showIcons: true,
            propName: 'menuManage'
          },
          menuDialogBtnList: [{
            name: '新增按钮',
            nameEn: 'add',
            isShow: true,
            icon: 'add',
            method: this.addMenuBtns
          }, {
            name: '删除',
            nameEn: 'delete',
            isShow: true,
            icon: 'delete',
            plain: true,
            state: true,
            method: this.deleteMenuBtns
          }],
          menuDialogConfigs: [],
          dialogBtnTable: {
            prop: 'operate',
            label: '操作',
            enLabel: 'operation',
            component: dialogBtns, //自定义内容
            editMenu: this.editMenuBtns, //自定义方法
          }
        },
        menuBtns: [],
        menuDeleteBtns: [],
        searchInput: '',
        treeData: [{
          name: '请新增菜单',
          id: 'rootTree',
          children: []
        }],

        // 页面业务数据
        dialogFormVisible: false,
        dialogStatus: '',
        textMap: {
          update: '编辑菜单',
          create: '新增菜单'
        },
        temp: {
          url: '',
          name: '',
          type: '',
          serialNumber: '',
          typeState: true
        },
        rules: {
          type: [{
            required: true,
            message: '需有父节点',
            trigger: 'change'
          }],
          url: [{
            required: true,
            message: '请指定资源路径',
            trigger: 'change'
          }],
          name: [{
            required: true,
            message: '请填写菜单名称',
            trigger: 'change'
          }]
        },
        menuViewList: [],
        tableViewLayer: 0,
        tableLayer: 0,
        treeCurrentState: ['rootTree'],
        addMenuData: {
          name: '',
          pid: ''
        },
        resultName: '',
        childrenDatas: null,
        deleteMenuList: null,
        pageData: null,
        currentpage: 1,

//				按钮弹窗
        dialogBtnVisible: false,
        dialogBtnInnerVisible: false,
        menuDialogTemp: {
          tableLoading: true,
          showCheckBox: false,
          showIndex: false,
          menuName: '',
          menuId: ''
        },
        btnDialogStatus: '',
        btnTextMap: {
          update: '编辑按钮',
          create: '新增按钮'
        },
        btnTemp: {
          menuId: '',
          name: '',
          nameEn: '',
          serialNumber: ''
        },
        btnRules: {
          nameEn: [{
            pattern: /^[A-Za-z]+$/,
            required: true,
            message: '请输入英文名称',
            trigger: 'change'
          }],
          name: [{
            required: true,
            message: '请填写按钮名称',
            trigger: 'change'
          }]
        },


        resultItem: '',

      }
    },

    //子组件
    components: {
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
      that.initTree()


      //			that.$refs.tree.setCheckedKeys([3]);
      //			console.log(that.$refs.tree)

      getListPageMenus({
        layer: 1
      }).then(res => {
        that.getTableMenuList(res)
        that.$loading().close()
      }).catch(err => {
        console.log(err)
        that.$loading().close()
      })

    },

    //挂载之前
    beforeMount() {

    },
    //真实DOM挂载后，仅限组件本身的挂载，如果存在子组件，并且需求子组件全部被挂载后进行操作，需使用vm.$nextTick顶替mounted（在mounted内部调用vm.$nextTick）；
    mounted() {
      const that = this
      that.$nextTick(function () {
        that.$refs.tree.$children[0].setCurrentKey(that.treeCurrentState[that.tableViewLayer])

      })
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


      initButtons(){
        const that = this
        that.$loading({
          spinner: 'none',
          text: '云上企业'
        })
        const roleId = that.$storage.get('userInfo').roleIds
        const menuId = that.$storage.get('menuId');
        if(roleId){
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
                        // console.log(topBtn)
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


      searchTree(searchStr,list){
        const resultItem = list.find(v=>{
          if(v.name === searchStr){
            return v
          }else {
            v.children && v.children.length && this.searchTree(searchStr,v.children)
          }
        })
        resultItem?(this.resultItem = resultItem):''
      },
      clearSearch(){
        this.menuViewList = []
        this.treeToTable(this.treeData[0].children)
        this.$refs.tree.$children[0].setCurrentKey('rootTree')
      },
      searchData(){
        const that = this
        if(that.searchInput){
          this.resultItem = ''
          this.searchTree(that.searchInput,that.treeData[0].children)
          // console.log(this.resultItem)
          if(this.resultItem){
            this.treeDataBridge({nodeData:this.resultItem})
            this.$refs.tree.$children[0].setCurrentKey(this.resultItem.id)
          }else {
            this.tableData = []
            this.$refs.tree.$children[0].setCurrentKey('')
          }
        }else {
          that.$message({
            showClose: true,
            message: '请输入菜单名称',
            type: 'warning'
          })
        }
      },


      initTree() {
        const that = this
        const rootMenu = that.$store.state.user.rootMenu.length?that.$store.state.user.rootMenu:that.$storage.get('rootMenu')
        rootMenu.push(this.appMenu)
        console.log(rootMenu)
        const newRootMenu = [{
          name: '全部菜单',
          id: 'rootTree',
          layer: 0,
          url: 'rootTree',
          children: rootMenu
        }]

        that.treeData = newRootMenu
        that.treeToTable(rootMenu)
        that.$nextTick(function () {
          that.$refs.tree.$children[0].setCurrentKey(that.treeCurrentState[that.tableViewLayer])
        })

      },
      treeToTable(data) {
        const that = this
        // console.log("111111111")
        // console.log(data)
        if (!that.menuViewList.length) {
          that.tableData = data
          if(that.tableData&&that.tableData.length>0){
            that.tableData.forEach(item =>{
              item['rowState'] = '1'
            })
          }
          that.menuViewList.push(that.tableData)
        } else {
          const itemId = that.treeCurrentState[that.tableViewLayer]
          that.childrenDatas = null
          that.searchChildren(data, itemId)
          that.tableData = that.childrenDatas
          that.menuViewList.splice(-1, 1, that.tableData)

        }

      },
      searchChildren(data, id) {
        const that = this
        if(Array.isArray(data)){
          data.forEach((item) => {
            if (item.id === id) {
              that.childrenDatas = item.children
            } else {
              if (item.children && item.children.length) {
                that.searchChildren(item, id)
              }
            }

          })
        }
      },

      getTableMenuList(res) {
        const that = this
        if (res) {
          res.result.titles = JSON.parse(res.result.titles)
          res.result.varList = JSON.parse(res.result.varList)
          res.result.pageData = JSON.parse(res.result.pageData)
          const data = filerTableTitle(res.result)
          const titleList = that.addTableTitle(data)
          // console.log(titleList)
          that.configs.tableConfigs = titleList
          that.pageData = res.result.pageData
          that.configs.showCheckBox = false
          that.configs.showIndex = true
          // that.tableData = res.result.varList
        }
      },
      updateView(data) {
        const that = this
        const userInfo = {
          userType:that.$store.getters.userInfo.userType,
          roleIds:that.$store.getters.userInfo.roleIds
        }
        that.$axios.all([getListPageMenus(), gettreemeuns(userInfo)]).then(that.$axios.spread((res1, res2) => {
          // console.log(res1)
          that.getTableMenuList(res1)
          // console.log(res2)
          const roles = JSON.parse(res2.result)
          const appIndex = roles.findIndex(v=>{return v.name === 'APP'})
          if(appIndex>-1){
            const appMenu = roles.splice(appIndex,1)[0]
            that.$store.commit('SET_APPMENU',appMenu)
            that.$storage.remove('appMenu')
            that.$storage.set('appMenu',appMenu)
          }
          that.$store.commit('SET_ROOTMENU', roles)
          that.$storage.set('rootMenu', roles)
          that.$store.dispatch('FilterRoutes', roles).then(() => {
            that.$router.addRoutes(that.$store.getters.addRouters) // 动态添加可访问路由表
          })
          that.initTree()
          that.$loading().close()
        })).catch((error) => {
          console.log(error)
        })

      },
      deleteMenu() {
        const that = this
        // console.log(that.deleteMenuList)
        let ids = ''
        that.deleteMenuList.forEach(item => {
          ids += item.id + ','
        })
        ids = ids.slice(0, ids.length - 1)
        that.httpDeleteSysMenus({
          ids: ids
        })

      },
      parentMenu() {
        this.menuViewList.pop()
        this.treeCurrentState.pop()
        this.tableViewLayer = this.tableViewLayer - 1
        this.tableData = this.menuViewList[this.menuViewList.length - 1].id ? [] : this.menuViewList[this.menuViewList.length - 1]
        this.$refs.tree.$children[0].setCurrentKey(this.treeCurrentState[this.tableViewLayer])

        // console.log(this.menuViewList)
        // console.log(this.tableViewLayer)
        if (this.tableViewLayer) {
          let itemPid = ''
          const tempData = this.menuViewList[this.menuViewList.length - 1]
          if (tempData.id) {
            itemPid = tempData.id
          } else {
            itemPid = tempData[0].pid
          }
          this.searchParentMenuName(itemPid, this.treeData)
          this.addMenuData = {
            name: this.resultName,
            pid: itemPid
          }
        } else {
          this.addMenuData = {
            name: '',
            pid: ''
          }
          this.tableLayer = 0
        }

      },

      searchParentMenuName(id, menuList) {
        const that = this

        // console.log(menuList)

        menuList.forEach((item, index) => {
          if (item.id === id) {
            that.resultName = item.name
          } else {
            if (item.children && item.children.length) {
              that.searchParentMenuName(id, item.children)
            }
          }

        })

      },

      editMenu(item, index) {
        const that = this
        // console.log(item)
        // console.log(index)
        this.resultName = ''
        this.searchParentMenuName(item.pid, this.treeData)
        this.resetTemp()
        this.temp.type = this.resultName
        this.temp.name = item.name
        this.temp.url = item.url
        this.temp.serialNumber = item.serialNumber
        this.temp.id = item.id
        this.rules.type[0].required = false
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['menuForm'].clearValidate()
        })
      },
      rootMenuState(item, index) {
        const that = this
        // console.log(item)
        // console.log(index)
        const data = {
          id: item.id,
          isdisable: item.isdisable
        }

        that.httpUpdateDisableMenu(data,item)

      },

      httpUpdateDisableMenu(data,item) {
        const that = this
        updateDisableMenu(data).then(res => {
          // console.log(res)
          if (res.code === 0) {
            that.$notify({
              title: '成功',
              message: '修改成功',
              type: 'success',
              duration: 2000
            })
          }
        }).catch(err => {
          console.log(err)
          item.isdisable = item.isdisable === '0'?'1':'0'
          that.$loading().close()

        })
      },

      childrenTree(item, index) {
        const that = this
        // console.log(item)
        // console.log(index)
        that.tableData = item.children
        const tempItem = that.tableData.length ? that.tableData : item
        that.menuViewList.push(tempItem)
        that.tableViewLayer = that.tableViewLayer + 1
        that.treeCurrentState.push(item.id)
        that.$refs.tree.$children[0].setCurrentKey(that.treeCurrentState[that.tableViewLayer])

        that.addMenuData = {
          name: item.name,
          pid: item.id
        }

        //				getListPageMenus({pid:item.id}).then(res => {
        //					that.getTableMenuList(res)
        //					that.menuViewList.push(that.tableData)
        //					that.$loading().close()
        //				}).catch(err => {
        //					console.log(err)
        //				})
      },
      dataBridge(data) { //获取table组件传回的数据
        // console.log(data)
        const that = this
        that.deleteMenuList = data
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
      treeDataBridge(data) {
        // console.log(data)
        const that = this
        that.addMenuData = {
          name: '',
          pid: ''
        }
        that.tableData = data.nodeData.children
        if(that.tableData&&that.tableData.length>0){
          that.tableData.forEach(item =>{
            item['rowState'] = '1'
          })
        }
        const tempItem = that.tableData.length ? that.tableData : data.nodeData
        if (data.nodeData.layer > that.tableViewLayer) {
          if (data.nodeData.layer > that.tableLayer) {
            that.menuViewList.push(tempItem)
            that.tableViewLayer = that.tableViewLayer + 1
            that.tableLayer = data.nodeData.layer
          } else {
            if (data.nodeData.layer === that.tableLayer) {
              that.menuViewList.splice(that.tableViewLayer, 1, tempItem)
            } else {
              that.menuViewList.splice(data.nodeData.layer + 1, 10)
              that.tableLayer = data.nodeData.layer
            }

          }

        } else {
          if (data.nodeData.layer === that.tableViewLayer) {
            that.menuViewList.splice(data.nodeData.layer, 1, tempItem)
          } else {
            that.menuViewList.splice(data.nodeData.layer + 1, 10)
            that.tableViewLayer = that.tableViewLayer - 1
          }

        }

        that.treeCurrentState[that.tableViewLayer] = data.nodeData.id
        that.treeCurrentState.splice(that.tableViewLayer + 1, 10)

        if (that.tableViewLayer) {
          that.addMenuData = {
            name: data.nodeData.name,
            pid: data.nodeData.id
          }
        }

      },
      addTableTitle(list) {
        const that = this
        const addTxt = 'isdisable'
        const addNameBtn = 'name'
        list.forEach(item => {
          if (item.enLabel === addTxt) {
            item.component = stateBtns
            item.rootMenuState = that.rootMenuState
            item.isPropName = that.configs.propName?true:false
          }
          if (item.enLabel === addNameBtn) {
            item.component = menuNameBtns
            item.childrenTree = that.childrenTree
            item.isPropName = that.configs.propName?true:false
          }
        })
        list.push(that.initConfigs.tableOperates)
        return list
      },

      resetTemp() {
        this.temp = {
          url: '',
          name: '',
          type: '',
          serialNumber: '',
          typeState: true
        }
      },
      addMenu() {
        this.resetTemp()
        if (this.tableViewLayer) {
          this.temp.type = this.addMenuData.name
        }
        this.rules.type[0].required = false
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['menuForm'].clearValidate()
        })
      },
      createData() {
        const that = this
        this.$refs['menuForm'].validate((valid) => {
          if (valid) {
            // console.log(that.temp)
            if (that.tableViewLayer) {
              that.temp.pid = that.addMenuData.pid
            } else {
              that.temp.pid = ''
            }
            that.httpAddSysMenu(that.temp)
            //						createArticle(this.temp).then(() => {
            //							this.list.unshift(this.temp)
            //							this.dialogFormVisible = false
            //							this.$notify({
            //								title: '成功',
            //								message: '创建成功',
            //								type: 'success',
            //								duration: 2000
            //							})
            //						})
          }
        })
      },
      handleUpdate(row) {
        this.temp = Object.assign({}, row) // copy obj
        this.temp.timestamp = new Date(this.temp.timestamp)
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['menuForm'].clearValidate()

        })
      },
      updateData() {
        const that = this
        that.$refs['menuForm'].validate((valid) => {
          if (valid) {
            // console.log(that.temp)
            if (that.tableViewLayer) {
              that.temp.pid = that.addMenuData.pid
            } else {
              that.temp.pid = ''
            }
            that.httpUpdateSysMenu(that.temp)
          }
        })
      },
      httpAddSysMenu(data) {
        const that = this
        addSysMenu(data).then(res => {
          // console.log(res)
          if (res.code === 0) {
            that.dialogFormVisible = false
            that.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
            that.updateView()
          }
        }).catch(err => {
          console.log(err)
          that.$loading().close()

        })
      },
      httpUpdateSysMenu(data) {
        const that = this
        updateSysMenu(data).then(res => {
          // console.log(res)
          if (res.code === 0) {
            that.dialogFormVisible = false
            that.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
            that.updateView()
          }
        }).catch(err => {
          console.log(err)
          that.$loading().close()
        })
      },
      httpDeleteSysMenus(data) {
        const that = this
        deleteSysMenus(data).then(res => {
          // console.log(res)
          if (res.code === 0) {
            that.dialogFormVisible = false
            that.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
            that.updateView()
          }
        }).catch(err => {
          console.log(err)
          that.$loading().close()
        })
      },
      httpUpdateSysMenuDisable(data) {
        const that = this
        updateSysMenuDisable(data).then(res => {
          // console.log(res)
          if (res.code === 0) {
            that.$notify({
              title: '成功',
              message: '修改成功',
              type: 'success',
              duration: 2000
            })
          }
        }).catch(err => {
          console.log(err)
          that.$loading().close()
        })
      },

//			按钮弹窗方法
      editBtns(item, index) {
        // console.log(item)
        // console.log(index)
        const that = this
        that.resetMenuDialog()
        that.menuDialogTemp.menuName = item.name
        that.menuDialogTemp.menuId = item.id
        that.dialogBtnVisible = true
        that.httpListPageMenuButtons({menuId: item.id})

      },
      resetMenuDialog() {
        this.menuDialogTemp = {
          tableLoading: true,
          showCheckBox: false,
          showIndex: false,
          menuName: '',
          menuId: ''
        }
        this.menuBtns = []
        this.btnDialogStatus = ''
      },
      resetBtnDialog() {
        this.btnTemp = {
          menuId: '',
          name: '',
          nameEn: '',
          serialNumber: ''
        }
        this.btnDialogStatus = ''
      },
      saveBtnList() {

      },
      addMenuBtns() {
        this.resetBtnDialog()
        this.btnDialogStatus = 'create'
        this.dialogBtnInnerVisible = true
        this.$nextTick(() => {
          this.$refs['btnForm'].clearValidate()
        })
      },
      deleteMenuBtns() {
        const that = this
        // console.log(that.menuDeleteBtns)
        let ids = ''
        that.menuDeleteBtns.forEach(item => {
          ids += item.id + ','
        })
        ids = ids.slice(0, ids.length - 1)
        // console.log(ids)
        that.httpDeleteMeunButtons({
          ids: ids
        })
      },
      httpDeleteMeunButtons(data) {
        const that = this
        deleteMeunButtons(data).then(res => {
          // console.log(res)
          if (res.code === 0) {
            that.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 1000
            })
            that.menuDeleteBtns = []
            that.menuDialogTemp.tableLoading = true
            that.httpListPageMenuButtons({menuId: that.menuDialogTemp.menuId})
          }
          that.$loading().close()
        }).catch(err => {
          console.log(err)
          that.$loading().close()
        })
      },
      menuDataBridge(data) {
        const that = this
        that.menuDeleteBtns = data

      },
      httpListPageMenuButtons(data) {
        const that = this
        listPageMenuButtons(data).then(res => {
          // console.log(res)
          res.result.titles = JSON.parse(res.result.titles)
          res.result.varList = JSON.parse(res.result.varList)
          const data = filerTableTitle(res.result)
          data.push(that.configs.dialogBtnTable)
          that.configs.menuDialogConfigs = data
          that.menuBtns = res.result.varList
          that.menuDialogTemp.tableLoading = false
          that.menuDialogTemp.showCheckBox = true

          that.$loading().close()
        }).catch(err => {
          console.log(err)
          that.$loading().close()
        })
      },
      createBtns() {
        const that = this
        that.$refs['btnForm'].validate((valid) => {
          if (valid) {
            that.btnTemp.menuId = that.menuDialogTemp.menuId
            // console.log(that.btnTemp)
            that.httpAddMeunButton(that.btnTemp)

          }
        })
      },
      httpAddMeunButton(data) {
        const that = this
        addMeunButton(data).then(res => {
          // console.log(res)
          if (res.code === 0) {
            that.$notify({
              title: '成功',
              message: '添加成功',
              type: 'success',
              duration: 1000
            })
            that.dialogBtnInnerVisible = false
            that.resetBtnDialog()
            that.menuDialogTemp.tableLoading = true
            that.httpListPageMenuButtons({menuId: that.menuDialogTemp.menuId})
          }
          that.$loading().close()
        }).catch(err => {
          console.log(err)
          that.$loading().close()
        })
      },
      updateBtns() {
        const that = this
        that.$refs['btnForm'].validate((valid) => {
          if (valid) {
            // console.log(that.btnTemp)
            that.httpUpdateMeunButton(that.btnTemp)

          }
        })
      },
      editMenuBtns(item,index) {
        // console.log(item)
        this.resetBtnDialog()
        this.btnTemp = {
          menuId: item.menuId,
          name: item.name,
          nameEn: item.nameEn,
          serialNumber: item.serialNumber,
          id: item.id
        }
        this.btnDialogStatus = 'update'
        this.dialogBtnInnerVisible = true
        this.$nextTick(() => {
          this.$refs['btnForm'].clearValidate()
        })
      },
      httpUpdateMeunButton(data) {
        const that = this
        updateMeunButton(data).then(res => {
          // console.log(res)
          if (res.code === 0) {
            that.$notify({
              title: '成功',
              message: '修改成功',
              type: 'success',
              duration: 1000
            })
            that.dialogBtnInnerVisible = false
            that.resetBtnDialog()
            that.menuDialogTemp.tableLoading = true
            that.httpListPageMenuButtons({menuId: that.menuDialogTemp.menuId})
          }
          that.$loading().close()
        }).catch(err => {
          console.log(err)
          that.$loading().close()
        })
      }

    },

    //计算属性
    computed: {
      test() {
        return this.$store.getters.language
      },
      appMenu() {
        return this.$store.getters.appMenu || this.$storage.get('appMenu')
      }
    },

    //观察者,可监听数据，属性和方法
    watch: {
      menuViewList: function () {
        this.configs.topBarBtnList.forEach(item => {
          if(item.nameEn=='goback'){
            item.state = this.menuViewList.length < 2
          }
        })
      },
      menuDeleteBtns: function() {
        // this.configs.menuDialogBtnList[1].state = this.menuDeleteBtns.length === 0
        this.configs.menuDialogBtnList.forEach(item => {
          if(item.nameEn=='delete'){
            item.state = this.menuDeleteBtns.length === 0
          }
        })
      },
      currentpage: function () {
        console.log(this.currentpage)


      }
    }
  }
</script>

<style lang="scss" rel="text/css">
  .menuManage {
    position: absolute;
    top: 10px;
    left: 10px;
    right: 10px;
    bottom: 0;
    box-sizing: border-box;
    border: 1px solid #E4E4E4;
    border-bottom: none;
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
  .tableSearch {
    display: inline-block;
    max-width: 300px;
  }
  }
  > .tableContent {
    height: calc(100% - 60px);
    overflow-y: auto;
    box-sizing: border-box;
    padding: 10px;
  }

  }
  }
  .menuDialogTitle {
    display: flex;
    margin: 8px 0;
    box-sizing: border-box;
    padding: 5px 20px;
    background-color: #EBF0F6;
    justify-content: space-between;
  .menuDialogTitleView {
    line-height: 2.4;
    font-size: 14px;
  }
  .el-button {
    padding: 9px 20px;
  svg {
    top: 5px;
  }
  }
  }
  .menuDialogBody {
    height: 400px;
    padding: 0 10px 5px 10px;
  }
  }
</style>
