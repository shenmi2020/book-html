const BASE_URL = 'http://localhost:8787'
// const token = uni.getStorageSync('access_token')

export  const myRequest = (options) => {
  
  return new Promise((resolve, reject) => {
    console.log('call:', options.callback)
    uni.request({
      url: BASE_URL + options.url,
      method: options.method || 'GET',
      data: options.data || {},
      timeout: 4000,
      header: {
        Authorization: 'Bearer ' + uni.getStorageSync('access_token')
      }
    }).then(res => {
      console.log('op-back')
      if (options.callback) {
        options.callback(res.data)
        return;
      }
      if (res.data.code == 0) {
        console.log('res', res)
        resolve(res.data)
      } else if (res.data.code == 10001) {
        getLoginToken().then(res2 => {
          console.log('get-then:', res2, BASE_URL + options.url, options.method)
          const new_token = res2.data.access_token
          myRequest({
            url: options.url,
            method: options.method || 'GET',
            callback: resolve
          })
          // return uni.request({
          //   url: BASE_URL + options.url,
          //   method: options.method || 'GET',
          //   header: {
          //     Authorization: 'Bearer ' + new_token
          //   }
          // })
        })
      } else {
        return uni.showToast({
          title: '接口异常'
        })
      }
      // if (res.data.code !== 0) {
      //   return uni.showToast({
      //     title: '接口异常'
      //   })
      // }
      
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
        console.log('login', loginRes)
        let info = await myRequest({
          url: '/user/login',
          method: 'POST',
          data: {
            code: loginRes.code
          }
        })
        uni.setStorage({key: 'access_token', data: info.data.access_token})
        console.log('upload12:', info)
        resolve(info)
      }
    })
  })
}