<template>
  <div class="login">
    <div class="login-box">
      
    <h2>智能农业管理系统</h2>
      <div class="loginMain">
        <a-input placeholder="帐号" v-model="username" class="a-input" />
        <a-input placeholder="密码" v-model="password" class="a-input" type="password" />
        <a-button type="primary" @click="login" class="a-input">登录</a-button>
      </div>
    </div>
  </div>
</template>

<script>
import qs from "qs";
import uu from "../../util/uuid";

export default {
  data() {
    return {
      username: "",
      password: ""
    };
  },
  methods: {
    login() {
      var dataObj = qs.stringify({
        username: this.username,
        password: this.password,
        rememberMe: "on"
      });
      this.$axios({
        url: "/login",
        method: "post",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        withCredentials: true,
        data: dataObj
      }).then(res => {
        console.log(res.headers["set-cookie"]);
        if (res.status === 200) {
          sessionStorage.setItem("login", uu);
          this.$router.push("/");
        }
      });
    }
  },
  mounted() {}
};
</script>

<style lang="less">
.login {
  background: url("../../assets/loginBg.png") no-repeat;
  background-size: 100% 100%;
  width: 100%;
  height: 100%;
}
.login-box {
  width: 500px;
  height: 400px;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;

  .loginMain {
    background: rgba(0, 46, 115, 0.5);
    padding: 50px;
  }
  h2 {
    color: #fff;
    font-size: 36px;
    font-weight: bold;
    width: 500px;
    text-align: center;
  }
  .a-input[type="text"],.a-input[type="password"]{
    margin-top: 30px;
    height: 40px;
    background: transparent;
    border-color: #00a0e9;
    color: #aaaaaa;
  }
  button{
    width: 400px;
    height: 40px;
    margin-top: 30px;
    background: linear-gradient(to bottom,#0082e4,#0248b7);
    border-radius: 5px;
    border: none;
    &:hover{
      background: linear-gradient(to bottom,#0b89e5,#0655d1);
      opacity: 1.2;
    }
  }
}
</style>