<template>
  <view class="content">
    <!-- 假设我需要状态栏到文字内容部分还有50px的距离 -->
    <view class="status_bar" :style="{ height: topHeight + 'px' }">
      <text class="book">默认测试1</text>
    </view>
    <!-- <view class="record">
      <view class="month">3 月·支出1222333</view>
      <view>400</view>
      <view>收入 0 | 结余 -400</view>
    </view> -->
    <view class="list">
      <view class="item" v-for="(val, key) in list" :key="key">
        <view class="day">
        {{formatDate(key)}}
          <span>hello</span>
        
        </view>
        <view class="apiece" v-for="item in val" :key="item.id">
          <view class="price">{{item.remark + '--' + item.money}}</view>
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
      list: {},
      contro: false,
      pageIndex: 1,
      aid: uni.getStorageSync('aid'),
      aid_list: []
    }
  },
  
  onLoad() {
    let str = '2022-09-08';
    str = str.replace(/-/g, '/')
    // str = Date.parse(str)
    let data = new Date(str)
    console.log('str:', data.getDate())
    // 初始请求
    this.fetchAccount()
    
    // #ifdef MP-WEIXIN
    let menuButtonInfo = uni.getMenuButtonBoundingClientRect()
    this.topHeight = menuButtonInfo.top + menuButtonInfo.height + 10
    // #endif
  },
  
  onReachBottom() {
    if (!this.contro) {
      return false
    }
    this.fetchRecord(++this.pageIndex)
  },
  
  methods: {
    // 查询账本
    async fetchAccount() {
      let res = await myRequest({
        url: '/wx/account',
        method: 'POST'
      })
      if (res.data.length < 1) {
        uni.showToast({
          title: '不存在账本'
        })
        return false
      }
      this.aid_list = res.data
      let aid = uni.getStorageSync('aid')
      if (aid) {
        let aid_arr = [];
        for (let s of res.data) {
          aid_arr.push(s.id)
        }
        if (aid_arr.indexOf(aid) < 0) {
          uni.setStorageSync('aid', res.data[0].id)
        }
      } else {
        uni.setStorageSync('aid', res.data[0].id)
      }
      this.fetchRecord()
    },
    // 查询账单
    async fetchRecord(pageIndex = 1) {
      this.contro = false
      let res = await myRequest({
        url: '/wx/record',
        method: 'POST',
        data: {
          aid: uni.getStorageSync('aid'),
          pageIndex
        }
      })
      
      res.data.map(item => {
        if (!this.list.hasOwnProperty(item.day)) {
          this.list[item.day] = []
        }
        this.list[item.day].push(item)
      })
      if (res.data.length == 10) {
        this.contro = true
      }
    },
    formatDate(str) {
      let strTime = str.replace(/-/g, '/')
      let date = new Date(strTime)
      let myyear = date.getFullYear()
      let mymonth = date.getMonth() + 1
      let myweekday = date.getDate()
   
      if (mymonth < 10) {
          mymonth = "0" + mymonth;
      }
      if (myweekday < 10) {
          myweekday = "0" + myweekday;
      }
      let info = myweekday + '日/' + mymonth + '月'
      let now = new Date()
  
      if (myyear != now.getFullYear()) {
        info = info + '/' + myyear + '年'
      }
      return info
    }
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
  .list {
    .item {
      margin: 50rpx 0;
      .day {
        height: 60rpx;
        line-height: 60rpx;
        background-color: #ffffcc;
        font-size: 30rpx;
      }
      .apiece {
        .price {
          height: 80rpx;
          line-height: 80rpx;
          font-size: 40rpx;
          margin: 20rpx 0;
        }
      }
    }
  }
}
</style>
