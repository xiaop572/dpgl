<template>
  <div class="container" :style="{transform:scale}">
    <img src="../../assets/top.png" alt class="top" />
    <left></left>
    <main-box :activeObj="activeObj"></main-box>
    <right :facility="facilityList" :activeObj="activeObj" @changeActive="changeActive" :company="company"></right>
  </div>
</template>

<script>
import Left from "../left/left";
import MainBox from "../main/main";
import Right from "../right/right";
export default {
  data() {
    return {
      scale: 1,
      facilityList: [],
      activeObj: {},
      company:""
    };
  },
  components: {
    Left,
    MainBox,
    Right
  },
  methods: {
    adapt() {
      let scaleX = window.innerWidth / 1920;
      let scaleY = window.innerHeight / 1080;
      let result = scaleX < scaleY ? scaleX : scaleY;
      this.scale = "scale(" + result + ")translate(-50%,-50%)";
    },
    getNodeGroups() {
      //获取设备列表
      this.$axios
        .get("/system/json/getNodeGroups", {
          withCredentials: true
        })
        .then(res => {
          this.facilityList = res.data.filter(it => it.nodesList);
          this.activeObj = this.facilityList[0];
          this.company=res.data[0].location.name;
        });
    },
    changeActive(index) {
      this.activeObj = this.facilityList[index];
    }
  },
  mounted() {
    this.adapt();
    this.getNodeGroups();
    window.addEventListener("resize", this.adapt);
  },
  destroyed() {
    window.removeEventListener("resize", this.adapt);
  }
};
</script>
 
<style lang="less">
.container {
  width: 1920px;
  height: 1080px;
  transform-origin: 0 0;
  margin: auto;
  position: absolute;
  overflow: hidden;
  z-index: 10;
  left: 50%;
  top: 50%;
  .top {
    width: 100%;
  }
}
</style>