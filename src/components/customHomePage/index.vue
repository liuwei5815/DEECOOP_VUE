<template>
	<div class="customHomePage">
		<div class="saveView">
			<button :disabled="!menuListState" type="button" class="el-button el-button--primary" :class="!menuListState?'is-disabled':''" @click="saveMenu">
				<svg-icon icon-class="save"></svg-icon>
              	<span>保存</span>
			</button>
		</div>
		<div class="menuBoxView">
			<h3>常用功能（最多显示6个模块）</h3>
			<div class="menuBox">
				<div class="menulist" key="0">
					<drop class="drop menu" v-for="(item, ind) in menuList" @drop="settingDrop(menuList, ...arguments, $event)" :data-index="ind">
						<div v-if="!item.id" style="text-align: center;height: 100%;line-height: 45px;border: 1px dashed #E4E4E4;">功能模块</div>
						<drag v-else class="drag" @dragstart="dragstartE(menuList, ...arguments, $event)" :key="item.id" :data-id="item.id" :data-name="item.name" :data-icon="item.url" :data-path="item.url" :data-index="ind" :class="{ [item]: true }" :transfer-data="{ item: item, list: menuList, example: 'menuList' }">
							<drop @drop="changeDrop(menuList, ...arguments, $event)" @dragleave="dragleaveE(menuList, ...arguments, $event)" @dragenter="dragenterE(menuList, ...arguments, $event)" style="height: 100%;line-height: 45px;overflow: hidden;">{{ item.name }}</drop>
						</drag>
					</drop>
				</div>
			</div>
		</div>
    <div style="height: 50px;line-height:50px;text-align: center;">请拖动下方功能模块至常用功能区</div>
		<div class="menuSelectView">
			<div class="menulist" key="1">
				<drop class="drop tempMenuList" @drop="handleDrop(tempList, ...arguments, $event)">
					<drag v-for="item in tempList" class="drag" :key="item.id" :class="{ [item]: true }" :transfer-data="{ item: item, list: tempList, example: 'tempList' }">
						{{ item.name }}
					</drag>
				</drop>
			</div>
		</div>
	</div>
</template>

