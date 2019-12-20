<template>
  <el-table-column :label="colConfig.label" :fixed="setFixed" align="center">
    <div slot-scope="scope" class="btnBox">
      <template v-if="colConfig.btns">
        <el-button v-for="item in colConfig.btns"  v-show="item.editBtns_isShow" type="text" class="btns" style="font-size: 12px;" @click="item.method(scope.row,scope.$index)">{{item.btnName}}</el-button>
      </template>
      <template v-else>
        <el-button  v-show="colConfig.editBtns_isShow" type="text" class="btns" style="font-size: 12px;" @click="colConfig.method(scope.row,scope.$index)">{{colConfig.btnName}}</el-button>
      </template>
    </div>
  </el-table-column>
</template>

<script>
    export default {
      name: "table-button",
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
      created() {

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
