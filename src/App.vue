<template>
  <div id="app">
    <router-view path="$router.key" class="system-frame" />
  </div>
</template>

<script>
import './style/global.css';

export default {
  name: 'App'
}
</script>
<style>
#app, .system-frame {
  width: 100vw;
  height: 100vh;
}
</style>
