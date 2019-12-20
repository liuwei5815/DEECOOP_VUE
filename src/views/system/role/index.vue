<template>
  <div class="roleManage">
    <!--顶部搜索栏开始-->
    <!--<el-row :gutter="10"-->
    <!--style="box-sizing: border-box;position: relative;overflow: hidden;transition: height 0.4s;-webkit-transition: height 0.4s;-moz-transition: height 0.4s;"-->
    <!--:style="{height: dynaHeight+'px'}">-->
    <!--<div style="position: absolute;">-->
    <!--<el-form inline :model="formData" class="form-inline">-->
    <!--<el-col :span="6" style="max-width: 260px">-->
    <!--<el-form-item label="角色编码">-->
    <!--<el-input v-model="formData.code" placeholder="角色编码" clearable></el-input>-->
    <!--</el-form-item>-->
    <!--</el-col>-->
    <!--<el-col :span="6" style="max-width: 260px">-->
    <!--<el-form-item label="角色名称">-->
    <!--<el-input v-model="formData.name" placeholder="角色名称" clearable></el-input>-->
    <!--</el-form-item>-->
    <!--</el-col>-->
    <!--<el-col :span="6" style="max-width: 260px">-->
    <!--<el-form-item label="是否启用">-->
    <!--<el-select v-model="formData.isdisable" placeholder="请选择" clearable>-->
    <!--<el-option label="是" value="1"></el-option>-->
    <!--<el-option label="否" value="0"></el-option>-->
    <!--</el-select>-->
    <!--</el-form-item>-->
    <!--</el-col>-->
    <!--<el-col :span="3" style="max-width: 100px">-->
    <!--<el-form-item>-->
    <!--<base-button :name='topBarBtnList[0].name' :icon='topBarBtnList[0].icon' :plain="topBarBtnList[0].plain"-->
    <!--:state="topBarBtnList[0].state"-->
    <!--@myclick="topBarBtnList[0].method"></base-button>-->
    <!--</el-form-item>-->
    <!--</el-col>-->
    <!--<el-col :span="3" style="max-width: 100px">-->
    <!--<el-form-item>-->
    <!--<base-button :name='topBarBtnList[1].name' :icon='topBarBtnList[1].icon' :plain="topBarBtnList[1].plain"-->
    <!--:state="topBarBtnList[1].state"-->
    <!--@myclick="topBarBtnList[1].method"></base-button>-->
    <!--</el-form-item>-->
    <!--</el-col>-->
    <!--</el-form>-->
    <!--</div>-->
    <!--</el-row>-->

    <!--<el-row style="position: relative;height: 20px;">-->
    <!--<div-->
    <!--style="position: absolute;bottom: 10px;left: 0;right: 0;height: 1px;background-color: rgb(228,228,228);z-index: 10;">-->
    <!--<div style="position: relative;">-->
    <!--<el-tooltip effect="dark" :content="dynaHeightState-0?'收起搜索':'展开搜索'" placement="bottom"-->
    <!--:hide-after="hideTime">-->
    <!--<el-button v-if="dynaHeightState-0" icon="el-icon-arrow-up" circle-->
    <!--style="position: absolute;left: 50%;top: -10.5px;transform: translate(-50%,0); width: 1.5em;height: 1.5em;padding: 0;"-->
    <!--@click="resetDynaHeight"></el-button>-->
    <!--<el-button v-else icon="el-icon-arrow-down" circle-->
    <!--style="position: absolute;left: 50%;top: -10.5px;transform: translate(-50%,0); width: 1.5em;height: 1.5em;padding: 0;"-->
    <!--@click="resetDynaHeight"></el-button>-->
    <!--</el-tooltip>-->
    <!--</div>-->
    <!--</div>-->
    <!--</el-row>-->
    <search-bar
      v-if="searchList.length"
      :searchList="searchList"
      :searchConfig="searchConfig"
      @search-map="searchMap"
      @send-guid="sendGuid"></search-bar>

    <!--顶部搜索栏结束-->

    <!--表格部分开始-->
    <el-row
      style="border: 1px solid #E4E4E4;border-bottom: none;margin-top: 10px;transition: height 0.4s;-webkit-transition: height 0.4s;-moz-transition: height 0.4s;"
      :style="{height: tableHeight+'px'}">
      <el-col class="tableStyle">
        <div class="baseTable">
          <!--表格顶部按钮开始-->
          <el-row class="tableTopBar">
            <el-col>
              <div class="tableBtns">
                <template v-for="(item) in contentBarBtnList">
                  <base-button :name='item.name' :icon='item.icon' :plain="item.plain" :state="item.state"
                               @myclick="item.method"></base-button>
                </template>
              </div>
            </el-col>
          </el-row>
          <!--表格顶部按钮结束-->

          <!--表格内容开始-->
          <el-row class="tableContent">
            <base-table :data="tableData" :colConfigs="tableConfigs.titleList" :showCheckBox="tableConfigs.showCheckBox"
                        :showIndex="tableConfigs.showIndex" :propName="propName" :pageData="pageData"
                        :currentpage.sync="currentpage" :isSingle="tableConfigs.isSingle" @databridge="dataBridge"></base-table>
          </el-row>
          <!--表格内容结束-->
        </div>
      </el-col>
    </el-row>

    <!--表格部分结束-->

    <!--页面弹窗部分开始-->
    <!--新增和编辑弹窗-->
    <el-dialog v-el-drag-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible"
               width="440px">
      <el-form :rules="rules" :ref="propName+'Dialog'" :model="temp" label-position="left" label-width="80px"
               style='width: 400px;padding: 10px;'>
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="temp.name"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input type="textarea" :rows="2" v-model="temp.remark"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">保 存</el-button>
        <el-button v-else type="primary" @click="updateData">保 存</el-button>
        <el-button @click="dialogFormVisible = false">关 闭</el-button>
      </div>
    </el-dialog>
    <!--菜单权限弹窗-->
    <el-dialog v-el-drag-dialog title="菜单权限" :visible.sync="dialogMenuVisible" width="340px">
      <!--<div slot="title">菜单权限</div>-->
      <div style="box-sizing: border-box;padding: 10px">
        <base-button :name='menuRoleBtnList[0].name' :icon='menuRoleBtnList[0].icon' :plain="menuRoleBtnList[0].plain"
                     :state="menuRoleBtnList[0].state"
                     @myclick="menuRoleBtnList[0].method"></base-button>
        <span> 当前角色 :<span
          style="color: #409EFF;font-weight: bold"> {{menuRoleData.name}}</span></span>
      </div>
      <div style="box-sizing: border-box;padding: 10px;overflow: auto" :style="menuRoleTree.length?setDialogMenuHeight:''">
        <base-tree v-loading="menuRoleLoading" ref="menuRoleTree" :data="menuRoleTree"
                   :treeConfigs="menuRoleTreeConfigs" :propName="menuRoleTreeConfigs.propName"
                   :checkedList="checkedList" @treedatabridge="menuRoleTreeDataBridge"></base-tree>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveMenuRole">保 存</el-button>
        <el-button @click="dialogMenuVisible = false">关 闭</el-button>
      </div>
    </el-dialog>
    <!--按钮权限弹窗-->
    <el-dialog v-el-drag-dialog title="按钮权限" :visible.sync="dialogBtnVisible" width="850px">
      <div style="height: 500px">
        <el-col :span="6" style="position: relative; height: 100%;overflow: hidden ">
          <div
            style="position: absolute;top: -10px;bottom: -10px;left: 0;right: 5px;background-color:#EBF0F6;box-shadow:5px 0 10px -5px rgba(0,0,0,0.3);box-sizing: border-box;padding: 20px 0;">
            <base-tree v-loading="btnRoleLoading" ref="btnRoleTree" :data="btnRoleTree"
                       :treeConfigs="btnRoleTreeConfigs" :propName="btnRoleTreeConfigs.propName"
                       :checkedList="btnCheckedList" @treedatabridge="btnRoleTreeDataBridge"></base-tree>
          </div>
        </el-col>
        <el-col :span="18" style="height: 100%">
          <div style="height: 50px;box-sizing: border-box;padding: 7px 20px 7px 0;">
            <el-checkbox border :indeterminate="isIndeterminate" :disabled="!dialogBtns.length" v-model="btnCheckAll"
                         @change="handleCheckAllChange">全选
            </el-checkbox>
            <span> 当前角色 :<span style="color: #409EFF;font-weight: bold"> {{menuRoleData.name}}</span></span>
          </div>
          <div style="height: calc(100% - 110px);box-sizing: border-box;padding: 7px 20px 7px 0;">
            <el-checkbox-group v-loading="dialogCheckboxLoading" v-model="checkedDialogBtns"
                               @change="handleCheckedDialogBtnsChange">
              <el-checkbox v-for="item in dialogBtns" :label="item.id" :key="item.id" :disabled="item.isdisable === '0'"
                           v-model="item.isBindRole === '1'" border>{{item.name}}
              </el-checkbox>
            </el-checkbox-group>
            <div v-show="!dialogBtns.length" style="text-align: center">请选择左侧菜单</div>
          </div>
          <div class="showLine"
               style="position: relative; height: 60px;text-align: center;box-sizing: border-box;padding: 10px 0 0 0;">
            <el-button type="primary" @click="saveBtnRole">保 存</el-button>
            <el-button @click="dialogBtnVisible = false" style="margin-left: 30px">关 闭</el-button>
          </div>
        </el-col>
      </div>
    </el-dialog>


    <!--数据权限弹窗-->
    <el-dialog v-el-drag-dialog title="数据权限" :visible.sync="dialogDataVisible" width="850px">
      <div style="height: 500px">
        <el-col :span="6" style="position: relative; height: 100%;overflow: hidden ">
          <div
            style="position: absolute;top: -10px;bottom: -10px;left: 0;right: 5px;background-color:#EBF0F6;box-shadow:5px 0 10px -5px rgba(0,0,0,0.3);box-sizing: border-box;padding: 20px 0;">
            <base-tree v-loading="btnRoleLoading" ref="btnRoleTree" :data="btnRoleTree"
                       :treeConfigs="btnRoleTreeConfigs" :propName="btnRoleTreeConfigs.propName"
                       :checkedList="btnCheckedList" @treedatabridge="dataRoleTreeDataBridge"></base-tree>
          </div>
        </el-col>
        <el-col :span="18" style="height: 100%">
          <div style="height: 50px;box-sizing: border-box;padding: 7px 20px 7px 15px;">
            <span> 当前角色 :<span style="color: #409EFF;font-weight: bold"> {{menuRoleData.name}}</span></span>
          </div>
          <div style="height: calc(100% - 110px);box-sizing: border-box;padding: 10px 20px 7px 20%;">
            <el-radio-group v-model="radio"  v-loading="dialogRadioLoading" v-show="!isShowRadio"
                            @change="handleRadioDataTypeChange">
              <el-radio :label="0">显示个人数据</el-radio>
              <el-radio :label="1">显示部门数据</el-radio>
              <el-radio :label="2">显示所有数据</el-radio>
            </el-radio-group>
            <div v-show="isShowRadio" style="text-align: center">请选择左侧菜单</div>
          </div>
          <div class="showLine"
               style="position: relative; height: 60px;text-align: center;box-sizing: border-box;padding: 10px 0 0 0;">
            <el-button type="primary" @click="saveDataRoleMenu">保 存</el-button>
            <el-button @click="dialogDataVisible = false" style="margin-left: 30px">关 闭</el-button>
          </div>
        </el-col>
      </div>
    </el-dialog>


    <!--分配用户弹窗-->
    <el-dialog v-el-drag-dialog title="分配用户" :visible.sync="dialogAssignVisible" width="850px">
      <div style="height: 500px" v-loading="assignLoading">
        <el-col :span="6" style="position: relative; height: 100%;overflow: hidden ">
          <div style="position: absolute;top: -10px;bottom: -10px;left: 0;right: 5px;background-color:#EBF0F6;box-shadow:5px 0 10px -5px rgba(0,0,0,0.3);box-sizing: border-box;padding: 10px 0;">
            <div class="leftTree" style="height: 100%;padding-top: 10px;">
              <!--<base-tree v-loading="assignLoading" ref="assignTree" :data="assignTree"-->
              <!--:treeConfigs="assignTreeConfigs" :propName="assignTreeConfigs.propName"-->
              <!--:checkedList="assignCheckedList" @treedatabridge="assignTreeDataBridge"></base-tree>-->
              <el-input placeholder="" v-model="assignFilterText" clearable>
                <i slot="suffix" class="el-input__icon el-icon-search"></i>
              </el-input>
              <div class="checkBox">
                <el-checkbox v-model="dialogAssignChecked">显示封存部门</el-checkbox>
              </div>
              <div class="treeView" style="height: calc(100% - 85px);overflow: auto;">
                <el-tree
                  ref="assignTree"
                  highlight-current
                  default-expand-all
                  node-key="id"
                  :expand-on-click-node="clickArrow"
                  :data="assignTree"
                  :props="defaultProps"
                  :filter-node-method="assignFilterNode"
                  @node-click="assignTreeDataBridge">
                  <span class="custom-tree-node" slot-scope="{ node, data }">
                    <svg-icon v-if="treeConfigs.showIcons" :icon-class="data.url" style="margin-right: 5px"></svg-icon>
                    <span v-if="node.label">{{ node.label }}</span>
                    <span v-else>{{ data.name }}</span>
                  </span>
                </el-tree>
              </div>

            </div>
          </div>
        </el-col>
        <el-col :span="18" style="height: 100%">
          <div style="height: calc(100% - 60px);box-sizing: border-box;padding: 7px 0;">
            <div style="text-align: center">
              <el-transfer
                style="text-align: left; display: inline-block"
                v-model="transferSelectedData"
                filterable
                :props="transferProps"
                :left-default-checked="[]"
                :right-default-checked="[]"
                :render-content="renderFunc"
                :titles="['未分配用户', '已分配用户']"
                :format="{noChecked: '${total}',hasChecked: '${checked}/${total}'}"
                @change="handleChange"
                :data="transferData">
              </el-transfer>
            </div>

          </div>
          <div style="position: relative; height: 60px;text-align: center;box-sizing: border-box;padding: 10px 0 0 0;">
            <el-button type="primary" @click="saveUsersByRole">保 存</el-button>
            <el-button @click="dialogAssignVisible = false" style="margin-left: 30px">关 闭</el-button>
          </div>
        </el-col>
      </div>
    </el-dialog>
    <!--页面弹窗部分结束-->

  </div>
