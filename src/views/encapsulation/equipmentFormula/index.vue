<template>
  <div class="equipmentFormulaView">
    <equipment-formula
      ref="equipmentFormula"
      width="650px"
      :apiObj="apiObj"
      :paramName="'用户输入的'"
      @databridge="databridge"></equipment-formula>

    <el-row :gutter="10">
      <el-button type="primary" @click="getData">获取公式对象</el-button>
      <p v-text="`公式：${formulaData?formulaData.formulaStr:''}`"></p>
    </el-row>
  </div>

</template>

<script>
  import equipmentFormula from '@/components/equipmentFormula'
  export default {
    name: "equipmentFormulaView",
    components:{
      equipmentFormula
    },
    data(){
      return {
        apiObj: {
          apiName: 'findListEquipmentSensorByEquipment',
          params: {
            equipmentId: '70e6f68a2e3844e3afac64c56c7f34c5'
          }
        },
        formulaData: null,
      }
    },
    methods: {
      getData(){
        this.$refs['equipmentFormula'].getData()
      },
      databridge(data){
        this.formulaData = data
      },
    },
  }
</script>
