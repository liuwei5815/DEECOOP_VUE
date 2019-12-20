<template>
	<div class="rootTree myCustomTree">
		<el-input ref="searchInputs" v-if="showSearch" @keyup.down.native="selectTreeNode($event)" placeholder="请输入关键字" v-model="filterText" clearable>
      <i slot="suffix" class="el-input__icon el-icon-search"></i>
    </el-input>
    <div v-if="showDisable" style="padding:5px 0px 10px 20px">
      <el-checkbox v-model="disableState">显示封存</el-checkbox>
    </div>
    <div :style="{top: treeBoxHeight + 'px'}" style="position: absolute;left: 0;right: 0;bottom: 0;overflow: auto">
      <el-tree ref="tree"
               :data="data"
               :indent="treeIndent"
               node-key="id"
               highlight-current
               :expand-on-click-node="!data"
               :show-checkbox="treeConfigs.showCheckBox"
               :default-expanded-keys="expandedKeys"
               :default-expand-all="expandedKeys.length?false:(treeConfigs.expandAll?treeConfigs.expandAll:false)"
               :props="treeConfigs.defaultProps?treeConfigs.defaultProps:defaultProps"
               :default-checked-keys="checkedList"
               @node-click="handleNodeClick"
               @node-contextmenu="handleNodeContextmenu"
               @check-change="checkChange" @check="nodeChecked"
               @current-change="currentChange"
               :filter-node-method="filterNode"
               @keyup.down.native="changeTreeNode($event)"
               @keyup.up.native="changeUpTreeNode($event)"
               @keyup.enter.native="currentTreeNode($event)">
      <span class="custom-tree-node" slot-scope="{ node, data }" :data-id="data.id">
        <svg-icon v-if="treeConfigs.showIcons" :icon-class="data.url" style="margin-right: 5px"></svg-icon>
        <span v-if="data.name">{{ data.name }}</span>
        <span v-else>{{ node.label }}</span>
      </span>
      </el-tree>
    </div>
	</div>
</template>

