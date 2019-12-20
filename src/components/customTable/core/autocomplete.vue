<template>
  <el-autocomplete
    size="small"
    placeholder="请输入内容"
    v-model="scope.row[childColconfig.prop || childColconfig.columnIndex]"
    clearable
    :value-key="childColconfig._cellConfig.valueKey?childColconfig._cellConfig.valueKey:'name'"
    :fetch-suggestions="rootVm.querySearchAsync(scope.row,childColconfig)"
    :disabled="scope.row.isdisable==='0'"
    @clear="rootVm.computedCell(scope.row,childColconfig,scope.$index)">
    <i v-if="childColconfig._cellConfig.icon" slot="suffix" class="treeFormTableIcon">
      <svg-icon :icon-class="childColconfig._cellConfig.icon"></svg-icon>
    </i>
  </el-autocomplete>
</template>

<script>
  export default {
    name: "table-autocomplete",
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
    methods: {
      // computedCell(row,config){
      //   this.$emit('call-table-fn',['computedCell',[row,config]])
      // },
      // querySearchAsync(row,config){
      //   this.$emit('call-table-fn',['querySearchAsync',[row,config]])
      // },
    },
  }
</script>
