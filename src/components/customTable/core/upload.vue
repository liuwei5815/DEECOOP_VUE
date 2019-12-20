<template>
  <el-upload
    class="upload-demo"
    :disabled="childColconfig._cellConfig.disabled !== undefined?(typeof childColconfig._cellConfig.disabled === 'boolean'?childColconfig._cellConfig.disabled:scope.row[childColconfig._cellConfig.disabled]):false"
    :action="childColconfig._cellConfig.action || ''"
    :multiple="childColconfig._cellConfig.limit?true:childColconfig._cellConfig.multiple"
    :data="childColconfig._cellConfig.data"
    :name="childColconfig._cellConfig.name"
    :on-preview="rootVm.handlePreview"
    :on-success="rootVm.handleSuccess"
    :on-error="rootVm.handleError"
    :limit="childColconfig._cellConfig.limit"
    :on-exceed="rootVm.handleExceed(childColconfig)"
    :file-list="rootVm.fileList">
    <el-button size="small" type="text" v-text="childColconfig._cellConfig.btnName||'点击上传'"></el-button>
    <div v-if="childColconfig._cellConfig.tip" slot="tip" class="el-upload__tip">
      {{childColconfig._cellConfig.tip}}
    </div>
  </el-upload>
</template>

<script>
  export default {
    name: "table-upload",
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
