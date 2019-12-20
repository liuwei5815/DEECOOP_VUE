<template>
  <el-tabs v-model="activeName" @tab-click="handleClick">
    <template v-for="(item, index) in tabs">
      <el-tab-pane :label="item.label" :name="item.key" :key="index">
        <el-button
          v-if="item.btnName"
          type="primary"
          size="mini"
          v-text="item.btnName"
          style="margin-bottom: 5px"
          :disabled="item.disabled"
          @click="item.method(item)"></el-button>
          <component
            v-if="activeName === item.key"
            :is="item.componentName"
            :baseHeight="tableConfig.baseHeight?tableConfig.baseHeight:'calc(100% - 40px)'"
            :baseBorder="tableConfig.baseBorder?tableConfig.baseBorder:'1px solid #E4E4E4'"
            :expand-all="tableConfig['expand-all']===undefined?true:tableConfig['expand-all']"
            :keyValue="tableConfig.keyValue===undefined?true:tableConfig.keyValue"
            :configs="tableConfig.configs?tableConfig.configs[activeName] || tableConfig.configs:{}"
            :customColumn="tableConfig.customColumn"
            :columnGlobalStyle="tableConfig.columnGlobalStyle"
            :editable="tableConfig.editable?tableConfig.editable:{}"
            :apiObj="item.apiObj || {}"
            :mergeColumn="tableConfig.mergeColumn"
            @databridge="databridge"
            @callmethod="callmethod"></component>
      </el-tab-pane>
    </template>
  </el-tabs>
</template>

<script>
  import customRowTable from "@/components/customRowTable"
  import equipmentCard from "@/components/equipmentCard"
  import equipmentData from "@/components/equipmentData"
  export default {
    name: "tabs-table",
    components: {
      customRowTable,
      equipmentCard,
      equipmentData
    },
    props: {
      tableConfig: {
        type: Object,
        default(){
          return {}
        }
      },
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
    },
    watch: {},
    methods: {
      databridge(data){
        this.$emit('databridge',data)
      },
      handleClick(tab, event){
        console.log(this.activeName)
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
        this.activeName = this.tabs[0].key
      }
    },
    mounted(){
    },

  }
</script>
