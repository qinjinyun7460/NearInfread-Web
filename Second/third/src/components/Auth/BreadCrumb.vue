<template>
  <el-header class="navbar" height="auto">
    <div class="container">
      <!-- 动态面包屑 -->
      <el-breadcrumb separator="/">
        <el-breadcrumb-item v-for="(route, index) in $route.matched" :key="index"
          :to="null">
          {{ route.meta.title }}
        </el-breadcrumb-item>
      </el-breadcrumb>

    </div>
  </el-header>
</template>

<script setup>
// import { useRoute } from 'vue-router';

// const route = useRoute();

// // 生成当前路由的完整路径（用于面包屑点击跳转）
// const getRoutePath = (currentRoute, index) => {
//   // 截取到当前索引的路由记录，拼接完整路径
//   return route.matched.slice(0, index + 1).map(r => r.path).join('');
// };


</script>
