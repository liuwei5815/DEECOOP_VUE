<template>
	<div class="rootTree">
		<el-input v-if="treeConfigs.showSearch" placeholder="$t('table.inputKeyword')" v-model="filterText"></el-input>
		<el-tree ref="tree" :data="data" :indent="treeIndent" node-key="id" highlight-current :expand-on-click-node="!data" :show-checkbox="treeConfigs.showCheckBox" :default-expand-all="!treeConfigs.expandAll" :props="defaultProps"  @node-click="handleNodeClick" @node-contextmenu="handleNodeContextmenu" @check-change="checkChange" @check="nodeChecked" @current-change="currentChange" :filter-node-method="filterNode">
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <svg-icon v-if="treeConfigs.showIcons" :icon-class="data.url" style="margin-right: 5px"></svg-icon>
        <span v-if="node.label">{{ $t( propName+'.'+node.label) }}</span>
        <span v-else>{{ data.name }}</span>
      </span>
		</el-tree>
	</div>
</template>

<script>
	export default {
		props: ['data', 'treeConfigs','propName'],
		//数据
		data() {
			return {
				filterText: '',
				defaultProps: {
					children: 'children',
					label: 'url'
				},
        lang: null,
        treeIndent: 16
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
      this.lang = this.$store.getters.language
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
			filterNode(value, data) {
				if(!value) return true;
				return data.label.indexOf(value) !== -1;
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
				console.log(nodeEvent)
				console.log(nodeState)
				console.log(childState)
			},
			nodeChecked(nodeEvent, nodeData) {
				console.log(nodeEvent)
				console.log(nodeData)
			},
			currentChange(nodeData, nodeEvent) {

			},


		},

		//计算属性
		computed: {
      treeLang() {
        return this.$store.getters.language
      }
		},

		//观察者,可监听数据，属性和方法
		watch: {
			filterText(val) {
				this.$refs.tree.filter(val);
			}
		}
	}
</script>

<style lang="scss" rel="text/css">
	.rootTree {
		background-color: inherit;
		.el-tree {
			background-color: inherit;
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
