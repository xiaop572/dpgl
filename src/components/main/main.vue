<template>
  <div class="main">
    <div class="video">
      <video
        id="myVideo"
        ref="viodeRef"
        class="video-js vjs-default-skin vjs-big-play-centered vjs-progress-holder"
      ></video>
    </div>
    <div class="current-data">
      <div class="data-row">
        <h4>内部数据</h4>
        <ul>
          <li :class="['li'+(index+1)]" v-for="(item,index) in sideData" :key="index">
            <p>{{item.value}}{{item.unit}}</p>
            <span>
              <img :src="[require('../../assets/icon'+(index+1)+'.png')]" alt />
              {{item.showName}}
            </span>
          </li>
        </ul>
      </div>
      <div class="data-row">
        <h4>外部数据</h4>
        <ul>
          <li :class="['li'+(index+1)]" v-for="(item,index) in externalData" :key="index">
            <p>{{item.value}}{{item.unit}}</p>
            <span>
              <img :src="[require('../../assets/icon'+(index+1)+'.png')]" alt />
              {{item.showName}}
            </span>
          </li>
        </ul>
      </div>
    </div>
    <div class="facility-state">
      <h4>
        <span>设备列表</span>
        <!-- <span class="facility-time">上报时间：2020-11-30 00:00</span> -->
      </h4>
      <ul class="facility-List">
        <li
          v-for="(item,index) in activeObj.nodesList"
          :key="item.id"
          :class="{'active':facilityActive===item}"
          @click="facilityChange(index)"
        >
          <span>{{item.name}}</span>
        </li>
      </ul>
      <!-- <div class="facility-main">
        <div>
          <p>设备名称：温室中心控制</p>
          <p>通风系统：高于 ℃启动</p>
          <p>设备ID：ED00001</p>
          <p>
            运行模式：
            <a-radio-group name="radioGroup" :default-value="1" class="radioList">
              <a-radio :value="1">手动</a-radio>
              <a-radio :value="2">自动</a-radio>
            </a-radio-group>
          </p>
        </div>
        <div>
          <p>降温系统：高于 ℃启动</p>
          <p>补光系统: 时至 时</p>
          <p>检测到PAR低于 W/ m²启动</p>
        </div>
      </div>-->
      <!-- <div class="save-btn">
        <span>保存参数</span>
      </div>-->
    </div>
    <div class="facility-control" v-if="facilNodeType<16">
      <h4>
        <span>设备状态</span>
        <span class="facility-time">设备状态:{{onlineStatus}}</span>
      </h4>
      <ul class="cgqState">
        <li v-for="(item,index) in facilDataArr" :key="index">{{item}}</li>
      </ul>
    </div>
    <div class="facility-control" v-if="facilNodeType>=16">
      <h4>
        <span>设备控制</span>
        <span class="facility-time">设备状态:{{onlineStatus}}</span>
      </h4>
      <div class="facility-main">
        <div>
          <h5>
            控制通道
            <span>运行状态</span>
          </h5>
          <template v-for="(item,index) in itemControlList">
            <p class="control" v-if="index % 2 === 0" :key="index">
              {{item.name}}
              <span>
                <a-switch
                  :checked="item.status==='on'? true :false"
                  @click="clickItem(item,index)"
                />
              </span>
            </p>
          </template>
        </div>
        <div>
          <h5>
            控制通道
            <span>运行状态</span>
          </h5>
          <template v-for="(item,index) in itemControlList">
            <p class="control" v-if="index % 2 === 1" :key="index">
              {{item.name}}
              <span>
                <!-- <a-switch :checked="item.status==='on'? true :false" @change="changeItem(index)" /> -->
                <a-switch
                  :checked="item.status==='on'? true :false"
                  @click="clickItem(item,index)"
                />
              </span>
            </p>
          </template>
        </div>
      </div>
      <portal to="destination">
        <!--弹框-->
        <div id="control" v-if="controlVis" @click="closeItem">
          <div
            class="popFrame animate__animated"
            :class="{animate__fadeInUp:animate,animate__fadeOutDown:!animate}"
            @click="e=>{e.stopPropagation()}"
          >
            <template v-if="nodeType==='jdq'">
              <div class="controlRow">当前状态:{{nodeChangeObj.statusText}}</div>
              <div class="controlRow">
                延迟时间:
                <a-select :value="setNodeTime.delay" style="width: 120px" @change="handleDelay">
                  <a-select-option value="立刻">立刻</a-select-option>
                  <a-select-option value="小时:分钟">小时:分钟</a-select-option>
                </a-select>
                <a-input
                  :disabled="setNodeTime.delay==='立刻'"
                  placeholder="小时"
                  style="width:100px"
                  v-model="setNodeTime.delayHour"
                />
                <a-input
                  :disabled="setNodeTime.delay==='立刻'"
                  placeholder="分钟"
                  style="width:100px"
                  v-model="setNodeTime.delayMinute"
                />
              </div>
              <div class="controlRow">
                持续时间:
                <a-select
                  :value="setNodeTime.continue"
                  style="width: 120px"
                  @change="handleContinue"
                >
                  <a-select-option value="立刻">立刻</a-select-option>
                  <a-select-option value="小时:分钟">小时:分钟</a-select-option>
                </a-select>
                <a-input
                  :disabled="setNodeTime.continue==='立刻'"
                  placeholder="小时"
                  style="width:100px"
                  v-model="setNodeTime.continueHour"
                />
                <a-input
                  :disabled="setNodeTime.continue==='立刻'"
                  placeholder="分钟"
                  style="width:100px"
                  v-model="setNodeTime.continueMinute"
                />
              </div>
              <a-button type="primary" @click="fengSub" v-if="nodeChangeObj.statusText==='关闭'">开启</a-button>
              <a-button type="danger" @click="fengSub" v-if="nodeChangeObj.statusText==='开启'">关闭</a-button>
            </template>
            <template v-if="nodeType==='bjmq' || nodeType==='dtc' || nodeType==='zyl'">
              <div class="controlRow">当前状态:{{nodeChangeObj.position}}%</div>
              <div class="controlRow">
                目标位置
                <a-select
                  :value="BjdjNodeObj.targetPosition"
                  style="width: 120px"
                  @change="handleTargetPosition"
                >
                  <a-select-option value="关闭">关闭</a-select-option>
                  <a-select-option value="部分打开">部分打开</a-select-option>
                  <a-select-option value="完全打开">完全打开</a-select-option>
                </a-select>位置:
                <a-input
                  :disabled="BjdjNodeObj.targetPosition!=='部分打开'"
                  placeholder="小时"
                  style="width:100px"
                  v-model="BjdjNodeObj.position"
                />%
              </div>
              <div class="controlRow">
                速度
                <a-input
                  :disabled="true"
                  placeholder="小时"
                  style="width:100px"
                  v-model="BjdjNodeObj.speed"
                />%
              </div>
              <a-button type="primary" @click="bjdjSub" v-if="nodeChangeObj.position==='0'">开启</a-button>
              <a-button type="danger" @click="bjdjSub" v-if="nodeChangeObj.position!=='0'">关闭</a-button>
            </template>
          </div>
        </div>
      </portal>
    </div>
  </div>