<script>
	import { Drag, Drop } from 'vue-drag-drop'

	import { saveusermenu, getusermenu, listRoleMeunAll } from '@/api/mainPage'

	export default {
		//数据
		data() {
			return {
				//				tempList: ['1','2','3','4'],
				//				menuList: ['5','6','7'],
				// tempList: [{
				// 	icon: 'check',
				// 	path: 'check',
				// 	name: '质量检测',
				// 	id: '1'
				// }, {
				// 	icon: 'date',
				// 	path: 'date',
				// 	name: '生产',
				// 	id: '2'
				// }, {
				// 	icon: 'table',
				// 	path: 'table',
				// 	name: '销售',
				// 	id: '3'
				// }, {
				// 	icon: 'chart',
				// 	path: 'chart',
				// 	name: '报表',
				// 	id: '4'
				// }, {
				// 	icon: 'storage',
				// 	path: 'storage',
				// 	name: '仓储',
				// 	id: '5'
				// }, {
				// 	icon: 'shopping',
				// 	path: 'shopping',
				// 	name: '采购',
				// 	id: '6'
				// }, {
				// 	icon: 'home',
				// 	path: 'home',
				// 	name: '首页',
				// 	id: '7'
				// }],
        tempList: [],
				menuList: [{}, {}, {}, {}, {}, {}],
				menuIndex: null,
        userInfo: null

			}
		},

		//子组件
		components: {
			Drag,
			Drop
		},

		/*生命周期函数开始*/
		//vue实例化之前
		beforeCreate() {

		},

		//vue实例化后调用
		created() {
			const that = this
      that.userInfo = that.$storage.get('userInfo')
      that.$axios.all([getusermenu(that.userInfo.userId),listRoleMeunAll({
        userType: that.userInfo.userType,
        roleIds: that.userInfo.roleIds
      })]).then(that.$axios.spread((res1, res2) => {
        const tempArr = []
        if(res1.result.varList.length){
          res1.result.varList.forEach(item => {
            that.menuList.splice(item.serialNumber,1,item)
          })
        }
        that.$store.commit('SET_USERMENU',that.menuList)
        that.filterMenuList(res2.result).forEach(item => {
          const state = res1.result.varList.some(citem => {
            return citem.id === item.id
          })
          if(!state){
            tempArr.push(item)
          }
        })
        that.tempList = tempArr
        that.$loading().close()

      })).catch((error) => {
        console.log(error)
      })




//			that.$store.dispatch('CreateSecurityCode', {}).then(() => {
//				that.drawPic(that.$store.state.user.securityCode)
//				that.tempCode = that.$store.state.user.securityCode
//				that.$loading({}).close()
//			}).catch(() => {
//
//			})

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
		  //网络请求
      httpGetuserMenu(){
        const that = this
        getusermenu().then(res => {
          console.log(res)
          res.result.varList.forEach((item,index) => {
            that.menuList.splice(index,1,item)
          })
          that.$loading().close()
        }).catch(err => {
          console.log(err)
        })
      },

      httpListRoleMeunAll(data) {
        const that = this
        listRoleMeunAll(data).then(res => {
          console.log(res)
          that.$loading().close()
        }).catch(err => {
          console.log(err)
        })
      },

			handleDrop(toList, data, event) {
				console.log(toList)
				console.log(data)
				console.log(event)
				const fromList = data.list;
				if(data.example === 'menuList') {
					if(fromList) {
						toList.push(data.item);
						fromList.splice(this.menuIndex, 1, {});
						//						toList.sort((a, b) => a > b);
					}
				}

			},
			settingDrop(toList, data, event) {
				console.log(toList)
				console.log(data)
				console.log(event)
				const fromList = data.list;
				if(data.example === 'menuList') {
					console.log(this.menuIndex)
					const toIndex = event.target.parentElement.dataset.index || ''
					if(this.menuIndex + '' && toIndex) {
						const el = toList[toIndex]
						toList.splice(toIndex, 1, data.item)
						toList.splice(this.menuIndex, 1, el)
					}
				} else if(data.example === 'tempList') {
					const dataset = event.target.parentElement.dataset
					const index = dataset.index || ''
					if(index && !dataset.id) {
						toList.splice(index, 1, data.item)
						fromList.splice(fromList.indexOf(data.item), 1);
					}
				}

				//				if (data.example === 'tempList' && this.menuList.length === 6) {
				//					this.$message.error('常用功能不能多余6项');
				//					return
				//				}
				//				if (fromList) {
				//					toList.push(data.item);
				//					fromList.splice(fromList.indexOf(data.item), 1);
				//					toList.sort((a, b) => a > b);
				//				}
			},
			changeDrop(toList, data, event) {
				if(data.example === 'tempList') {
					console.log('-----------changeDrop_star--------------')
					console.log(event)
					console.log(data)
					console.log(toList)
					console.log('-----------changeDrop_end--------------')
					const fromList = data.list
					if(fromList) {
						const dataset = event.target.parentElement.dataset
						const tempItem = {
							icon: dataset.icon,
							path: dataset.path,
							name: dataset.name,
							id: dataset.id
						}
						console.log(tempItem)
						this.changeList(tempItem.id, toList, fromList, data)
						//						toList.splice(toList.indexOf(tempItem), 1)
						//						toList.push(data.item)
						//						fromList.splice(fromList.indexOf(data.item), 1)

					}
				} else {
					return
				}
			},
			dragenterE(toList, data, event) {
				const ele = event.target
				ele.style.backgroundColor = '#1664D5'
				if(data.example === 'tempList') {
					console.log('-----------dragenterE_star--------------')
					console.log(event)
					console.log(data)
					console.log(toList)
					console.log('-----------dragenterE_end--------------')

				} else {
					return
				}
			},
			dragleaveE(toList, data, event) {
				const ele = event.target
				ele.style.backgroundColor = '#169BD5'
				if(data.example === 'tempList') {
					console.log('-----------dragleaveE_star--------------')
					console.log(event)
					console.log(data)
					console.log(toList)
					console.log('-----------dragleaveE_end--------------')

				} else {
					return
				}
			},
			dragstartE(toList, data, event) {
				if(data.example === 'menuList') {
					console.log('-----------dragstartE_star--------------')
					console.log(event)
					console.log(data)
					console.log(toList)
					console.log('-----------dragstartE_end--------------')
					const index = event.target.parentElement.dataset.index || ''
					if(index) {
						this.menuIndex = index - 0
					}
				} else {
					return
				}
			},
			changeList(id, toList, fromList, data) {
				const tempItem = toList.filter(item => {
					if(item.id === id) {
						return item
					}
				})
				console.log(tempItem[0])
				toList.splice(toList.indexOf(tempItem[0]), 1, data.item)
				fromList.splice(fromList.indexOf(data.item), 1, tempItem[0])

			},
			saveMenu() {
				const that = this
        const tempArr = []
        that.menuList.forEach((item,index) => {
          let state = false
          for(let k in item){
            state = true
          }
          if(state){
            item.serialNumber = index
            item.userId = that.userInfo.userId
            tempArr.push(item)
          }

        })
				saveusermenu(tempArr).then(res => {
				  console.log(res)
          that.$loading().close()
          that.$store.commit('SET_USERMENU',that.menuList)
          that.$router.push({path: '/home/index'})
				}).catch(error => {
          console.log(error)
				})
			},
      filterMenuList(list){
        const that = this
        const tempArr = []
        if(Array.isArray(list)){
          list.forEach(item => {
            const state = tempArr.some(tpItem => {
              return item.id === tpItem.id
            })
            if(!state && item.url){
              tempArr.push(item)
            }
          })
          return tempArr
        }
      }

		},

		//计算属性
		computed: {
			menuListState() {
				const state = this.menuList.some(item => {
					return item.id ? true : false
				})

				return state
			}
		},

		//观察者,可监听数据，属性和方法
		watch: {

		}
	}
