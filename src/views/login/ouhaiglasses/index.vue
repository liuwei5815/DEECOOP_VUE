<template>
	<div class="login-container">
    <div class="clearfix" style="float: left;width: 50%;height: 100%;position: relative;">
      <div style="position: absolute;top: 50%;left: 50%;transform: translate(-50%,-50%);width: 70%;height: auto;">
        <img src="@/assets/ouhaiglasses.png" style="width: 100%;height: auto;">
      </div>
    </div>
    <div class="clearfix" style="float: left;width: 50%;height: 100%;position: relative;background-color:rgb(191,191,191);">
      <div style="position: absolute;top: 50%;left: 50%;transform: translate(-50%,-50%);width: 100%;height: 655px;">
        <div style="height: 100%;position: relative;">
          <p style="text-align: center;font-size: 5vh;font-weight: 600;letter-spacing: 5px;">瓯海区眼镜企业</p>
          <p style="text-align: center;font-size: 5vh;font-weight: 600;letter-spacing: 5px;">运营管理系统</p>
          <el-form class="login-form" autoComplete="on" :model="loginForm" :rules="loginRules" ref="loginForm" label-position="left" status-icon>
            <el-form-item prop="username">
				<span class="svg-container svg-container_login">
          <svg-icon icon-class="user" />
        </span>
              <el-input name="username" type="text" clearable v-model="loginForm.username" autoComplete="on" placeholder="请输入用户名" />
            </el-form-item>
            <el-form-item prop="password">
				<span class="svg-container">
          <svg-icon icon-class="password"></svg-icon>
        </span>
              <el-input name="password" :type="pwdType" clearable v-model="loginForm.password" autoComplete="on" placeholder="请输入密码"></el-input>
              <span class="show-pwd" @click="showPwd" :title="$t('base.showPwd')"><svg-icon v-show="pwdType" icon-class="eye" /><svg-icon v-show="!pwdType" icon-class="eye_open" /></span>
            </el-form-item>
            <el-form-item class="loginCss" prop="authcode">
              <el-input style="width:60%;border: 2px solid rgba(217, 217, 217, 1);border-radius: 5px;" type="text" clearable v-model="loginForm.authcode" @keyup.enter.native="handleLogin" name="authcode" placeholder="请输入右侧验证码"></el-input>
              <div id="authcodeBox">
                <div id="canvasBox">
                  <canvas v-show="authcode" id="canvas" width="83" height="32" @click="changeCode" title="点击更换验证码"></canvas>
                  <div v-show="!authcode" style="height: 100%;text-align: center;background-color: #e0e0e0;cursor: pointer;" @click="changeCode">获取验证码</div>
                </div>
              </div>
            </el-form-item>
            <el-form-item class="loginCss">
              <el-button type="primary" style="width:100%;" :loading="loading" @click.native.prevent="handleLogin" :disabled="btnState">
                登 录
              </el-button>
            </el-form-item>
            <div class="tips">
              <el-checkbox v-model="checked" style="color: #fff;">记住密码</el-checkbox>
            </div>
          </el-form>
        </div>
      </div>
    </div>
	</div>
</template>

<script>
  import mixin from '../mixins'
  export default {
    name: 'login',
    mixins: [mixin],
  }
</script>

<style rel="stylesheet/scss" lang="scss">
	$bg:#2d3a4b;
	$light_gray:#fff;
	/* reset element-ui css */

	.login-container {
		.el-input {
			display: inline-block;
			height: 40px;
			width: 82%;
			input {
				background: transparent;
				border: 0px;
				-webkit-appearance: none;
				border-radius: 0px;
				padding: 10px 10px 10px 15px;
				color: $light_gray;
				height: 40px;
				&:-webkit-autofill {
					box-shadow: 0 0 0px 1000px $bg inset !important;
					-webkit-box-shadow: 0 0 0px 1000px $bg inset !important;
					-webkit-text-fill-color: #fff !important;
				}
			}
      input::placeholder{
        color:#fff;
      }
		}
		.el-form-item {
			border: 2px solid rgba(217, 217, 217, 1);
			/*background: rgba(0, 0, 0, 0.1);*/
			border-radius: 5px;
			color: #454545;
		}
	}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
	$bg:#fff;
	$dark_gray:#fff;
	$light_gray:#199ED8;
	.login-container {
		position: fixed;
		height: 100%;
		width: 100%;
		background-color: $bg;
		.login-form {
			position: absolute;
			left: 0;
			right: 0;
			width: 370px;
			padding: 35px 35px 15px 35px;
			margin: 0 auto;
		}
		.tips {
			font-size: 14px;
			margin-bottom: 10px;
			text-align: right;
		}
		.svg-container {
			padding: 6px 5px 6px 15px;
			color: $dark_gray;
			vertical-align: middle;
			width: 30px;
			display: inline-block;
			&_login {
				font-size: 20px;
			}
		}
		.title {
			font-size: 26px;
			font-weight: 400;
			color: $light_gray;
			margin: 0px auto 40px auto;
			text-align: center;
			font-weight: bold;
		}
		.show-pwd {
			position: absolute;
			right: 10px;
			top: 7px;
			font-size: 16px;
			color: $dark_gray;
			cursor: pointer;
			user-select: none;
		}
		.loginCss {
			border: none;
		}
		#authcodeBox {
			position: absolute;
			top: 0;
			right: 0;
			width: 40%;
			height: 98%;
			text-align: center;
			>#canvasBox {
				position: absolute;
				top: 50%;
				left: 50%;
				transform: translate(-50%, -50%);
				width: 80%;
				height: 32px;
				background-color: #e0e0e0;
				>#canvas {
					width: 100%;
					height: 32px;
					cursor: pointer;
				}
			}
		}
	}
</style>
