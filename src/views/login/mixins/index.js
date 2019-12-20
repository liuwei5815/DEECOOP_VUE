import { isvalidUsername } from '@/utils/validate'
import { mapGetters } from 'vuex'
import mystorage from '@/utils/storage'
export default {
  data() {
    const validateUsername = (rule, value, callback) => {
      if(!value.trim()) {
        callback(new Error('请输入正确的用户名'))
      } else {
        callback()
      }
    }
    const validatePass = (rule, value, callback) => {
      if(value.length < 0) {
        callback(new Error('密码不能小于5位'))
      } else {
        callback()
      }
    }
    const validateAuth = (rule, value, callback) => {
      const userInput = value.toUpperCase()
      if(!userInput || !this.authcode) {
        callback(new Error('验证码不匹配'))
        return
      }
      if(userInput !== this.authcode) {
        callback(new Error('验证码错误'))
      } else {
        callback()
      }

    }
    //  const loding = Loading.service({
    //  	lock: true,
    //    text: '云上企业',
    //    background: 'rgba(255, 255, 255, 0.7)'
    //  })
    return {
      loginForm: {
        username: '',
        password: '',
        authcode: ''
      },
      loginRules: {
        username: [{
          required: true,
          trigger: 'blur',
          validator: validateUsername
        }],
        password: [{
          required: true,
          trigger: 'blur',
          validator: validatePass
        }],
        authcode: [{
          required: true,
          trigger: 'blur',
          validator: validateAuth
        }]
      },
      loading: false,
      pwdType: 'password',
      checked: false,
      lading: null,
      codeTimer: '',
    }
  },
  created() {
    const that = this
    const authData = mystorage.localGet('auth') || {}
    //console.log(authData)
    if(authData.password) {
      that.loginForm.username = authData.username
      that.loginForm.password = authData.password
      that.checked = true
    }
    that.$loading()
    that.changeCode()
    that.$loading({}).close()
    // that.$store.dispatch('CreateSecurityCode', {}).then(() => {
    // 	that.drawPic(that.authcode)
    // 	//that.tempCode = that.$store.state.user.securityCode
    // 	that.$loading({}).close()
    // }).catch(() => {
    // that.$loading({}).close()
    // })

  },
  mounted() {
    const that = this
    // that.changeCode()
    //console.log(this.$envName)
  },
  methods: {
    //	...mapActions([
    //		'CreateSecurityCode'
    //	]),
    showPwd() {
      if(this.pwdType === 'password') {
        this.pwdType = ''
      } else {
        this.pwdType = 'password'
      }
    },
    handleLogin() {
      const that = this
      that.savePwd(that.checked)
      that.$refs.loginForm.validate(valid => {
        if(valid) {
          that.loading = true
          that.$store.dispatch('Login', this.loginForm).then((response) => {
//							that.$store.dispatch('GetTreeMeuns').then((response) => {
//								console.log(response)
//								this.loading = false
//								this.$router.push({
//									path: '/home'
//								})
//							}).catch(error => {
//								console.log(error)
//							})
            clearTimeout(that.codeTimer)
            that.loading = false
            that.$store.dispatch('tagsView/delAllViews').then(({ visitedViews }) => {
              //console.log(visitedViews)
            })
            that.$router.push({
              path: '/home'
            })


          }).catch(() => {
            that.loading = false
            that.$loading({}).close()
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    savePwd(state) {
      if(state) {
        const data = {
          username: this.loginForm.username,
          password: this.loginForm.password
        }
        console.log(data)
        mystorage.localSet('auth', data)
      } else {
        mystorage.localRemove('auth')
      }
    },
    changeCode() {
      const that = this
      that.$store.dispatch('CreateSecurityCode', {}).then(() => {
        that.$refs.loginForm && that.$refs.loginForm.clearValidate && that.$refs.loginForm.clearValidate()
        that.loginForm.authcode = ''
        that.drawPic(that.authcode)
        //that.tempCode = that.$store.state.user.securityCode
        // that.$loading({}).close()
        clearTimeout(that.codeTimer)
        that.codeTimer = setTimeout(_=>{
          that.changeCode()
        },27000)
      }).catch(() => {
        that.$refs.loginForm && that.$refs.loginForm.clearValidate && that.$refs.loginForm.clearValidate()
        clearTimeout(that.codeTimer)
        that.codeTimer = setTimeout(_=>{
          that.changeCode()
        },27000)
        // that.$loading({}).close()
      })
    },
    drawPic(txt) {
      const canvas = document.getElementById("canvas")
      const width = canvas.width
      const height = canvas.height
      const ctx = canvas.getContext('2d')
      ctx.textBaseline = 'bottom'

      /**生成一个随机数**/
      function randomNum(min, max) {
        return Math.floor(Math.random() * (max - min) + min)
      }

      /**生成一个随机色**/
      function randomColor(min, max) {
        var r = randomNum(min, max)
        var g = randomNum(min, max)
        var b = randomNum(min, max)
        return "rgb(" + r + "," + g + "," + b + ")"
      }

      /**绘制背景色**/
      ctx.fillStyle = randomColor(180, 240); //颜色若太深可能导致看不清
      ctx.fillRect(0, 0, width, height);
      /**绘制文字**/
      const str = txt;
      for(let i = 0; i < 4; i++) {
        const txt = str[i];
        ctx.fillStyle = randomColor(50, 160); //随机生成字体颜色
        ctx.font = randomNum(18, 30) + 'px SimHei'; //随机生成字体大小
        let x = 5 + i * 20; //2 25 45 65
        let y = randomNum(25, 30);
        let deg = randomNum(-30, 30);
        //修改坐标原点和旋转角度
        ctx.translate(x, y);
        ctx.rotate(deg * Math.PI / 180);
        ctx.fillText(txt, 0, 0);
        //恢复坐标原点和旋转角度
        ctx.rotate(-deg * Math.PI / 180);
        ctx.translate(-x, -y);
      }
      /**绘制干扰线**/
      // for(let i = 0; i < 8; i++) {
      // 	ctx.strokeStyle = randomColor(40, 180);
      // 	ctx.beginPath();
      // 	ctx.moveTo(randomNum(0, width), randomNum(0, height));
      // 	ctx.lineTo(randomNum(0, width), randomNum(0, height));
      // 	ctx.stroke();
      // }
      /**绘制干扰点**/
      //				for(let i = 0; i < 100; i++) {
      //					ctx.fillStyle = randomColor(0, 255);
      //					ctx.beginPath();
      //					ctx.arc(randomNum(0, width), randomNum(0, height), 1, 0, 2 * Math.PI);
      //					ctx.fill();
      //				}
    }
  },
  computed: {
    ...mapGetters([
      'authcode'
    ]),
    btnState() {
      if(this.loginForm.username && this.loginForm.password && this.loginForm.authcode) {
        return false
      } else {
        return true
      }
    }
  },
  watch: {
    checked(){
      if(!this.checked){
        mystorage.localRemove('auth')
      }
    },
  }
}
