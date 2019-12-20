<template>
  <div
    class="authority-tree-component">
    <el-tree
      :data="treeData"
      :style="{width: config.width||'100%',background: config.treeWidth?`linear-gradient(to right, ${config.treeBackgroundColor} ${config.treeWidth}px, #ffffff ${config.treeWidth}px)`:'inherit'}"
      :show-checkbox="config['show-checkbox'] || false"
      node-key="id"
      :default-expand-all="config['default-expand-all'] || false"
      :highlight-current="config['highlight-current'] || false"
      :accordion="config['accordion'] || false"
      :expand-on-click-node="false"
      :props="config['props'] || {label: 'name'}"
      @node-click="handleNodeClick">
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <span>{{ node.label }}</span>
        <template v-if="config.componentName === 'radio'">
          <template v-if="config.componentList[data._layer] && config.componentList[data._layer].length">
            <span v-if="data.children && !data.children.length" :style="{width: `calc(100% - ${config.treeWidth || 0}px)`,'text-align':'center'}">
              <el-radio-group
                v-model="data[config.bindValue[data._layer]]"
                :size="config.componentConfig.size|| 'mini'"
                @change="radioChange">
                <template v-for="item in config.componentList[data._layer]">
                  <el-radio
                    :border="config.componentConfig.border"
                    :disabled="data[config.componentConfig.disabled] === '0'"
                    :label="item.label">{{item.text}}</el-radio>
                </template>
              </el-radio-group>
            </span>
          </template>
        </template>
        <template v-else>
          <template v-if="config.componentName === 'checkbox' && data[config.bindValue[data._layer]] && data[config.bindValue[data._layer]].length">
            <span :style="{width: `calc(100% - ${config.treeWidth || 0}px)`,display: 'flex','align-items': 'center','justify-content': 'space-between'}">
              <el-checkbox-group
                style="display: inline-block;"
                v-model="checkboxGroup[data[config.componentConfig.keyName || 'id']]"
                :size="config.componentConfig.size|| 'mini'"
                @change="val=>indeterminateChange(val,data)">
                <template v-for="item in data[config.bindValue[data._layer]]">
                  <el-checkbox
                    :border="config.componentConfig.border"
                    :disabled="item[config.componentConfig.disabled] === '0'"
                    :key="item.id"
                    :label="item[config.componentConfig.keyName || 'id']">{{item[config.componentConfig.labelName || 'name']}}</el-checkbox>
                </template>
              </el-checkbox-group>
              <el-checkbox :indeterminate="isIndeterminate[data[config.componentConfig.keyName || 'id']]" v-model="checkAll[data[config.componentConfig.keyName || 'id']]" @change="val=>handleCheckAllChange(val,data)"><span style="font-weight: bold;color: #000000;">全选</span></el-checkbox>
            </span>
          </template>
        </template>

      </span>
    </el-tree>
  </div>
</template>

