<template>
  <el-date-picker
    size="small"
    v-model="scope.row[childColconfig.prop || childColconfig.columnIndex]"
    :key="scope.row._internalId"
    :format="childColconfig._cellConfig.format || 'yyyy 年 MM 月 dd 日'"
    :value-format="childColconfig._cellConfig.format || 'yyyy-MM-dd'"
    :default-value="childColconfig._cellConfig.defaultValue?rootVm.defaultValue(childColconfig._cellConfig.defaultValue,scope.row,childColconfig):undefined"
    :editable="childColconfig._cellConfig.editable===undefined?true:childColconfig._cellConfig.editable"
    :disabled="((childColconfig._cellConfig.compute && !childColconfig._cellConfig.edit)?true:false)||scope.row.isdisable==='0'"
    :type="childColconfig._cellConfig.valueType || 'date'"
    :placeholder="childColconfig._cellConfig.placeholder || '选择日期'"
    :picker-options="rootVm.pickerOptions(scope.row,childColconfig)"
    @change="rootVm.datePickerChange(scope.row,childColconfig)">
  </el-date-picker>
</template>

<script>
  export default {
    name: "table-date-picker",
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
      // pickerOptions(row,config){
      //   this.$emit('call-table-fn',['pickerOptions',[row,config]])
      // },
      // datePickerChange(row,config){
      //   this.$emit('call-table-fn',['datePickerChange',[row,config]])
      // },
      // defaultValue(defaultValue,row,config){
      //   this.$emit('call-table-fn',['defaultValue',[defaultValue,row,config]])
      // },
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
