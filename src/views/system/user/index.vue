<!----------------------------userManage 用户自定义修改  注意要与最下边对应的样式名称保持一致-------------------------------->
<template>
  <div class="userManage">
    <!--列表界面查询搜索-->
    <!--<el-row  :gutter="10" style="box-sizing: border-box;position: relative;overflow: hidden;transition: height 0.4s;-webkit-transition: height 0.4s;-moz-transition: height 0.4s;" :style="{height: dynaHeight+'px'}">-->
      <!--<div style="position: absolute;">-->
        <!--<el-form :inline="true" :model="tempQuery" class="form-inline">-->
          <!--<el-col :span="3" style="max-width: 260px">-->
            <!--<el-form-item :label="tempLable.userCode">-->
              <!--<el-input v-model="tempQuery.userCode" :placeholder="tempLable.userCode"></el-input>-->
            <!--</el-form-item>-->
          <!--</el-col>-->
          <!--<el-col :span="3" style="max-width: 260px">-->
            <!--<el-form-item :label="tempLable.userName">-->
              <!--<el-input v-model="tempQuery.userName" :placeholder="tempLable.userName"></el-input>-->
            <!--</el-form-item>-->
          <!--</el-col>-->
          <!--<el-col :span="3" style="max-width: 260px">-->
            <!--<el-form-item :label="tempLable.mobile">-->
              <!--<el-input v-model="tempQuery.mobile" :placeholder="tempLable.mobile"></el-input>-->
            <!--</el-form-item>-->
          <!--</el-col>-->


          <!--<el-col :span="3" style="max-width: 260px">-->
            <!--<el-form-item :label="tempLable.roleName" >-->
              <!--<base-input-select :placeholder="tempLable.roleName" v-model="selectDataRole.defaultSelected" :data="selectDataRole.data"  @callback="queryRoleSelect" ></base-input-select>-->
            <!--</el-form-item>-->
          <!--</el-col>-->

          <!--<el-col :span="3" style="max-width: 260px">-->
            <!--<el-form-item :label="tempLable.userTypeName" >-->
              <!--<base-input-select :placeholder="tempLable.userTypeName" v-model="selectDataUser.defaultSelected" :data="selectDataUser.data"  @callback="queryUserSelect" ></base-input-select>-->
            <!--</el-form-item>-->
          <!--</el-col>-->


          <!--<el-col :span="3" style="max-width: 260px">-->
            <!--<el-form-item :label="tempLable.isdisable">-->
              <!--<el-select v-model="tempQuery.isdisable" :placeholder="tempLable.isdisable" clearable>-->
                <!--<el-option :label="'是'" value="1"></el-option>-->
                <!--<el-option :label="'否'" value="0"></el-option>-->
              <!--</el-select>-->
            <!--</el-form-item>-->
          <!--</el-col>-->
          <!--<el-col :span="2" style="max-width: 100px">-->
            <!--<el-form-item>-->
              <!--<base-button v-show="configs.queryBarBtnList[0].isShow"  :name='configs.queryBarBtnList[0].name' :icon='configs.queryBarBtnList[0].icon' :plain="configs.queryBarBtnList[0].plain"-->
                         <!--:state="configs.queryBarBtnList[0].state"-->
                         <!--@myclick="configs.queryBarBtnList[0].method"></base-button>-->
            <!--</el-form-item>-->
          <!--</el-col>-->
          <!--<el-col :span="2" style="max-width: 100px">-->
            <!--<el-form-item>-->
              <!--<base-button v-show="configs.queryBarBtnList[1].isShow"  :name='configs.queryBarBtnList[1].name' :icon='configs.queryBarBtnList[1].icon' :plain="configs.queryBarBtnList[1].plain"-->
                         <!--:state="configs.queryBarBtnList[1].state"-->
                         <!--@myclick="configs.queryBarBtnList[1].method"></base-button>-->
            <!--</el-form-item>-->
          <!--</el-col>-->
        <!--</el-form>-->
      <!--</div>-->
    <!--</el-row>-->



    <!--<el-row style="position: relative;height: 20px;">-->
      <!--<div style="position: absolute;bottom: 10px;left: 0;right: 0;height: 1px;background-color: rgb(228,228,228);z-index: 10;">-->
        <!--<div style="position: relative;">-->
          <!--<el-tooltip effect="dark" :content="dynaHeightState-0?'收起搜索':'展开搜索'" placement="bottom" :hide-after="hideTime">-->
            <!--<el-button v-if="dynaHeightState-0" icon="el-icon-arrow-up" circle style="position: absolute;left: 50%;top: -10.5px;transform: translate(-50%,0); width: 1.5em;height: 1.5em;padding: 0;" @click="resetDynaHeight"></el-button>-->
            <!--<el-button v-else icon="el-icon-arrow-down" circle style="position: absolute;left: 50%;top: -10.5px;transform: translate(-50%,0); width: 1.5em;height: 1.5em;padding: 0;" @click="resetDynaHeight"></el-button>-->
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



    <el-row style="border: 1px solid #E4E4E4;border-bottom: none;margin-top: 10px;transition: height 0.4s;-webkit-transition: height 0.4s;-moz-transition: height 0.4s;" :style="{height: tableHeight+'px'}">

      <el-col :span="4" class="treeStyle">
        <!--<el-tree :data="treeData" :props="defaultProps" style="background-color: inherit;"></el-tree>-->
        <base-tree ref="tree" :data="treeData" :treeConfigs="treeConfigs"
                   @treedatabridge="treeDataBridge" @disable-state="disableState"></base-tree>
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




    <!--新增及修改表单界面-->
    <el-dialog v-el-drag-dialog   :title="textMap[dialogStatus]" :visible.sync="dialogAddVisible" width="700px"  top="10vh" style="height: 90vh" custom-class="listDeliverClass">
      <div v-loading="dialogLoading" style="height: 100%;overflow: auto">
        <div style="line-height:30px;padding-left: 30px;border-bottom:1px solid rgb(228,228,228);"><a>账号使用：</a><a style="color: #0099CC">{{currentUsers}}</a><a>/</a><a>{{allUsers}}</a><a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;购买更多帐号请联系相关服务人员</a></div>
        <!--<div style="position: absolute;top: 70px;left: 0;right: 0;height: 1px;background-color: rgb(228,228,228);z-index: 10;" >-->
          <!--<div style="position: relative;">-->
            <!--<el-tooltip effect="dark" placement="bottom" :hide-after="hideTime"></el-tooltip>-->
          <!--</div>-->
        <!--</div>-->
        <el-form  :rules="rules" ref="submitForm" :model="temp" label-position="right" label-width="120px"
                 style='width: 500px;margin: 20px auto;'>
          <!--所属部门-->
          <el-form-item :label="tempLable.deptName+ ':'" prop="deptName" v-show="tempShow.deptName">
            <el-input v-model="temp.deptName"  :disabled="tempNotEditable.deptName"></el-input>
          </el-form-item>
          <!--账号-->
          <el-form-item :label="tempLable.userCode+ ':'" prop="userCode" v-show="tempShow.userCode">
            <el-input v-model="temp.userCode"   placeholder="此项为空，则系统自动生成" :disabled="tempNotEditable.userCode"></el-input>
          </el-form-item>
          <!--密码-->
          <el-form-item :label="tempLable.password+ ':'" prop="password" v-show="tempShow.password">
            <el-input v-model="temp.password" type="password"  placeholder="此项为空，则默认为手机号后六位"></el-input>
          </el-form-item>
          <!--用户名称-->
          <el-form-item :label="tempLable.userName+ ':'" prop="userName" v-show="tempShow.userName">
            <el-input v-model="temp.userName" :disabled="tempNotEditable.userName"></el-input>
          </el-form-item>
          <!--手机号-->
          <el-form-item :label="tempLable.mobile+ ':'" prop="mobile" v-show="tempShow.mobile">
            <el-input v-model="temp.mobile" @change="checkMobile"></el-input>
          </el-form-item>
          <!--邮箱-->
          <el-form-item :label="tempLable.email+ ':'" prop="email" v-show="tempShow.email">
            <el-input v-model="temp.email"></el-input>
          </el-form-item>
          <!--角色-->
          <el-form-item :label="tempLable.roleName" prop="roleName" v-show="tempShow.roleName">
            <base-input-select style='width: 380px' :placeholder="tempLable.roleName" v-model="selectDataRole.defaultSelected"   :data="selectDataRole.data"  @callback="roleSelect" ></base-input-select>
          </el-form-item>
          <!--用户类型-->
          <el-form-item :label="tempLable.userTypeName" prop="userTypeName" v-show="tempShow.userTypeName">
            <base-input-select style='width: 380px' :placeholder="tempLable.userTypeName" v-model="selectDataUser.defaultSelected" :data="selectDataUser.data"  @callback="userSelect" ></base-input-select>
          </el-form-item>
          <!--员工--->
          <el-form-item :label="tempLable.employeeCode+ ':'" prop="employeeCode" v-show="tempShow.employeeCode">
            <base-input-option v-model="temp.employeeCode" :dialog="optionData.dialog" @callback="optionSelect"></base-input-option>
          </el-form-item>
          <!--备注-->
          <el-form-item :label="tempLable.remark+ ':'" prop="remark" v-show="tempShow.remark">
            <el-input v-model="temp.remark" ></el-input>
          </el-form-item>

        </el-form>

        <div slot="footer" class="dialog-footer" style="text-align: center;padding-bottom: 30px">
          <el-button type="primary" @click="createData">保存</el-button>
          <el-button @click="dialogAddVisible = false">关闭</el-button>
        </div>

      </div>


    </el-dialog>






    <!--新增及修改表单界面-->
    <el-dialog v-el-drag-dialog    :title="textMap[dialogStatus]" :visible.sync="dialogUpdateVisible" width="700px" top="10vh" style="height: 90vh" custom-class="listDeliverClass">
      <div v-loading="dialogLoading" style="height: 100%;overflow: auto">
        <div style="line-height:30px;padding-left: 30px;border-bottom:1px solid rgb(228,228,228);"><a>账号使用：</a><a style="color: #0099CC">{{currentUsers}}</a><a>/</a><a>{{allUsers}}</a><a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;购买更多帐号请联系，电话：400-111-1111；邮箱：xxxxxxxxxx@qq.com</a>></div>
        <!--<div style="position: absolute;top: 70px;left: 0;right: 0;height: 1px;background-color: rgb(228,228,228);z-index: 10;" >-->
          <!--<div style="position: relative;">-->
            <!--<el-tooltip effect="dark" placement="bottom" :hide-after="hideTime"></el-tooltip>-->
          <!--</div>-->
        <!--</div>-->

        <el-form  :rules="rules" ref="submitForm" :model="temp" label-position="right" label-width="120px"
                  style='width: 500px;margin: 20px auto;'>

          <!--所属部门-->
          <el-form-item :label="tempLable.deptName+ ':'" prop="deptName" v-show="tempShow.deptName">
            <el-input v-model="temp.deptName"  :disabled="tempNotEditable.deptName"></el-input>
          </el-form-item>
          <!--账号-->
          <el-form-item :label="tempLable.userCode+ ':'" prop="userCode" v-show="tempShow.userCode">
            <el-input v-model="temp.userCode"   placeholder="此项为空，则系统自动生成" :disabled="tempNotEditable.userCode"></el-input>
          </el-form-item>
          <!--用户名称-->
          <el-form-item :label="tempLable.userName+ ':'" prop="userName" v-show="tempShow.userName">
            <el-input v-model="temp.userName" :disabled="tempNotEditable.userName"></el-input>
          </el-form-item>
          <!--手机号-->
          <el-form-item :label="tempLable.mobile+ ':'" prop="mobile" v-show="tempShow.mobile">
            <el-input v-model="temp.mobile" @change="checkMobile"></el-input>
          </el-form-item>
          <!--邮箱-->
          <el-form-item :label="tempLable.email+ ':'" prop="email" v-show="tempShow.email">
            <el-input v-model="temp.email"></el-input>
          </el-form-item>
          <!--角色-->
          <el-form-item :label="tempLable.roleName" prop="roleName" v-show="tempShow.roleName">
            <base-input-select style='width: 380px' :placeholder="tempLable.roleName" v-model="selectDataRole.defaultSelected"   :data="selectDataRole.data"  @callback="roleSelect" ></base-input-select>
          </el-form-item>
          <!--用户类型-->
          <el-form-item :label="tempLable.userTypeName" prop="userTypeName" v-show="tempShow.userTypeName">
            <base-input-select style='width: 380px' :placeholder="tempLable.userTypeName" v-model="selectDataUser.defaultSelected"  :disabled="true"  :data="selectDataUser.data"  @callback="userSelect" ></base-input-select>
          </el-form-item>
          <!--员工--->
          <el-form-item :label="tempLable.employeeCode+ ':'" prop="employeeCode" v-show="tempShow.employeeCode">
            <base-input-option v-model="temp.employeeCode" :disabled="tempNotEditable.employeeCode" :dialog="optionData.dialog" @callback="optionSelect"></base-input-option>
          </el-form-item>
          <!--备注-->
          <el-form-item :label="tempLable.remark+ ':'" prop="remark" v-show="tempShow.remark">
            <el-input v-model="temp.remark" ></el-input>
          </el-form-item>

        </el-form>

        <div slot="footer" class="dialog-footer" style="text-align: center;padding-bottom: 30px">
          <el-button  type="primary" @click="updateData">保存</el-button>
          <el-button @click="dialogUpdateVisible = false">关闭</el-button>
        </div>

      </div>


    </el-dialog>






    <!--新增及修改表单界面-->
    <el-dialog v-el-drag-dialog  :title="textMap[dialogStatus]" :visible.sync="dialogPWVisible" width="700px" top="40px">

      <div v-loading="dialogLoading">
        <div style="line-height:30px;padding-left: 30px"><a>账号使用：</a><a style="color: #0099CC">{{currentUsers}}</a><a>/</a><a>{{allUsers}}</a><a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;购买更多帐号请联系，电话：400-111-1111；邮箱：xxxxxxxxxx@qq.com</a>></div>
        <div style="position: absolute;top: 70px;left: 0;right: 0;height: 1px;background-color: rgb(228,228,228);z-index: 10;" >
          <div style="position: relative;">
            <el-tooltip effect="dark" placement="bottom" :hide-after="hideTime"></el-tooltip>
          </div>
        </div>

        <el-form    :rules="rules" ref="submitForm" :model="temp" label-position="right" label-width="120px"
                  style='width: 500px;margin: 50px auto;'>
          <!--所属部门-->
          <el-form-item :label="tempLable.deptName+ ':'" prop="deptName" v-show="tempShow.deptName">
            <el-input v-model="temp.deptName"  :disabled="tempNotEditable.deptName"></el-input>
          </el-form-item>
          <!--用户名称-->
          <el-form-item :label="tempLable.userName+ ':'" prop="userName" v-show="tempShow.userName">
            <el-input v-model="temp.userName" :disabled="tempNotEditable.userName"></el-input>
          </el-form-item>
          <!--邮箱-->
          <el-form-item :label="tempLable.email+ ':'" prop="email" v-show="tempShow.email">
            <el-input v-model="temp.email"></el-input>
          </el-form-item>
          <!--账号-->
          <el-form-item :label="tempLable.userCode+ ':'" prop="userCode" v-show="tempShow.userCode">
            <el-input v-model="temp.userCode"   placeholder="此项为空，则系统自动生成" :disabled="tempNotEditable.userCode"></el-input>
          </el-form-item>
          <!--密码-->
          <el-form-item :label="tempLable.password+ ':'" prop="password" v-show="tempShow.password">
            <el-input v-model="temp.password" type="password"  placeholder="此项为空，则默认为手机号后六位"></el-input>
          </el-form-item>
          <!--密码-->
          <el-form-item :label="'新密码:'" prop="firstPassword" v-show="tempShow.firstPassword">
            <el-input v-model="temp.firstPassword" type="password" ></el-input>
          </el-form-item>
          <!--密码-->
          <el-form-item :label="'确认密码:'" prop="confirmPassword" v-show="tempShow.confirmPassword">
            <el-input v-model="temp.confirmPassword" type="password" ></el-input>
          </el-form-item>
        </el-form>

        <div slot="footer" class="dialog-footer" style="text-align: center;padding-bottom: 30px">
          <el-button  type="primary" @click="changePW">保存</el-button>
          <el-button @click="dialogPWVisible = false">关闭</el-button>
        </div>

      </div>


    </el-dialog>








    <!--员工信息查看界面-->
    <el-dialog  v-el-drag-dialog :title="textMap[dialogStatus]" :visible.sync="dialogEmployeeFormVisible" width="600px" top="40px">

      <div v-loading="dialogLoading" >
        <div style="margin:30px  50px 50px 135px"  >
          <img :src="temp.employeePhoto" style="float: left;max-width: 27%">
          <!--<div style="line-height:10px;padding-left: 30px;border: 1px solid salmon;">-->
          <!---->
          <!--</div>-->
          <div style="padding-left: 150px;">
            <p><a>工号:</a>{{temp.employeeCode}}</p>
            <p><a>姓名:</a>{{temp.employeeName}}</p>
            <p><a>性别:</a>{{temp.employeeSex}}</p>
            <p><a>部门:</a>{{temp.employeeDeptName}}</p>
            <p><a>岗位:</a>{{temp.employeePostName}}<a>（主岗）</a></p>
          </div>
          <div style="position: relative;right:78px;top:15px;clear: both"><a>员工信息</a></div>
        </div>


        <div style="position: absolute;top: 250px;left: 0;right: 0;height: 1px;background-color: rgb(228,228,228);z-index: 10;" >
          <div style="position: relative;">
            <el-tooltip effect="dark" placement="bottom" :hide-after="hideTime"></el-tooltip>
          </div>
        </div>

        <el-form :rules="rules" ref="submitForm" :model="temp" label-position="right" label-width="80px"
                 style='width: 500px;margin: 10px auto;'>
          <el-row>

            <!--手机号-->
            <el-col :span="12">
              <el-form-item :label="tempLable.employeeMobile+ ':'" prop="employeeMobile" >
                <el-input v-model="temp.employeeMobile"  :disabled="true"></el-input>
              </el-form-item>
            </el-col>
            <!--政治面貌-->
            <el-col :span="12">
              <el-form-item :label="tempLable.employeePoliticalName+ ':'" prop="employeePoliticalName" >
                <el-input v-model="temp.employeePoliticalName"  :disabled="true"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <!--邮箱-->
            <el-col :span="12">
              <el-form-item :label="tempLable.employeeEmail+ ':'" prop="employeeEmail">
                <el-input v-model="temp.employeeEmail" :disabled="true"></el-input>
              </el-form-item>
            </el-col>
            <!--身份证号-->
            <el-col :span="12">
              <el-form-item :label="tempLable.employeeIdentityNumber+ ':'" prop="employeeIdentityNumber">
                <el-input v-model="temp.employeeIdentityNumber" :disabled="true"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <!--出生日期-->
            <el-col :span="12">
              <el-form-item :label="tempLable.employeeBirthday+ ':'" prop="employeeBirthday">
                <el-input v-model="temp.employeeBirthday" :disabled="true"></el-input>
              </el-form-item>
            </el-col>
            <!--婚姻状况-->
            <el-col :span="12">
              <el-form-item :label="tempLable.employeeMarital+ ':'" prop="employeeMarital">
                <el-input v-model="temp.employeeMarital" :disabled="true"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <!--入职日期-->
            <el-col :span="12">
              <el-form-item :label="tempLable.employeeEntryDate+ ':'" prop="employeeEntryDate">
                <el-input v-model="temp.employeeEntryDate" :disabled="true"></el-input>
              </el-form-item>
            </el-col>
            <!--创建日期-->
            <el-col :span="12">
              <el-form-item :label="tempLable.employeeCdate+ ':'" prop="employeeCdate">
                <el-input v-model="temp.employeeCdate" :disabled="true"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <!--籍贯-->
            <el-col :span="12">
              <el-form-item :label="tempLable.employeeNativePlace+ ':'" prop="employeeNativePlace">
                <el-input v-model="temp.employeeNativePlace" :disabled="true"></el-input>
              </el-form-item>
            </el-col>
            <!--创建人-->
            <el-col :span="12">
              <el-form-item :label="tempLable.employeeCuserName+ ':'" prop="employeeCuserName">
                <el-input v-model="temp.employeeCuserName" :disabled="true"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

        </el-form>


        <div slot="footer" class="dialog-footer" style="text-align: center;padding-bottom: 30px">
          <el-button  type="primary" @click="unbindEmployee">解除绑定</el-button>
          <el-button @click="dialogEmployeeFormVisible = false">关闭</el-button>
        </div>

      </div>




    </el-dialog>


    <component v-if="optionData.showDialog" :is="optionData.dialog.dialogName" :initData="optionData.dialog.data" :visible="optionData.visible" @close-dialog="closeDialog"></component>
  </div>