<script>
  import {internalId} from '@/utils/common'
  const checkboxTests = '[{"id":"3b133abe4f3544c5952dd678a780c790","name":"恢复","nameEn":"recoveryByParent","serialNumber":5,"isdisable":"1","isBindRole":"1"},{"id":"6e088d007c99458a8a90d96ff210a59f","name":"删除","nameEn":"deleteByParent","serialNumber":3,"isdisable":"1","isBindRole":"1"},{"id":"715398ca1a0e4dd8b1e2a11bb26ee101","name":"新增","nameEn":"add","serialNumber":1,"isdisable":"1","isBindRole":"1"},{"id":"760255102b494f769e1e6dc0490a4afd","name":"业务信息","nameEn":"orderByParent","serialNumber":7,"isdisable":"1","isBindRole":"1"},{"id":"c3523f114a6a4ff182ff21e26cd6f805","name":"执行","nameEn":"executeByParent","serialNumber":6,"isdisable":"1","isBindRole":"1"},{"id":"e2002b785c9044b48cd1cb727e27fa8a","name":"取消","nameEn":"cancelByParent","serialNumber":4,"isdisable":"1","isBindRole":"1"},{"id":"f6a0db1a0e784687b7e307820c53ffde","name":"编辑","nameEn":"editByParent","serialNumber":2,"isdisable":"1","isBindRole":"1"}]'
  export default {
    name: "authority-tree-component",
    props: {
      config: {
        type: Object,
        default() {
          return {}
        }
      },
    },
    computed: {

    },
    data() {
      return {
        componentNameList: ['radio','switch'],
        treeData: [],
        handleNodeClickTimer: '',
        checkboxGroup: {},
        checkAll: {},
        isIndeterminate: {},
      }
    },
    created(){
      this.httpRequest()
    },
    watch:{
      'config.apiObj.params'(){
        this.httpRequest()
      }
    },
    methods: {
      httpRequest(){
        if(this.config.apiObj && this.config.apiObj.apiName){
          this.checkboxGroup = {}
          this.checkAll = {}
          this.isIndeterminate = {}
          this.$api[this.config.apiObj.apiName](this.config.apiObj.params).then(res=>{
            console.log(res)
            if(res.result){
              if(typeof res.result === 'string'){
                const tempResult = JSON.parse(res.result)
                if(tempResult){
                  Array.isArray(tempResult) && (this.treeData = this.formatFn(0, tempResult))
                  typeof tempResult === 'object' && Object.keys(tempResult).includes('treeList') && (this.treeData = Array.isArray(tempResult.treeList)?this.formatFn(0, tempResult.treeList):this.formatFn(0, [tempResult.treeList]))
                }
              }else if(Array.isArray(res.result)){
                this.treeData = this.formatFn(0, res.result)
              }else if(!Array.isArray(res.result) && typeof res.result === 'object'){
                Object.keys(res.result).includes('treeList') && (this.treeData = Array.isArray(res.result.treeList)?this.formatFn(0, res.result.treeList):this.formatFn(0, [res.result.treeList]))
              }else {
                this.treeData = []
              }
            }else {
              this.treeData = []
            }
          }).catch(err=>{
            console.log(err)
          })
        }
      },
      radioChange(value){
        // console.log(value)
      },
      formatFn(layer, list) {
        return list.map(v => {
          v._layer = layer
          if(this.$storage.get('userInfo').userId === '0'){
            this.config.componentName === 'radio'?(Object.keys(v).includes('bindValue') ? '' : (v.bindValue = '1')):''
            this.config.componentName === 'checkbox'?(Object.keys(v).includes('bindValue') ? '' : (v.bindValue = this.roundId(checkboxTests))):''
          }
          if(this.config.componentName === 'checkbox' && this.config.bindValue[v._layer] && v[this.config.bindValue[v._layer]]){
            const keyName = v[this.config.componentConfig.keyName || 'id']
            const checkboxList = v[this.config.bindValue[v._layer]]
            const checkedList = (checkboxList.filter(fv=>{return fv[this.config.componentConfig.stateName] === '1'})).map(mv=>{return mv[this.config.componentConfig.keyName || 'id']})
            if(!Object.keys(this.checkboxGroup).includes(keyName)){
              this.$set(this.checkboxGroup,keyName,checkedList)
            }else {
              this.checkboxGroup[keyName] = checkedList
            }
            if(!Object.keys(this.checkAll).includes(keyName)){
              this.$set(this.checkAll,keyName,checkedList.length === checkboxList.length)
            }else {
              this.checkAll[keyName] = checkedList.length === checkboxList.length
            }
            if(!Object.keys(this.isIndeterminate).includes(keyName)){
              this.$set(this.isIndeterminate,keyName,checkboxList.length && checkedList.length<checkboxList.length)
            }else {
              this.isIndeterminate[keyName] = checkboxList.length && checkedList.length<checkboxList.length
            }
          }
          v.children && v.children.length && this.formatFn(v._layer + 1, v.children)
          return v
        })
      },
      handleNodeClick(nodeData, nodeEvent, tar) {
        if(this.config.throwTreeNode){
          clearTimeout(this.handleNodeClickTimer)
          this.handleNodeClickTimer = setTimeout(_=>{
            this.$emit('treedatabridge',nodeData)
          },10)
        }
      },
      indeterminateChange(value,data){
        // console.log(value,data)
        let checkedCount = value.length,checkboxList = data[this.config.bindValue[data._layer]]
        checkboxList.forEach(v=>{
          if(!value.includes(v[this.config.componentConfig.keyName || 'id'])){
            v[this.config.componentConfig.stateName] = '0'
          }
        })
        this.checkAll[data[this.config.componentConfig.keyName || 'id']] = checkedCount === checkboxList.length;
        this.isIndeterminate[data[this.config.componentConfig.keyName || 'id']] = checkedCount > 0 && checkedCount < checkboxList.length;
      },
      handleCheckAllChange(val,data){
        // console.log(val,data)
        let checkboxList = data[this.config.bindValue[data._layer]]
        checkboxList.forEach(v=>{
          v[this.config.componentConfig.stateName] = val?'1':'0'
        })
        this.checkboxGroup[data[this.config.componentConfig.keyName || 'id']] = val?checkboxList.map(v=>{return v[this.config.componentConfig.keyName || 'id']}):[];
        this.isIndeterminate[data[this.config.componentConfig.keyName || 'id']] = false;
      },
      roundId(data){
        let tempData
        if(typeof data === 'string'){
          tempData = JSON.parse(data)
          Array.isArray(tempData)
            ?(tempData = tempData.map(v=>{
              v.id = internalId();
              return v
            }))
            :''
        }else {
          tempData = data.map(v=>{
            v.id = internalId();
            return v
          })
        }
        return tempData
      },


      getTreeData(){
        this.$emit('treedatabridge',this.treeData)
      }
    },
  }
</script>

<style lang="scss" rel="text/css">
  .authority-tree-component {
    position: relative;
    height:100%;
    overflow-y: scroll;
    overflow-x: auto;
    background: #ffffff;
    .custom-tree-node {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 14px;
      padding-right: 8px;
    }
  }

</style>
