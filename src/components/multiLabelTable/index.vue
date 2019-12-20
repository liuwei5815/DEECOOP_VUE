<template>
  <el-tabs v-model="activeName" @tab-click="handleClick">
    <template v-for="(item, index) in tabs">
      <el-tab-pane :label="item.label" :name="index + ''" :key="index">
        <template v-if="item.btns && item.btns.length">
          <el-button
            v-for="(bt,bi) in item.btns"
            type="primary"
            size="mini"
            v-text="bt.btnName"
            style="margin-bottom: 5px"
            :disabled="bt.disabled"
            @click="bt.method(item)"></el-button>
        </template>
          <component
            v-if="activeName === index+''"
            :is="item.componentName"
            :tableConfigList="formatConfig[index]"
            @databridge="databridge"
            @callmethod="callmethod"></component>
      </el-tab-pane>
    </template>
  </el-tabs>
</template>

<script>
  import baseTable from "@/components/customTable/baseTable"
  import multilevelTable from "@/components/customTable/multilevelTable"
  import equipmentCard from "@/components/equipmentCard"
  import equipmentData from "@/components/equipmentData"
  export default {
    name: "tabs-table",
    components: {
      equipmentCard,
      equipmentData,
      multilevelTable,
      baseTable
    },
    props: {
      tabs: {
        type: Array,
        default(){
          return []
        }
      },
      defaultKey: {
        type: String,
        default: '',
      }
    },
    data(){
      return {
        activeName: '',
      }
    },
    computed: {
      formatConfig(){
        return this.tabs.map(v=>{
          return v.tableConfigList
        })
      },
    },
    watch: {},
    methods: {
      databridge(data){
        this.$emit('databridge',data)
      },
      handleClick(tab, event){
        this.$emit('tabsKey',this.activeName)
      },
      callmethod(obj){
        this.$emit('callmethod',obj)
      },

    },
    created(){
      if(this.defaultKey){
        this.activeName = this.defaultKey
      }else {
        this.activeName = '0'
      }
    },

  }
</script>
