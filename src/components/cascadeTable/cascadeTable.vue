<template>
  <el-table ref="baseTable" :data="data"stripe border fit highlight-current-row row-key="id" :row-key="getRowKey" :expand-row-keys="expandRowKeys" @expand-change="expandChange" @select="selectItem" @select-all="selectAllItem">
    <template v-for="(colConfig,infoIndex) in colConfigs">
      <template v-if="colConfig.children && colConfig.children.length">
        <el-table-column type="expand" width="55" align="center">
          <template slot-scope="props">
            <template v-if="props.row.children&&props.row.children.length">
              <cascade-table :data="props.row.children" :layer="childrenLayer" :colConfigs="colConfig.children"></cascade-table>
            </template>
            <template v-else>
              <div style="text-align: center">暂无数据</div>
            </template>
          </template>
        </el-table-column>
      </template>
      <template v-if="infoIndex === 0">
        <template v-if="configs.showCheckBox">
          <el-table-column type="selection" :fixed="fixedState" :selectable="selectable" width="55" align="center"></el-table-column>
        </template>
        <template v-if="configs.showIndex">
          <el-table-column type="index" :index="indexMethod" :fixed="fixedState" label="序号" width="60" align="center"></el-table-column>
        </template>
        <el-table-column show-overflow-tooltip v-bind="colConfig" :sortable="configs.isSortable" align="center"></el-table-column>
      </template>
      <component v-else-if="colConfig.component" :is="colConfig.component" :col-config="colConfig"></component>
      <el-table-column v-else show-overflow-tooltip v-bind="colConfig" :sortable="configs.isSortable" :label="colConfig.label" align="center"></el-table-column>
    </template>
  </el-table>
</template>

<script>
  import cascadeTable from './cascadeTable'
  import { mapGetters } from 'vuex'

  export default {
    name: 'cascade-table',
    components: {
      cascadeTable
    },
    props: {
      data: {
        type: Array,
        default: function () {
          return []
        }
      },
      colConfigs: {
        type: Array,
        default: function () {
          return []
        }
      },
      layer: {
        type: Number,
        default: 0
      }
    },
    data() {
      return {
        fixedState: false,
        fixedList: [],
        expandRowKeys: [],
        childrenConfigs: {},
        getRowKey(row){
          return row.id
        },
        selectable(row, index) {
          return row.isdisable === '1'
        },
      }
    },
    computed: {
      ...mapGetters([
        'cascadeTableConfig',
        'cascadeTableDefault'
      ]),
      configs(){
        return this.childrenConfigs
      },
      childrenLayer() {
        return this.layer + 1
      }
    },
    created: function() {
      if(this.cascadeTableConfig.isGlobalSetting){
        this.childrenConfigs = this.cascadeTableConfig
      }else {
        this.childrenConfigs = this.cascadeTableDefault[this.childrenLayer-1]?this.cascadeTableDefault[this.childrenLayer-1]:this.cascadeTableDefault[this.cascadeTableDefault.length-1]
      }

    },
    mounted: function () {
      this.$refs.baseTable.$nextTick(()=>{
        if(this.configs.isSingle){
          const el = this.$refs.baseTable.$el.querySelector('.el-table__header-wrapper .el-checkbox')
          el.parentNode.removeChild(el);
        }
      })
    },
    watch: {
      configs: function () {
        console.log(this.configs)
      }
    },
    methods:{
      indexMethod(index) {
        return index + 1
      },
      expandChange(row, list){
        if(this.configs.isExpands){
          if(list.length>1){
            list.forEach((item,index) => {
              if(item.id !== row.id){
                list.splice(index,1)
              }
            })
          }
        }
        this.$refs.baseTable.setCurrentRow(row)
        this.$refs.baseTable.doLayout();
      },
      selectItem(selection, row) {
        console.log(selection)
        this.$emit('databridge',selection)
        if(this.configs.isSingle){
          if(selection.length){
            this.data.forEach(item => {
              item.isdisable = '0'
            })
            selection[0].isdisable = '1'
          }else {
            this.data.forEach(item => {
              item.isdisable = '1'
            })
          }
        }
      },
      selectAllItem(selection) {
        if(this.configs.isSingle){
          if(selection.length){
            for(let i =selection.length-1;i>=0;i--){
              selection.splice(i,1)
            }
            console.log(selection)
          }
        }else {
          this.$emit('databridge',selection)
          console.log(selection)
        }
      },
    }
  }
</script>

<style>


</style>
