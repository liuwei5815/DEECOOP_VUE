<template>
  <div style="height: 100%" class="myCoustomTable resetBaseTableStyle">
    <div :style="{height: setTableHeight}">
      <el-table :data="data" stripe border current-row-key style="width: 100%;" height="100%" fit :header-cell-class-name="setStyle" row-key="id" @select="selectItem" @select-all="selectAllItem">
        <template v-if="showCheckBox">
          <el-table-column type="selection" width="55" align="center"></el-table-column>
        </template>
        <template v-if="showIndex">
          <el-table-column type="index" :index="indexMethod" :label="$t('serialNumber')" width="60" align="center"></el-table-column>
        </template>
        <template v-for="(colConfig,infoIndex) in colConfigs">
          <slot v-if="colConfig.slot" :name="colConfig.slot"></slot>
          <component v-else-if="colConfig.component" :is="colConfig.component" :width="colConfig.width || null" :col-config="colConfig"></component>
          <el-table-column v-else show-overflow-tooltip v-bind="colConfig" :label="propName?$t(propName + '.' + colConfig.enLabel):colConfig.label" align="center"></el-table-column>
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
	export default {
		props: ['colConfigs', 'data','showCheckBox','showIndex','propName','pageData'],
    data() {
		  return {

      }
    },
    computed: {
      setTableHeight() {
        return this.pageData?'calc(100% - 40px)':'100%'
      }
    },
		created: function() {
			console.log(this.colConfigs);
		},
		methods:{
			setStyle(row) {
				if(row.columnIndex === 0){
					return 'datesStyle'
				}
				if(row.columnIndex === 4){
					return 'phoneStyle'
				}
			},
			indexMethod(index) {
				return index + 1
			},
			tableRowClassName(row,index) {
				row.index = index
			},
			selectItem(selection, row) {
				console.log(row)
				this.$emit('databridge',selection)
			},
			selectAllItem(selection) {
				this.$emit('databridge',selection)
			},
      handleCurrentChange(pageIndex) {
        this.$emit('update:currentpage', pageIndex)
      }
		}
	}
</script>

<style>


</style>
