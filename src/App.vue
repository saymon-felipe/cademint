<template>
  <div id="app">
    <router-view path="$router.key" />
  </div>
</template>

<script>
import './style/global.css';

export default {
  name: 'App'
}
</script>
