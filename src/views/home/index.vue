<template>
	<div class="homePage">
		<div class="menuView" v-if="usermenu.length">
			<div class="menuBox" v-for="(item,index) in usermenu" @mouseenter="showLink(index)" @mouseleave="hideLink(index)">
        <div class="menuShow" v-if="item.url">
          <div class="menuTitle">
            {{item.title?item.title:item.name}}
          </div>
          <div class="menuIcon" @click="goPage(item.url,item.id,item.layer)">
            <svg-icon :icon-class="setIconUrl[index]"></svg-icon>
          </div>
          <div class="menuLink" :class="linkSate[index]?'linkShow':'linkHide'" @click.stop="goSetting(item.url,item.id)">
            +自定义首页
          </div>
        </div>
        <div class="menuHide" v-else>
          <h3 style="text-align: center;">添加功能模块</h3>
          <div class="addMenu" :style="{color:iconColor[index]}" @click="openMenuView">
            <svg-icon icon-class="menu_add"></svg-icon>
          </div>
        </div>
			</div>
      <!--<el-button type="primary" @click="showVisible">buttonCont</el-button>-->
    </div>
    <!--<el-dialog v-el-drag-dialog title="11" :visible.sync="isVisible" width="500px">-->
      <!--&lt;!&ndash;放大镜输入框：{绑定的值，跟原来一样}{配置：type_接口参数，visible_默认值}  {打开的放大镜窗口类型}  {传回的数据，用于给temp赋值}&ndash;&gt;-->
      <!--&lt;!&ndash;放大镜窗口类型：&ndash;&gt;-->
      <!--&lt;!&ndash;数据字典: 'dictionary'&#45;&#45;参数()&ndash;&gt;-->
      <!--&lt;!&ndash;岗位设置: 'dialogPost'&ndash;&gt;-->
      <!--&lt;!&ndash;<base-input v-model="temp.userInput" :data="{type:'userType',visible:false}" propName="dialogPost" @user-select="selectedData"></base-input>&ndash;&gt;-->
      <!--<base-input v-model="temp.userInput" :dialogConfig="dialogConfig1" @user-select="selectedData"></base-input>-->
      <!--<base-input v-model="temp.userPost" :dialogConfig="dialogConfig2" @user-select="selectedPostData"></base-input>-->
      <!--<base-input v-model="temp.userAllPost" :dialogConfig="dialogConfig3" @user-select="selectAllData"></base-input>-->
      <!--&lt;!&ndash;<base-input-dictionary v-model="temp.userInput" :data="{type:'userType'}" @user-select="selectedData"></base-input-dictionary>&ndash;&gt;-->
      <!--&lt;!&ndash;<base-input-post v-model="temp.userPost" :data="{isSingle :true,key: 'deptId'}" @user-select="selectedPostData"></base-input-post>&ndash;&gt;-->
      <!--&lt;!&ndash;<base-input-post v-model="temp.userAllPost" :data="{isSingle:false,key: 'companyId'}" @user-select="selectAllData"></base-input-post>&ndash;&gt;-->
      <!--<base-button v-for="item in btnList" :name='item.name' :icon='item.icon' :plain="item.plain" :state="item.state"-->
                   <!--:dialog="item.dialog" @myclick="item.method"></base-button>-->
      <!--&lt;!&ndash;<base-input-staff v-model="temp.userData" :data="{isSingle:true,key: 'companyId'}" @user-select="selectUserData"></base-input-staff>&ndash;&gt;-->
      <!--<base-input v-model="temp.userData" :dialogConfig="dialogConfig" @user-select="selectUserData"></base-input>-->
    <!--</el-dialog>-->
	</div>
</template>

