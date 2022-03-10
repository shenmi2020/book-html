<template>
  <view class="content">
    <!-- 假设我需要状态栏到文字内容部分还有50px的距离 -->
    <view class="status_bar" :style="{ height: '56px' }">
      <text class="">默认</text>
    </view>
    <view> 状态栏下的文字1 </view>
    <view class="text-area">
      <text class="title">{{ title }}</text>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      height: null, //获取的状态栏高度
      title: "Hello",
    };
  },
  onLoad() {
    var _this = this;
    // 获取手机状态栏高度
    uni.getSystemInfo({
      success: function (data) {
        // 将其赋值给this
        _this.height = data.statusBarHeight;
      },
    })
    const res = wx.getMenuButtonBoundingClientRect()
    console.log('res:', res)
  },
  methods: {},
};
</script>

<style>
.status_bar {
  width: 100%;
  background: #007aff;
  position: relative;
}
/* 调整状态栏标题的位置 */
text {
  position: absolute;
  margin: auto;
  bottom: 10px;
  left: 0;
  right: 0;
}
</style>
