<template>
  <div id="app">
    <room msg="Welcome to Your Vue.js App"/>
    <div class="footer">警示：该网站为个人开发网站测试专用，禁止任何交易及非法言论。</div>
  </div>
</template>

<script>
import room from './components/room.vue'

export default {
  name: 'App',
  components: {
    room
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
.footer{
  font-size: 12px;
  color: #999;
}
</style>