<script>
	import customHomePage from '@/components/customHomePage'
	import { mapGetters, mapMutations } from 'vuex'
  import { getusermenu } from '@/api/mainPage'
  import { filerIds } from '@/utils/common'



	export default {
		//数据
		data() {
			return {
        dialogConfig: {
          name: 'dialogBindStaff',
          data: {
            isSingle: true,
            key: 'deptId',
            dictionaryType: '',
          },
        },
        dialogConfig1: {
          name: 'dictionary',
          data: {
            isSingle: false,
            key: 'deptId',
            dictionaryType: 'userType',
          },
        },
        dialogConfig2: {
          name: 'dialogPost',
          data: {
            isSingle: true,
            key: 'deptId',
            dictionaryType: '',
          },
        },
        dialogConfig3: {
          name: 'dialogPost',
          data: {
            isSingle: false,
            key: 'companyId',
            dictionaryType: '',
          },
        },

//				nodeKey: 1,
				nodeShow: false,
				linkSate: [false,false,false,false,false,false],
        iconColor: ['#669966','#2ED18C','#DDAC62','#DC5F34','#0099CC','#7676BA'],
        isVisible: false,
        temp: {
          userInput: '',
          userPost: '',
          userAllPost: '',
          userData: ''
        },
        btnList: [{
          name: 'add',
          icon: 'add',
          method: function () {
            console.log(1)
          }
        }, {
            name: 'delete',
            icon: 'delete',
            plain: true,
            state: true,
            method: function () {
              console.log(2)
            }
          }, {
            name: 'employee_ChangePost',
            icon: 'edit',
            plain: true,
            state: false,
            method: this.dialogCallBack,
            dialog: {
              enable: true,//启用按钮弹窗功能
              data: {//传入的基本配置和数据
                isSingle :true,//table是否单选
                key: 'deptId',//取值的key
                employeeList: []//数据
              },
              dialogName:'dialogBindStaff',//打开的弹窗组件名称，注意大小写
            }
          },
        ],
        timeStamp: '',
        layer: 999,
        urlStrList: [],
        rootMenu: []


			}
		},

		//子组件
		components: {
      customHomePage
		},

		/*生命周期函数开始*/
		//vue实例化之前
		beforeCreate() {

		},

		//vue实例化后调用
		created() {
			const that = this
      if(!that.userInfo){
        const userInfo = that.$storage.get('userInfo')
        that.SET_USERINFO(userInfo)
      }
      that.rootMenu = that.$storage.get('rootMenu')
      that.$store.commit('SET_USERMENU',[{},{},{},{},{},{}])
      that.httpGetuserMenu()
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
      ...mapMutations(['SET_USERINFO']),
		  //test
      showVisible(){
        this.isVisible = true
      },
      selectedData(data) {
        if(data.nodeData){
          this.temp.userInput = data.nodeData.name
        }else {
          this.temp.userInput = ''
        }
      },
      selectedPostData(data) {
        if(data.length && data[0].name && data[0].type === 'post'){
          this.temp.userPost = data[0].name
        }
      },
      selectAllData(data) {
        const ids = filerIds(data,'name')
        if(ids){
          this.temp.userAllPost = ids
        }
      },
      selectUserData(data) {
        const ids = filerIds(data,'userName')
        if(ids){
          this.temp.userData = ids
        }
      },

      //弹窗按钮返回值
      dialogCallBack(data) {
        if(this.timeStamp !== data){
          //调方法更新table

          this.timeStamp = data
          console.log(1)
        }

        console.log(this.timeStamp)
      },


      //网络请求
      httpGetuserMenu(){
        const that = this
        getusermenu(that.userInfo.userId).then(res => {
          res.result.varList.forEach((item,index) => {
            that.usermenu.splice(item.serialNumber-0,1,item)
          })
          that.$store.commit('SET_USERMENU',that.usermenu)
          that.$loading().close()
        }).catch(err => {
          console.log(err)
        })
      },


			openMenuView() {
				const that = this
				// that.nodeShow = true
        this.$router.push({path: '/system/mainPage'})

//				const h = that.$createElement;
//      		that.$msgbox({
//        				message: h(customHomePage, {key: that.nodeKey++})
//      			})
			},
			showLink(index) {
				this.linkSate.splice(index,1,true)
			},
			hideLink(index) {
				this.linkSate.splice(index,1,false)
			},
			goSetting(url, id) {
				this.$router.push({path: '/system/mainPage'})
			},
      goPage(url,id,layer) {
        const that = this
        that.layer = 999
        that.urlStrList = []
        that.getUrlStr(that.rootMenu,url,id)
        if((layer-0) === 1){
          that.urlStrList.push('index')
        }
        const tempUrl = that.urlStrList.join('/')
        if(tempUrl){
          that.$router.push({path: `/${tempUrl}`})
        }else {
          that.$message({
            message: '严重错误，请重新登录',
            type: 'error',
            duration: 2000
          })
        }
      },
      getUrlStr(list,url,id) {
        const that = this
        list.forEach((item,index) => {
          if(item.layer<that.layer && item.children.length){
            that.getUrlStr(item.children,url,id)
          }
          if(item.id === id){
            that.layer = item.layer
            that.urlStrList[item.layer-1] = item.url
            if(item.layer !== 1 && item.layer !== 0){
              that.getUrlStr(that.rootMenu,url,item.pid)
            }
          }
        })
      },
      getIconUrlStr(list) {
        return list.map(item => {
          this.layer = 999
          this.urlStrList = []
          this.getUrlStr(this.rootMenu,item.url,item.id)
          return this.urlStrList.join('_')
        })
      }
		},

		//计算属性
		computed: {
			...mapGetters([
			  'usermenu',
        'userInfo'
      ]),
      setIconUrl(){
        return this.getIconUrlStr(this.usermenu)
      }
		},

		//观察者,可监听数据，属性和方法
		watch: {
      temp: function () {
      },
		}
	}
