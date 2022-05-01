<template>
  <router-view />
</template>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #eee;
}
body {
  background: url("../src/assets/background.webp");
  height: 100vh;
  width: 100%;
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  position: relative;
}
body::after {
  content: "";
  position: var(--onAnotherPages, fixed);
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background-color: rgba($color: #76b3e2, $alpha: 0.8);
  z-index: -1;
  color: rgb(168, 168, 168);
  height: 100vh;
}
</style>
