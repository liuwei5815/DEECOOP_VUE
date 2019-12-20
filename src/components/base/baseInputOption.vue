<template>
  <div class="baseInput">
    <el-input :value="value" :placeholder="placeholder?placeholder:$t('base.inputKeyword')" :disabled="setDisabled" :clearable="setClearable">
      <el-button slot="append" icon="el-icon-search" @click="myclick"></el-button>
    </el-input>

    <component v-if="showDialog" :is="dialogData" :initData="dialog.data" :visible="visible" @close-dialog="closeDialog"></component>

  </div>

</template>

<script>


  export default {
    name: "base-input-option",
    props: {
      placeholder: {
        type: String,
        default: '',
      },
      readonly: {
        type: Boolean,
        default: true
      },
      disabled: {
        type: Boolean,
        default: false
      },
      clearable: {
        type: Boolean,
        default: true
      },
      // data: {
      //   type: Object,
      //   default: function () {
      //     return {}
      //   }
      // },
      value: {
        type: [String, Number, Boolean, Date]
      },
      dialog: {
        type: Object,
        default: function () {
          return {
          }
        }
      }

    },
    components: {
      'dialogTreeOption': () => import('@/components/dialog/dialogTreeOption'),
      'dialogOption': () => import('@/components/dialog/dialogOption'),
      'dialogTree': () => import('@/components/dialog/dialogTree'),
    },
    data(){
      return {
        getStoreInput: '',
        showDialog: false,
        visible: false
      }
    },
    mounted() {

    },
    created() {
      // console.log("222"+this.dialog)
    },
    computed: {
      setDisabled() {
        return this.disabled
      },
      setClearable() {
        return this.clearable
      },
      dialogData() {
        return this.dialog.dialogName
      }
    },
    methods: {
      myclick() {
        // console.log("111"+this.dialog)
        this.showDialog = true
        this.visible = true
        // this.$emit('click')
      },
      closeDialog(data,temp,state) {
        this.showDialog = false
        this.$emit('callback',data,temp,state)
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
