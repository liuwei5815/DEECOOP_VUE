<template>
  <el-dialog v-el-drag-dialog title="修改密码" :visible.sync="isVisible" @close="dialogClose" append-to-body width="400px">
    <el-form :rules="rules" ref="temp" :model="temp" label-position="right" label-width="90px"
             style='box-sizing:border-box;padding:20px;width: 400px;margin: auto;'>
      <!--账号-->
      <el-form-item label="账号:" prop="userCode">
        <el-input v-model="temp.userCode" disabled></el-input>
      </el-form-item>
      <!--用户名称-->
      <el-form-item label="用户名称:" prop="userName">
        <el-input v-model="temp.userName" disabled></el-input>
      </el-form-item>
      <!--密码-->
      <el-form-item label="原密码:" prop="oldPassword">
        <el-input v-model="temp.oldPassword" type="password" ></el-input>
      </el-form-item>
      <!--密码-->
      <el-form-item label="新密码:" prop="firstPassword">
        <el-input v-model="temp.firstPassword" type="password" ></el-input>
      </el-form-item>
      <!--密码-->
      <el-form-item label="确认密码:" prop="confirmPassword">
        <el-input v-model="temp.confirmPassword" type="password" ></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="updatePw">保 存</el-button>
      <el-button @click="isVisible = false">关 闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
    import { mapGetters, mapMutations } from 'vuex'
    import { changePassWord } from '@/api/userLogin'

    export default {
      name: "dialog-change-pw",
      props:['visible'],
      data() {
        var validatePass = (rule, value, callback) => {
          if (value === '') {
            callback(new Error('请输入新密码'));
          } else {
            if (this.temp.confirmPassword !== '') {
              this.$refs.temp.validateField('confirmPassword');
            }
            callback();
          }
        };
        var validatePass2 = (rule, value, callback) => {
          if (value === '') {
            callback(new Error('请再次输入新密码'));
          } else if (value !== this.temp.firstPassword) {
            callback(new Error('两次输入密码不一致!'));
          } else {
            callback();
          }
        };
        return {
          isVisible: false,
          temp: {
            userCode:'',
            userName:'',
            oldPassword: '',
            firstPassword:'',
            confirmPassword:''
          },
          rules: {
            oldPassword: [
              { required: true, message: '请输入原密码', trigger: 'blur' }
            ],
            firstPassword: [
              { required: true, validator: validatePass, trigger: 'blur' }
            ],
            confirmPassword: [
              { required: true, validator: validatePass2, trigger: 'blur' }
            ]
          }
        }
      },
      created(){
        this.isVisible = this.visible
        if(!this.userInfo){
          this.SET_USERINFO(this.$storage.get('userInfo'))
        }
        this.temp = {
          userCode:this.userInfo.userCode,
          userName:this.userInfo.userName,
          oldPassword: '',
          firstPassword:'',
          confirmPassword:''
        }
      },
      computed: {
        ...mapGetters([
          'userInfo'
        ])
      },
      methods: {
        dialogClose(){
          this.$emit('close-dialog')
        },
        updatePw() {
          const that = this
          that.$refs.temp.validate((valid)=>{
            if(valid){
              const data = {
                userID: that.userInfo.userId,
                passwordOld: that.temp.oldPassword,
                passwordNew: that.temp.firstPassword
              }
              that.httpChangePassWord(data)
            }
          })
        },
        ...mapMutations(['SET_USERINFO']),
        httpChangePassWord(data) {
          changePassWord(data).then(res => {
            console.log(res)
            if(res.code === 0){
              this.$notify({
                title: '成功',
                message: res.msg || res.message,
                type: 'success',
                duration: 1000
              })
            }
            this.isVisible = false
            this.$loading().close()
          }).catch(err => {
            console.log(err)
          })
        }
      }

    }
</script>

<style scoped>

</style>
