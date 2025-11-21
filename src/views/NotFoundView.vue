<template>
  <div class="not-found-page">
    <div class="not-found-container">
      <div class="error-code">404</div>
      <h2 class="error-message">页面不存在</h2>
      <p class="error-desc">您访问的页面不存在或已被删除</p>
      <button class="back-btn" @click="$router.push('/')">
        返回首页
      </button>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.not-found-page {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f7fa;
}

.not-found-container {
  text-align: center;
  padding: 50px;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
}

.error-code {
  font-size: 80px;
  font-weight: 700;
  color: #409eff;
  margin-bottom: 20px;
}

.error-message {
  font-size: 24px;
  color: #1d2129;
  margin-bottom: 10px;
}

.error-desc {
  font-size: 14px;
  color: #606266;
  margin-bottom: 30px;
}

.back-btn {
  background-color: #409eff;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 10px 20px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.back-btn:hover {
  background-color: #66b1ff;
}
</style>
