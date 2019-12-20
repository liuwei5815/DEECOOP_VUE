<template>
  <el-cascader
    size="small"
    :filterable="childColconfig._cellConfig.filterable !== undefined?childColconfig._cellConfig.filterable:false"
    :disabled="childColconfig._cellConfig.disabled !== undefined?(typeof childColconfig._cellConfig.disabled === 'boolean'?childColconfig._cellConfig.disabled:scope.row[childColconfig._cellConfig.disabled]):false"
    :clearable="childColconfig._cellConfig.clearable !== undefined?childColconfig._cellConfig.clearable:true"
    :props="childColconfig._cellConfig.props || {value:'id',label:'label',children:'children',disabled:'disabled'}"
    :expand-trigger="childColconfig._cellConfig.expand || 'hover'"
    :show-all-levels="childColconfig._cellConfig.showLevels !== undefined?childColconfig._cellConfig.showLevels:true"
    :change-on-select="childColconfig._cellConfig.onChange !== undefined?childColconfig._cellConfig.onChange:false"
    :options="rootVm.createCascaderOptions[scope.$index]?rootVm.createCascaderOptions[scope.$index][childColconfig.prop  || childColconfig.columnIndex]||[]:[]"
    v-model="scope.row[childColconfig.prop  || childColconfig.columnIndex]"
    @focus="rootVm.getCascaderOptions(scope.row,childColconfig,scope.$index)"
    @active-item-change="rootVm.cascaderActiveItemChange"></el-cascader>
</template>

<script>
  export default {
    name: "table-cascader",
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
      },
    },
  }
</script>