</script>

<style lang="scss" rel="text/css">
	.customHomePage {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		box-sizing: border-box;
		padding: 10px;
		>.saveView {
			box-sizing: border-box;
			height: 60px;
			padding: 10px;
			border-bottom: 1px solid #E4E4E4;
			text-align: right;
			>button {
				position: relative;
				padding-left: 30px;
				>svg {
					position: absolute;
					top: 8px;
					left: 8px;
					width: 22px;
					height: 22px;
				}
			}
		}
		>.menuBoxView {
			box-sizing: border-box;
			height: 140px;
			padding: 10px 0;
			>h3 {
				box-sizing: border-box;
				margin: 0;
				padding: 5px 0 5px 10px;
				background-color: #F2F2F2;
				border: 1px solid #E4E4E4;
				border-bottom: none;
			}
			>.menuBox {
				box-sizing: border-box;
				padding: 5px 20px;
				border: 1px solid #E4E4E4;
				border-top: none;
				height: calc(100% - 32px);
				overflow: auto;
			}
		}
		>.menuSelectView {
			box-sizing: border-box;
			border: 1px solid #E4E4E4;
			height: calc(100% - 250px);
			background-color: #F9FAFC;
			/*padding: 10px 0;*/
		}
		.menulist {
			height: 100%;
      overflow-y: auto;
			text-align: center;
			>.drop {
				display: inline-block;
				width: calc(16.666% - 15px);
				max-width: 150px;
				margin: 16px 5px;
				height: 45px;
				box-sizing: border-box;
				text-align: center;
        vertical-align: middle;
				>.drag {
					display: inline-block;
					width: 100%;
					height: 100%;
					box-sizing: border-box;
					font-size: 20px;
					background-color: #169BD5;
					border: none;
					text-align: center;
					color: #FFFFFF;
					margin: 10px;
				}
				>.drag:hover {
					opacity: 0.5;
					cursor: move;
				}
			}
			>.tempMenuList {
				display: block;
				width: 100%;
				max-width: 100%;
				padding: 0;
				height: 100%;
        box-sizing: border-box;
        margin: 0 !important;
				>.drag {
					display: inline-block;
					width: 16.666%;
					height: 45px;
					box-sizing: border-box;
					background-color: #FFFFFF;
					border: 1px solid #C9C9C9;
					text-align: center;
					color: #000;
					line-height: 45px;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
				}
			}
			>.menu>.drag {
				margin: 0;
			}
		}
	}
</style>
