<template>
  <div class="tableFilter" :style="{height: setHeight+'px'}">
    <div class="msg" @click="viewSwitch" title="列开关">
      <svg-icon icon-class="tableSetting"></svg-icon>
    </div>
    <div class="checkView" :class="{setWidth:widthSwitch}" ref="checkBoxView">
      <div style="position: relative;">
        <div style="position: absolute;top: 0;left: 0;">
          <el-checkbox-group
            v-model="checkList"
            size="mini"
            @change="checkedList">
            <el-checkbox
              v-for="(item,index) in setHeaderList"
              :key="item.prop"
              :label="item.label"
              :checked="setChecked(item)"
              v-auto-width="index"></el-checkbox>
          </el-checkbox-group>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
    export default {
      name: "table-filter",
      props: {
        headerList:{
          type: Array,
          default(){
            return []
          }
        },
        tableSwitchState:{
          type: Array,
          default(){
            return []
          }
        },
        storeId: {
          type: String,
          default: ''
        },
        componentId: {
          type: String,
          default: ''
        },
      },
      directives: {
        'auto-width':{
          inserted(el,binding,vnode){
            vnode.context.widthList[binding.value] = el.clientWidth
          }
        },
      },
      data () {
        return {
          checkList: [],
          widthSwitch: false,
          checkViewWidth: 0,
          checkViewHeight: 0,
          checkViewWidthTimer: '',
          widthList: [],
          userConfig: '',
          storeKey: '',
          userId: '',
          localStoreKey:'',
          useStore: false,
          tempList: ''
        };
      },
      created(){
        console.log(this.headerList)
        // this.storeKey = 'tableFilter'+this.storeId
        // this.userId = this.$storage.get('userInfo').userId || ''
        // this.tempList = this.localStore(this.componentId,this.storeKey,this.userId)
        // this.$emit('checked-list',this.tempList)
      },
      computed:{
        setHeight(){
          if(this.checkViewHeight&&this.widthSwitch){
            this.$emit('checked-height',this.checkViewHeight)
            return this.checkViewHeight
          }else {
            this.$emit('checked-height',20)
            return 20
          }
        },
        setHeaderList(){
          return this.headerList.filter(v=>{
            // console.log(!v.component && !v.slot,v)
            return !v.component && !v.slot
          })
        }
      },
      methods:{
        checkedList(list){
          this.$emit('checked-list',list)
        },
        viewSwitch(){
          this.widthSwitch = !this.widthSwitch
        },
        localStore(componentId,storeKey,userId){
          this.localStoreKey = '_' + componentId + storeKey + userId
          const userConfig = JSON.parse(localStorage.getItem(this.localStoreKey)) || ''
          return userConfig
        },
        setChecked(item){
          return this.tableSwitchState.includes(item.label)
        }
      },
      watch: {
        widthSwitch(){
          if(this.widthSwitch && !this.checkViewHeight){
            clearTimeout(this.checkViewWidthTimer)
            this.checkViewWidthTimer = setTimeout(_=>{
              let width = 0
              this.widthList.forEach(v=>{
                if(v-0){
                  width+=(v+15)
                }
              })
              this.checkViewHeight = Math.ceil(width/this.$refs.checkBoxView.clientWidth)*20
            },200)
          }
        },
        // headerList:{
        //   deep: true,
        //   handler(n,o){
        //     console.log(n)
        //   }
        // }
      }
    }
</script>

<style scoped lang="scss" rel="text/css">
  .tableFilter {
    overflow: hidden;
    position: relative;
    .msg {
      color: #199ed8;
      position: absolute;
      top: 50%;
      left: 0;
      transform: translate(0,-50%);
    }
    .checkView {
      position: absolute;
      top: 0;
      left: 20px;
      height: 100%;
      width: 0;
      opacity: 0;
      transition: width 0.2s linear,opacity 0.2s linear;
      overflow-y: auto;
    }
    .setWidth {
      width: calc(100% - 20px);
      opacity: 1;
    }
    .el-checkbox{
      margin-left: 15px;
    }
  }
</style>
