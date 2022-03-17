const BASE_URL = 'http://localhost:8787'

export  const myRequest = (options) => {
  return new Promise((resolve, reject) => {
    uni.request({
      url: BASE_URL + options.url,
      method: options.method || 'GET',
      data: options.data || {},
      timeout: 4000,
      header: {
        Authorization: 'Bearer ' + uni.getStorageSync('access_token')
      }
    }).then(res => {
      if (options.callback) {
        options.callback(res.data)
        return;
      }
      if (res.data.code == 0) {
        resolve(res.data)
      } else if (res.data.code == 10001) {
        getLoginToken().then(res2 => {
          const new_token = res2.data.access_token
          myRequest({
            url: options.url,
            method: options.method || 'GET',
            callback: resolve
          })
        })
      } else {
        return uni.showToast({
          title: '接口异常'
        })
      }
    }).catch(err => {
      uni.showToast({
        title: '请求超时'
      })
      reject(err)
    })
  })
}
function getLoginToken() {
  return new Promise((resolve, reject) => {
    uni.login({
      provider: 'weixin',
      success: async function (loginRes) {
        let info = await myRequest({
          url: '/user/login',
          method: 'POST',
          data: {
            code: loginRes.code
          }
        })
        uni.setStorage({key: 'access_token', data: info.data.access_token})
        resolve(info)
      }
    })
  })
}