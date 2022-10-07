<template>
 <div id="Map"></div>
</template>
<script>
window._AMapSecurityConfig = {
  securityJsCode: "2edc557545d0432d5dbce45992e8857f",
};
// 一下的每个方法的用法和作用都可以在高德的文档中找到
// https://lbs.amap.com/api/jsapi-v2/documentation
import AMapLoader from "@amap/amap-jsapi-loader";
export default {
  props:{
    //该地图组件中是否允许添加多个标记
    isMultiple:{
      type:Boolean,
      default:false
    }
  },
  name: "FangYuanMap",
  data() {
    return {
      // 实例化 map 选项
      map:null,
      // AMap 加载的AMap选项
      AMap: null,
      //初始化地图的中心点
      center:[106.610443,26.664922],
      //标记的数组
      markers:[],
    };
  },
  mounted() {
    //测试在mounted中使用initMap 在实际调用中推荐得到该函数的引用来调用 initMap
    this.initMap();
  },
  methods: {
    // 初始化地图选项
    initMap(){
      const that = this;
      AMapLoader.load({
            key:'48c48ff1d8d0cfd0932f23dcfb7c6108',
            plugins:[
              //地理
              'AMap.Geocoder',
              //根据关键字搜索
              'AMap.PlaceSearch'
            ]
        }).then(AMap=>{
            that.AMap = AMap;
            that.map =new AMap.Map('Map', {
                resizeEnable: true, //是否监控地图容器尺寸变化
                zoom: 11, //初始化地图层级
                center:that.center //初始化地图中心点
             })
            that.addMapEvent()
      })
    },
    //地图添加事件
    addMapEvent(){
      const cb = event=>{
        //拿到经纬度
        const {lng,lat} = event.lnglat;
        this.addMarker(lng,lat)
      }
      this.map.on('click',cb)
    },
    //创建点标记
    createMarker(lng,lat,title='北京'){
      const position = new this.AMap.LngLat(lng,lat)
      const marker = new this.AMap.Marker({
        position,
        title,
        // icon 参数 接受一个String 路径 默认是一个蓝色的标记
      });
      return marker
    },
    /**
     * 添加marker标记点
     */
    addMarker(lng,lat){
      const marker = this.createMarker(lng,lat);
      if(!this.isMultiple){
        //将markers的标记点 全部清除
        if(this.markers.length){
          this.map.remove(this.markers)
        }
        // 将数组清空
        this.markers = [];

      }
      this.markers.push(marker);
      this.map.add(this.markers);
    },  
    // 逆向地理编码 根据经纬度 获取行政区划
    /**
     * 
     * @param {Array<Number>} lnglat 经纬度
     * @param {String} city 
     */
    getDistrct(lnglat, city = "贵阳") {
      var geocoder = new this.AMap.Geocoder({
        // city 指定进行编码查询的城市，支持传入城市名、adcode 和 citycode
        city,
      });
      geocoder.getAddress(lnglat, (status, result)=>{
        if (status === "complete" && result.info === "OK") {
          // result中对应详细地理坐标信息
          result.regeocode.addressComponent.address = result.regeocode.formattedAddress
          this.$emit('getDistrct',result.regeocode.addressComponent)
        }
      });
    },
    // 根据关键字搜索   
    keywordSearch(keywords, city = "贵阳") {
      const that = this;
      var autoOptions = {
        city,
      };
      var placeSearch = new this.AMap.PlaceSearch(autoOptions);
      // console.log(placeSearch,'placeSearch');
      placeSearch.search(keywords, function (status, result) {
        // console.log(result);
        if (!result.poiList) {
          return;
        }
        that.$emit("getList", result.poiList.pois);
      });
    },
  },
};
</script>

<style lang="scss" scoped>
#Map {
  height: 100vh;
  width: 100vw;
}
</style>
