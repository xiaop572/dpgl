<template>
  <div id="app">
    <router-view />
    <portal-target name="destination">
      <!--
  This component can be located anywhere in your App.
  The slot content of the above portal component will be rendered here.
      -->
    </portal-target>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {},
  mounted() {}
};
</script>
<style lang="less">
body {
  background: url("./assets/bg.png") no-repeat;
  background-size: 100% 100%;
}
body,
#app {
  height: 100%;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
