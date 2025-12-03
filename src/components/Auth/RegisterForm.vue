<template>
  <el-form ref="registerFormRef" :model="registerForm" :rules="registerRules" class="auth-form">

    <!-- <el-form-item prop="name">
      <el-input v-model="registerForm.name" placeholder="用户名" prefix-icon="User" size="large"
        clearable></el-input>
    </el-form-item> -->

    <!-- <el-form-item prop="account">
      <el-input v-model="registerForm.account" placeholder="手机号或邮箱" prefix-icon="User" size="large"
        clearable></el-input>
    </el-form-item> -->

    <el-form-item prop="tel">
      <el-input v-model="registerForm.tel" placeholder="手机号" prefix-icon="Cellphone" size="large" clearable></el-input>
    </el-form-item>

    <el-form-item prop="email">
      <el-input v-model="registerForm.email" placeholder="邮箱" prefix-icon="Message" size="large" clearable></el-input>
    </el-form-item>

    <el-form-item prop="password">
      <el-input v-model="registerForm.password" type="password" placeholder="设置密码（至少6位）" prefix-icon="Lock"
        show-password size="large" clearable></el-input>
    </el-form-item>

    <el-form-item prop="captcha">
      <Captcha :api-base="API_BASE" v-model:captchaUuid="registerForm.captcha_uuid"
        v-model:captchaValue="registerForm.captcha" />
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="handleRegister" class="submit-btn" size="large" :loading="registerLoading">
        注册
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { ElMessage } from 'element-plus';
import axios from 'axios';
import Captcha from './CaptchaComponent.vue';


// 向父组件传递注册成功事件（用于切换到登录模式）
const emit = defineEmits(['registerSuccess']);
const API_BASE = 'http://127.0.0.1:5000';
const registerFormRef = ref(null);
const registerLoading = ref(false);
const registerForm = reactive({
  account: '',
  password: '',
  captcha: '',
  captcha_uuid: ''
});

// 表单验证规则
const registerRules = reactive({
  // name: [
  //   { required: true, message: '请输入用户名', trigger: 'blur' },
  //   { min: 2, max: 20, message: '用户名长度应在2到20个字符之间', trigger: 'blur' }
  // ],
  account: [
    { required: true, message: '请输入手机号或邮箱', trigger: 'blur' },
    { pattern: /(^\d{11}$)|(^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$)/, message: '请输入正确的格式', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请设置密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6位', trigger: 'blur' }
  ],
  captcha: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    { min: 4, max: 4, message: '验证码长度为4位', trigger: 'blur' }
  ]
});

// 注册逻辑
const handleRegister = async () => {
  try {
    await registerFormRef.value.validate();
    registerLoading.value = true;

    // 构建请求参数
    const params = {
      // name: registerForm.name,
      account: registerForm.account,
      password: registerForm.password,
      captcha: registerForm.captcha.toLowerCase(),
      captcha_uuid: registerForm.captcha_uuid
    };
    if (registerForm.account.includes('@')) {
      params.email = registerForm.account;
    } else {
      params.tel = registerForm.account;
    }

    // 发送注册请求
    const { data } = await axios.post(`${API_BASE}/api/user/register`, params);
    if (data.success) {
      ElMessage.success('注册成功，请登录');
      emit('registerSuccess'); // 通知父组件切换模式
    } else {
      ElMessage.error(data.message || '注册失败');
    }
  } catch (error) {
    console.error('注册错误:', error);
    const msg = error.response?.data?.message || '网络错误，请检查后端';
    ElMessage.error(msg);
  } finally {
    registerLoading.value = false;
  }
};
</script>

<style scoped>
/* 与LoginForm共享submit-btn样式，可提取到公共CSS */
.submit-btn {
  width: 100%;
  height: 48px;
  font-size: 16px;
  border-radius: 8px;
}
</style>