</template>

<script>
  import i18n from '@/lang'

  import searchBar from '@/components/searchBar'
  import dialogTreeOption from '@/components/dialog/dialogTreeOption'
  // ajax后台方法
  import {
    listPageUsers, //分页列表查询查询
    addUser, //新增功能
    updateUser, //修改功能
    updateUserByPassword,
    updateDisableUser, //启用禁用功能
    resetPasswords,//批量重置密码
    exportExcelUsers,//Excel导出
    countUserNum,//查看用户使用情况
    updateEmployeeUserUnbind,//解除当前用户绑定员工
    updateEmployeeUserBind,//给当前用户绑定员工
    deleteUsers //批量删除功能
  } from '@/api/user'
  //按钮权限
  import {initMenuButtons} from '@/api/button'
  //树表查询
  import {listTreeDepartment} from '@/api/department'

  //下拉列表ajax数据请求
  // import {dataListDictionarys,dataListDictionarysNew} from '@/api/dictionary'
  import {dataListRoles} from '@/api/role'
  //	公共方法
  import {filerTableTitle,downLoad} from '@/utils/common'


  //	  table操作栏里面的按钮
  const operateBtns = {
    props: ['colConfig'],
    template: `<el-table-column :label="colConfig.label" :sortable="colConfig.sortable" align="center">
      					<div slot-scope="scope" class="btnBox">
      							<el-button  v-show="colConfig.editBtns_isShow" type="text" class="btns" style="font-size: 12px;" @click="colConfig.editBtns(scope.row,scope.$index)">编辑</el-button>
      							<el-button  v-show="colConfig.editPassword_isShow" type="text" class="btns" style="font-size: 12px;" @click="colConfig.editPassword(scope.row,scope.$index)">修改密码</el-button>
      							<el-button  v-show="colConfig.editPassword_isShow && scope.row.employeeId==''&& scope.row.userTypeName!='外部用户'&& scope.row.userTypeName!='企业管理员'&& scope.row.userTypeName!='超级管理员'"  type="text" class="btns" style="font-size: 12px;" @click="colConfig.bindEmployee(scope.row,scope.$index)">绑定员工</el-button>
      							<el-button  v-show="colConfig.viewEmployee_isShow && scope.row.employeeId!=''" type="text" class="btns" style="font-size: 12px;" @click="colConfig.viewEmployee(scope.row,scope.$index)">查看员工</el-button>
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
            label: '账号',
            type: 'input',
            ruleType: 'string',
            mapKey: 'userCode',
            configs: {},
            placeholder: '账号'
          },
        {
          label: '姓名',
          type: 'input',
          ruleType: 'string',
          mapKey: 'userName',
          configs: {},
          placeholder: '姓名'
        },
        {
          label: '手机号',
          type: 'input',
          ruleType: 'string',
          mapKey: 'mobile',
          configs: {},
          placeholder: '手机号'
        },
        {
          label: '用户类型',
          type: 'input',
          ruleType: 'string',
          mapKey: 'userTypeName',
          configs: {},
          placeholder: '用户类型'
        },
        {
          label: '角色名称',
          type: 'input',
          ruleType: 'string',
          mapKey: 'roleName',
          configs: {},
          placeholder: '角色名称'
        },
        {
            label: '是否启用',
            type: 'select',
            ruleType: 'string',
            mapKey: 'isdisableByQuery',
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





        dialogLoading: false,





        /*初始化数据*/
        userInfo: null,
        currentUsers: 0,
        allUsers: '~',

        //搜索栏数据
        hideTime: 700,
        dynaHeight: 40,
        clientHeight: 0,
        dynaHeightTimer: null,
        dynaHeightState: null,








        initConfigs: {
          //行级按钮初始化
          tableOperates: {
            prop: 'operate',
            label: '操作',
            enLabel: 'operation',
            isPropName: true,
            component: operateBtns, //自定义按钮组件
            editBtns: this.editBtns, //自定义按钮方法-编辑
            editPassword: this.editPassword, //自定义按钮方法-编辑
            bindEmployee: this.bindEmployee, //自定义按钮方法-绑定员工
            viewEmployee: this.viewEmployee, //自定义按钮方法-查看员工
            editBtns_isShow: true,
            editPassword_isShow: true,
            bindEmployee_isShow: true,
            viewEmployee_isShow: true,
          },
        },


        configs: {

          //查询及重置按钮
          queryBarBtnList: [{
            name: '查询',
            nameEn: 'query',
            isShow: true,
            icon: 'search',
            method: this.queryTable
          }, {
            name: '重置',
            nameEn: 'reset',
            isShow: true,
            icon: 'refresh',
            plain: true,
            method: this.resetQueryTemp
          }],


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
              name: '重置密码',
              nameEn: 'resetPW',
              isShow: true,
              icon: 'resetPW',
              plain: true,
              state: true,
              method: this.resetPasswordBatch//自定义按钮方法-删除
            },{
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
                  exportUrl: '/fileUpload/excelTemplet/UserExcelImport.xlsx',
                  importUrl: '/system/user/importExcelUser'
                },
                dialogName:'dialogImportExcel',
              }
            },
          ],
          tableConfigs: [],
          showCheckBox: false,//是否显示行级单选框
          showIndex: false    //是否显示行号
        },

        //table数据集
        tableData: [],

        //行数据选择列表
        selectList: null,

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


        // 表单标题及状态值
        dialogAddVisible: false,
        dialogUpdateVisible: false,
        dialogPWVisible: false,
        dialogEmployeeFormVisible: false,
        dialogStatus: '',
        textMap: {
          update: '编辑菜单',
          create: '新增菜单',
          changePW: '修改密码',
          viewEmployee: '查看员工',
          bindEmployee: '绑定员工'
        },


        // form表单字段值map集合
        temp: {
          firstPassword:'',
          confirmPassword:''
        },
        // form查询字段值map集合
        tempQuery: {

        },
        // form表单标签名称map集合
        tempLable: {

        },
        // form表单不可编辑字段map集合
        tempNotEditable: {

        },
        // form表单不可编辑字段map集合
        tempShow: {

        },
        // form表单字段校验信息
        rules: {
          userName: [{
            required: true,
            message: '请填写姓名',
            trigger: 'change'
          }],
          mobile: [
            { required: true, message: '请填写手机号', trigger: 'blur' },
            {
              type: 'number',
              trigger: ['blur', 'change'],
              validator: (rule, value, callback) => {
                if (value && (!(/^[1][34578]\d{9}$/).test(value) || !(/^[1-9]\d*$/).test(value) || value.length !== 11)) {
                  callback(new Error('手机号码不符合规范'))
                } else {
                  callback()
                }
              }
            }],
          email: [{
            type: 'email',
            message: '请输入正确的邮箱地址',
            trigger:['blur', 'change']
          }],
          roleName: [{
            required: true,
            trigger: 'change',
            validator: (rule, value, callback) => {
              if ( this.selectDataRole.defaultSelected.length <= 0) {
                // console.log("***********"+this.selectDataRole.defaultSelected)
                callback(new Error('请选择角色'));
              } else {
                callback();
              }
            }
          }],
          userTypeName: [{
            required: true,
            trigger: 'change',
            validator: (rule, value, callback) => {
              if ( this.selectDataUser.defaultSelected.length <= 0) {
                // console.log("***********"+this.selectDataRole.defaultSelected)
                callback(new Error('请选择用户类型'));
              } else {
                callback();
              }
            }
          }],
          firstPassword: [{
            required: true,
            message: '新密码不能为空',
            trigger: 'change'
          }],
          confirmPassword: [{
            required: true,
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (value === '') {
                callback(new Error('请再次输入密码'));
              } else if (value !== this.temp.firstPassword) {
                callback(new Error('两次输入密码不一致!'));
              } else {
                callback();
              }
            }
          }]
        },

        //分页参数集合及当前默认页面
        pageData: null,
        pageNo: 1,




        selectDataUser: {
          data: {//传入的基本配置和数据
            selectUrl: '/system/dictionary/getDictionarys',
            selectParm: {dictionaryKey:'userType',isglobal:'1'},//全局
          },
          defaultSelected: [],
        },

        selectDataRole: {
          data: {//传入的基本配置和数据
            selectUrl: '/system/role/getRoles',
            selectParm: {queryStr:''},//全局
          },
          defaultSelected: [],
        },

        //表单弹窗组件
        optionData:{
          showDialog: false,
          visible: false,
          dialog: {
            data: {//传入的基本配置和数据
              isSingle :true,//table是否单选
              title: '选择员工',
              treeUrl: '/system/post/treeDeptPosts',
              treeParm: {},
              tableUrl: '/system/employee/listPageEmployees',
              tableParm: {queryStr:" employee.user_id is null "},
              temp: {},
            },
            dialogName:'dialogTreeOption',//打开的弹窗组件名称，注意大小写
          }
        },

      }
    },

    //子组件
    components: {
      dialogTreeOption,
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
      if(that.userInfo.companyId!='b6ff76cb95f711e884ad00163e105f05'){
        that.selectDataUser.data.selectParm.queryStr = " and name not in ('企业管理员','超级管理员') "
      }
      // console.log(that.userInfo,"***********")



      //按钮初始化
      that.initButtons()
      //加载左树右表
      that.initTree()
      that.dynaHeightState = that.$storage.get('dynaHeightState') || '1'
      if(!(that.dynaHeightState -0)){
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
        this.pageNo = 1
        this.initTable(this.selectTree.id,this.selectTree.layer,null)
      },
      sendGuid(id) {
        this.guid = id
      },



      // //搜索栏切换
      // resetDynaHeight() {
      //   const that = this
      //   if(that.dynaHeight && that.dynaHeightState-0){
      //     that.dynaHeight = 0
      //     that.$storage.remove('dynaHeightState')
      //     that.$storage.set('dynaHeightState','0')
      //     clearTimeout(that.dynaHeightTimer)
      //     that.dynaHeightTimer = setTimeout(function () {
      //       that.dynaHeightState = false
      //     },500)
      //   }else if(!that.dynaHeight && !(that.dynaHeightState-0)){
      //     that.dynaHeight = 40
      //     that.$storage.remove('dynaHeightState')
      //     that.$storage.set('dynaHeightState','1')
      //     clearTimeout(that.dynaHeightTimer)
      //     that.dynaHeightTimer = setTimeout(function () {
      //       that.dynaHeightState = true
      //     },500)
      //   }
      // },


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

      initTree(isdisable) {
        const that = this

        let queryStr = " isdisable = 1 "
        if(isdisable){
          queryStr = ""
        }
        //页面初始化列表及分页参数
        //*******************************************************用户自定义修改 start ***************************************************************************
        listTreeDepartment({
          //*******************************************************用户自定义修改 end ***************************************************************************
          //参数
          queryStr:queryStr,
          deptID: that.userInfo.companyId
        }).then(res => {

          const newTree = []
          const root = res.result.treeList
          that.selectTree = {
            pid: root.pid,
            id: root.id,
            layer: root.layer,
            name: root.name
          }

          that.selectDataRole.data = {
            selectUrl: '/system/role/getRoles',
            selectParm: {queryStr:"(company_id = (select case when id_1 is null or id_1 = '' then id_0 else id_1 end from vmes_department where  id = '"+that.selectTree.id+"')    )"},//全局
          }


          newTree.push(root)
          that.treeData = newTree
          that.initTable(that.selectTree.id,that.selectTree.layer,true)
          that.$nextTick(function () {
            that.$refs.tree && that.$refs.tree.$children[0] && that.$refs.tree.$children[0].setCurrentKey && that.$refs.tree.$children[0].setCurrentKey(that.selectTree.id)
          })
          // that.$loading().close()
        }).catch(err => {
          console.log(err)
          that.$loading().close()
        })

      },

      // treeToTable(data) {
      //   const that = this
      //   console.log(data)
      //   if (!that.menuViewList.length) {
      //     that.tableData = data
      //     that.menuViewList.push(that.tableData)
      //   } else {
      //     const itemId = that.treeCurrentState[that.tableViewLayer]
      //     that.childrenDatas = null
      //     that.searchChildren(data, itemId)
      //     that.tableData = that.childrenDatas
      //     that.menuViewList.splice(-1, 1, that.tableData)
      //
      //   }
      //
      // },


      // searchChildren(data, id) {
      //   const that = this
      //   data.forEach((item) => {
      //     if (item.id === id) {
      //       that.childrenDatas = item.children
      //     } else {
      //       if (item.children && item.children.length) {
      //         that.searchChildren(item, id)
      //       }
      //     }
      //
      //   })
      //
      // },

      treeDataBridge(data) {
        console.log(data)
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

    //通过搜索栏查询，加载table列表
    queryTable(){
      const that = this
      that.pageNo=1
      that.initTable(that.selectTree.id,that.selectTree.layer)
    },




      //加载table列表
      initTable(pid, layer, isClosedLoading){
        const that = this

        //页面初始化列表及分页参数
        listPageUsers({
          ...that.tempQuery,
          layer: layer,
          pid: pid,
          pageNo: that.pageNo
        }).then(res => {
          that.getListPage(res)
          if(isClosedLoading){
            that.$loading().close()
          }
        }).catch(err => {
          console.log(err)
          that.$loading().close()
        })

        //部门类型下拉列表初始化
        // that.handleUserTypeFocus()
        //角色下拉列表初始化
        // that.handleRoleFocus()

      },



      //加载table列头及列表数据
      getListPage(res) {
        const that = this
        if (res) {
          // console.log(res.result.titles)
          // res.result.titles = JSON.parse(res.result.titles)
          // res.result.varList = JSON.parse(res.result.varList)
          // res.result.pageData = JSON.parse(res.result.pageData)
          //分页参数
          that.pageData = res.result.pageData

          //列表标签可编辑属性、国际化初始化
          that.initTempData(res.result.titles)

          const data = filerTableTitle(res.result)
          const titleList = that.addTableTitle(data)
          // console.log(titleList)
          that.configs.tableConfigs = titleList
          that.configs.showCheckBox = true
          that.configs.showIndex = true
          that.tableData = res.result.varList

          that.configs.topBarBtnList.forEach(item => {
            if(item.nameEn=='delete'||item.nameEn=='resetPW'){
              item.state = true  //删除按钮的状态变更||重置密码按钮的状态变更
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
            that.tempLable[k]=label
            //from表单常规字段不可编辑状态设置   注意尽量使表单字段key要与列表查询的key保持一致
            that.tempNotEditable[k]=false
            //from表单常规字段显示状态设置   注意尽量使表单字段key要与列表查询的key保持一致
            that.tempShow[k]=true

          }
        })
      },

      //自定义状态列
      addTableTitle(list) {
        const that = this
        // console.log("*****11*"+JSON.stringify(i18n.messages.zh.selfDefine))
        list.forEach(item => {
          // console.log("******"+JSON.stringify(item))
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
          if (labelName.indexOf('是否启用')>=0) {
            item.component = stateBtns
            item.changeState = that.changeState
          }
        })
        that.internationalConfig()
        list.push(that.initConfigs.tableOperates)
        // console.log("******"+JSON.stringify(list))
        return list
      },

      //国际化设置
      internationalConfig(){
        const that = this
        if(i18n.locale == "en"){
          //列表操作列国际化处理
          that.initConfigs.tableOperates.label="OPERATE"
          // that.initConfigs.tableOperates.isPropName = true
          //弹出窗标题国际化处理
          that.textMap.create="ADDNEW"
          that.textMap.update="EDIT"
          //form表单特殊字段国际化处理
          // that.tempLable[key]=英文名
        }else if(i18n.locale == "zh"){
          //列表操作列国际化处理
          that.initConfigs.tableOperates.label="操作"
          // that.initConfigs.tableOperates.isPropName = true
          //弹出窗标题国际化处理
          that.textMap.create="新增"
          that.textMap.update="编辑"
          //form表单特殊字段国际化处理
          // that.tempLable[key]=中文名
        }
      },



      //自定义状态列回调函数
      changeState(item, index) {
        const that = this
        updateDisableUser(item.id, item.isdisable )
          .then(res => {
            //console.log(res)
            // that.$loading().close()
          }).catch(err => {
          //console.log(err)
          if ("0" == item.isdisable) {
            item.isdisable = "1";
          }
          // that.$loading().close()
        })
      },

      //通过单选框触发事件 获取table组件传回的数据
      dataBridge(data) {
        // console.log("*********"+data)
        const that = this
        that.selectList = data
        if (data.length) {
          that.configs.topBarBtnList.forEach(item => {
            if(item.nameEn=='delete'||item.nameEn=='resetPW'){
              item.state = false  //删除按钮的状态变更||重置密码按钮的状态变更
            }
          })
        } else {
          that.configs.topBarBtnList.forEach(item => {
            if(item.nameEn=='delete'||item.nameEn=='resetPW'){
              item.state = true  //删除按钮的状态变更||重置密码按钮的状态变更
            }
          })
        }
      },

      //手机号数值型 数据有效性
      isMobileNumberByValue(value) {
        if (value == null || value.trim().length == 0) {
          return false;
        }

        //1开头(11)位数字-正则表达式
        let reg = new RegExp("^1[\\d]{10}");
        return reg.test(value.trim())
      },

      checkMobileValue(value, column) {
        let msgStr = '';

        if (value != null && value.trim().length > 0 && value.trim().length != 11) {
          msgStr = column + '(' + value + ')输入错误，请输入11位正确的手机号！';
        } else if (value != null && value.trim().length == 11 && !this.isMobileNumberByValue(value.trim())) {
          msgStr = column + '(' + value + ')输入错误，请输入11位正确的手机号！';
        }

        return msgStr;
      },

      checkMobile(value) {
        let msgStr = this.checkMobileValue(value, '手机号');
        if (msgStr != null && msgStr.trim().length > 0) {
          this.$message({
            type: 'warning',
            duration: 5 * 1000,
            showClose: true,
            message: msgStr,
          });
          return;
        }
      },


      //查询用户使用个数及总数
      viewUserNum() {
        const that = this
        countUserNum(that.temp.deptId)
          .then(res => {
            // console.log(res)
            if (res.code === 0) {
              that.currentUsers=res.result.currentUsers
              that.allUsers=res.result.allUsers
            }
          }).catch(err => {
          // console.log(err)
          // that.$loading().close()

        })
      },




      viewEmployee(item, index) {
        // console.log("*********"+JSON.stringify(item))
        const that = this
        that.resetTemp()
        //将item对象转成json字符串，然后又将字符串转成新生成的json对象，最后将这个json对象直接传递给temp。如果直接将item对象传递给temp，那后面对temp进行数据修改同时也会对item对象进行修改。为了防止这种情况，我们采用了json转换对象的间接传递。
        that.temp = JSON.parse(JSON.stringify(item))

        that.temp.employeePhoto =  process.env.BASE_API + that.temp.employeePhoto


        //设置当前弹窗界面为编辑界面
        that.dialogStatus = 'viewEmployee'
        that.dialogEmployeeFormVisible = true
        that.$nextTick(() => {
          that.$refs['submitForm'].clearValidate()
        })
      },


      unbindEmployee(){
        const that = this
        // that.$loading({
        //   spinner: 'none',
        //   text: '云上企业'
        // })
        updateEmployeeUserUnbind(that.temp)
          .then(res => {
            // that.$loading().close()
            //console.log(res)
            if (res.code === 0) {
              that.dialogEmployeeFormVisible = false
              that.$notify({
                title: '成功',
                message: '操作成功',
                type: 'success',
                duration: 2000
              })
              that.refreshTable()
            }
          }).catch(err => {
          //console.log(err)
          // that.$loading().close()

        })
      },


      bindEmployee(item){
        const that = this
        that.resetTemp()
        //将item对象转成json字符串，然后又将字符串转成新生成的json对象，最后将这个json对象直接传递给temp。如果直接将item对象传递给temp，那后面对temp进行数据修改同时也会对item对象进行修改。为了防止这种情况，我们采用了json转换对象的间接传递。
        that.temp = JSON.parse(JSON.stringify(item))

        that.optionData.dialog.data.temp = JSON.parse(JSON.stringify(item))
        that.optionData.showDialog = true
        that.optionData.visible = true
      },

      closeDialog(data,temp,isCancel) {
        const that = this
        // console.log("@@@@@@@@@@"+JSON.stringify(data))
        // console.log("@@@@@@@@@@"+JSON.stringify(temp))
        that.optionData.showDialog = false
        that.optionData.visible = false
        if(isCancel){
          return;
        }
        that.temp.employeeId = data[0].employeeId
        updateEmployeeUserBind(that.temp)
          .then(res => {
            if (res.code === 0) {
              that.$notify({
                title: '成功',
                message: '操作成功',
                type: 'success',
                duration: 2000
              })
              that.refreshTable()
            }
          }).catch(err => {
          console.log(err)
        })
      },


      editPassword(item, index) {
        // console.log("*********"+JSON.stringify(item))
        const that = this
        that.resetTemp()
        //将item对象转成json字符串，然后又将字符串转成新生成的json对象，最后将这个json对象直接传递给temp。如果直接将item对象传递给temp，那后面对temp进行数据修改同时也会对item对象进行修改。为了防止这种情况，我们采用了json转换对象的间接传递。
        that.temp = JSON.parse(JSON.stringify(item))
        that.temp.password = null

        //设置不可编辑字段
        that.tempNotEditable.userCode = true
        that.tempNotEditable.deptName = true
        that.tempNotEditable.userName = true

        //设置字段必填校验
        that.rules.confirmPassword = [{
          required: true,
          trigger: 'blur',
          validator: (rule, value, callback) => {
            if (value === '') {
              callback(new Error('请再次输入密码'));
            } else if (value !== this.temp.firstPassword) {
              callback(new Error('两次输入密码不一致!'));
            } else {
              callback();
            }
          }
        }]
        that.rules.firstPassword = [{
          required: true,
          message: '新密码不能为空',
          trigger: 'change'
        }]

        //设置隐藏字段
        that.tempShow['firstPassword'] = true
        that.tempShow['confirmPassword'] = true
        that.tempShow.password = false
        that.tempShow.roleName = false
        that.tempShow.userTypeName = false
        that.tempShow.employeeCode = false
        that.tempShow.mobile = false
        that.tempShow.email = false
        that.tempShow.remark = false

        //初始化下拉列表
        // that.isReadUserTypeFirst = true
        // that.handleUserTypeFocus()

        // that.isReadRoleFirst = true
        // that.handleRoleFocus()


        //初始化用户使用个数
        that.viewUserNum()

        //设置当前弹窗界面为编辑界面
        that.dialogStatus = 'changePW'
        that.dialogPWVisible = true
        that.$nextTick(() => {
          that.$refs['submitForm'].clearValidate()
        })
      },

      //编辑保存
      changePW() {
        const that = this
        that.$refs['submitForm'].validate((valid) => {
          if (valid) {
            that.dialogLoading = true

            // that.$loading({
            //   spinner: 'none',
            //   text: '云上企业'
            // })
            updateUserByPassword(that.temp).then(res => {
              that.dialogLoading = false
              // that.$loading().close()
              // console.log(res)
              if (res.code === 0) {
                that.dialogPWVisible = false
                that.$notify({
                  title: '成功',
                  message: '修改成功',
                  type: 'success',
                  duration: 2000
                })
                that.refreshTable()
              }
            }).catch(err => {
              //console.log(err)
              that.dialogLoading = false
              // that.$loading().close()

            })

          }
        })
      },



      //行级按钮-编辑
      editBtns(item, index) {
        // console.log("*********"+JSON.stringify(item))
        const that = this
        that.resetTemp()
        //将item对象转成json字符串，然后又将字符串转成新生成的json对象，最后将这个json对象直接传递给temp。如果直接将item对象传递给temp，那后面对temp进行数据修改同时也会对item对象进行修改。为了防止这种情况，我们采用了json转换对象的间接传递。
        that.temp = JSON.parse(JSON.stringify(item))


        //设置不可编辑字段
        that.tempNotEditable.deptName = true
        that.tempNotEditable.userName = false
        that.tempNotEditable.userCode = true

        //取消字段必填校验
        that.rules.confirmPassword = []
        that.rules.firstPassword = []
        // that.rules.roleName = [{
        //   required: true,
        //   trigger: 'blur',
        //   validator: (rule, value, callback) => {
        //     if (value === '') {
        //       callback(new Error('请选择角色'));
        //     }else {
        //       callback();
        //     }
        //   }
        // }]


        that.tempShow = JSON.parse(JSON.stringify(that.tempShow))
        //设置隐藏字段
        that.tempShow['firstPassword'] = false
        that.tempShow['confirmPassword'] = false
        that.tempShow.password = false
        if(that.temp.userTypeName=='企业管理员'||that.temp.userTypeName=='超级管理员'){
          that.tempShow.roleName = false
          that.tempShow.userTypeName = false
          that.tempShow.employeeCode = false
        }else{
          that.tempShow.roleName = true
          that.tempShow.userTypeName = true
          that.tempShow.employeeCode = true
        }

        if(that.temp.userTypeName == '外部用户'){
          that.tempNotEditable.employeeCode = false
          that.tempShow.employeeCode = false
        }else {
          that.tempNotEditable.employeeCode = true
          that.tempShow.employeeCode = true
          that.tempNotEditable.userName = true
        }

        that.tempShow.mobile = true
        that.tempShow.email = true
        that.tempShow.remark = true

        //初始化下拉列表
        // that.isReadUserTypeFirst = true
        // that.handleUserTypeFocus()

        // that.isReadRoleFirst = true
        // that.handleRoleFocus()


        //初始化下拉列表
        // that.isReadUserTypeFirst = true
        // that.handleUserTypeFocus()
        // that.selectedUserTypeOptions[0] = that.temp['userType']
        // that.temp['userType'] =  that.userTypeData[0].value


        if(that.temp.deptId != 'b6ff76cb95f711e884ad00163e105f05'){
          let queryUserType = ''
          if(that.temp.userType){
            queryUserType = " or  id = '"+that.temp.userType+"' ";
          }
          that.selectDataUser.data = {
              selectUrl: '/system/dictionary/getDictionarys',
              selectParm: {dictionaryKey:'userType',isglobal:'1',queryStr:"and ( name not in ('企业管理员','超级管理员') "+queryUserType+"  )"},//全局
          }
        }
        // console.log("****************"+that.temp['userType'])
        if(that.temp['userType']){
          that.selectDataUser.defaultSelected = [that.temp['userType']]
        }else {
          that.selectDataUser.defaultSelected = []
        }



        if(that.temp.deptId){
          let queryRoleId = ''
          if(that.temp.roleId){
            queryRoleId = " or  id = '"+that.temp.roleId+"' ";
          }

          that.selectDataRole.data = {
            selectUrl: '/system/role/getRoles',
            selectParm: {queryStr:"(company_id = (select case when id_1 is null or id_1 = '' then id_0 else id_1 end from vmes_department where  id = '"+this.temp.deptId+"')  "+queryRoleId+"   )"},//全局
          }
        }
        if(that.temp['roleId']){
          that.selectDataRole.defaultSelected = [that.temp['roleId']]
        }else {
          that.selectDataRole.defaultSelected = []
        }


        // that.isReadRoleFirst = true
        // that.handleRoleFocus()
        // that.selectedRoleOptions[0] = that.temp['roleId']
        // that.temp['roleId'] = that.roleData[0].value


        //设置当前弹窗界面为编辑界面
        that.dialogStatus = 'update'
        that.dialogUpdateVisible = true

        //初始化用户使用个数
        that.viewUserNum()

        that.$nextTick(() => {
          that.$refs['submitForm'].clearValidate()
        })
      },
      //编辑保存
      updateData() {
        const that = this

        that.$refs['submitForm'].validate((valid) => {
          if (valid) {
            let mobile = this.temp.mobile;
            let msgStr = this.checkMobileValue(mobile, '手机号');
            if (msgStr != null && msgStr.trim().length > 0) {
              this.$message({
                type: 'warning',
                duration: 5 * 1000,
                showClose: true,
                message: msgStr,
              });
              return;
            }
            //console.log("提交保存");

            that.dialogLoading = true
            updateUser(that.temp)
              .then(res => {
                // that.$loading().close()
                that.dialogLoading = false
                // console.log(res)
                if (res.code === 0) {
                  that.dialogUpdateVisible = false
                  that.$notify({
                    title: '成功',
                    message: '修改成功',
                    type: 'success',
                    duration: 2000
                  })
                  that.refreshTable()
                }
              }).catch(err => {
              console.log(err)
              that.dialogLoading = false
              // that.$loading().close()

            })

          }
        })
      },




      //表级按钮-新增
      addNew() {

        const that = this

        that.resetTemp()

        //所属部门ID
        that.temp.deptId = this.selectTree.id;
        //所属部门
        that.temp.deptName = this.selectTree.name;

        //设置不可编辑字段
        that.tempNotEditable.deptName = true
        that.tempNotEditable.userName = false
        that.tempNotEditable.userCode = false

        //取消字段必填校验
        that.rules.confirmPassword = []
        that.rules.firstPassword = []
        // that.rules.roleName = [{
        //   required: true,
        //   trigger: 'blur',
        //   validator: (rule, value, callback) => {
        //     if (value === '') {
        //       callback(new Error('请选择角色'));
        //     }else {
        //       callback();
        //     }
        //   }
        // }]


        that.tempShow = JSON.parse(JSON.stringify(that.tempShow))
        //设置隐藏字段
        // that.tempShow['firstPassword'] = true
        // that.tempShow['confirmPassword'] = true
        that.tempShow.password = true
        that.tempShow.roleName = true
        that.tempShow.userTypeName = true
        that.tempShow.employeeCode = true
        that.tempShow.mobile = true
        that.tempShow.email = true
        that.tempShow.remark = true


        //设置当前弹窗界面为新增界面
        that.dialogStatus = 'create'
        that.dialogAddVisible = true

        //初始化下拉列表
        // that.isReadUserTypeFirst = true
        // that.handleUserTypeFocus()
        // that.selectedUserTypeOptions[0] = that.userTypeData[0].value
        // that.temp['userType'] =  that.userTypeData[0].value
        if(that.selectTree.id != 'b6ff76cb95f711e884ad00163e105f05'){
          that.selectDataUser.data = {
            selectUrl: '/system/dictionary/getDictionarys',
            selectParm: {dictionaryKey:'userType',isglobal:'1',queryStr:"and ( name not in ('企业管理员','超级管理员')   )"},//全局
          }
        }
        that.selectDataUser.defaultSelected = ['69726efa45044117ac94a33ab2938ce4']
        that.temp['userType'] = '69726efa45044117ac94a33ab2938ce4'



        if(that.selectTree.id){
          that.selectDataRole.data = {
            selectUrl: '/system/role/getRoles',
            selectParm: {queryStr:"(company_id = (select case when id_1 is null or id_1 = '' then id_0 else id_1 end from vmes_department where  id = '"+this.selectTree.id+"')    )"},//全局
          }
        }
        that.selectDataRole.defaultSelected = []
        that.temp['roleId'] = null

        // that.isReadRoleFirst = true
        // that.handleRoleFocus()
        // that.temp['roleId'] = this.selectedRoleOptions[0]

        //初始化用户使用个数
        that.viewUserNum()

        that.$nextTick(() => {
          that.$refs['submitForm'].clearValidate()
        })
      },

      //form表单内容重置
      resetTemp() {
        const that = this
        for(let key in that.temp) {
          if(that.temp.hasOwnProperty(key)){
            that.temp[key]= ''
          }
        }
      },
      //查询条件重置
      resetQueryTemp() {
        const that = this
        for(let key in that.tempQuery) {
          // console.log(key)
          that.tempQuery[key]= ''
        }
        that.selectDataRole.defaultSelected = []
        that.selectDataUser.defaultSelected = []
      },


      //新增保存
      createData() {
        const that = this
        this.$refs['submitForm'].validate((valid) => {
          if (valid) {
            // that.$loading({
            //   spinner: 'none',
            //   text: '云上企业'
            // })

            let mobile = this.temp.mobile;
            let msgStr = this.checkMobileValue(mobile, '手机号');
            if (msgStr != null && msgStr.trim().length > 0) {
              this.$message({
                type: 'warning',
                duration: 5 * 1000,
                showClose: true,
                message: msgStr,
              });
              return;
            }
            //console.log("提交保存");

            //Service (deptId) 该参数名称已经使用 -- 更改为(userDeptId)
            that.temp.userDeptId = that.temp.deptId;
            that.dialogLoading = true
            addUser(that.temp)
              .then(res => {
                that.dialogLoading = false
                // that.$loading().close()
                //console.log(res)
                if (res.code === 0) {
                  that.dialogAddVisible = false
                  that.$notify({
                    title: '成功',
                    message: '创建成功',
                    type: 'success',
                    duration: 2000
                  })
                  that.refreshTable()
                }
              }).catch(err => {
              console.log(err)
              that.dialogLoading = false
              // that.$loading().close()

            })


          }
        })
      },

      //重置密码
      resetPasswordBatch(){
        const that = this

        that.$confirm('此操作将批量重置以下勾选用户密码，重置后的密码为用户手机号后六位！是否继续?', '提示', {
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
          resetPasswords(ids)
            .then(res => {
              // that.$loading().close()
              // console.log(res)
              if (res.code === 0) {
                that.$notify({
                  title: '成功',
                  message: '操作成功',
                  type: 'success',
                  duration: 2000
                })
                that.refreshTable()
              }
            }).catch(err => {
            // console.log(err)
            // that.$loading().close()
          })


        }).catch(() => {
          that.$message({
            type: 'info',
            message: '已取消操作'
          });
        });

      },

      //表级按钮-删除
      deleteBatch(){
        const that = this
        let userId = this.$storage.get('userInfo').userId;

        //遍历(this.selectList)
        let isExistUser = false;
        let index = -1;
        if (this.selectList != null && this.selectList.length > 0) {
          for (let i = 0; i < this.selectList.length; i++) {
            let rowData = this.selectList[i];
            if (userId == rowData.id) {
              isExistUser = true;
              index = (i+1);
              break;
            }
          }
        }

        if(isExistUser) {
          this.$message({
            type: 'warning',
            duration: 5 * 1000,
            showClose: true,
            message: "第 " + index +" 行： 是您自己的账号不允许删除！",
          });
          return;
        }


        that.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {

          let ids = ''
          that.selectList.forEach(item => {
            if(item.userTypeName=='企业管理员'){
              ids = ''
              this.$message({
                type: 'warning',
                duration: 5 * 1000,
                showClose: true,
                message: "企业管理员不能删除！",
              });
              return;
            }else{
              ids += item.id + ','
            }
          })

          if(ids){
            window.setTimeout(
              deleteUsers(ids)
                .then(res => {
                  // that.$loading().close()
                  // console.log(res)
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
                // console.log(err)
                // that.$loading().close()
              })
              , 1000 * 2);
          }


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
        // that.$loading({
        //   spinner: 'none',
        //   text: '云上企业'
        // })
        that.$axios.all([
          listPageUsers({  ...that.tempQuery,pid: that.selectTree.id,layer: that.selectTree.layer, pageNo: that.pageNo })
        ]).then(that.$axios.spread((res1,res2) => {
          // console.log(res1)
          // that.$loading().close()
          that.getListPage(res1)

          const root = res2.result.treeList
          const newTree = []
          newTree.push(root)
          that.treeData = newTree
          that.$nextTick(function () {
            that.$refs.tree.$children[0].setCurrentKey(that.selectTree.id)
          })

          that.selectDataRole.defaultSelected = [that.tempQuery.roleId]
          that.selectDataUser.defaultSelected = [that.tempQuery.userType]

        })).catch((error) => {
          console.log(error)
          // that.$loading().close()
        })

      },


      optionSelect(data,temp,state) {
        // console.log("*************",data)
        if(!state){
          const that = this
          that.temp = JSON.parse(JSON.stringify(that.temp))
          that.temp['employeeId'] = data[0].employeeId
          that.temp['employeeCode'] = data[0].code
          that.temp['userName'] = data[0].name
          that.temp['mobile'] = data[0].mobile
          that.temp['email'] = data[0].email
          that.temp['deptId'] = data[0].deptId
          that.temp['deptName'] = data[0].deptName
          that.tempNotEditable.userName = true
        }
      },

      userSelect(data,option){
         // console.log("******"+data)
        const that = this
        that.temp = JSON.parse(JSON.stringify(that.temp))
        if(data[0]){
          that.temp['userType'] = data[0]
          that.selectDataUser.defaultSelected = [data[0]]
        }else {
          that.temp['userType'] = []
          that.selectDataUser.defaultSelected = []
        }
        // that.temp['userTypeName'] = option.label
        //普通用户
        if(data[0] == '69726efa45044117ac94a33ab2938ce4'){
          that.tempShow.employeeCode = true
          // console.log("111"+that.tempShow.employeeCode)
        }else {
          that.tempShow.employeeCode = false
          // console.log("222"+that.tempShow.employeeCode)
        }

      },


      roleSelect(data,option){
        // console.log("******"+JSON.stringify(option))
        const that = this
        that.temp = JSON.parse(JSON.stringify(that.temp))
        if(data[0]){
          that.selectDataRole.defaultSelected = [data[0]]
          that.temp['roleId'] = data[0]
        }else {
          that.selectDataRole.defaultSelected = []
          that.temp['roleId'] = []
        }

      },


      disableState(isdisable){
        // console.log(isdisable)
        this.initTree(isdisable)
        // const that = this
        // circleTree(that.treeData,isdisable,that.filterTextDept,that.treeNodes)
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

        exportExcelUsers(ids)
          .then(res => {
            // console.log(res)
            if (!res) {
              return
            }
            downLoad(res,"用户导出.xls")
            // that.$message({
            //   title: '成功',
            //   message: '导出成功',
            //   type: 'success',
            //   duration: 2000
            // })
          }).catch(err => {
            //console.log(err)
          })
      },

      //Excel文件导入
      importExcelCallBack() {
        this.refreshTable();
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
    },

    //观察者,可监听数据，属性和方法
    watch: {
      pageNo: function () {
        // console.log(this.pageNo)
        const that = this
        that.initTable(that.selectTree.id,that.selectTree.layer)
      },
      temp:{
        handler(curVal,oldVal){
          // console.log(curVal,oldVal)
          this.temp.confirmPassword && (this.temp.password = this.temp.confirmPassword)
        },
        deep:true
      },
      tempShow:{
        handler(curVal,oldVal){
          // console.log(curVal,oldVal)
          // this.temp.password = this.temp.confirmPassword
        },
        deep:true
      },
    }
  }
</script>



<!----------------------------userManage 用户自定义修改  注意要与最上边定义的样式名称保持一致-------------------------------->
<style  lang="scss" rel="text/css">
  .userManage {
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