</template>

<script>
  //核心库
  import Vue from 'vue'
  import searchBar from '@/components/searchBar'

  //API
  import {
    listPageRoles,
    addRole,
    saveRoleUsers,
    updateRole,
    updateRoleDisable,
    deleteRoles,
    exportExcelRoles,
    importExcelRoles,
    saveRoleMeuns,
    treeRoleMeunsAll,
    treeRoleMeunsSelected,
    listRoleMeunsButtonsAll,
    getRoleMeunsDataType,
    saveRoleMeunsButtons,
    dataListRoles,
    listUsersByRole,
    saveRoleMeunsData,
    listAllUsersByDeptId
  } from '@/api/role'


  import {treeDepartments} from '@/api/department'

  //按钮权限
  import {initMenuButtons} from '@/api/button'


  //	公共方法
  import {filerTableTitle, filerIds, resetState,downLoad} from '@/utils/common'
  // import ElInput from "element-ui/packages/input/src/input";

  //	  table操作栏里面的按钮
  const operateBtns = {
    props: ['colConfig'],
    template: `<el-table-column :label="colConfig.label" :sortable="colConfig.sortable" align="center">
      					<div slot-scope="scope" class="btnBox">
      							<el-button  type="text" class="btns" style="font-size: 12px;" :disabled="scope.row.isdisable==='0'" @click="colConfig.editRole(scope.row,scope.$index)">编辑</el-button>
      							<el-button  type="text" class="btns" style="font-size: 12px;" :disabled="scope.row.isdisable==='0'" @click="colConfig.menuRole(scope.row,scope.$index)">菜单权限</el-button>
      							<el-button  type="text" class="btns" style="font-size: 12px;" :disabled="scope.row.isdisable==='0'" @click="colConfig.btnRole(scope.row,scope.$index)">按钮权限</el-button>
      							<el-button v-show="scope.row.companyCode!='NB' " type="text" class="btns" style="font-size: 12px;" :disabled="scope.row.isdisable==='0'" @click="colConfig.dataRole(scope.row,scope.$index)">数据权限</el-button>
      							<el-button  type="text" class="btns" style="font-size: 12px;" :disabled="scope.row.isdisable==='0'" @click="colConfig.assign(scope.row,scope.$index)">分配用户</el-button>
      					</div>
    				</el-table-column>`
  }
  //	  table状态栏里面的按钮
  const stateBtns = {
    props: ['colConfig'],
    template: `<el-table-column :label="colConfig.label" :sortable="colConfig.sortable" align="center">
						<div slot-scope="scope">
    						<el-switch active-value="1" inactive-value="0" v-model="scope.row.isdisable" :disabled="colConfig.isSingle && scope.row.isdisable==='0'" @change="colConfig.changeState(scope.row,scope.$index)"></el-switch>
    					</div>
    			   </el-table-column>`
  }


  export default {

    data() {
      // const generateData = _ => {
      //   const data = [];
      //   for (let i = 1; i <= 15; i++) {
      //     data.push({
      //       key: i,
      //       label: `备选项 ${ i }`,
      //       disabled: i % 4 === 0
      //     });
      //   }
      //
      //   console.log(data)
      //   return data;
      // };
      return {



        //搜索栏数据
        guid: '',
        searchList: [
          {
            label: '企业编码',
            type: 'input',
            ruleType: 'string',
            mapKey: 'companyCode',
            configs: {},
            placeholder: '企业编码'
          },
          {
            label: '企业名称',
            type: 'input',
            ruleType: 'string',
            mapKey: 'companyName',
            configs: {},
            placeholder: '企业名称'
          },{
            label: '角色编码',
            type: 'input',
            ruleType: 'string',
            mapKey: 'code',
            configs: {},
            placeholder: '角色编码'
          },
          {
            label: '角色名称',
            type: 'input',
            ruleType: 'string',
            mapKey: 'name',
            configs: {},
            placeholder: '角色名称'
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
          }
        ],
        searchConfig: {
          hideSearchSwitch: false,//设置是否隐藏搜索列，隐藏为true,不隐藏为false，非必要设置
        },


        radio:null,
        isShowRadio:true,
        roleMenu:{},

        propName: 'role',
        userInfo: null,
        pageData: {},
        currentpage: 1,//分页默认值
        selectList: [],//行数据选择列表
        hideTime: 500,
        dynaHeight: 40,
        clientHeight: 0,
        dynaHeightTimer: null,
        dynaHeightState: null,


        //顶部搜索栏数据开始
        formData: {
          code: '',
          name: '',
          isdisable: ''
        },
        topBarBtnList: [{
          name: '查询',
          icon: 'search',
          method: this.queryRole
        }, {
          name: '重置',
          icon: 'refresh',
          plain: true,
          method: this.resetQuery
        }],

        //表格部分数据
        contentBarBtnList: [{
          name: '新增',
          icon: 'add',
          method: this.addRole
        },
          //   {
          //   name: '导入',
          //   icon: 'import',
          //   method: this.importRole
          // },{
          //   name: '导出',
          //   nameEn: 'export',
          //   isShow: true,
          //   icon: 'export',
          //   method: this.exportExcel
          // },
          {
            name: '删除',
            icon: 'delete',
            plain: true,
            state: true,
            method: this.deleteRole
          }],
        tableOperates: {
          prop: 'operate',
          label: '操作',
          enLabel: 'operation',
          isPropName: true,
          component: operateBtns,
          editRole: this.editRole,
          menuRole: this.menuRole,
          btnRole: this.btnRole,
          dataRole: this.dataRole,
          assign: this.assign
        },
        tableConfigs: {
          titleList: [],
          showCheckBox: true,
          showIndex: false,
          isSingle: false
        },
        tableData: [],
        treeConfigs: {
          ref: 'tree',
          showCheckBox: false,
          showIcons: false,
        },

        //
        addDictionaryData: {
          pid: '',
          id: '',
          name: ''
        },

        //页面弹窗数据
        dialogFormVisible: false,
        dialogStatus: '',
        textMap: {
          update: '编辑',
          create: '新增'
        },
        temp: {
          userId: '',
          userType: '',
          name: '',
          companyId: '',
          remark: ''
        },
        rules: {
          name: [{
            required: true,
            message: '请填写名称',
            trigger: 'change'
          }]
        },
        treeData: [],

        //菜单权限弹窗
        menuRoleLoading: true,
        dialogMenuVisible: false,
        menuRoleBtnList: [{
          name: '清空',
          icon: 'refresh',
          plain: true,
          state: true,
          method: this.emptyMenuRole
        }],
        menuRoleData: '',
        menuRoleTreeConfigs: {
          propName: 'route',
          showCheckBox: true,
          defaultProps: {
            children: 'children',
            label: 'url',
          },
        },
        menuRoleTree: [],
        checkedList: [],
        menuRoleCheckedList: [],
        roleID: '',

        //按钮权限弹窗
        btnPropName: '',
        dialogBtnVisible: false,
        dialogDataVisible: false,
        isIndeterminate: false,
        btnCheckAll: false,
        checkedDialogBtns: [],
        dialogBtns: [],
        btnRoleTreeConfigs: {
          propName: 'route',
        },
        btnRoleTree: [],
        btnCheckedList: [],
        btnRoleLoading: false,
        dialogCheckboxLoading: false,
        dialogRadioLoading:false,
        menuNodeData: null,

        //分配用户弹窗
        dialogAssignVisible: false,
        transferData: [],
        transferSelectedData: [],
        renderFunc(h, option) {
          console.log(option)
          return <span style = "display: inline-block;width: 100%;" > < span style = "display: inline-block;width: 20%;text-align: center;" > {option.index}</span><span style="display: inline-block;width: 39%;text-align: center;">{ option.userCode }</span > < span style = "display: inline-block;width: 39%;text-align: center;" > {option.userName}</span></span >;
        },
        assignLoading: false,
        assignTree: [],
        assignTreeConfigs:{
          showSearch: true,

        },
        assignCheckedList: [],
        assignData: null,
        assignFilterText: '',
        dialogAssignChecked: false,
        clickArrow: false,
        defaultProps: {
          children: 'children',
          label: 'url'
        },
        transferProps: {
          key: 'id',
          label: 'userName',
          code: 'userCode',
          disabled: 'isdisable',
          index: 'index'
        },





        //old
        /*初始化数据*/
        initConfigs: {
          // //行级按钮初始化
          // tableOperates: {
          //   prop: 'operate',
          //   label: '操作',
          //   enLabel: 'operation',
          //   isPropName: true,
          //   component: operateBtns, //自定义按钮组件
          //   editBtns: this.editBtns //自定义按钮方法-编辑
          // },
        },
        tableData: [],//table数据集
        configs: {
          //表级按钮初始化
          topBarBtnList: [
            {
              name: 'add',
              icon: 'add',
              method: this.addNew //自定义按钮方法-新增
            },
            {
              name: 'delete',
              icon: 'delete',
              plain: true,
              state: true,
              method: this.deleteBatch//自定义按钮方法-删除
            }
          ],
          tableConfigs: [],
          showCheckBox: false,//是否显示行级单选框
          showIndex: false    //是否显示行号
        },

        tempQuery: {

        },
        // form表单字段名称map集合
        tempLable: {
          name: ''
        },
        // form表单字段校验信息
        rules: {
          name: [{
            required: true,
            message: '请填写名称',
            trigger: 'change'
          }]
        }
      }
    },

    //子组件
    components: {
      searchBar
    },

    /*生命周期函数开始*/
    //vue实例化之前
    beforeCreate() {

    },

    //vue实例化后调用
    created() {
      const that = this
      that.userInfo = that.$storage.get('userInfo')
      //按钮初始化
      that.initButtons()
      that.httpListPageRoles()
      that.dynaHeightState = that.$storage.get('dynaHeightState') || '1'
      if (!(that.dynaHeightState - 0)) {
        that.dynaHeight = 0
      }

    },

    //挂载之前
    beforeMount() {

    },
    //真实DOM挂载后，仅限组件本身的挂载，如果存在子组件，并且需求子组件全部被挂载后进行操作，需使用vm.$nextTick顶替mounted（在mounted内部调用vm.$nextTick）；
    mounted() {
      this.clientHeight = this.$el.clientHeight


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
        this.currentpage = 1
        this.httpListPageRoles()
      },
      sendGuid(id) {
        this.guid = id
      },


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



      // //搜索栏切换
      // resetDynaHeight() {
      //   const that = this
      //   if (that.dynaHeight && that.dynaHeightState - 0) {
      //     that.dynaHeight = 0
      //     that.$storage.remove('dynaHeightState')
      //     that.$storage.set('dynaHeightState', '0')
      //     clearTimeout(that.dynaHeightTimer)
      //     that.dynaHeightTimer = setTimeout(function () {
      //       that.dynaHeightState = false
      //     }, 500)
      //   } else if (!that.dynaHeight && !(that.dynaHeightState - 0)) {
      //     that.dynaHeight = 40
      //     that.$storage.remove('dynaHeightState')
      //     that.$storage.set('dynaHeightState', '1')
      //     clearTimeout(that.dynaHeightTimer)
      //     that.dynaHeightTimer = setTimeout(function () {
      //       that.dynaHeightState = true
      //     }, 500)
      //   }
      // },

      //region
      //网络请求
      httpListPageRoles() {
        const that = this
        listPageRoles(that.setTempQuery).then(res => {
          that.getListPage(res)
          that.$loading().close()
        }).catch(err => {
          console.log(err)
        })
      },

      //查询功能
      queryRole() {
        const that = this
        that.currentpage = 1
        listPageRoles(that.setTempQuery).then(res => {
          that.getListPage(res)
          that.$loading().close()
        }).catch(err => {
          console.log(err)
        })
      },


      // resetQuery() {
      //   if (this.formData.code || this.formData.name || this.formData.isdisable) {
      //     this.httpListPageRoles()
      //   }
      //   this.formData = {
      //     code: '',
      //     name: '',
      //     isdisable: ''
      //   }
      //
      // },
      //新增角色权限
      addRole() {
        this.resetTemp()
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs[this.propName + 'Dialog'].clearValidate()
        })

      },
      createData() {
        const that = this
        that.$refs[this.propName + 'Dialog'].validate((valid) => {
          if (valid) {
            that.temp.userId = that.userInfo.userId
            that.temp.userType = that.userInfo.userType
            that.temp.companyId = that.userInfo.companyId
            that.dialogFormVisible = true
            that.httpAddRole(that.temp)
          }
        })
      },
      httpAddRole(data) {
        const that = this
        addRole(data).then(res => {
          console.log(res)
          if (res.code === 0) {
            that.dialogFormVisible = false
            that.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 1000,
              onClose: () => {
                that.httpListPageRoles()
              }
            })
          }
        }).catch(err => {
          console.log(err)
        })
      },


      //导入角色权限
      importRole() {

      },

      //删除角色权限
      deleteRole() {
        const that = this
        console.log(that.selectList)
        let ids = ''
        that.selectList.forEach(item => {
          ids += item.id + ','
        })
        ids = ids.slice(0, ids.length - 1)

        that.httpDeleteRoles({ids: ids})
      },
      httpDeleteRoles(data, isSucc) {
        const that = this
        deleteRoles(data).then(res => {
          console.log(res)
          that.selectList = []
          if (res.code === 0) {
            that.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 1000,
              onClose: () => {
                if (!isSucc) {
                  that.httpListPageRoles()
                }
              }
            })
          }
          that.contentBarBtnList[1].state = true
          that.$loading().close()
        }).catch(err => {
          console.log(err)
        })
      },

      //表格内按钮功能
      editRole(item, index) {
        this.resetTemp()
        this.temp = JSON.parse(JSON.stringify(item))

        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs[this.propName + 'Dialog'].clearValidate()
        })
      },
      updateData() {
        const that = this
        that.$refs[this.propName + 'Dialog'].validate((valid) => {
          if (valid) {
            const data = {
              companyId: that.temp.companyId,
              id: that.temp.id,
              name: that.temp.name,
              remark: that.temp.remark
            }
            that.httpUpdateRole(data, true)
          }
        })
      },
      httpUpdateRole(data, isSucc) {
        const that = this
        updateRole(data).then(res => {
          //console.log(res)
          if (res.code === 0) {
            that.dialogFormVisible = false
            that.$loading().close()
            that.$notify({
              title: '成功',
              message: '修改成功',
              type: 'success',
              duration: 1000,
              onClose: () => {
                that.httpListPageRoles()
              }
            })
          }
        }).catch(err => {
          //console.log(err)
        })
      },

      //状态栏按钮功能
      changeRoleState(data,index){
        const that = this
        console.log(data)
        console.log(index)
        that.httpUpdateRoleDisable(data)
      },
      httpUpdateRoleDisable(data){
        const that = this
        updateRoleDisable({
          id: data.id,
          isdisable: data.isdisable
        }).then(res => {
          console.log(res)
          that.$loading().close()
          that.$notify({
            title: '成功',
            message: '修改成功',
            type: 'success',
            duration: 1000
          })
        }).catch(err => {
          if(data.isdisable === '0'){
            data.isdisable = '1'
          }else {
            data.isdisable = '0'
          }
        })
      },


      //菜单权限按钮
      menuRole(item, index) {
        //console.log(item)
        const that = this
        //当前登录用户-用户角色id
        const userRoleId = that.$storage.get('userInfo').roleIds
        //当前登录用户-用户类型 userType
        const userType = that.$storage.get('userInfo').userType

        this.menuRoleData = item
        this.roleID = item.id
        this.menuRoleTree = []
        this.checkedList = []
        this.menuRoleLoading = true
        this.dialogMenuVisible = true
        this.httpTreeRoleMeunsAll({userRoleId: userRoleId, userType: userType, roleIds: item.id})
      },
      httpTreeRoleMeunsAll(data) {
        const that = this
        treeRoleMeunsAll(data).then(res => {
          console.log(JSON.parse(res.result))
          that.menuRoleLoading = false
          if (res.code === 0) {
            that.menuRoleTree = JSON.parse(res.result)
            //console.log(that.menuRoleTree)
            that.filterBindRole(that.menuRoleTree)
            //console.log(that.menuRoleTree)
            //console.log(that.checkedList)
          }
        }).catch(err => {
          console.log(err)
        })
      },
      saveMenuRole() {
        const that = this
        const halfKeys = that.$refs.menuRoleTree.$children[0].getHalfCheckedKeys()
        console.log(halfKeys)
        that.menuRoleCheckedList = that.menuRoleCheckedList.concat(halfKeys)
        if (that.menuRoleCheckedList.length) {
          let strs = ''
          that.menuRoleCheckedList.forEach(item => {
            strs += item + ','
          })
          strs = strs.slice(0, strs.length - 1)
          that.httpSaveRoleMeuns({roleID: that.roleID, meunIds: strs})
        } else {
          that.$message({
            message: '请选择菜单',
            type: 'error',
            duration: 1000
          })
        }
      },
      httpSaveRoleMeuns(data) {
        const that = this
        saveRoleMeuns(data).then(res => {
          console.log(res)
          if (res.code === 0) {
            that.$loading().close()
            that.$notify({
              title: '成功',
              message: '设置成功',
              type: 'success',
              duration: 1000
            })
            this.dialogMenuVisible = false;
          }

        }).catch(err => {
          console.log(err)
        })
      },
      emptyMenuRole() {
        console.log(this.$refs.menuRoleTree)
        this.$refs.menuRoleTree.$children[0].setCheckedKeys([], true)
        this.menuRoleCheckedList = []
        this.checkedList = []
      },
      menuRoleTreeDataBridge(data) {
        console.log(data)
        if (data.checkedKeys) {
          this.menuRoleCheckedList = data.checkedKeys
        }
      },
      filterBindRole(data) {
        const that = this
        data.forEach((item,index) => {
          if(item.children && item.children.length){
            that.filterBindRole(item.children)
          }
          if(item.isChecked){
            that.checkedList.push(item.id)
          }
          // if (item.isChecked) {
          //   if (item.children && item.children.length) {
          //     const state = that.checkChildBindRole(item.children)
          //     if(state){
          //       that.checkedList.push(item.id)
          //     }
          //     that.filterBindRole(item.children)
          //   }else {
          //     that.checkedList.push(item.id)
          //   }
          // }
        })
        that.menuRoleCheckedList = that.checkedList
      },
      // checkChildBindRole(list) {
      //   let index = 0
      //   let state = false
      //   list.forEach(item => {
      //     if(item.isChecked){
      //       index++
      //     }
      //     if(index === list.length){
      //       state = true
      //     }
      //   })
      //   return state
      // },

      //按钮权限弹窗
      dataRole(item, index) {
        console.log(item)
        // this.menuNodeData = null
        this.isShowRadio = true
        this.menuRoleData = item

        this.dialogDataVisible = true
        this.btnRoleLoading = true
        this.httpTreeRoleMeunsSelected({roleIds: item.id})
      },

      //按钮权限弹窗
      btnRole(item, index) {
        console.log(item)
        this.menuNodeData = null
        this.btnPropName = ''
        this.dialogBtns = []
        this.btnRoleTree = []
        this.btnCheckedList = []
        this.menuRoleData = item
        this.dialogBtnVisible = true
        this.btnRoleLoading = true
        this.httpTreeRoleMeunsSelected({roleIds: item.id})
      },

      httpTreeRoleMeunsSelected(data) {
        const that = this
        treeRoleMeunsSelected(data).then(res => {
          console.log(res)
          if (res.code === 0) {
            res.result = JSON.parse(res.result)
            that.btnRoleTree = res.result
            that.btnRoleLoading = false
          }

        }).catch(err => {
          console.log(err)
        })
      },



      contains(arr, obj) {
        var i = arr.length;
        while (i--) {
          if (arr[i] === obj) {
            return true;
          }
        }
        return false;
      },

      saveDataRoleMenu(){
        const that = this
        if(that.roleMenu.id){
          that.roleMenu.dataType = that.radio
          // that.roleMenu.roleId = that.menuRoleData.id
          // that.roleMenu.menuId = that.menuNodeData.id
          saveRoleMeunsData(that.roleMenu).then(res => {
            if (res.code === 0) {
              that.$notify({
                title: '成功',
                message: '设置成功',
                type: 'success',
                duration: 1000
              })
              // this.dialogDataVisible = false;
            }
          }).catch(err => {
            console.log(err)
          })
        }else{
          that.$message({
            message: '请重新选择左边菜单！',
            type: 'error',
            duration: 1000
          })
          return;
        }

      },



      saveBtnRole() {

        let ids = ''
        this.dialogBtns.forEach(item =>{
          if(!this.contains(this.checkedDialogBtns,item.id)){
            if(ids.length==0){
              ids = item.id
            }else{
              ids = ids + ','+ item.id
            }
          }

        })
        // console.log("%%%%%%%%%%"+this.dialogBtns)
        // console.log("$$$$$$$$$"+this.checkedDialogBtns)
        // const ids = filerIds(this.checkedDialogBtns)
        // console.log("&&&&&&&&"+ids)
        // this.menuRoleData
        this.httpSaveRoleMeunsButtons({menuId:this.menuNodeData.id,roleID: this.menuRoleData.id, buttonIds: ids})
      },
      httpSaveRoleMeunsButtons(data) {
        const that = this
        saveRoleMeunsButtons(data).then(res => {
          console.log(res)
          that.$loading().close()
          that.dialogCheckboxLoading = true
          listRoleMeunsButtonsAll({
            roleIds: that.menuRoleData.id,
            menuId: that.menuNodeData.id
          }).then(res => {
              that.resetBtnDialogData()
              res.result = JSON.parse(res.result)
              that.dialogBtns = res.result
              that.checkedDialogBtns = that.getCheckedDialogBtns(res.result)
              that.dialogCheckboxLoading = false
              that.$notify({
                title: '成功',
                message: '设置成功',
                type: 'success',
                duration: 1000
              })
              this.dialogBtnVisible = false;
            }
          ).catch(err => {
              console.log(err)
            }
          )
        }).catch(err => {
          console.log(err)
        })
      },
      getCheckedDialogBtns(list) {
        const tempArr = []
        list.forEach(item => {
          if(item.isBindRole === '1'){
            tempArr.push(item.id)
          }
        })
        return tempArr
      },
      resetBtnDialogData(){
        this.btnCheckAll = false
        this.dialogBtns = []
        this.dialogCheckboxLoading = true
        this.isIndeterminate = false
        this.checkedDialogBtns = []
      },

      dataRoleTreeDataBridge(data) {
        const that = this
        // console.log(data)
        that.radio = null
        if(data.nodeData.children.length>0){
          that.isShowRadio = true
        }else{
          that.isShowRadio = false
        }
        that.menuNodeData = data.nodeData
        this.roleMenu = {}
        that.dialogRadioLoading = true
        getRoleMeunsDataType({roleId: that.menuRoleData.id,menuId: that.menuNodeData.id}).then(res => {
            console.log(res)
            if (res.code === 0) {
              if(res.result.roleMenu){
                this.roleMenu = res.result.roleMenu
                if(res.result.roleMenu.dataType){
                  that.radio = parseInt(res.result.roleMenu.dataType)
                }
              }
              that.dialogRadioLoading = false
            }
          }
        ).catch(err => {
            console.log(err)
            that.dialogRadioLoading = false
          }
        )


      },

      btnRoleTreeDataBridge(data) {
        const that = this
        // console.log(data)
        if (data.nodeData.url !== that.btnPropName) {
          that.btnPropName = data.nodeData.url
          that.resetBtnDialogData()
          that.menuNodeData = data.nodeData
          that.httpListRoleMeunsButtonsAll({
            roleIds: that.menuRoleData.id,
            menuId: data.nodeData.id
          })
        }
      },
      httpListRoleMeunsButtonsAll(data) {
        const that = this
        listRoleMeunsButtonsAll(data).then(res => {
            console.log(res)
            if (res.code === 0) {
              res.result = JSON.parse(res.result)
              that.dialogBtns = res.result
              that.checkedDialogBtns = that.getCheckedDialogBtns(res.result)
              that.dialogCheckboxLoading = false
            }
          }
        ).catch(err => {
            console.log(err)
            that.dialogCheckboxLoading = false
          }
        )
      },

      handleCheckAllChange(val) {
        this.checkedDialogBtns = val ? this.filterBtnNameEn(this.dialogBtns) : [];
        this.isIndeterminate = false;
      },
      filterBtnNameEn(list) {
        const tempArr = []
        if (list.length) {
          list.forEach(item => {
            tempArr.push(item.id)
          })
        }
        return tempArr
      },
      handleCheckedDialogBtnsChange(value) {
        console.log(this.checkedDialogBtns)
        let checkedCount = value.length;
        this.btnCheckAll = checkedCount === this.dialogBtns.length;
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.dialogBtns.length;
      },

      handleRadioDataTypeChange(value) {
        // console.log(this.radio)
        // console.log(value)
      },
      //endregion

      //分配用户弹窗
      resetAssignData() {
        this.assignData = null
        this.assignFilterText = ''
        this.dialogAssignChecked = false
        this.assignLoading = false
        this.assignTree = []
        this.transferData = []
        this.transferSelectedData = []

      },
      assign(item, index) {
        const that = this
        that.resetAssignData()
        //var jsonStr = JSON.stringify(item);
        //console.log("jsonStr: " + jsonStr);

        that.dialogAssignVisible = true
        that.assignLoading = true
        that.assignData = item
        that.$nextTick(() => {
          if (!document.getElementsByClassName('customTitle').length) {
            const elList = document.getElementsByClassName('el-transfer-panel__filter')
            for (let i = 0; i < elList.length; i++) {
              const Title = Vue.extend({
                template: `<div class="customTitle" style="box-sizing: border-box;padding: 5px 0 5px 41px;height: 25px;box-shadow:0 3px 5px -3px rgba(0,0,0,0.3);">
                          <span style="display: inline-block;width: 100%;">
                          <span style="display: inline-block;width: 20%;text-align: center;">序号</span>
                          <span style="display: inline-block;width: 37%;text-align: center;">账号</span>
                          <span style="display: inline-block;width: 38%;text-align: center;">姓名</span>
                          </span>
                        </div>`
              })
              const component = new Title().$mount()
              var div = elList[i]
              var divParent = div.parentNode
              var next = div.nextSibling
              if (next) {
                divParent.insertBefore(component.$el, next)
              } else {
                divParent.appendChild(component.$el)
              }
            }
          }
        })

        that.httpTreeDepartments({isdisable: "1"})

        let companyId = that.$storage.get('userInfo').companyId;
        that.assignTreeDataBridge({id: companyId});
      },

      httpTreeDepartments(data) {
        const that = this
        treeDepartments(data).then(res => {
          that.assignTree = [res.result.treeList]


          that.$nextTick(_=>{
            that.$refs.assignTree.setCurrentKey(that.assignTree[0].id)
            //that.$refs.assignTree.getCurrentNode().id
          })
        }).catch(err => {
          that.assignLoading = false
        })
      },

      handleChange(value, direction, movedKeys) {
      },

      assignTreeDataBridge(data){
        const that = this
        that.transferData = []
        that.transferSelectedData = []

        const reqData1 = {
          //Service (deptId)参数已经使用 -- 更改为(userDeptId)
          userDeptId: data.id,
          roleId: that.assignData.id
        }
        const reqData2 = {
          roleId: that.assignData.id
        }
        that.$axios.all([listUsersByRole(reqData2), listAllUsersByDeptId(reqData1)]).then(that.$axios.spread((res1, res2) => {
          //console.log(res1)
          //console.log(res2)
          // const tempList1 = resetState(res1.result.varList)
          // const tempList2 = resetState(res2.result.varList)
          const tempList = resetState(res1.result.varList.concat(res2.result.varList))
          tempList.forEach((item, index) => {
            item.index = index + 1
          })
          that.transferData = tempList
          //console.log(that.transferData)
          that.transferSelectedData = that.assignFilterKey(res1.result.varList)
          //console.log(that.transferSelectedData)
          that.$loading().close()
          that.assignLoading = false
        })).catch((error) => {
          console.log(error)
          that.$loading().close()
          that.assignLoading = false
        })
        // that.httpListUsersByRole(reqData1)
        // setTimeout(function () {
        //   that.httpListUsersByRole(reqData2)
        // },1000)

      },
      assignFilterKey(list){
        const tempArr = []
        list.forEach(item => {
          tempArr.push(item.id)
        })
        return tempArr
      },
      // httpListUsersByRole(data) {
      //   const that = this
      //   listUsersByRole(data).then(res => {
      //     console.log(res)
      //     that.$loading().close()
      //   }).catch(err => {
      //     console.log(err)
      //   })
      // },
      assignFilterNode(value, data) {
        if (!value) return true;
        return data.name.indexOf(value) !== -1;
      },
      saveUsersByRole(){
        const that = this
        that.httpSaveRoleUsers()
      },
      httpSaveRoleUsers() {
        //console.log("assignData.id:" + this.assignData.id);
        const that = this
        saveRoleUsers({
          roleId: that.assignData.id,
          userIds: filerIds(that.transferSelectedData)
        }).then(res => {
          //console.log(res)
          that.$loading().close()
          that.dialogAssignVisible = false
          that.$notify({
            title: '成功',
            message: '保存成功',
            type: 'success',
            duration: 1000
          })
        }).catch(err => {
        })
      },






      //加载table列头及列表数据
      getListPage(res) {
        const that = this
        if (res) {
          res.result.titles = JSON.parse(res.result.titles)
          res.result.varList = JSON.parse(res.result.varList)
          res.result.pageData = JSON.parse(res.result.pageData)
          const data = filerTableTitle(res.result)
          const titleList = that.addTableTitle(data)
          that.tableConfigs.titleList = titleList
          that.pageData = res.result.pageData
          that.tableConfigs.showCheckBox = true
          that.tableConfigs.showIndex = true
          that.tableData = res.result.varList

        }
      },

      addTableTitle(list) {
        const that = this
        const addTxt = 'isdisable'
        list.forEach(item => {
          if (item.enLabel === addTxt) {
            item.component = stateBtns
            item.changeState = that.changeRoleState
            item.isPropName = that.propName ? true : false
            // item.isSingle = true
          }
        })
        list.push(that.tableOperates)
        return list
      },


      //通过单选框触发事件 获取table组件传回的数据
      dataBridge(data) {
        console.log(data)
        const that = this
        that.selectList = data
        if (data.length) {
          that.contentBarBtnList[1].state = false
        } else {
          that.contentBarBtnList[1].state = true
        }
      },

      // //行级按钮-编辑
      // editBtns(item, index) {
      //   //const that = this
      //   // console.log(item)
      //   //console.log("item.companyId:" + item.companyId);
      //
      //   this.resetTemp()
      //   this.temp = JSON.parse(JSON.stringify(item))
      //
      //   //this.temp.companyId = item.companyId
      //   //this.temp.name = item.name
      //   //this.temp.id = item.id
      //   this.dialogStatus = 'update'
      //   this.dialogFormVisible = true
      //   this.$nextTick(() => {
      //     this.$refs['submitForm'].clearValidate()
      //   })
      // },


      //表级按钮-新增
      addNew() {
        this.resetTemp()
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['submitForm'].clearValidate()
        })
      },

      //form表单内容重置
      resetTemp() {
        this.temp = {
          userId: '',
          userType: '',
          name: '',
          companyId: '',
          remark: ''
        }
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
        exportExcelRoles(ids)
        //*******************************************************用户自定义修改 end ***************************************************************************
          .then(res => {
            // console.log(res)
            if (!res) {
              return
            }
            downLoad(res,"组织管理导出.xls")
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
      setDialogMenuHeight(){
        return `height:${this.$store.getters.systemInfo.offsetHeight/2}px`
      },
      setTempQuery(){
        return Object.assign({},this.tempQuery,{pageNo: this.currentpage})
      },
    },

    //观察者,可监听数据
    watch: {
      currentpage: function () {
        //console.log(this.currentpage)
        this.httpListPageRoles()
      },
      selectList: function () {
        this.contentBarBtnList[2].state = this.selectList.length < 1
        this.contentBarBtnList[3].state = this.selectList.length < 1
      },
      menuRoleCheckedList: function () {
        this.menuRoleBtnList[0].state = this.menuRoleCheckedList.length < 1
      },
      dialogAssignChecked: function () {
        console.log(this.dialogAssignChecked)
      },
      assignFilterText: function(val) {
        this.$refs.assignTree.filter(val);
      },
      // transferSelectedData: function (val) {
      //   console.log(val)
      // }
    }

  }

</script>

<style lang="scss" rel="text/css">
  .roleManage {
    position: absolute;
    top: 10px;
    left: 10px;
    right: 10px;
    bottom: 0;
    box-sizing: border-box;
  /*border: 1px solid #E4E4E4;*/
  /*border-bottom: none;*/
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

  .el-checkbox.is-bordered.el-checkbox--medium {
    margin-left: 20px;
    margin-bottom: 10px;
  }

  .el-checkbox.is-bordered + .el-checkbox.is-bordered {
    margin-left: 20px;
    margin-bottom: 10px;
  }

  .el-checkbox.is-bordered.el-checkbox--medium {
    padding: 9px 20px 9px 10px;
  }

  .el-transfer-panel {
    width: 250px;
  }

  .el-transfer-panel__body {
    height: 370px;
  }

  .el-transfer-panel__list.is-filterable {
    height: 308px;
  }

  .el-transfer__buttons .el-button {
    padding: 10px;
  }

  .el-transfer-panel__filter {
    margin: 5px 15px;
  }
  .leftTree .el-input, .leftTree .checkBox {
    margin-left: 10%;
    margin-bottom: 10px;
    width: 80%;
  }
  .treeView {
    height: calc(100% - 85px);
    overflow: auto;
  .el-tree {
    background-color: inherit;
  }
  }

</style>
