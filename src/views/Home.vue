<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <room msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>
// @ is an alias to /src
import room from '@/components/room.vue'

export default {
  name: 'Home',
  components: {
    room
  }
}
</script>
