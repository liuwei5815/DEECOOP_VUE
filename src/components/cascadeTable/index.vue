<template>
  <div style="height: 100%" class="myCoustomTable resetCascadeTableStyle">
    <div :style="{height: setTableHeight}">
      <el-table ref="baseTable" :data="data" stripe border style="width: 100%;" height="100%" fit highlight-current-row :header-cell-class-name="setStyle" :row-key="getRowKey" :expand-row-keys="expandRowKeys" @expand-change="expandChange" @select="selectItem" @select-all="selectAllItem">
        <template v-for="(colConfig,infoIndex) in colConfigs">
          <template v-if="colConfig.children && colConfig.children.length">
            <el-table-column type="expand" width="55" align="center">
              <template slot-scope="props">
                <template v-if="props.row.children&&props.row.children.length">
                  <cascade-table :data="props.row.children" :layer="0" :colConfigs="colConfig.children"></cascade-table>
                </template>
                <template v-else>
                  <div style="text-align: center">暂无数据</div>
                </template>
              </template>
            </el-table-column>
          </template>
          <template v-if="infoIndex === 0">
            <template v-if="showCheckBox">
              <el-table-column type="selection" :selectable="selectable" width="55" align="center"></el-table-column>
            </template>
            <template v-if="showIndex">
              <el-table-column type="index" :index="indexMethod" label="序号" width="60" align="center"></el-table-column>
            </template>
            <el-table-column show-overflow-tooltip v-bind="colConfig" :sortable="isSortable" align="center"></el-table-column>
          </template>
          <component v-else-if="colConfig.component" :is="colConfig.component" :col-config="colConfig"></component>
          <el-table-column v-else show-overflow-tooltip v-bind="colConfig" :sortable="isSortable" :label="colConfig.label" align="center"></el-table-column>
        </template>
      </el-table>
    </div>
    <div v-if="pageData" style="height: 40px;text-align: center;margin-top: 5px;">
      <el-pagination
        background
        @current-change="handleCurrentChange"
        :current-page.sync="pageData.current"
        :page-size="pageData.size"
        layout="prev, pager, next, jumper"
        :total="pageData.total-0">
      </el-pagination>
    </div>

  </div>

</template>

<script>
  import cascadeTable from './cascadeTable'
  import { mapMutations } from 'vuex'

  export default {
    props: {
      colConfigs: {
        type: Array,
        default: function () {
          return []
        }
      },
      data: {
        type: Array,
        default: function () {
          return []
        }
      },
      showCheckBox: {
        type: Boolean,
        default: false
      },
      showIndex: {
        type: Boolean,
        default: false
      },
      propName: {
        type: String,
        default: ''
      },
      pageData: {
        type: Object,
        default: function () {
          return {}
        }
      },
      isSingle: {
        type: Boolean,
        default: false
      },
      isExpands: {
        type: Boolean,
        default: false
      },
      isSortable: {
        type: Boolean,
        default: false
      },
      childrenConfigs: {
        type: Array,
        default: function () {
          return []
        }
      }
    },
    data() {
      return {
        wrapperWidth: 0,
        tableWidth: 0,
        fixedList: [],
        expandRowKeys: [],
        getRowKey(row){
          return row.id
        },
        selectable(row, index) {
          return row.isdisable === '1'
        },

      }
    },
    components: {
      cascadeTable,
    },
    computed: {
      setTableHeight() {
        return this.pageData?'calc(100% - 40px)':'100%'
      }
    },
    created: function() {
      if(!this.childrenConfigs.length){
        const configs = {
          showCheckBox: this.showCheckBox,
          showIndex: this.showIndex,
          isSingle: this.isSingle,
          isExpands: this.isExpands,
          isSortable: this.isSortable,
          isGlobalSetting: true
        }
        this.SET_CASCADETABLE(configs)
      }else {
        this.SET_CASCADETABLEDEFAULT(this.childrenConfigs)

      }

    },
    mounted: function () {
      this.$refs.baseTable.$nextTick(()=>{
        if(this.isSingle){
          const el = this.$refs.baseTable.$el.querySelector('.el-table__header-wrapper .el-checkbox')
          el.parentNode.removeChild(el);
        }
      })
    },
    watch: {

    },
    methods:{
      ...mapMutations(['SET_CASCADETABLE','SET_CASCADETABLEDEFAULT']),
      expandChange(row, list){
        if(this.isExpands){
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

      setStyle(row) {

      },
      indexMethod(index) {
        return index + 1
      },
      tableRowClassName(row,index) {
        row.index = index
      },
      selectItem(selection, row) {
        this.$emit('databridge',selection)
        if(this.isSingle){
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
        if(this.isSingle){
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
      handleCurrentChange(pageIndex) {
        this.$emit('update:currentpage', pageIndex)
      },
    }
  }
</script>

<style>
  .el-table__expanded-cell[class*=cell] {
    padding: 10px;
  }

</style>
