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
    <scroll-view class="list" scroll-y="true" :style="{ height: listHeight + 'px' }" 
      lower-threshold="50" @scrolltolower="lowerRecord">
      <view class="item" v-for="(val, key) in list" :key="key">
        <view class="day-info">
          <view class="day-line">{{formatDate(key)}}</view>
          <view class="count">
            <span class="mr-10">支出 {{val.exp}}</span>
            <span class="mr-10">收入 {{val.inc}}</span>
            <span>结余 {{val.inc - val.exp}}</span>
          </view>
        </view>
        <view class="apiece" v-for="item in val.info" :key="item.id">
          <view class="mark">{{item.remark}} ---- {{item.type == 1 ? '支出' : '收入'}}</view>
          <view class="price">{{item.money}}</view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
import { myRequest } from '@/common/request.js'
  
export default {
  data() {
    return {
      topHeight: 56,
      listHeight: 600,
      title: "Hello",
      list: {},
      contro: false,
      pageIndex: 1,
      aid: uni.getStorageSync('aid'),
      aid_list: []
    }
  },
  
  onLoad() {
    // 初始请求
    this.fetchAccount()
    // #ifdef MP-WEIXIN
    let menuButtonInfo = uni.getMenuButtonBoundingClientRect()
    this.topHeight = menuButtonInfo.top + menuButtonInfo.height + 10
    let that = this
    uni.getSystemInfo({
    	success: function (res) {
        console.log('sys', res)
        that.listHeight = res.windowHeight - that.topHeight
    	}
    })
    // #endif
    
  },
  

  // onReachBottom() {
    
  // },
  
  methods: {
    lowerRecord() {
      console.log('lower')
      if (!this.contro) {
        return false
      }
      this.fetchRecord(++this.pageIndex)
      
    },
    
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
          this.list[item.day] = {}
          if (item.inc) {
            this.list[item.day].inc = item.inc
          }
          if (item.exp) {
            this.list[item.day].exp = item.exp
          }
          this.list[item.day].info = []
        }
        this.list[item.day].info.push(item)
      })
      if (res.data.length == 20) {
        this.contro = true
      }
    },
    formatDate(str) {
      let strTime = str.replace(/-/g, '/')
      let date = new Date(strTime)
      let year = date.getFullYear()
      let month = date.getMonth() + 1
      let day = date.getDate()
   
      if (month < 10) {
          month = "0" + month;
      }
      if (day < 10) {
          day = "0" + day;
      }
      let info = day + '日/' + month + '月'
      let now = new Date()
  
      if (year != now.getFullYear()) {
        info = info + '/' + year + '年'
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
      .day-info {
        height: 80rpx;
        line-height: 80rpx;
        background-color: #d9d9d9;
        font-size: 30rpx;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 20rpx;
        .day-line {
          color: #666666;
        }
        .count {
          font-size: 24rpx;
          color: #999999;
          .mr-10 {
            margin-right: 10rpx;
          }
        }
      }
      .apiece {
        padding: 0 20rpx;
        display: flex;
        justify-content: space-between;
        font-size: 30rpx;
        height: 120rpx;
        line-height: 120rpx;
        border-bottom: 1rpx solid #e6e6e6;
        .mark {
          color: #333333;
        }
        .price {
          
        }
      }
    }
  }
}
</style>