</script>

<style lang="scss" rel="text/css">
	.homePage {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: #FAFBFC;
		.menuHide {
			.addMenu {
				margin: 0 auto;
				width: 130px;
				height: 110px;
				background-color: #FFFFFF;
				border: 1px dashed #E4E4E4;
				.svg-icon {
					width: 70px;
					height: 70px;
					margin-left: 30px;
					margin-top: 15px;
				}
			}
			.addMenu:hover {
				background-color: #DBDBEA;
				cursor: pointer;
			}
		}

    /*.menuHide:nth-child(1) .svg-icon {*/
      /*color: #669966;*/
    /*}*/
    /*.menuHide:nth-child(2) .svg-icon {*/
      /*color: #2ED18C;*/
    /*}*/
    /*.menuHide:nth-child(3) .svg-icon {*/
      /*color: #DDAC62;*/
    /*}*/
    /*.menuHide:nth-child(4) .svg-icon {*/
      /*color: #DC5F34;*/
    /*}*/
    /*.menuHide:nth-child(5) .svg-icon {*/
      /*color: #0099CC;*/
    /*}*/
    /*.menuHide:nth-child(6) .svg-icon {*/
      /*color: #7676BA;*/
    /*}*/

		.menuView {
			display: flex;
			margin: 0 auto;
			padding-bottom: 10%;
			width: 800px;
			height: 100%;
			box-sizing: border-box;
			flex-wrap: wrap;
			justify-content: center;
			align-content: center;
			.menuBox {
				width: 250px;
				height: 200px;
				margin: 5px;
				color: #FFFFFF;
				box-sizing: border-box;
				overflow: hidden;
				position: relative;
        >.menuShow {
          >.menuTitle {
            margin: 35px 0 0 0;
            text-align: center;
            font-size: 16px;

          }
          >.menuIcon {
            height: 110px;
            text-align: center;
            >svg {
              width: 110px;
              height: 110px;
            }
          }
          >.menuLink {
            position: absolute;
            bottom: -32px;
            left: 0;
            width: 100%;
            height: 32px;
            text-align: center;
            line-height: 32px;
            background-color: #333333;
            opacity: 0.7;
            transition: bottom 500ms;
          }
          >.linkShow {
            bottom: 0;
          }
          >.linkHide {
            bottom: -32px;
          }
          .menuLink:hover {
            cursor: pointer;
          }
        }

			}
			.menuShow:hover {
				cursor: pointer;
			}
			.menuBox:nth-child(1) {
				background-color: #669966;
			}
			.menuBox:nth-child(2) {
				background-color: #2ED18C;
			}
			.menuBox:nth-child(3) {
				background-color: #DDAC62;
			}
			.menuBox:nth-child(4) {
				background-color: #DC5F34;
			}
			.menuBox:nth-child(5) {
				background-color: #0099CC;
			}
			.menuBox:nth-child(6) {
				background-color: #7676BA;
			}

		}
	}
  h3 {
    font-weight: 100;
    font-size: 16px;
  }
</style>
