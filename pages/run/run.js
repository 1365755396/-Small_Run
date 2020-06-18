// pages/run/run.js
let utils=require('../utils.js');
//记录总的节点
var countmarkers=[];
//用于连线
let ctmarkers = [];
//回放的
let cctmarkers=[];
//是否结束
var isjie=false;
var isFrist=true;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    running:false,
    latitude:0,
    longitude:0,
    markers:[],
    meters:0.00,
    second:0,
    isHui:false

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.curLocation()
    //开始计时器记录坐标并标记位置（前提为开始： running:true,）
    let timer=setInterval(this.record,1000)

  },
      //开始计时器记录坐标并标记位置（前提为开始： running:true,）
  record(){
    var that=this;
    //在未开始时退出
    if(!this.data.running){
      return
    }
    this.setData({
      second:this.data.second+1
    })
    wx.getLocation({
      type:'gcj02',//默认炜wgs84 返回gps坐标，gcj0返回可用于wx。openLocation的坐标
      success: function(res) {
        //增加标注点
        let newMarker={
          latitude:res.latitude,
          longitude:res.longitude,
          iconPath:'redPoint.png',
        }
        //连线的参数
        let cNewMarker={
          latitude: res.latitude,
          longitude: res.longitude
        }
        ctmarkers.push(cNewMarker);



        let pace = 0
        let tmarkers =that.data.markers
        
        //marker数组为空就不计算距离
        if (that.data.markers.length>0){

          
          //每回都添加最后一个
          let lastmarker = that.data.markers[that.data.markers.length-1]
          pace=utils.getDistance(lastmarker.latitude,lastmarker.longitude,newMarker.latitude,newMarker.longitude)
          //gps定位偏差的数据飘逸清零，户外gps精度15米左右
          if(pace<15){
            pace=0
          }else{
            //新标注点加入临时数据中
            tmarkers.push(newMarker)
            //console.log(newMarker)
          }
        }else{
          //新标注点加入临时数据中
          tmarkers.push(newMarker)

        }



        countmarkers = tmarkers;

        if(isFrist){
        //记录走过的
       
      //  / console.log(ctmarkers)
        that.setData({
          latitude:res.latitude,
          longitude:res.longitude,
          markers:tmarkers,
          meters:that.data.meters+pace
        })

        }else{
          that.setData({
            latitude: res.latitude,
            longitude: res.longitude,
            polyline: [{
              points: ctmarkers,
              color: "#7cc4ff",
              width: 2,
              dottedLine: true
            }],
            meters: that.data.meters + pace
          })

          if (isjie) {
         
           // console.log(ctmarkers[-1])
            that.setData({
              latitude: res.latitude,
              longitude: res.longitude,
              markers: [that.data.markers[0],that.data.markers[that.data.markers.length - 1]],
           
              meters: that.data.meters + pace
            })

          }
        }
        isFrist=false;
      },
   
    })
    
  },
  run:function(){
      this.setData({
        running:!this.data.running
      })
  },
  clear:function(){
    ctmarkers=[];
    this.setData({
      markers:[],
      polyline:[],
      meters:0,
      second:0,
      running:false
    })
    isjie=false;
    isFrist=true;
  },
  bao:function(){
    cctmarkers=ctmarkers;
      this.setData({
        countmarkers:countmarkers
      });
  },
  hui:function(){
      this.setData({
        markers:countmarkers,
        polyline: [{
          points: cctmarkers,
          color: "#7cc4ff",
          width: 2,
          dottedLine: true
        }],
      })
  },
  jie:function(){
    isjie=true;
  },

  //获取当前位置
  curLocation(){
    var that =this;
    wx.getLocation({
      type: 'gcj02',
      success: function(res) {
        console.log("latitude:"+res.latitude)
        console.log("longitude:" + res.longitude)
        that.setData({
          latitude:res.latitude,
          longitude:res.longitude
        })
      },
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})