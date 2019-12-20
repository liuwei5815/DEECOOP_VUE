<template>
  <formula-edit @send-formula="formula"></formula-edit>
</template>

<script>
    import formulaEdit from '@/components/formulaEdit'
    export default {
        name: "formula",
        components:{
          formulaEdit
        },
        data(){
          return {
          }
        },
        methods:{
          formula(data){
            console.log(data)
          }
        }
    }
</script>

<style scoped>

</style>
