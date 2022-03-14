<template>
  <view class="content">
    <!-- 假设我需要状态栏到文字内容部分还有50px的距离 -->
    <view class="status_bar" :style="{ height: topHeight + 'px' }">
      <text class="book">默认测试</text>
    </view>
    <view class="record">
      <view class="month">3 月·支出</view>
    </view>
    
  </view>
</template>

<script>
export default {
  data() {
    return {
      topHeight: 56,
      title: "Hello",
    };
  },
  onLoad() {
    // #ifdef MP-WEIXIN
    let menuButtonInfo = uni.getMenuButtonBoundingClientRect()
    this.topHeight = menuButtonInfo.top + menuButtonInfo.height + 10
    // #endif
    
    console.log('res:', menuButtonInfo)
  },
  methods: {},
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
    .month {
      font-size: 30rpx;
    }
  }
}
</style>