<script>
	export default {
    name: 'base-tree',
		props: ['data', 'treeConfigs','checkedList','keyClose','expandedKeyList'],
		//数据
		data() {
			return {
				filterText: '',
				defaultProps: {
					children: 'children',
					label: 'url'
				},
        treeIndent: 16,
        disableState: false,
        resultNodeList: [],
        focusNodeIndex: -1,
        resultElList: [],
        targetEle: null,
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
		},

		//挂载之前
		beforeMount() {

		},
		//真实DOM挂载后，仅限组件本身的挂载，如果存在子组件，并且需求子组件全部被挂载后进行操作，需使用vm.$nextTick顶替mounted（在mounted内部调用vm.$nextTick）；
		mounted() {


		},

		//数据更新前调用
		beforeUpdate() {
      // console.log(this.checkedList.indexOf("d061e83d13ee448b8f662301fb432cd1"))
      // console.log(this.checkedList)
		},

		//数据更新后调用（避免使用，最好使用计算属性或watch函数）,仅限组件本身的更新，如果存在子组件，并且需求子组件全部被更新后进行操作，需使用vm.$nextTick顶替updated（在updated内部调用vm.$nextTick）；
		updated() {

		},
		/*生命周期函数结束*/

		//方法
		methods: {
			filterNode(value, data,node) {
        if(!value) return true
			  const state = data.name.indexOf(value) !== -1
        if(state){
          this.resultNodeList.push(node.data)
          console.log(this.resultNodeList)
        }
				return state
			},
      searchFocusNode(eleList,index){
			  eleList.some(item => {
			    if(item.node.data.id === this.resultNodeList[index].id){
            this.targetEle = item
            return true
          }
          if(item.$children.length>1){
			      this.searchFocusNode(item.$children,index)
          }
        })
        return this.targetEle
      },
			handleNodeContextmenu(event, nodeEvent, node, tar) {
				console.log(event)
				console.log(nodeEvent)
				console.log(node)
				console.log(tar)
			},
			handleNodeClick(nodeData, nodeEvent, tar) {
				this.$emit('treedatabridge',{nodeData,nodeEvent})
			},
			checkChange(nodeEvent, nodeState, childState) {
			},
			nodeChecked(nodeEvent, nodeData) {
        this.$emit('treedatabridge',nodeData)
			},
			currentChange(nodeData, nodeEvent) {

			},
      selectTreeNode(event){
			  if(this.treeConfigs.showSearch || this.treeConfigs.keyboard){
          this.resultElList = []
          this.targetEle = null
          if(document.hasFocus() && document.activeElement === event.target){
            if(this.resultNodeList.length){
              this.focusNodeIndex = 0
              event.target.blur()
              this.resultElList = this.$refs.tree.$children
              this.searchFocusNode(this.resultElList,this.focusNodeIndex).$el.focus()
              // this.$refs.tree.$children.some((item,index) => {
              //   if(item.$el.className.indexOf('is-hidden') === -1){
              //     if(item.$children.length>1){
              //       item.$children.some(childItem => {
              //         if(childItem.$el.className.indexOf('is-hidden') === -1) {
              //
              //         }
              //
              //       })
              //     }else {
              //       item.$el.focus()
              //       this.focusNodeIndex = 0
              //     }
              //     return true
              //   }else {
              //     return false
              //   }
              // })
              // this.$refs.tree.$children.forEach((item,index) => {
              //   if(item.$el.className.indexOf('is-hidden') === -1){
              //     this.resultElList.push(item)
              //   }
              // })
            }else if(!this.filterText) {
              event.target.blur()
              this.$refs.tree.$children[0].$el.focus()
            }
            //this.$refs.tree.setCurrentKey(this.resultNodeList[0]?this.resultNodeList[0].id:(this.filterText?'':this.data[0].id))
            // this.$refs.tree.$nextTick(()=>{
            //   this.$refs.tree.$children.some((item,index) => {
            //     if(item.$el.className.indexOf('is-current')>-1){
            //       item.$el.focus()
            //       return true
            //     }else {
            //       return false
            //     }
            //   })
            // })
          }
        }
      },

      changeTreeNode(event){
			  if(this.treeConfigs.showSearch || this.treeConfigs.keyboard){
          if(this.resultNodeList.length){
            if(this.resultNodeList.length > (this.focusNodeIndex + 1)){
              this.focusNodeIndex++
              this.searchFocusNode(this.resultElList,this.focusNodeIndex).$el.focus()
            }else {
              this.focusNodeIndex = 0
              this.searchFocusNode(this.resultElList,this.focusNodeIndex).$el.focus()
            }
          }
        }
      },

      changeUpTreeNode(event){
			  if(this.treeConfigs.showSearch || this.treeConfigs.keyboard){
          if(this.resultNodeList.length){
            if(this.focusNodeIndex>0){
              this.focusNodeIndex--
              this.searchFocusNode(this.resultElList,this.focusNodeIndex).$el.focus()
            }else {
              this.focusNodeIndex = this.resultNodeList.length-1
              this.searchFocusNode(this.resultElList,this.focusNodeIndex).$el.focus()
            }
          }
        }
      },
      currentTreeNode(event){
			  if(this.treeConfigs.showSearch || this.treeConfigs.keyboard){
          if(this.resultNodeList.length){
            this.$refs.tree.setCurrentKey(this.resultNodeList[this.focusNodeIndex].id)
            this.$refs.tree.$nextTick(_=>{
              this.$emit('treedatabridge',{nodeData: this.resultNodeList[this.focusNodeIndex]},this.keyClose===undefined?true:this.keyClose)
            })
          }else if(!this.filterText) {
            const targetEle = event.target.children[0].children[1].dataset
            if(targetEle.id){
              this.$refs.tree.setCurrentKey(targetEle.id)
              this.$refs.tree.$nextTick(_=>{
                this.$emit('treedatabridge',{nodeData: this.$refs.tree.getCurrentNode()},this.keyClose===undefined?true:this.keyClose)
              })
            }
          }
        }
      },
      expandedKeysList(list){
			  const tempArr = []
        list.forEach(item => {
          if(item.id){
            tempArr.push(item.id)
          }
        })
        return tempArr
      }

		},

		//计算属性
		computed: {
      showDisable() {
        return this.treeConfigs.showDisable?this.treeConfigs.showDisable:false
      },
      showSearch() {
        return this.treeConfigs.showSearch?this.treeConfigs.showSearch:(this.treeConfigs.keyboard?this.treeConfigs.keyboard:false)
      },
      expandedKeys() {
        return (this.expandedKeyList&&this.expandedKeyList.length)?this.expandedKeyList:this.expandedKeysList(this.data)
      },
      treeBoxHeight() {
        let elHeight = 0
        if(this.showSearch){
          elHeight += 46
        }
        if(this.showDisable){
          elHeight += 34
        }
        return elHeight
      },
		},

		//观察者,可监听数据，属性和方法
		watch: {
			filterText(val) {
			  this.resultNodeList = []
				this.$refs.tree.filter(val)
			},
      disableState: function (state) {
        this.$emit('disable-state',state)
      },
      data(){
      }
		}
	}
</script>

<style lang="scss" rel="text/css">
	.rootTree {
    height: 100%;
		background-color: inherit;
    position: relative;
		.el-tree {
			background-color: inherit;
		}
    .el-input {
      margin-left: 5%;
      margin-bottom: 10px;
      width: 90%;
    }
	}
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    /*justify-content: space-between;*/
    font-size: 14px;
    padding-right: 8px;
  }
</style>
