<template>
  <div style="color: #1890ff">{{ msg }}</div>
</template>

<script>
/**
 * 验证码倒计时
 * 外界可以通过ref引用调用 内部的start方法来
 *
 */
export default {
  props: {
    //倒计时秒数
    second: {
      type: Number,
      default: 20,
    },
  },
  data() {
    return {
      //  第一次 获取验证码 点击之后开始变成 多少秒后重新获取  时间完成之后 重新获取
      msg: "获取验证码",
      //倒计时
      initSecond: this.second,
    };
  },
  methods: {
    // 开始调用
    start() {
      //如果初始化秒数 不等于 设定的秒数  就返回true 说明已经在调用倒计时函数了
      if (this.initSecond !== this.second) return true;
      this.cutDown();
    },
    //倒计时
    cutDown() {
      //倒计时完成
      if (!this.initSecond) {
        this.msg = "重新获取";
        this.initSecond = this.second;
        clearTimeout(this.cutDown.timer);
        return;
      }
      --this.initSecond;
      this.msg = `${this.initSecond}秒后重新获取`;
      this.cutDown.timer = setTimeout(this.cutDown, 1000);
    },
  },
};
</script>

<style scoped>
</style>