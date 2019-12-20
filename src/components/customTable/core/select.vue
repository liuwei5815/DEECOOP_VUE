<template>
  <el-select
    v-model="scope.row[childColconfig.prop || childColconfig.columnIndex]"
    size="small"
    clearable
    filterable
    :disabled="scope.row.isdisable==='0'"
    :multiple="childColconfig._cellConfig.multiple || false"
    :loading="rootVm.selectLoading"
    value-key="item.id"
    placeholder="请选择"
    @focus="rootVm.getSelectOptions(scope.row,childColconfig,scope.$index)"
    @change="rootVm.rowSelectChange">
    <el-option
      v-for="item in selectOptions"
      :key="item.id"
      :label="item.label"
      :value="{item,row:scope.row,config:childColconfig,index:scope.$index}"
      :disabled="item.isdisable==='0'">
    </el-option>
  </el-select>
</template>

<script>
  export default {
    name: "table-select",
    inject:['rootVm'],
    props: {
      scope: {
        type:Object,
        default(){
          return {}
        }
      },
      childColconfig: {
        type:Object,
        default(){
          return {}
        }
      }
    },
    computed:{
      selectOptions(){
        if(this.rootVm.createSelectOptions[this.scope.$index] && this.rootVm.createSelectOptions[this.scope.$index][this.childColconfig.prop || this.childColconfig.columnIndex]){
          return this.rootVm.createSelectOptions[this.scope.$index][this.childColconfig.prop || this.childColconfig.columnIndex]
        }
        return []
      },
    },
    created(){
      // console.log(this.childColconfig,'select')
    }
  }
</script>
