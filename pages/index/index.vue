<template>
  <view class="content">
    <!-- 假设我需要状态栏到文字内容部分还有50px的距离 -->
    <view class="status_bar" :style="{ height: topHeight + 'px' }">
      <text class="book">默认测试</text>
    </view>
    <view class="record">
      <view class="month">3 月·支出1222333</view>
      <view>400</view>
      <view>收入 0 | 结余 -400</view>
    </view>
    <view class="list">
      <view class="item">
        <view>3月10日2022</view>
        <view class="">
          
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { myRequest } from '@/common/request.js'
  
export default {
  data() {
    return {
      topHeight: 56,
      title: "Hello",
    };
  },
  
  onLoad() {
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
        console.log('upload12:', info)
      }
    })
    // #ifdef MP-WEIXIN
    let menuButtonInfo = uni.getMenuButtonBoundingClientRect()
    this.topHeight = menuButtonInfo.top + menuButtonInfo.height + 10
    // #endif
  },
  
  methods: {
    
  },
};
</script>

<style lang="scss">
.content {
  .status_bar {
    width: 100%;
    background: #007aff;
    position: relative;
    .book {
      position: absolute;
      bottom: 12px;
      left: 10px;
      font-size: 15px;
    }
  }
  .record {
    background-color: #cccccc;
    .month {
      font-size: 30rpx;
    }
  }
}
</style>
