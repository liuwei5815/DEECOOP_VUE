<template>
  <el-steps :active="scope.row[childColconfig.prop || childColconfig.columnIndex]-0" simple>
    <el-step
      v-for="(stepItem,stemIndex) in childColconfig._cellConfig.componentConfig.titleList"
      :title="stepItem"
      :key="stemIndex"
      :icon="'none'"></el-step>
  </el-steps>
</template>

<script>
  export default {
    name: "table-steps",
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
