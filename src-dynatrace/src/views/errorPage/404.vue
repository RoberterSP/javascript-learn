<template>
  <div class="page">
    <!-- <p class="page_title">404 page not found</p> -->
    <img src="@/assets/image/you-shall-not-pass.svg" alt="" @click="$router.replace({ path: '/' })">
  </div>
</template>
<style scoped lang="less">
@import "~common/style/variable";
img {
  width: 100%;
  cursor: pointer;
}
</style>
