<template>
  <div class="auth-page">
    <!-- 背景装饰 -->
    <div class="bg-pattern"></div>

    <!-- 登录注册卡片 -->
    <div class="auth-card">
      <!-- 标题区域 -->
      <div class="auth-header">
        <h2 class="title">{{ isLoginMode ? '账号登录' : '用户注册' }}</h2>
      </div>

      <!-- 动态切换表单 -->
      <LoginForm v-if="isLoginMode" @loginSuccess="handleLoginSuccess" />
      <RegisterForm v-else @registerSuccess="toggleMode" />

      <!-- 模式切换 -->
      <div class="mode-switch">
        <span>
          {{ isLoginMode ? '还没有账号?' : '已有账号?' }}
          <el-link type="primary" @click="toggleMode" class="switch-link">
            {{ isLoginMode ? '立即注册' : '立即登录' }}
          </el-link>
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import LoginForm from '@/components/Auth/LoginForm.vue';
import RegisterForm from '@/components/Auth/RegisterForm.vue';

const router = useRouter();

const isLoginMode = ref(true);

const toggleMode = () => {
  isLoginMode.value = !isLoginMode.value;
};

const handleLoginSuccess = () => {
  router.push('/');
};
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  background-color: #f5f7fa;
  position: relative;
}

.bg-pattern {
  position: absolute;
  width: 100%;
  height: 100%;
  background-image:
    radial-gradient(circle at 20% 30%, rgba(64, 158, 255, 0.1) 0%, transparent 40%),
    radial-gradient(circle at 80% 70%, rgba(64, 158, 255, 0.1) 0%, transparent 40%);
  z-index: 0;
}

.auth-card {
  width: 100%;
  max-width: 420px;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  padding: 36px 30px;
  z-index: 1;
  transition: box-shadow 0.3s ease;
}

.auth-card:hover {
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.12);
}

.auth-header {
  text-align: center;
  margin-bottom: 30px;
}

.title {
  font-size: 24px;
  font-weight: 600;
  color: #1d2129;
  margin: 0 0 8px;
}

.mode-switch {
  text-align: center;
  margin-top: 24px;
  font-size: 14px;
  color: #86909c;
}

.switch-link {
  margin-left: 4px;
  cursor: pointer;
}

/* 响应式调整 */
@media (max-width: 480px) {
  .auth-card {
    padding: 28px 20px;
  }

  .title {
    font-size: 22px;
  }
}
</style>
