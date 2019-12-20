<template>
  <el-dialog v-el-drag-dialog  :title="title" :visible.sync="isVisible" @close="dialogClose" append-to-body width="900px">
    <!--弹窗控件开始-->
    <component v-if="showDialog" :is="dialogName" :initData="dialogData" :visible="visibleState" @close-dialog="closeDialog"></component>
    <!--弹窗控件结束-->
    <div style="" v-loading="dialogTopLoading">




        <div style="height: 50px;box-sizing: border-box;padding: 7px 20px 7px 7px;">
          <el-upload
            name="fileName"
            class="avatar-uploader"
            :action="uploadUrl"
            :data="fileData"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <base-button v-show="attachmentBtn.isShow" :name='attachmentBtn.name' :icon='attachmentBtn.icon' :plain="attachmentBtn.plain" :state="attachmentBtn.state"
                         @myclick="attachmentBtn.method"></base-button>
          </el-upload>
        </div>


        <div style="padding: 7px;">
          <!--列表界面table表头及数据动态加载-->
          <el-row class="tableContent">
            <multilevel-table
              ref="customBaseTable"
              :tableConfigList="tableConfigList"
              @callmethod="callMethod"
              @databridge="databridge"></multilevel-table>
          </el-row>
        </div>


        <div slot="footer" class="dialog-footer" style="text-align: center;padding-bottom: 10px">
          <el-button @click="isVisible = false">关闭</el-button>
        </div>



    </div>

  </el-dialog>


</template>

