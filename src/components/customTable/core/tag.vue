<template>
  <el-tag
    :type="rootVm.setTagState(scope.$index,scope.row,childColconfig).type"
    :color="rootVm.setTagState(scope.$index,scope.row,childColconfig).color || ''"
    size="small">{{rootVm.setTagState(scope.$index,scope.row,childColconfig).text || '未知状态'}}
  </el-tag>
</template>

<script>
  export default {
    name: "table-tag",
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