</template>

<script>
import "vue-video-player/src/custom-theme.css";
import "video.js/dist/video-js.css";
import axios from 'axios';
import qs from "qs";
import uu from "../../util/uuid";
import sockjs from "sockjs-client";
import stompjs from "stompjs";
export default {
  data() {
    return {
      sideData: [],
      sideType: ["gz", "wd", "sd", "trwd", "trsf"],
      externalData: [],
      externalSideType: ["gz", "wd", "sd", "yl", "fs"],
      myPlayer: "", //播放器
      videoUrl: "http://61.164.118.210:83/openUrl/nMbNauI/live.m3u8", //直播视频地址
      facilityActive: {},
      itemControlList: [], //节点列表
      nodeType: "", //节点类型
      controlVis: false,
      animate: false,
      nodeChangeObj: {},
      setNodeTime: {
        delay: "立刻",
        delayHour: 0,
        delayMinute: 0,
        continue: "立刻",
        continueHour: 0,
        continueMinute: 0
      },
      BjdjNodeObj: {
        targetPosition: "关闭",
        position: 0,
        speed: 100
      },
      subscription: null,
      __StompClient: null,
      nowNodeId: 0,
      facilNodeType: "jdq", //设备是传感器还是控制器
      facilData: 0, //设备数据
      onlineStatus: "" //设备状态
    };
  },
  props: ["activeObj"],
  methods: {
    handleDelay(value) {
      this.setNodeTime.delay = value;
    },
    handleContinue(value) {
      this.setNodeTime.continue = value;
    },
    handleTargetPosition(value) {
      this.BjdjNodeObj.targetPosition = value;
      if (value === "部分打开") {
        this.BjdjNodeObj.position = 50;
      } else if (value === "完全打开") {
        this.BjdjNodeObj.position = 100;
      } else if (value === "关闭") {
        this.BjdjNodeObj.position = 0;
      }
    },
    bjdjSub() {
      let param = {
        id: this.facilityActive.id,
        name: this.nodeType,
        channel: 1,
        action: "forward",
        speed: this.BjdjNodeObj.speed,
        position: this.BjdjNodeObj.position
      };
      this.$confirm({
        title: "确定执行操作吗?",
        onOk: () => {
          this.$axios
            .post("/actuators/control/" + this.facilityActive.id, param, {
              withCredentials: true
            })
            .then(res => {
              this.controlVis = false;
              this.$success({
                content: `${res.data.text}`,
                okText: "确认",
                centered: true
              });
            });
        },
        okText: "确认",
        cancelText: "取消",
        centered: true,
        onCancel() {},
        class: "test"
      });
    },
    fengSub() {
      let action = "";
      let delay =
        this.setNodeTime.delayHour * 60 * 60 +
        this.setNodeTime.delayMinute * 60;
      let duration =
        this.setNodeTime.continueHour * 60 * 60 +
        this.setNodeTime.continueMinute * 60;
      if (this.nodeChangeObj.statusText === "关闭") {
        if (delay > 0) {
          action = "onReserve";
        } else {
          action = "on";
        }
      } else if (this.nodeChangeObj.statusText === "开启") {
        if (delay > 0) {
          action = "offReserve";
        } else {
          action = "off";
        }
      }
      let param = {
        id: this.facilityActive.id,
        name: this.nodeType,
        channel: 1,
        action: action,
        delay: delay,
        duration: duration > 0 ? duration : 604800
      };
      this.$confirm({
        title: "确定执行操作吗?",
        onOk: () => {
          this.$axios
            .post("/actuators/control/" + this.facilityActive.id, param, {
              withCredentials: true
            })
            .then(res => {
              this.controlVis = false;
              this.$success({
                content: `${res.data.text}`,
                okText: "确认",
                centered: true
              });
            });
        },
        okText: "确认",
        cancelText: "取消",
        centered: true,
        onCancel() {},
        class: "test"
      });
      //风机提交
    },
    clickItem(item, index) {
      this.setNodeTime = {
        delay: "立刻",
        delayHour: 0,
        delayMinute: 0,
        continue: "立刻",
        continueHour: 0,
        continueMinute: 0
      };
      this.nodeChangeObj = item;
      //点击开关
      if (!this.controlVis) {
        this.controlVis = true;
        this.animate = true;
      }
    },
    closeItem() {
      this.animate = false;
      setTimeout(() => {
        this.controlVis = false;
      }, 300);
    },
    getInsideData() {
      //内部数据
      this.$axios
        .get("/data/json/getNewestDataByNode/49", {
          withCredentials: true
        })
        .then(res => {
          res.data.dataParams.forEach(item => {
            if (this.sideType.includes(item.param.name)) {
              this.sideData.push({
                value: item.value,
                showName: item.param.showName,
                unit: item.param.unit
              });
            }
          });
        });
    },
    getExternalData() {
      //外部数据
      this.$axios
        .get("/data/json/getNewestDataByNode/51", {
          withCredentials: true
        })
        .then(res => {
          res.data.dataParams.forEach(item => {
            if (this.externalSideType.includes(item.param.name)) {
              this.externalData.push({
                value: item.value,
                showName: item.param.showName,
                unit: item.param.unit
              });
            }
          });
        });
    },
    getVideo() {
      if (this.videoUrl) {
        this.myPlayer = this.$video(
          myVideo,
          {
            controls: true, //启动视频播放的唯一方法是使用autoplay属性或通过Player /v1。
            autoplay: true, //自动播放属性,muted:静音播放 muted
            preload: "auto", //建议浏览器是否应在<video>加载元素后立即开始下载视频数据。
            sources: [
              {
                src: this.videoUrl,
                type: "application/x-mpegURL"
              }
            ]
          },
          function() {}
        );
      } else {
        const videoDom = this.$refs.viodeRef; //不能用document 获取节点
        this.$video(videoDom).dispose();
      }
    },
    facilityChange(index) {
      //修改当前选中的设备
      this.facilityActive = this.activeObj.nodesList[index];
      this.getNode(this.facilityActive); //获取当前节点设备类型 传感器还是控制器
      this.getFacilityItem();
    },
    getFacilityItem() {
      this.itemControlList = [];
      //获取设备列表
      this.$axios
        .get("/actuators/out/" + this.facilityActive.id + "?tbType=node", {
          withCredentials: true
        })
        .then(res => {
          res.data.params.forEach(it => {
            for (let item in it) {
              if (typeof it[item] === "object") {
                for (let tt in it[item]) {
                  if (!(tt == "name")) {
                    this.itemControlList.push({
                      name: tt,
                      ...it[item][tt]
                    });
                  } else {
                    this.nodeType = it[item][tt];
                  }
                }
              }
            }
          });
        });
    },
    changeItem(index) {
      this.itemControlList[index].status =
        this.itemControlList[index].status === "on" ? "off" : "on";
      let params = {
        id: this.activeObj.id,
        oldStatus: "enabled",
        location: {
          id: this.activeObj.location.id
        },
        type: "node",
        name: this.activeObj.name,
        channelName: this.itemControlList[index].name,
        status:
          this.itemControlList[index].status === "on" ? "enabled" : "disabled",
        nodeGroup: {
          id: this.activeObj.id
        },
        nodeType: {
          id: 1
        },
        nodeAlarm: "disabled", //报警
        nodeAutoCtrl: "disabled" //自动控制
      };
      this.$axios
        .post("/system/node/update", params, {
          withCredentials: true
        })
        .then(res => {
          console.log(res);
        });
      console.log(this.activeObj, this.itemControlList[index]);
    },
    holdLogin() {
      var dataObj = qs.stringify({
        username: "wzyd",
        password: "1234",
        rememberMe: "on"
      });
      this.$axios
        .post("/login", dataObj, {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          withCredentials: true
        })
        .then(res => {
          if (res.status === 200) {
            sessionStorage.setItem("login", uu);
            this.$router.push("/");
          }
        });
    },
    socket() {
      var url = "http://dpgl.aihxkj.com/websocket";
      var socket = new SockJS(url);
      this.__StompClient = Stomp.over(socket);

      // __StompClient.subscribe('/app/unReadMessages',function(message){
      //   console.log(message.body,"message")
      // })
      // __StompClient.subscribe('/topic/25/newMessage',function(message){
      //   console.log(message.body,"message")
      // })
    },
    bindSubscript(id) {
      //绑定监听
      this.__StompClient.connect({}, frame => {
        this.__StompClient.subscribe(
          `http://dpgl.aihxkj.com/topic/${id}/newData`,
          message => {
            this.getFacilityItem();
          }
        );
      });
    },
    getNode(facil) {
      this.$axios
        .get(`/data/json/getNewestDataByNode/${facil.id}`, {
          withCredentials: true
        })
        .then(res => {
          this.facilNodeType = res.data.dataParams[0].param.value;
          this.facilData = res.data.dataString +=
            "|数据时刻:" + res.data.createDate;
          this.onlineStatus = res.data.onlineStatus;
        });
    }
  },
  watch: {
    activeObj() {
      this.facilityActive = this.activeObj.nodesList[0];
      this.getNode(this.facilityActive); //获取当前节点设备类型 传感器还是控制器
      this.bindSubscript(this.activeObj.location.id);
      this.getFacilityItem();
    } //监听大棚选项变化
  },
  mounted() {
    this.socket(); //连接socket
    this.getInsideData(); //获取内部数据
    this.getExternalData(); //获取外部数据
    axios.get('http://zhcn.aihxkj.com/control/haik.php').then(res=>{
      this.videoUrl=res.data.data.url;
    this.getVideo(); //获取视频
    })
    setInterval(() => {
      this.holdLogin();
    }, 60 * 1000 * 28);
  },
  computed: {
    facilDataArr() {
      return this.facilData.split("|");
    }
  }
};
</script>

