const BASE_URL = 'http://127.0.0.1:8787'

export  const myRequest = (options) => {
  return new Promise((resolve, reject) => {
    uni.request({
      url: BASE_URL + options.url,
      method: options.method || 'GET',
      data: options.data || {},
      timeout: 4000
    }).then(res => {
      if (res.data.code !== 0) {
        return uni.showToast({
          title: '接口异常'
        })
      }
      resolve(res.data)
    }).catch(err => {
      uni.showToast({
        title: '请求超时'
      })
      reject(err)
    })
  })
}
