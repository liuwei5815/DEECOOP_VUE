<template>
  <el-table-column :label="colConfig.label" :fixed="setFixed" align="center">
    <div slot-scope="scope">
      <el-switch active-value="1" inactive-value="0" v-model="scope.row.isdisable" @change="colConfig.changeState(scope.row,scope.$index)"></el-switch>
    </div>
  </el-table-column>
</template>

<script>
    export default {
      name: "table-switch",
      props: {
        colConfig: {
          type: Object,
          default: function () {
            return {}
          }
        },
        fixed: {
          type: [Boolean,String],
          default: false
        }
      },
      computed:{
        setFixed() {
          return this.fixed
        }
      }
    }
</script>

<style scoped>

</style>
