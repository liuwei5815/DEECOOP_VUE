<template>
  <button style="position: relative" :disabled="setState" type="button"
          :class="[setStyle,setType, isDisabled, isPlain, isCircle, setSize, setRightStyle]" @click="myclick">
    <span v-if="iconRight">{{btnName}}</span>
    <svg-icon v-if="hasIcon" :icon-class="setIcon"></svg-icon>
    <span v-if="!iconRight">{{btnName}}</span>
    <span v-if="dialog.enable">
      <component v-if="showDialog" :is="dialogData" :initData="dialog.data" :visible="visible"
                 @close-dialog="closeDialog"></component>
    </span>
  </button>
</template>

<script>


  export default {
    name: 'base-button',
    props: {
      name: {
        type: String,
        default: '查询',
        required: true
      },
      icon: {
        type: String,
        default: '',
      },
      state: {
        type: Boolean,
        default: false
      },
      type: {
        type: String,
        default: 'primary'
      },
      size: {
        type: String,
        default: 'default'
      },
      plain: {
        type: Boolean,
        default: false
      },
      circle: {
        type: Boolean,
        default: false
      },
      iconRight: {
        type: Boolean,
        default: false
      },
      dialog: {
        type: Object,
        default: function () {
          return {
            enable: false
          }
        }
      }
    },
    components: {
      'dialogPost': () => import('@/components/dialog/dialogPost'),
      'dialogBindStaff': () => import('@/components/dialog/dialogBindStaff'),
      'dialogTreeOption': () => import('@/components/dialog/dialogTreeOption'),
      'dialogOption': () => import('@/components/dialog/dialogOption'),
      'dialogTree': () => import('@/components/dialog/dialogTree'),
      'dialogImportExcel': () => import('@/components/dialog/dialogImportExcel'),
    },
    data() {
      return {
        showDialog: false,
      }
    },
    beforeCreate() {

    },
    created() {
    },
    computed: {
      btnName() {
        return this.name
      },
      setIcon() {
        return this.icon
      },
      setState() {
        return this.state ? true : false
      },
      setType() {
        return `el-button el-button--${this.type}`
      },
      isDisabled() {
        return this.state ? 'is-disabled' : ''
      },
      isPlain() {
        return this.plain ? 'is-plain' : ''
      },
      isCircle() {
        return this.circle ? 'is-circle' : ''
      },
      dialogData() {
        return this.dialog.dialogName
      },
      hasIcon() {
        return this.icon ? true : false
      },
      setStyle() {
        return (this.icon && !this.iconRight) ? 'myButtons' : ''
      },
      setRightStyle(){
        return (this.icon && this.iconRight) ? 'iconRight' : ''
      },
      setSize() {
        return `el-button--${this.size}`
      }
    },
    methods: {

      myclick() {
        if (this.dialog.enable) {
          console.log(this.dialog)
          this.showDialog = true
          this.visible = true
        } else {
          this.$emit('myclick')
        }
      },
      closeDialog(data, temp) {
        this.$emit('myclick', data, temp)
        this.showDialog = false
      }
    }
  }
</script>
