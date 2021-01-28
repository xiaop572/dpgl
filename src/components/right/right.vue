<template>
  <div class="right">
    <div class="nowTime">
      {{company}}
      <span @click="loginOut">退出登录</span>
    </div>
    <div class="title">
      <span class="p">
        大棚列表
        <img src="../../assets/san.png" alt />
      </span>
    </div>
    <ul class="list">
      <li
        :class="{'active':activeObj==item}"
        v-for="(item,index) in facility"
        :key="item.id"
        @click="$emit('changeActive',index)"
      >{{item.name}}</li>
    </ul>
  </div>
</template>

<script>
export default {
  props: ["facility", "activeObj","company"],
  data() {
    return {};
  },
  methods:{
    loginOut(){
      sessionStorage.removeItem('login');
      this.$router.push('/login')
    }
  },
  mounted(){
    console.log("哈",this.facility,this.activeObj)
  }
};
</script>

<style lang="less">
.right {
  width: 154px;
  overflow: hidden;
  height: calc(100% - 152px);
  background: rgba(56, 83, 146, 0.21);
  box-sizing: border-box;
  border: 1px solid #073050;
  margin: 40px 0 0 0;
  .nowTime {
    right: 20px;
    position: absolute;
    top: 50px;
    z-index: 10;
    color: #fff;
    // border: 2px solid;
    text-align: left;
    padding: 0 15px;
    font-size: 16px;
    height: 50px;
    line-height: 50px;
    // border-image: linear-gradient(to right, #0072ff, #00e8ff, #01aaff) 1 10;
    span {
      margin-left: 30px;
      cursor: pointer;
      &:hover{
        color:#01aaff;
      }
    }
  }
  .title {
    height: 75px;
    line-height: 75px;
    font-size: 20px;
    font-weight: bold;
    .p {
      background: linear-gradient(to right, #0074ff, #00dff9, #0074ff);
      -webkit-background-clip: text;
      color: transparent;
      vertical-align: middle;
    }
    img {
      vertical-align: middle;
      margin-left: 10px;
      margin-top: -2px;
    }
  }
  .list {
    background: #05082f;
    color: rgba(255, 255, 255, 0.4);
    margin: 0;
    padding: 0;
    li {
      height: 50px;
      line-height: 50px;
      list-style: none;
      font-size: 14px;
      letter-spacing: 2px;
      font-weight: bold;
      cursor: pointer;
    }
    .active {
      color: #fff;
      background: #0684d5;
    }
  }
}
</style>