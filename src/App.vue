<script setup>

</script>

<template>
  <router-view></router-view>
</template>

<style>
* {
  box-sizing: border-box
}
body {
  @apply bg-gray-100;
}

#nprogress .bar {
  background-color: #f4f4f4;
  height: 3px;
}
::-webkit-scrollbar {
    width: 4px;
    height: 3px;
}

::-webkit-scrollbar-track {
    /* background: transparent;  */
    border-radius: 3px;
}

::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
    cursor: pointer;
}

</style>>