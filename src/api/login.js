import request from '@/utils/request'

export function login(apollo, app, captcha, uuid) {
  return request({
    url: 'sys/login',
    method: 'post',
    data: {
      apollo,
      app,
      captcha,
      uuid
    }
  })
}

export function getInfo() {
  return request({
    url: 'auth/info',
    method: 'get'
  })
}

export function getCodeImg() {
  return request({
    url: 'captcha.jpg',
    method: 'get'
  })
}