<style lang="less">
.radioList {
  display: inline;
  .ant-radio-wrapper {
    color: #fff !important;
  }
}
#control {
  position: fixed;
  width: 100%;
  height: 100%;
  z-index: 99;
  background: rgba(0, 0, 0, 0.4);
  .popFrame {
    background: rgba(0, 46, 115, 0.8);
    width: 600px;
    height: 400px;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    text-align: left;
    padding: 2%;
    font-size: 20px;
    box-sizing: border-box;
    color: #eee;
    border-radius: 10px;
    .ant-select,.ant-input{
      margin:10px;
    }
    button{
      margin:30px 0 0 0;
    }
    input{
      margin-left: 20px;
    }
    .controlRow {
      margin-top: 20px;
    }
  }
}
.main {
  width: 1055px;
  float: left;
  height: calc(100% - 152px);
  margin: 40px 30px 0 30px;
  overflow: hidden;
  .ant-switch {
    background: #ff2e2e;
  }
  .ant-switch-checked {
    background: #25e925;
  }
  .video {
    width: 690px !important;
    box-sizing: border-box;
    padding: 20px;
    height: 494px !important;
    background: url("../../assets/vedio.png") no-repeat;
    background-size: 100% 100%;
    position: relative !important;
    float: left;
    video {
      width: 650px;
      height: 460px;
      background: #000;
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      margin: auto;
    }
    .video-js {
      position: static !important;
      width: 640px !important;
      height: 454px !important;
      background: #000;
      margin: 0;
      padding: 0;
      top: 0;
      left: 0;
    }
  }
  .current-data {
    width: 365px;
    float: left;
    .data-row {
      width: 158px;
      float: left;
      margin-left: 24px;
      h4 {
        background: linear-gradient(to right, #0074ff, #00dff9, #0074ff);
        -webkit-background-clip: text;
        color: transparent;
        font-size: 26px;
        font-weight: bold;
      }
      ul {
        padding: 0;
        li {
          width: 100%;
          height: 70px;
          background: url("../../assets/liBg.png") no-repeat;
          background-size: 100% 100%;
          margin-top: 21px;
          overflow: hidden;
          span {
            img {
              height: 16px;
              vertical-align: middle;
              margin-right: 5px;
            }
            font-size: 14px;
            vertical-align: middle;
            margin-top: -20px;
          }
          p {
            font-size: 28px;
            height: 38px;
            padding: 0;
            margin: 3px 0 0 0;
          }
        }
        .li1 {
          color: #08c7f1;
        }
        .li2 {
          color: #ffd725;
        }
        .li3 {
          color: #ad55ff;
        }
        .li4 {
          color: #f75050;
        }
        .li5 {
          color: #0dde79;
        }
      }
    }
  }
  .facility-state,
  .facility-control {
    width: 514px;
    height: 378px;
    background: rgba(56, 83, 146, 0.21);
    box-sizing: border-box;
    border: 1px solid #073050;
    float: left;
    margin-top: 42px;
    .facility-main {
      font-size: 16px;
      color: #ffffff;
      display: flex;
      flex-basis: 100%;
      justify-content: space-between;
      div {
        width: 50%;
        margin-top: 36px;
        h5 {
          font-size: 18px;
          color: #08c7f1;
          text-align: left;
          margin: -10px 0 20px 30px;
          position: relative;

          span {
            position: absolute;
            right: 46px;
          }
        }
        p.control {
          font-size: 16px;
          color: #08c7f1;
          span {
            position: absolute;
            right: 46px;
          }
        }
        p {
          text-align: left;
          margin-left: 30px;
          position: relative;
        }
      }
    }
    h4 {
      background: linear-gradient(
        to right,
        rgba(8, 37, 183, 0.5),
        rgba(1, 180, 255, 0.2)
      );
      height: 40px;
      margin: 15px auto 0 auto;
      text-align: left;
      padding-left: 25px;
      line-height: 40px;
      font-size: 22px;
      font-weight: bold;
      font-family: "微软雅黑";
      width: 480px;
      span {
        background: linear-gradient(to right, #0074ff, #00dff9, #0074ff);
        -webkit-background-clip: text;
        color: transparent;
      }
    }
    .facility-time {
      font-size: 16px;
      float: right;
      margin-right: 20px;
      font-weight: bold;
    }
  }
  .facility-control {
    margin-left: 27px;
  }
  .facility-state {
    position: relative;
    .facility-List {
      list-style: none;
      color: #fff;
      text-align: left;
      padding: 0;
      margin: 20px 20px 0 20px;
      li {
        height: 50px;
        line-height: 50px;
        font-size: 18px;
        cursor: pointer;
        padding: 0 0 0 20px;
        box-sizing: border-box;
        border-bottom: 1px solid #09208e;
        span {
          color: rgba(255, 255, 255, 0.4);
        }
        &.active {
          background: #0684d5;
          span {
            color: #fff;
          }
        }
      }
    }
    .save-btn {
      width: 117px;
      height: 30px;
      line-height: 30px;
      background: linear-gradient(to right, #09208e, #0484c5);
      position: absolute;
      left: 22px;
      bottom: 17px;
      span {
        font-size: 18px;
        background: linear-gradient(to right, #00a0ff, #00eaff, #01abfb);
        -webkit-background-clip: text;
        color: transparent;
      }
    }
  }
  .cgqState {
    list-style: none;
    color: #08c7f1;
    font-size: 16px;
    text-align: left;
    margin-top: 18px;
    li {
      line-height: 30px;
    }
  }
}
</style>