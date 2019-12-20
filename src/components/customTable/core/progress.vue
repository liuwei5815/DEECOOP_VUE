<template>
  <el-progress
    :percentage="(childColconfig._cellConfig.componentConfig.baseValue?((scope.row[childColconfig.prop || childColconfig.columnIndex]-0)*100/((scope.row[childColconfig._cellConfig.componentConfig.baseValue]||childColconfig._cellConfig.componentConfig.baseValue)-0)):scope.row[childColconfig.prop || childColconfig.columnIndex]-0).toFixed(childColconfig._cellConfig.componentConfig.precision || rootVm.setPrecision)-0 || 0"
    :text-inside="childColconfig._cellConfig.componentConfig['text-inside'] || false"
    :stroke-width="childColconfig._cellConfig.componentConfig['stroke-width'] || 16"
    :show-text="childColconfig._cellConfig.componentConfig['show-text']?true:false"
    :color="rootVm.setProgressColor(childColconfig._cellConfig.componentConfig.color,(childColconfig._cellConfig.componentConfig.baseValue?((scope.row[childColconfig.prop || childColconfig.columnIndex]-0)*100/((scope.row[childColconfig._cellConfig.componentConfig.baseValue]||childColconfig._cellConfig.componentConfig.baseValue)-0)):scope.row[childColconfig.prop || childColconfig.columnIndex]-0).toFixed(childColconfig._cellConfig.componentConfig.precision || rootVm.setPrecision)-0 || 0)"></el-progress>
</template>

<script>
  export default {
    name: "table-progress",
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
<style lang="scss" rel="text/css">
  .el-progress-bar {
    padding-right: 70px !important;
    margin-right: -76px !important;
  }
  .el-progress--text-inside {
    .el-progress-bar {
      padding-right: 0 !important;
      margin-right: 0 !important;
    }
  }
  .el-progress-bar__inner {
    max-width: 100%;
  }
</style>
