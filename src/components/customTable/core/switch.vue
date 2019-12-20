<template>
  <el-switch
    v-model="scope.row[childColconfig.prop || childColconfig.columnIndex]"
    :active-color="childColconfig._cellConfig?childColconfig._cellConfig.activeColor || '#13ce66':'#13ce66'"
    :inactive-color="childColconfig._cellConfig?childColconfig._cellConfig.inactiveColor || '#ff4949':'#ff4949'"
    :active-value="childColconfig._cellConfig?childColconfig._cellConfig.activeValue || '1':'1'"
    :inactive-value="childColconfig._cellConfig?childColconfig._cellConfig.inactiveValue || '0':'0'"
    :disabled="childColconfig._cellConfig?(childColconfig._cellConfig.disabled !== undefined?(typeof childColconfig._cellConfig.disabled === 'boolean'?childColconfig._cellConfig.disabled:scope.row[childColconfig._cellConfig.disabled]):false):false"
    @change="rootVm.componentMethod(scope.row,scope.$index,childColconfig)">
  </el-switch>
</template>

<script>
  export default {
    name: "table-switch",
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
