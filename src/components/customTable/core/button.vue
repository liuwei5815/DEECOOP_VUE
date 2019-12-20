<template>
  <el-button
    type="text"
    size="small"
    :style="{'padding-left':childColconfig._cellConfig.hideTitle?'':'0'}"
    :disabled="childColconfig._cellConfig.disabled?scope.row[childColconfig._cellConfig.disabled]:false"
    @click="rootVm.componentMethod(scope.row,scope.$index,childColconfig)">{{childColconfig._cellConfig.name || scope.row[childColconfig.prop || childColconfig.columnIndex]}}</el-button>
</template>

<script>
  export default {
    name: "table-button",
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
  }
</script>
