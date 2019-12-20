<template>
  <div class="baseInput">
    <el-input :value="value" :placeholder="placeholder?placeholder:$t('base.inputKeyword')" :disabled="setDisabled" :clearable="setClearable">
      <el-button slot="append" icon="el-icon-search" @click="myclick"></el-button>
    </el-input>
    <component v-if="showDialog" :is="dialogProp" :initData="dialogData" :visible="visible" @close-dialog="closeDialog"></component>
  </div>

</template>

<script>
    export default {
      name: "base-input",
      props: {
        placeholder: {
          type: String,
          default: '',
        },
        disabled: {
          type: Boolean,
          default: true
        },
        clearable: {
          type: Boolean,
          default: true
        },
        dialogConfig: {
          type: Object,
          default: function () {
            return {}
          }
        },
        value: {
          type: [String, Number, Boolean, Date]
        }

      },
      components: {
        'dictionary': ()=> import('@/components/dialog/dictionary'),
        'dialogPost': ()=> import('@/components/dialog/dialogPost'),
        'dialogBindStaff': () => import('@/components/dialog/dialogBindStaff')
      },
      data(){
        return {
          showDialog: false,
          visible: false
        }
      },
      mounted() {

      },
      computed: {
        setDisabled() {
          return this.disabled
        },
        setClearable() {
          return this.clearable
        },
        dialogProp() {
          return this.dialogConfig.name?this.dialogConfig.name:false
        },
        dialogData() {
          return this.dialogConfig.data?this.dialogConfig.data:{}
        }
      },
      methods: {
        myclick() {
          this.showDialog = true
          this.visible = true
        },
        closeDialog(data) {
          this.visible = false
          this.showDialog = false
          this.$emit('user-select',data)
        }
      },
      watch: {
        value: function () {
          console.log(this.value)
        }
      }
    }
</script>

<style scoped>

</style>
