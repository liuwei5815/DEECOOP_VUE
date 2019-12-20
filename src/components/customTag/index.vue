<script>
  export default {
    name: "custom-tag",
    props: {
      type:{
        type: String,
        default: ''
      },
      closable: {
        type: Boolean,
        default: false
      },
      'disable-transitions': {
        type: Boolean,
        default: false
      },
      hit: {
        type: Boolean,
        default: false
      },
      color:{
        type: String,
        default: ''
      },
      size:{
        type: String,
        default: ''
      },
      effect:{
        type: String,
        default: ''
      },
    },
    render(h){
      return
    },
  }
</script>

<style scoped lang="scss" rel="text/css">
  @import "./index";



</style>
