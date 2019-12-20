<template>
  <el-input-number
    size="small"
    v-model="scope.row[childColconfig.prop || childColconfig.columnIndex]"
    :disabled="childColconfig._cellConfig.disabled !== undefined?(typeof childColconfig._cellConfig.disabled === 'boolean'?childColconfig._cellConfig.disabled:scope.row[childColconfig._cellConfig.disabled]):false"
    :precision="childColconfig._cellConfig.precision || 2"
    :step="childColconfig._cellConfig.step || 1"
    :max="childColconfig._cellConfig.max"
    :min="childColconfig._cellConfig.min"></el-input-number>
</template>

<script>
  export default {
    name: "table-input-number",
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
