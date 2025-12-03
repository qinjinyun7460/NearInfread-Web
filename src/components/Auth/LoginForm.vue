<template>
  <el-form ref="loginFormRef" :model="loginForm" :rules="loginRules" class="auth-form">
    <!-- 账号输入 -->
    <el-form-item prop="account">
      <el-input v-model="loginForm.account" placeholder="手机号或邮箱" prefix-icon="User" size="large" clearable></el-input>
    </el-form-item>

    <!-- 密码输入 -->
    <el-form-item prop="password">
      <el-input v-model="loginForm.password" type="password" placeholder="密码" prefix-icon="Lock" show-password
        size="large" clearable></el-input>
    </el-form-item>

    <!-- 验证码（复用公共组件） -->
    <el-form-item prop="captcha">
      <Captcha :api-base="API_BASE" v-model:captchaUuid="loginForm.captcha_uuid"
        v-model:captchaValue="loginForm.captcha" />
    </el-form-item>

    <!-- 记住我 & 忘记密码 -->
    <div class="form-actions">
      <el-checkbox v-model="loginForm.remember">记住我</el-checkbox>
      <!-- <el-link type="primary" size="small" @click="handleForgot">忘记密码?</el-link> -->
    </div>

    <!-- 登录按钮 -->
    <el-form-item>
      <el-button type="primary" @click="handleLogin" class="submit-btn" size="large" :loading="loginLoading">
        登录
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script setup>
import { ref, reactive } from 'vue';

import { ElMessage } from 'element-plus';
import axios from 'axios';
import Captcha from './CaptchaComponent.vue';

// 向父组件传递登录成功事件
const emit = defineEmits(['loginSuccess']);
const API_BASE = 'http://127.0.0.1:5000';
const loginFormRef = ref(null);
const loginLoading = ref(false);
const loginForm = reactive({
  account: '',
  password: '',
  captcha: '',
  remember: false,
  captcha_uuid: ''
});

// 表单验证规则
const loginRules = reactive({
  account: [
    { required: true, message: '请输入手机号或邮箱', trigger: 'blur' },
    { pattern: /(^\d{11}$)|(^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$)/, message: '请输入正确的格式', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6位', trigger: 'blur' }
  ],
  captcha: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    { min: 4, max: 4, message: '验证码长度为4位', trigger: 'blur' }
  ]
});

// 登录逻辑
const handleLogin = async () => {
  try {
    await loginFormRef.value.validate();
    loginLoading.value = true;

    const params = {
      tel: loginForm.tel,
      email: loginForm.email,
      password: loginForm.password,
      captcha: loginForm.captcha.toLowerCase(),
      captcha_uuid: loginForm.captcha_uuid,
    };
    if (loginForm.account.includes('@')) {
      params.email = loginForm.account;
    } else {
      params.tel = loginForm.account;
    }


    const response = await axios.post(`${API_BASE}/api/user/login`, params);

    if (response.data.success) {
      ElMessage.success('登录成功');
      const storage = loginForm.remember ? localStorage : sessionStorage;

      const userInfo = response.data.data.user
      storage.setItem('userInfo', JSON.stringify(userInfo));

      const current_user_id = response.data.data.user.user_id

      if (current_user_id) {
        // localStorage.setItem('current_user_id', current_user_id);
        // localStorage.setItem('role', response.data.data.user.role);
        storage.setItem('current_user_id', current_user_id);
        storage.setItem('role', response.data.data.user.role);
      } else {
        ElMessage.error('登录失败: 未获取到用户ID');
      }

      emit('loginSuccess');

    } else {
      ElMessage.error(response.data.message || '登录失败');
    }
  }
  catch (error) {
    console.error('登录错误:', error);
    const msg = error.response?.data?.message || '网络错误，请检查后端';
    ElMessage.error(msg);
  }
  finally {
    loginLoading.value = false;
  }
};


</script>

<style scoped>
.form-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 10px 0 20px;
  font-size: 14px;
}

.submit-btn {
  width: 100%;
  height: 48px;
  font-size: 16px;
  border-radius: 8px;
}
</style>
