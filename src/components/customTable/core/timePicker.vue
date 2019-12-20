<template>
  <el-time-picker
    v-model="scope.row[childColconfig.prop || childColconfig.columnIndex]"
    clearable
    size="small"
    align="center"
    :disabled="scope.row.isdisable==='0'"
    :editable="false"
    :key="scope.row._internalId"
    placeholder="任意时间点">
  </el-time-picker>
</template>

<script>
  export default {
    name: "table-time-picker",
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
<style lang="scss" scoped rel="text/css">
  .el-date-editor.el-input {
    width: 95% !important;
    /*min-width: 150px !important;*/
  }
  .el-date-editor--date {
    min-width: 150px !important;
  }
  .el-date-editor--time {
    min-width: 110px !important;
  }
  .el-date-editor--datetime {
    min-width: 190px !important;
  }
  .el-input--suffix .el-input__inner {
    padding-right: 0;
  }
</style>
