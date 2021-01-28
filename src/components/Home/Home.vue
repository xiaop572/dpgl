<template>
  <div class="home">
    <div class="title">智能种植管理系统</div>
    <div class="nodeList">
      <ul>
        <li v-for="(item) in nodeList" :key="item.id">{{item.name}}</li>
      </ul>
    </div>
    <div class="external">
      <span>外部实时数据</span>
      <ul>
        <li v-for="(item) in externalData" :key="item.id">
          <p>{{item.param.showName}}</p>
          {{item.value}}
        </li>
      </ul>
    </div>
    <div class="external">
      <span>棚内数据</span>
      <ul>
        <li v-for="(item) in shedData" :key="item.id">
          <p>{{item.param.showName}}</p>
          {{item.value}}
        </li>
      </ul>
    </div>
    <div
      id="myChart"
      :style="{width: '1000px', height: '500px',marginTop:'100px',marginLeft:'500px'}"
    ></div>
    <a-button type="primary" @click="showDrawer" class="kz">
      控制台
    </a-button>
    <a-drawer
      title="Basic Drawer"
      placement="right"
      :closable="false"
      :visible="visible"
      @close="onClose"
    >
      <p>大棚开关 <a-switch @change="onChange" /></p>
      <p>风机 <a-switch default-checked @change="onChange" /></p>
    </a-drawer>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      nodeList: [],
      externalData: [],
      shedData: [],
      shedMap: [[], [], [], [], []],
      timeDate: [],
      visible: false
    };
  },
  mounted() {
    axios.post("/system/json/getNodes?search_EQ_location.id=5").then(res => {
      this.nodeList = res.data;
    });
    axios.get("/data/json/getNewestDataByNode/51").then(res => {
      this.externalData = res.data.dataParams;
    });
    axios.get("data/json/getNewestDataByNode/49").then(res => {
      this.shedData = res.data.dataParams;
    });
    axios
      .get("/data/json/getJsonDatas/51?startTime=&endTime=&extend=true")
      .then(res => {
        if (res.status) {
          for (let i = res.data.datas.length-1; i > 0; i--) {
            this.timeDate.push(res.data.datas[i].createDate);
            res.data.datas[i].params.forEach(it => {
              switch (it.paramName) {
                case "光照":
                  if (it.value !== "ERR") {
                    this.shedMap[0].push(it.value / 1000);
                  }else{
                     this.shedMap[0].push(0);
                  }
                  break;
                case "温度":
                  if (it.value !== "ERR") {
                    this.shedMap[1].push(it.value);
                  }
                  break;
                case "湿度":
                  if (it.value !== "ERR") {
                    this.shedMap[2].push(it.value);
                  }
                  break;
                case "土壤温度":
                  if (it.value !== "ERR") {
                    this.shedMap[3].push(it.value);
                  }
                  break;
                case "土壤含水率":
                  if (it.value !== "ERR") {
                    this.shedMap[4].push(it.value);
                  }
                  break;
              }
            });
          }
          
          console.log(this.shedData[0]);
          this.drawLine();
        }
      });
  },
  methods: {
    onChange(checked) {
      console.log(`a-switch to ${checked}`);
    },
    showDrawer() {
      this.visible = true;
    },
    onClose() {
      this.visible = false;
    },
    drawLine() {
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById("myChart"));
      // 绘制图表
      myChart.setOption({
        color: ["#4472C5", "#ED7C30", "#80FF80", "#FF8096", "#800080"],
        title: {
          text: "意达实验示范大棚传感器",
          textStyle: {
            //文字颜色
            color: "#ccc",
            //字体风格,'normal','italic','oblique'
            fontStyle: "normal",
            //字体粗细 'normal','bold','bolder','lighter',100 | 200 | 300 | 400...
            fontWeight: "bold",
            //字体系列
            fontFamily: "sans-serif",
            //字体大小
            fontSize: 18
          }
        },
        legend: {
          textStyle: {
            fontSize: 18, //字体大小
            color: "#ffffff" //字体颜色
          },
          data: ["光照", "温度", "湿度", "土壤温度", "土壤含水率"]
        },
        tooltip: {},
        xAxis: {
          data: this.timeDate,
          axisLine: {
            lineStyle: {
              color: "#fff"
            }
          }
        },
        yAxis: {
          axisLine: {
            lineStyle: {
              color: "#fff"
            }
          }
        },
        series: [
          {
            name: "光照",
            type: "line",
            data: this.shedMap[0],
            smooth: true
          },
          {
            name: "温度",
            type: "line",
            data: this.shedMap[1],
            smooth: true
          },
          {
            name: "湿度",
            type: "line",
            data: this.shedMap[2],
            smooth: true
          },
          {
            name: "土壤温度",
            type: "line",
            data: this.shedMap[3],
            smooth: true
          },
          {
            name: "土壤含水率",
            type: "line",
            data: this.shedMap[4],
            smooth: true
          }
        ]
      });
    }
  }
};
</script>

<style lang="less" scoped>
.home {
  height: 100%;
  background: url("../../assets/bg1.jpg");
  .title {
    font-size: 28px;
    color: #fff;
  }
  .nodeList {
    list-style: none;
    width: 400px;
    color: #fff;
    float: left;
  }
  .external {
    color: #fff;
    width: 600px;
    li {
      list-style: none;
      float: left;
      width: 100px;
    }
  }
  .kz{
    position: fixed;
    right: 50px;
    top: 50px;
  }
}
</style>