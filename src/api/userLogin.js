import request from '@/utils/request'

export function login(userCode, userPassword, securityCode, securityCodeKey) {
  return request({
    url: '/system/userLogin/loginIn',
    method: 'post',
    data: {
      userCode,
      userPassword,
      securityCode,
      securityCodeKey,
      loginType: 'web'
    }
  })
}

export function changePassWord(data) {
  return request({
    url: '/system/userLogin/changePassWord',
    method: 'post',
    data: data
  })
}


export function logout(token) {
	// console.log(token)
  return request({
    url: '/system/userLogin/loginOut',
    method: 'post',
    data: {
    	sessionID: token
    }
  })
}

export function createSecurityCode() {
	return request({
		url: '/system/userLogin/createSecurityCode',
		method: 'post',
		data: {}
	})
}


