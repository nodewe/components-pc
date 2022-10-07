<template>
  <div class="box-overflow" >
    <slot></slot>
  </div>
</template>
<script>
export default {
  // 美化滚动条的样式
}
</script>
<style lang="scss" scoped>
.box-overflow {
  overflow: auto;
}
.box-overflow::-webkit-scrollbar {
  // 竖向的滚动条它的宽度
  width: 8px;
  // 横向滚动条的他的高度
  height: 8px;
  background-color: #f5f5f5;
  
}
.box-overflow::-webkit-scrollbar-track {
  // -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
  border-radius: 10px;
  background-color: #f5f5f5;
}
.box-overflow::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background-color: #ccc;
}
//moz
.box-overflow::-moz-scrollbar {
  width: 8px;
  background-color: #f5f5f5;
}
.box-overflow::-moz-scrollbar-track {
  // -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
  border-radius: 10px;
  background-color: #f5f5f5;
}
.box-overflow::-moz-scrollbar-thumb {
  border-radius: 10px;
  background-color: #ccc;
}
//微软
.box-overflow::-ms-scrollbar {
  width: 8px;
  background-color: #f5f5f5;
}
.box-overflow::-ms-scrollbar-track {
  // -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
  border-radius: 10px;
  background-color: #f5f5f5;
}
.box-overflow::-ms-scrollbar-thumb {
  border-radius: 10px;
  background-color: #ccc;
}
</style>