<script>
  import multilevelTable from "@/components/customTable/multilevelTable"
  //	公共方法
  import {filerTableTitle} from '@/utils/common'
  import {deleteAttachment} from '@/api/attachments'

  export default {

    name: "dialog-option",
    props: ['initData','visible'],

    //数据
    data() {
      return {

        dialogTopLoading: false,
        isVisible: false,
        title: '',


        /*初始化数据*/
        userInfo: null,


        // //表级按钮初始化
        // topBarBtnList: [
        //   {
        //     name: '添加附件',
        //     nameEn: 'addAttachment',
        //     isShow: true,
        //     icon: 'add',
        //     method: this.addAttachment //自定义按钮方法-新增
        //   }
        // ],

        attachmentBtn:{
          name: '添加附件',
          nameEn: 'addAttachment',
          isShow: true,
          icon: 'add',
          method: this.addAttachment //自定义按钮方法-新增
        },

        //table配置项开始
        tableConfigList: [
          {
            //自定义列
            customColumn: [//自定义列
              {
                columnIndex: 'name',//列的prop
                'min-width': 160,
                _cellConfig: {
                  hideTitle: true,
                  bodyStyle: {
                    color: '#199ED4',
                    'font-weight': 600,
                    width: '100%',
                  },
                  events: {
                    type: 'file',//事件类型，简单点说就是要做什么。navigation:导航；link:超链接,新打开页面；file:文件路径，可下载，图片可预览
                    path: 'url',//行数据存有地址的key
                  },
                }
              },
              {
                columnIndex: 'relativeUrl',//列的prop
                'min-width': 250,
                _cellConfig: {
                  hideTitle: true
                }
              },
              {
                columnIndex: 'cdate',//列的prop
                'min-width': 120,
                _cellConfig: {
                  hideTitle: true
                }
              },
              {
                columnIndex: 'last',
                prop: 'operate',
                label: '操作',
                componentName: 'button',
                //方式一：
                component: [
                  {
                    name: '删除',
                    nameEn: 'delete',
                    editBtns_isShow: true,
                    icon: 'delete',
                    method: this.delete //自定义按钮方法-新增
                  }
                ],
              }
            ],

            //数据接口
            apiObj: {//组件使用的API
              apiName: 'listPageAttachments',
              params: {fieldCode:"name,relativeUrl,cdate",businessId:this.initData.temp.id}
            },

            //外部数据
            temp: {},

            //显示序号
            showIndex: true,

            //表头开关
            showHeader: true,

            //显示选择器
            showCheckBox: false,

            //显示列控制器
            showTableSet: false,
            //显示全部列，在列控制器开启后可用
            showAll: false,

            //组件内部名称，需要全项目唯一
            componentId: 'oneLevelTable',

            //开启下级
            expand: false,
            expandMode: 'none',//展开模式，'all'全部展开(默认)，'one'同级只能展开一个，默认第一条，'none'不自动展开；其中'all'模式下默认没有展开按钮，可设置showExpandBtn强制显示展开按钮
            showExpandBtn: true,//强制显示展开按钮

            //表头样式
            headerStyle: {
              'background-color': '#E4F3FA'
            },
            //行样式
            rowStyle: {
              'background-color': '#E4F3FA'
            },

          }
        ],


        //行数据选择列表
        selectList: [],
        fileData: {fileDir: "attachment/",businessId: this.initData.temp.id,companyId: this.initData.temp.companyId},
        uploadUrl: process.env.BASE_API + '/fileIO/attachment/uploadAttachment',
        imageUrl: '',

        //弹窗功能
        openDialogName: '',
        showDialog: false,
        visibleState: false,
        dialogData: {
          //width: '600px',
          title: '',
          temp:null,
          tempLable:null,
        },

      }
    },

    //子组件
    components: {multilevelTable},

    /*生命周期函数开始*/
    //vue实例化之前
    beforeCreate() {

    },

    //vue实例化后调用
    created() {
      const that = this
      that.title = that.initData.title
      that.userInfo = that.$storage.get('userInfo')

    },

    //挂载之前
    beforeMount() {

    },
    //真实DOM挂载后，仅限组件本身的挂载，如果存在子组件，并且需求子组件全部被挂载后进行操作，需使用vm.$nextTick顶替mounted（在mounted内部调用vm.$nextTick）；
    mounted() {
      this.isVisible = this.visible
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

      dialogClose() {
        this.$emit('close-dialog',{resState:'ok'})
      },





      //table数据操作API
      getData() {
        this.$refs.customBaseTable.getData()
      },
      pushData(data,target) {
        this.$refs.customBaseTable.pushData(data,target)
      },
      updateData(params) {
        this.selectList = []
        this.$refs.customBaseTable.updateData(params)
      },
      deleteData(target) {
        this.$refs.customBaseTable.deleteData(target)
      },
      //让组件调用本页面的方法
      callMethod(obj){
        obj && obj.methodName && this[obj.methodName](obj.params)
      },


      //文件上传方法:
      handleAvatarSuccess(res) {
        if (res.code == 0) {
          // let fileUrl = res.fileUrl;
          this.$message({
            message: '文件上传成功！',
            type: 'success',
            duration: 5 * 1000
          });
          this.updateData();
        } else if (res.code != 0 && res.msg != null && res.msg.trim().length > 0) {
          this.$message.error(res.msg.trim());
        }
      },

      beforeAvatarUpload(file) {
        // let fileType = file.type;
        // fileType = fileType.replace("image/", "");
        // if ("jpg,jpeg,png".indexOf(fileType) == -1) {
        //   this.$message({
        //     message: '上传员工照片只能是(jpg,jpeg,png)格式文件!',
        //     type: 'error',
        //     duration: 5 * 1000
        //   });
        //   return;
        // }

        //最大上传文件大小(M)
        const maxFileSize = 5 * 1024 * 1024;
        if (file.size > maxFileSize) {
          this.$message({
            message: '上传附件大小不能超过 5MB!',
            type: 'error',
            duration: 5 * 1000
          });
          return;
        }
      },



      addAttachment(item, index){

      },


      //行级按钮-编辑
      delete(item, index) {
        const that = this

        that.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteAttachment(item)
            .then(res => {
              if (res.code === 0) {
                that.$notify({
                  title: '成功',
                  message: '删除成功',
                  type: 'success',
                  duration: 2000
                })
                that.updateData()
              }
            }).catch(err => {
            console.log(err)
          })

        }).catch(() => {
          that.$message({
            type: 'info',
            message: '已取消删除'
          });
        });


      },



      //弹窗功能
      closeDialog(data) {
        // console.log(data)
        this.showDialog = false
        if(data.resState === 'ok'){
          this.updateData()
        }
      },


      //通过单选框触发事件 获取table组件传回的数据
      databridge(data) {
        // console.log("*********"+data)
        const that = this
        that.selectList = data
      },


    },

    //计算属性
    computed: {
      dialogName() {
        return this.openDialogName
      }
    },

    //观察者,可监听数据，属性和方法
    watch: {

    }
  }


</script>

<style>
  .tableContent {
    height: calc(100% - 60px);
    overflow-y: auto;
    box-sizing: border-box;
    padding: 10px;
  }
</style>
