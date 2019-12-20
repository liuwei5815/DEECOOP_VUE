<template>
  <div class="authorityTree">
    <div style="height: calc(100% - 60px);">
      <authority-tree
        ref="authorityTree"
        :config="treeConfig"
        @treedatabridge="treedatabridge"></authority-tree>
    </div>
    <div style="height: 60px">
      <el-button type="primary" @click="getTreeData">获取树数据</el-button>
    </div>
  </div>
</template>

<script>
  import authorityTree from '@/components/authorityTree'

  export default {
    name: "authority",
    components: {
      authorityTree
    },
    data(){
      return {
        treeConfig: {
          treeWidth: 250,//树表的背景宽度
          treeBackgroundColor: '#e0e0e0',//树表的背景色
          throwTreeNode: false,//是否在点击某行树节点时抛出该节点数据
          disabled:'isdisable',//指定节点选择框是否禁用为节点对象的某个属性值
          accordion: false,//是否每次只打开一个同级树节点展开
          'show-checkbox': false,//节点是否可被选择
          'highlight-current': false,//是否高亮当前行
          'default-expand-all': true,//是否默认展开所有节点
          props: {
            label: 'name',//指定节点标签为节点对象的某个属性值
          },

          // //单选使用
          // //width: '1000px',//整个树结构的宽度，只能为字符串。当自定义选项过多导致样式换行时使用
          // apiObj:{
          //   apiName: 'listTreeDepartment',
          //   params: {
          //     queryStr: "isdisable = 1",
          //     deptID: this.$storage.get('userInfo').companyId,
          //   },
          // },
          // componentName: 'radio',//组件名称
          // componentConfig: {// 组件全局配置
          //   border: false,//是否使用边框
          //   size: 'mini',//单选框尺寸
          //   disabled: 'isdisable',//单选框是否禁用，值为树数据里面的key，key值为'0'表示禁用
          // },
          // bindValue: ['','bindValue'],//组件需要绑定的树数据中的key，树数据有多少层级就设置多少个，第一项为空是因为树数据的第一级不需要单选设置
          // componentList: [//单选框数组，即有多少选项；注意根据树的层级进行配置，例如有三级树，
          //                 //就需要配置三个数组项，只需要最底层的树有单选设置的话，前面两级的数组为空即可
          //   [],//第一级不需要单选设置，所以为空数组
          //   [//第二级设置
          //     {
          //       label: '0',//该选项选中时的值，
          //       text: '显示个人数据',//显示的文本
          //     },
          //     {
          //       label: '1',//该选项选中时的值，
          //       text: '显示部门数据',//显示的文本
          //     },
          //     {
          //       label: '2',//该选项选中时的值，
          //       text: '显示所有数据',//显示的文本
          //     },
          //   ],
          // ],

          //多选使用
          width: '1000px',//整个树结构的宽度，只能为字符串。当自定义选项过多导致样式换行时使用
          apiObj: {
            apiName: 'treeRoleMeunsSelected',
            params: {
              roleIds: "e0af062de24046a385f9319dbad8d875",
            },
          },
          componentName: 'checkbox',//组件名称
          componentConfig: {
            border: false,//是否使用边框
            size: 'mini',//多选框尺寸
            disabled: 'isdisable',//是否禁用，值为树数据里面的key，key值为'0'表示禁用
            keyName: 'id',//checkbox绑定的数据key
            labelName: 'name',//checkbox显示的文本
            stateName: 'isBindRole',//checkbox选中状态的数据key，key值为'1'表示选中
          },
          bindValue: ['','bindValue'],//组件需要绑定的树数据中的key，树数据有多少层级就设置多少个，第一项为空是因为树数据的第一级不需要单选设置
        },
      }
    },
    created() {

    },
    methods:{
      treedatabridge(data){
        console.log(data)
      },
      getTreeData(){
        this.$refs.authorityTree.getTreeData && this.$refs.authorityTree.getTreeData()
      },
    },

  }
</script>

<style scoped lang="scss" rel="text/css">
  .authorityTree {
    position: absolute;
    top: 10px;
    left: 10px;
    right: 10px;
    bottom: 10px;

  }

</style>
