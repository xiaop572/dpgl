<template>
  <div class="left">
    <div class="nowTime">
      北京时间：
      <span>{{nowTime}}</span>
    </div>
    <div class="ray-box">
      <h4>
        <span>光照强度</span>
      </h4>
      <div id="myChart1" :style="{width: '528px', height: '258px'}"></div>
    </div>
    <div class="ray-box">
      <h4>
        <span>空气温度 | 空气湿度</span>
      </h4>
      <div id="myChart2" :style="{width: '528px', height: '258px'}"></div>
    </div>
    <div class="ray-box">
      <h4>
        <span>土壤温度 | 土壤含水量</span>
        <div id="myChart3" :style="{width: '528px', height: '258px'}"></div>
      </h4>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import moment from "moment";
export default {
  data() {
    return {
      gz: [[], [], [], [], []],
      gzTime: [],
      nowTime: ""
    };
  },
  methods: {
    getCharts1() {
      this.gz=[[], [], [], [], []];
      this.$axios
        .get("/data/json/getJsonDatas/49?startTime=&endTime=&extend=true", {
          withCredentials: true
        })
        .then(res => {
          if (res.status) {
            for (let i = res.data.datas.length - 1; i > 0; i--) {
              this.gzTime.push(res.data.datas[i].createDate);
              res.data.datas[i].params.forEach(it => {
                switch (it.paramName) {
                  case "光照":
                    if (it.value !== "ERR") {
                      this.gz[0].push(it.value / 1000);
                    } else {
                      this.gz[0].push(0);
                    }
                    break;
                  case "温度":
                    if (it.value !== "ERR") {
                      this.gz[1].push(it.value);
                    }
                    break;
                  case "湿度":
                    if (it.value !== "ERR") {
                      this.gz[2].push(it.value);
                    }
                    break;
                  case "土壤温度":
                    if (it.value !== "ERR") {
                      this.gz[3].push(it.value);
                    }
                    break;
                  case "土壤含水率":
                    if (it.value !== "ERR") {
                      this.gz[4].push(it.value);
                    }
                    break;
                }
              });
            }
            this.charts1();
            this.charts2();
            this.charts3();
          }
        });
    },
    charts1() {
      let myChart = this.$echarts.init(document.getElementById("myChart1"));
      myChart.setOption({
        color: ["#ffc400", "#ad55ff"],
        grid: {
          top: "20%",
          left: "15%",
          height: "170px"
        },
        title: {
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
          top: "5%",
          textStyle: {
            fontSize: 18, //字体大小
            color: "#ffffff" //字体颜色
          },
          data: ["光照强度", "湿度"]
        },
        tooltip: {},
        xAxis: {
          data: this.gzTime,
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
            name: "光照强度",
            type: "line",
            data: this.gz[0],
            smooth: true
          }
        ]
      });
    },
    charts2() {
      let myChart = this.$echarts.init(document.getElementById("myChart2"));
      myChart.setOption({
        color: ["#09a6ce", "#ffc400"],
        grid: {
          top: "20%",
          left: "15%",
          height: "170px"
        },
        title: {
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
          top: "5%",
          textStyle: {
            fontSize: 18, //字体大小
            color: "#ffffff" //字体颜色
          },
          data: ["温度", "湿度"]
        },
        tooltip: {},
        xAxis: {
          data: this.gzTime,
          axisLine: {
            lineStyle: {
              color: "#fff"
            }
          }
        },
        yAxis: [
          {
            axisLine: {
              lineStyle: {
                color: "#fff"
              }
            },
            axisLabel: {
              textStyle: {
                color: "#09a6ce"
              }
            }
          },
          {
            axisLine: {
              lineStyle: {
                color: "#fff"
              }
            },
            splitLine: {
              //网格线
              show: false
            },
            axisLabel: {
              textStyle: {
                color: "#ffc400"
              }
            }
          }
        ],
        series: [
          {
            name: "温度",
            type: "line",
            data: this.gz[1],
            smooth: true,
            yAxisIndex: 0
          },
          {
            name: "湿度",
            type: "line",
            data: this.gz[2],
            smooth: true,
            yAxisIndex: 1
          }
        ]
      });
    },
    charts3() {
      let myChart = this.$echarts.init(document.getElementById("myChart3"));
      myChart.setOption({
        color: ["#f75050", "#0dde79"],
        grid: {
          top: "20%",
          left: "10%",
          height: "170px"
        },
        title: {
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
          top: "5%",
          textStyle: {
            fontSize: 18, //字体大小
            color: "#ffffff" //字体颜色
          },
          data: ["土壤温度", "土壤含水量"]
        },
        tooltip: {},
        xAxis: {
          data: this.gzTime,
          axisLine: {
            lineStyle: {
              color: "#fff"
            }
          }
        },
        yAxis: [
          {
            axisLine: {
              lineStyle: {
                color: "#fff"
              }
            },
            axisLabel: {
              textStyle: {
                color: "#f75050"
              }
            }
          },
          {
            axisLine: {
              lineStyle: {
                color: "#fff"
              }
            },
            splitLine: {
              //网格线
              show: false
            },
            axisLabel: {
              textStyle: {
                color: "#0dde79"
              }
            }
          }
        ],
        series: [
          {
            name: "土壤温度",
            type: "line",
            data: this.gz[3],
            smooth: true,
            yAxisIndex: 0
          },
          {
            name: "土壤含水量",
            type: "line",
            data: this.gz[4],
            smooth: true,
            yAxisIndex: 1
          }
        ]
      });
    }
  },
  mounted() {
    this.getCharts1();
    setInterval(() => {
      this.nowTime = moment().format("YYYY-MM-DD  hh:mm:ss");
    }, 1000);
    setInterval(()=>{
      this.getCharts1()
    },30*60*1000)
  }
};
</script>

<style lang="less">
.left {
  width: 587px;
  overflow: hidden;
  float: left;
  margin: 40px 0 0 43px;
  height: calc(100% - 152px);
  background: rgba(56, 83, 146, 0.21);
  box-sizing: border-box;
  border: 1px solid #073050;
  .nowTime {
    position: absolute;
    top: 50px;
    z-index: 10;
    color: #fff;
    border: 2px solid;
    padding: 0 15px;
    font-size: 20px;
    height: 50px;
    line-height: 50px;
    font-weight: bold;
    border-image: linear-gradient(to right, #0072ff, #00e8ff, #01aaff) 1 10;
    span {
      margin-left: 30px;
    }
  }
  .ray-box {
    height: 293px;
    width: 550px;
    margin: 16px auto 0 auto;
    h4 {
      background: linear-gradient(
        to right,
        rgba(8, 37, 183, 0.5),
        rgba(1, 180, 255, 0.2)
      );
      height: 40px;
      margin: auto;
      text-align: left;
      padding-left: 25px;
      line-height: 40px;
      font-size: 22px;
      font-weight: bold;
      font-family: "微软雅黑";
      span {
        background: linear-gradient(to right, #0074ff, #00dff9, #0074ff);
        -webkit-background-clip: text;
        color: transparent;
      }
    }
  }
}
</style>