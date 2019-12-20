export default {
  props: {
    configs:{
      type: Object,
      default(){
        return null
      },
    },
    cardData:{
      type: Object,
      default(){
        return null
      },
    },
  },
  computed:{
  },
  data(){
    return {
      loopTime: 600000,
    }
  },
  watch:{
    cardData(){
      console.log(this.cardData)
      this[`${this.configs.name}Loading`] = true
      this.httpRequests()
    }
  },
}
