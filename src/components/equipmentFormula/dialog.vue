<template>
  <el-dialog
    v-el-drag-dialog
    :width="'650px'"
    title="公式编辑器"
    :visible.sync="innerVisible"
    append-to-body
    @close="dialogClose">
    <div style="padding: 10px;text-align: center">
      <formula-edit :state="setState" @send-formula="formula"></formula-edit>
    </div>
  </el-dialog>
</template>

<script>
  import formulaEdit from '@/components/formulaEdit'

    export default {
      name: "formula-dialog",
      props:['visible','state'],
      components:{
        formulaEdit
      },
      data(){
        return {
          innerVisible: false,
          formulaStr:'',
        }
      },
      computed:{
        setState(){
          return this.state
        }
      },
      watch:{

      },
      methods:{
        formula(data){
          this.formulaStr = data
          this.innerVisible = false
        },
        dialogClose(){
          this.$emit('close-dialog',this.formulaStr)
        }
      },
      created(){

      },
      mounted(){
        this.innerVisible = this.visible
      },
    }
</script>

<style scoped>

</style>
