<template>
  <footer class="footer">
    <div class="container">
      <div class="footer-content">
        <!-- 版权信息 -->
        <p class="copyright">© 2025 AdminSystem. 保留所有权利</p>

        <!-- 底部链接 -->
        <div class="footer-links">
          <a href="/privacy" class="footer-link">隐私政策</a>
          <span class="link-divider">|</span>
          <a href="/terms" class="footer-link">服务条款</a>
          <span class="link-divider">|</span>
          <a href="/contact" class="footer-link">联系我们</a>
        </div>

        <!-- 系统信息 -->
        <p class="system-info">当前版本 v1.0.0 | 上次更新: 2025-10-27</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
// 页脚组件无需复杂逻辑，主要提供布局和链接
</script>

<style scoped>
.footer {
  background-color: #fff;
  border-top: 1px solid #f0f2f5;
  padding: 30px 0 20px;
  margin-top: auto; /* 确保页脚在页面底部 */
}

.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.footer-content {
  text-align: center;
}

.copyright {
  font-size: 14px;
  color: #606266;
  margin: 0 0 15px;
}

.footer-links {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  margin-bottom: 15px;
}

.footer-link {
  font-size: 13px;
  color: #606266;
  text-decoration: none;
  transition: color 0.3s;
}

.footer-link:hover {
  color: #409eff;
}

.link-divider {
  color: #e5e6eb;
  font-size: 12px;
}

.system-info {
  font-size: 12px;
  color: #909399;
  margin: 0;
}
</style>
