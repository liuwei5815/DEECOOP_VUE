<template>
  <div class="dynaForm" style="height: 100%;position: relative;box-sizing: border-box;" :style="{paddingTop:btnsBoxHeight+'px'}">
    <div ref="btnsBox" v-if="hideBtn" class="dynaFormBtn" style="position: absolute;top: 0;right: 0;">
      <el-button type="text" size="mini" icon="el-icon-plus" @click="addAttr">自定义属性</el-button>
    </div>
    <div class="formBox" style="height: 100%;overflow-y: auto;">
      <el-form ref="resultForm" label-position="left" label-width="75px" style="padding: 5px">
        <el-form-item v-for="(item,index) in formList" :label="item.key" :key="item.key">
          <el-input v-model="item.value" style="width: calc(100% - 27px);"placeholder="请输入" clearable></el-input><el-button type="text" style="padding: 5px;" icon="el-icon-remove" title="删除该项" @click.prevent="removeDomain(item,index)"></el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-dialog v-el-drag-dialog title="自定义属性" :visible.sync="isVisible" :close-on-click-modal="onModal" :close-on-press-escape="onEscape" @open="dialogOpen" width="400px" append-to-body>
      <div class="addContent" style="box-sizing: border-box;padding: 5px 10px;">
        <div>
          <template v-for="(item,index) in tempFormList">
            <el-row style="position:relative;border: 1px solid #E4E4E4;border-radius: 4px;margin-bottom: 10px;">
              <el-form :ref="'tempForm'+index" :model="item" label-position="left" label-width="75px" style="width: 90%;padding: 5px">
                <el-form-item label="属性名称:" prop="key" :rules="itemRule" style="margin-bottom: 20px">
                  <el-input v-model="item.key" placeholder="请输入属性名" @blur="checkInput(item,index)" clearable></el-input>
                </el-form-item>
                <el-form-item label="属性值:" style="margin-bottom: 0">
                  <el-input v-model="item.value" placeholder="请输入属性值" clearable></el-input>
                </el-form-item>
              </el-form>
              <div style="position: absolute;right: 8px;top: 50%;transform: translate(0,-50%);">
                <el-button type="text" style="padding: 5px;" icon="el-icon-remove" title="删除该项" @click="deleteContent(item,index)"></el-button>
              </div>
            </el-row>
          </template>

        </div>
        <div ref="dialogBtn" style="text-align: center">
          <el-button style="padding: 5px;width: 100%;border: 1px dashed #E4E4E4;" type="text" size="medium" icon="el-icon-plus" @click="addContent">新增属性</el-button>
        </div>
      </div>
      <div slot="footer" class="dialog-footer" style="text-align: center;padding-bottom: 10px">
        <el-button type="primary" :disabled="saveBtnState" @click="save">保存</el-button>
        <el-button @click="isVisible = false">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

    export default {
      components: {},
      name: "dyna-form",
      props: {
        config: {
          type: Object,
          default: function () {
            return {}
          }
        },
        formTemp: {
          type: Array,
          default: function () {
            return []
          }
        },
        props: {
          type: Object,
          default: function () {
            return {
              key: 'key',
              value: 'value'
            }
          }
        }
      },
      data(){
        const validate = (rule, value, callback) => {
          if (value === '') {
            this.saveBtnState = true
            callback(new Error('请定义属性名称'));
          } else if (this.deDuplication(value)) {
            this.saveBtnState = true
            callback(new Error('有重复的属性名称'));
          } else {
            callback();
          }
        };
        return {
          btnsBoxHeight: 0,
          addFormData: [],
          isVisible: false,
          saveBtnState: true,
          tempFormList: [
            {key: '',value: ''}
          ],
          itemRule: [{ validator: validate, trigger: 'blur' }],
          formData: [],
        }
      },
      created(){
        this.formData = this.renameAttr(this.formTemp,true)
      },
      mounted(){
        this.$nextTick(function () {
          this.btnsBoxHeight = this.hideBtn?this.$refs.btnsBox.clientHeight:0
        })
      },
      computed: {
        hideBtn(){
          return this.config.hideBtn?false:true
        },
        formList() {
          return this.formData.concat(this.addFormData)
        },
        onModal() {
          return false
        },
        onEscape() {
          return false
        },
      },
      methods: {
        renameAttr(list,state){
          if(this.props.key === 'key' && this.props.value === 'value'){
            return list
          }else {
            const {key,value} = this.props,tempArr = []
            if(state){
              list.forEach((item,index) => {
                tempArr.push({'key':item[key?key:'key'],'value':item[value?value:'value']})
              })
              return tempArr
            }else {
              this.formList.forEach((item,index) => {
                tempArr.push({[key?key:'key']:item.key,[value?value:'value']:item.value})
              })
              return tempArr
            }
          }
        },
        addAttr(){
          this.tempFormList = [{key: '',value: ''}]
          this.isVisible = true
        },
        removeDomain(data,index){
          let state = true
          this.formData.forEach((item,ind) => {
            if(item.key === data.key){
              state = false
              this.formData.splice(ind,1)
            }
          })
          if(state){
            this.addFormData.forEach((item,ind) => {
              if(item.key === data.key){
                this.addFormData.splice(ind,1)
              }
            })
          }

        },
        dialogOpen(){
          this.saveBtnState = true
          this.$nextTick(()=>{
            this.tempFormList.forEach((item,index) => {
              this.$refs['tempForm'+index][0].clearValidate()
            })
          })

        },
        getFormList(){
          this.$emit('sent-list',this.renameAttr(this.formList))
        },
        save(){
          this.addFormData = this.addFormData.concat(this.tempFormList)
          this.isVisible = false
        },
        addContent() {
          const obj = {
            key: '',
            value: ''
          }
          this.tempFormList.push(obj)
          this.saveBtnState = true
        },
        deleteContent(item,index) {
          this.tempFormList.splice(index,1)
          //this.$refs['tempForm'+index][0].clearValidate()
          this.switchSaveBtnState()

        },
        deDuplication(key){
          let state = 0
          this.tempFormList.forEach(item => {
            if(item.key === key){
              state++
            }
          })
          this.formList.forEach(item => {
            if(item.key === key){
              state++
            }
          })
          return state===1?false:true
        },
        checkInput() {
          this.switchSaveBtnState()
        },
        switchSaveBtnState() {
          this.$nextTick(() => {
            let state = 0,throttle = true
            this.tempFormList.forEach((item,index) => {
              if(throttle){
                this.$refs['tempForm'+index][0].validate( result => {
                  if(!result){
                    state++
                    throttle = false
                  }
                })
              }else {
                this.$refs['tempForm'+index][0].validate( _ => {})
              }
            })
            this.saveBtnState = this.tempFormList.length?(state?true:false):true
          })
        },
      },
    }
</script>

<style lang="scss" rel="text/css">
  .dynaForm {
    .el-button {
      padding: 5px;
    }
  }

</style>
