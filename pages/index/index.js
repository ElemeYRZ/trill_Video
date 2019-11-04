// pages/douyin/douyin.js
const windowHeight = wx.getSystemInfoSync().windowHeight;
const windowWidth = wx.getSystemInfoSync().windowWidth;
const app = getApp();
var globalData = app.globalData;
var videoContext = '';
Page({
  /**
   * 页面的初始数据
   */
  data: {
    videos: [{
        videoUrl: "https://aweme.snssdk.com/aweme/v1/playwm/?video_id=v0200fce0000bg36q72j2boojh1t030g&line=0",
        type: false,
        poster: "https://p99.pstatp.com/large/12c5c0009891b32e947b7.jpg",
        imgType: true,
      },
      {
        videoUrl: "https://aweme.snssdk.com/aweme/v1/playwm/?video_id=v0300fd10000bfrb9mlpimm72a92fsj0&line=0",
        type: false,
        poster: "https://p99.pstatp.com/large/12246000525d4c87900e7.jpg",
        imgType: true,
      },
      {
        type: false,
        poster: 'https://img.weixin-qq.com.cn/media/smy1008/09b72ae17ae729f78ccc394079a35a7a.jpg',
        imgType: false,
      },
      {
        videoUrl: "https://aweme.snssdk.com/aweme/v1/playwm/?video_id=v0300fd10000bfrb9mlpimm72a92fsj0&line=0",
        type: false,
        poster: "https://p99.pstatp.com/large/12246000525d4c87900e7.jpg",
        imgType: true,
      },
    ],
    phonetop: 0,
    topHeight: 0,
    statusBarHeight: 0,
    videoShow: false,
    isplay: true,
    indexPage: 0,
    startPageY: '',
    left: 0,
    top: 0,
    animation: {}, //滑动动画实例
    animationLove: {}, //单击爱心动画实例
    doubleClickAnimation: {}, //双击屏幕点赞动画实例
    opacity: 0,
    videoContext: {}, //视频的实例
    startTime: 0, //触摸开始的时间
    endTime: 0, //触摸结束的时间
    lastTapTime: 0, //最后一次单击事件的时间
    lastTapTimeOutFunc: null, //单击事件点击后要触发的函数
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // 查询节点信息对象 exec():执行所有的请求，请求结果按照次序构成数组，在callback的第一个参数中返回
    // wx.createSelectorQuery().select('.video').context(res => {
    //   console.log('res', res);
    //   videoContext = res.context;
    //   // this.setData({
    //   //   videoContext: res.context
    //   // })
    // }).exec()
    if(this.data.videos[0].imgType){
      videoContext = wx.createVideoContext('video', this);
    }
    // 初始化动画，创建一个动画animation对象
    this.animationInit();

    // 自定义标题栏高度做适配
    const statusBarHeight = wx.getSystemInfoSync().statusBarHeight;
    console.log('status', statusBarHeight);
    var phoneType = globalData.phoneType;
    var navHeight;
    if (phoneType == 'android') {
      navHeight = 48;
    } else {
      navHeight = 44;
    }
    var topHeight = navHeight + statusBarHeight;
    var phonetop = (navHeight - 30) / 2
    console.log('topHeight', topHeight);
    this.setData({
      topHeight,
      statusBarHeight,
      phonetop
    })

  },

  // 初始化动画对象
  animationInit() {
    //生成换页动画
    var animation = wx.createAnimation({
      duration: 1000,
      timingFunction: 'ease',
    })
    this.animation = animation;
    this.setData({
      animation: animation.export()
    })

    // 单击爱心 点赞动画
    var animationLove = wx.createAnimation({
      duration: 450,
      timingFunction: 'ease'
    })
    this.animationLove = animationLove;
    this.setData({
      animationLove: animationLove.export()
    })

    // 双击屏幕点赞动画
    var doubleClickAnimation = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease'
    })
    this.doubleClickAnimation = doubleClickAnimation;
    this.setData({
      doubleClickAnimation: doubleClickAnimation.export()
    })

  },

  // 触摸开始
  touchstart(e) {
    this.setData({
      startPageY: e.touches[0].pageY,
      startTime: e.timeStamp
    })

  },

  // 触摸结束
  touchend(e) {
    this.setData({
      endTime: e.timeStamp
    })
    var endPageY = e.changedTouches[0].pageY;
    var result = endPageY - this.data.startPageY;
    var indexPage = this.data.indexPage;
    if (result > 80 && indexPage > 0) {
      console.log('上滑');
      this.changePhoto(-1);
      this.changeVideo();
    } else if (result < -80 && indexPage < this.data.videos.length - 1) {
      console.log('下滑');
      this.changePhoto(1);
      this.changeVideo();
    }
  },

  // 改变图片
  changePhoto(i) {
    var index = this.data.indexPage + i;
    this.setData({
      indexPage: index
    })
    var distance = -index * windowHeight;
    this.animation.translateY(distance).step();
    console.log('animation', this.animation);
    this.setData({
      animation: this.animation.export()
    })
  },

  //改变视频的状态
  changeVideo() {
    console.log('index', this.data.indexPage);
    this.setData({
      videoShow: true,
      isplay: true
    })
    if(videoContext != ''){
      videoContext = null;
    }
    if(this.data.videos[this.data.indexPage].imgType){
      videoContext = wx.createVideoContext('video', this);
      setTimeout(() => {
        this.setData({
          videoShow: false,
        })
        videoContext.play();
        console.log('111');
      }, 1100)
    }else{
      setTimeout(() => {
        this.setData({
          videoShow: false,
        })
        console.log('222');
      }, 1100)
    }
    

  },

  // 点击爱心
  handleLove() {
    var videos = this.data.videos;
    if (videos[this.data.indexPage].type) {
      console.log('取消')
      videos[this.data.indexPage].type = false;
      this.animationLove.opacity(0).step();
      this.setData({
        videos,
        animationLove: this.animationLove.export(),
      });
    } else {
      console.log('选中')
      videos[this.data.indexPage].type = true;
      this.animationLove.opacity(1).scale(2.1, 2.1).step();
      this.animationLove.scale(1, 1).step();
      this.setData({
        videos,
        animationLove: this.animationLove.export(),
      });
    }
    console.log('tap vidoes', this.data.videos);
  },

  // 双击
  mutipleTap(e) {
    console.log('e', e);
    // 控制点击事件在350ms内触发，加这层判断是为了防止长按时会触发点击事件
    if (this.data.endTime - this.data.startTime < 350) {
      var current = e.timeStamp;
      var lastTapTime = this.data.lastTapTime;
      // 更新最后一次点击时间
      this.setData({
        lastTapTime: current,
        left: e.detail.x - 32,
        top: e.detail.y - 32
      })
      if (current - lastTapTime < 300) {
        console.log('double tap');
        clearTimeout(this.data.lastTapTimeOutFunc);
        var doubleClickAnimation = this.doubleClickAnimation;
        doubleClickAnimation.opacity(1).scale(1.3, 1.3).step();
        doubleClickAnimation.scale(1.1, 1.1).step();
        doubleClickAnimation.scale(2, 2).opacity(0).step();

        var videos = this.data.videos;
        videos[this.data.indexPage].type = true;
        this.setData({
          doubleClickAnimation: doubleClickAnimation.export(),
          opacity: 1,
          videos
        })
        console.log('videos', this.data.videos);
      } else {
        // 单击事件延时300毫秒执行，这和最初的浏览器的点击300ms延时有点像。
        this.data.lastTapTimeOutFunc = setTimeout(() => {
          console.log('tap')
          console.log('videoContext', videoContext);
          if(this.data.videos[this.data.indexPage].imgType){
            if (this.data.isplay) {
              videoContext.pause();
              this.setData({
                isplay: false
              })
            } else {
              videoContext.play();
              this.setData({
                isplay: true
              })
            }
          }
        }, 300)
      }
    }
  },

  // 上一张
  goPrev() {
    if (this.data.indexPage > 0) {
      this.changePhoto(-1);
      this.changeVideo();
    }

  }



})