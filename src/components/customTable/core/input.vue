<template>
  <el-input
    size="small"
    placeholder="请输入内容"
    v-model="scope.row[childColconfig.prop || childColconfig.columnIndex]"
    clearable
    :align="'center'"
    :type="childColconfig._cellConfig.textarea?'textarea':'text'"
    :disabled="((childColconfig._cellConfig.compute && !childColconfig._cellConfig.editable)?true:false)||scope.row.isdisable==='0'"
    @blur="rootVm.computedCell(scope.row,childColconfig,scope.$index)"
    @clear="rootVm.computedCell(scope.row,childColconfig,scope.$index)">
    <i v-if="childColconfig._cellConfig.icon" slot="suffix" class="treeFormTableIcon">
      <svg-icon :icon-class="childColconfig._cellConfig.icon"></svg-icon>
    </i>
  </el-input>
</template>

<script>
  export default {
    name: "table-input",
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
    mounted(){
      //console.log(this.rootVm)
    },
    methods: {
      // computedCell(row,config,index){
      //   //this.$emit('call-table-fn',['computedCell',[row,config,index]])
      // }
    },
  }
</script>
