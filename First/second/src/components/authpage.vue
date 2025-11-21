<template>
  <div class="auth-container">
    <!-- 背景装饰 -->
    <div class="bg-pattern"></div>
    
    <!-- 登录注册卡片 -->
    <div class="auth-card">
      <!-- 标题区域 -->
      <div class="auth-header">
        <h2 class="title">{{ isLoginMode ? '账号登录' : '用户注册' }}</h2>
        <p class="subtitle">{{ isLoginMode ? '请输入账号信息登录' : '填写信息创建新账号' }}</p>
      </div>

      <!-- 登录表单 -->
      <el-form 
        v-if="isLoginMode" 
        ref="loginFormRef" 
        :model="loginForm" 
        :rules="loginRules" 
        class="auth-form"
      >
        <el-form-item prop="account">
          <el-input 
            v-model="loginForm.account" 
            placeholder="手机号或邮箱" 
            prefix-icon="User"
            size="large"
            clearable
          ></el-input>
        </el-form-item>

        <el-form-item prop="password">
          <el-input 
            v-model="loginForm.password" 
            type="password" 
            placeholder="密码" 
            prefix-icon="Lock"
            show-password
            size="large"
            clearable
          ></el-input>
        </el-form-item>

        <!-- 验证码 -->
        <el-form-item prop="captcha">
          <div class="captcha-row">
            <el-input 
              v-model="loginForm.captcha" 
              placeholder="验证码" 
              prefix-icon="Check"
              size="large"
              clearable
              class="captcha-input"
            ></el-input>
            <div class="captcha-img-container" @click="refreshCaptcha('login')">
              <img 
                :src="loginCaptchaUrl" 
                alt="验证码" 
                class="captcha-img"
                @error="refreshCaptcha('login')"
              >
              <span class="refresh-text">点击刷新</span>
            </div>
          </div>
        </el-form-item>

        <div class="form-actions">
          <el-checkbox v-model="loginForm.remember" size="small">记住我</el-checkbox>
          <el-link type="primary" size="small" @click="handleForgot">忘记密码?</el-link>
        </div>

        <el-form-item>
          <el-button 
            type="primary" 
            @click="handleLogin" 
            class="submit-btn"
            size="large"
            :loading="loginLoading"
          >
            登录
          </el-button>
        </el-form-item>
      </el-form>

      <!-- 注册表单 -->
      <el-form 
        v-else 
        ref="registerFormRef" 
        :model="registerForm" 
        :rules="registerRules" 
        class="auth-form"
      >
        <el-form-item prop="name">
          <el-input 
            v-model="registerForm.name" 
            placeholder="用户名" 
            prefix-icon="User"
            size="large"
            clearable
          ></el-input>
        </el-form-item>

        <el-form-item prop="tel">
          <el-input 
            v-model="registerForm.tel" 
            placeholder="手机号" 
            prefix-icon="Phone"
            size="large"
            clearable
          ></el-input>
        </el-form-item>

        <el-form-item prop="email">
          <el-input 
            v-model="registerForm.email" 
            placeholder="邮箱" 
            prefix-icon="Message"
            size="large"
            clearable
          ></el-input>
        </el-form-item>

        <el-form-item prop="password">
          <el-input 
            v-model="registerForm.password" 
            type="password" 
            placeholder="设置密码（至少6位）" 
            prefix-icon="Lock"
            show-password
            size="large"
            clearable
          ></el-input>
        </el-form-item>

        <!-- 验证码 -->
        <el-form-item prop="captcha">
          <div class="captcha-row">
            <el-input 
              v-model="registerForm.captcha" 
              placeholder="验证码" 
              prefix-icon="Check"
              size="large"
              clearable
              class="captcha-input"
            ></el-input>
            <div class="captcha-img-container" @click="refreshCaptcha('register')">
              <img 
                :src="registerCaptchaUrl" 
                alt="验证码" 
                class="captcha-img"
                @error="refreshCaptcha('register')"
              >
              <span class="refresh-text">点击刷新</span>
            </div>
          </div>
        </el-form-item>

        <el-form-item>
          <el-button 
            type="primary" 
            @click="handleRegister" 
            class="submit-btn"
            size="large"
            :loading="registerLoading"
          >
            注册
          </el-button>
        </el-form-item>
      </el-form>

      <!-- 切换模式 -->
      <div class="mode-switch">
        <span>
          {{ isLoginMode ? '还没有账号?' : '已有账号?' }}
        </span>
        <el-link 
          type="primary" 
          @click="toggleMode"
          class="switch-link"
        >
          {{ isLoginMode ? '立即注册' : '立即登录' }}
        </el-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

// 后端接口基础地址
const API_BASE = 'http://127.0.0.1:5000';

// 状态管理
const isLoginMode = ref(true); // 登录/注册模式切换
const loginLoading = ref(false); // 登录按钮加载状态
const registerLoading = ref(false); // 注册按钮加载状态

// 表单引用
const loginFormRef = ref(null);
const registerFormRef = ref(null);

// 验证码相关
const loginCaptchaUuid = ref('');
const loginCaptchaUrl = ref('');
const registerCaptchaUuid = ref('');
const registerCaptchaUrl = ref('');

// 登录表单数据
const loginForm = reactive({
  account: '',       // 手机号或邮箱
  password: '',      // 密码
  captcha: '',       // 验证码
  remember: false,   // 记住我
  captcha_uuid: ''   // 验证码UUID
});

// 注册表单数据
const registerForm = reactive({
  name: '',          // 用户名
  tel: '',           // 手机号
  email: '',         // 邮箱
  password: '',      // 密码
  captcha: '',       // 验证码
  captcha_uuid: ''   // 验证码UUID
});

// 登录表单验证规则
const loginRules = reactive({
  account: [
    { required: true, message: '请输入手机号或邮箱', trigger: 'blur' }
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

// 注册表单验证规则
const registerRules = reactive({
  name: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 2, max: 20, message: '用户名长度在2-20个字符之间', trigger: 'blur' }
  ],
  tel: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
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

/**
 * 获取验证码
 * @param {string} type - 'login' 或 'register'
 */
const getCaptcha = (type) => {
  const uuid = uuidv4(); // 生成唯一UUID
  const timestamp = Date.now(); // 时间戳防缓存
  const url = `${API_BASE}/api/captcha?uuid=${uuid}&t=${timestamp}`;

  if (type === 'login') {
    loginCaptchaUuid.value = uuid;
    loginCaptchaUrl.value = url;
    loginForm.captcha_uuid = uuid;
  } else {
    registerCaptchaUuid.value = uuid;
    registerCaptchaUrl.value = url;
    registerForm.captcha_uuid = uuid;
  }
};

/**
 * 刷新验证码
 */
const refreshCaptcha = (type) => {
  getCaptcha(type);
};

/**
 * 切换登录/注册模式
 */
const toggleMode = () => {
  isLoginMode.value = !isLoginMode.value;
  // 重置当前表单
  if (isLoginMode.value) {
    registerFormRef.value?.resetFields();
  } else {
    loginFormRef.value?.resetFields();
  }
  // 刷新当前模式的验证码
  getCaptcha(isLoginMode.value ? 'login' : 'register');
};

/**
 * 处理登录
 */
const handleLogin = async () => {
  try {
    // 表单验证
    await loginFormRef.value.validate();
    loginLoading.value = true;

    // 构建请求参数（区分手机号/邮箱）
    const params = {
      password: loginForm.password,
      captcha: loginForm.captcha.toLowerCase(), // 转为小写匹配后端
      captcha_uuid: loginForm.captcha_uuid
    };

    // 判断账号类型
    if (loginForm.account.includes('@')) {
      params.email = loginForm.account;
    } else {
      params.tel = loginForm.account;
    }

    // 发送登录请求
    const { data } = await axios.post(`${API_BASE}/api/user/login`, params);

    if (data.success) {
      ElMessage.success('登录成功');
      // 存储用户信息
      const storage = loginForm.remember ? localStorage : sessionStorage;
      storage.setItem('userInfo', JSON.stringify(data.data.user));
      // 跳转到首页（实际项目中替换为Vue Router的push）
      setTimeout(() => window.location.href = '/', 1000);
    } else {
      ElMessage.error(data.message || '登录失败');
      refreshCaptcha('login'); // 失败后刷新验证码
    }
  } catch (error) {
    console.error('登录错误:', error);
    if (error.response) {
      ElMessage.error(error.response.data?.message || '登录失败，请重试');
      refreshCaptcha('login');
    } else {
      ElMessage.error('网络错误，请检查后端是否运行在127.0.0.1:5000');
    }
  } finally {
    loginLoading.value = false;
  }
};

/**
 * 处理注册
 */
const handleRegister = async () => {
  try {
    // 表单验证
    await registerFormRef.value.validate();
    registerLoading.value = true;

    // 构建请求参数
    const params = {
      name: registerForm.name,
      tel: registerForm.tel,
      email: registerForm.email,
      password: registerForm.password,
      captcha: registerForm.captcha.toLowerCase(), // 转为小写匹配后端
      captcha_uuid: registerForm.captcha_uuid
    };

    // 发送注册请求
    const { data } = await axios.post(`${API_BASE}/api/user/register`, params);

    if (data.success) {
      ElMessage.success('注册成功，请登录');
      toggleMode(); // 切换到登录模式
    } else {
      ElMessage.error(data.message || '注册失败');
      refreshCaptcha('register'); // 失败后刷新验证码
    }
  } catch (error) {
    console.error('注册错误:', error);
    if (error.response) {
      ElMessage.error(error.response.data?.message || '注册失败，请重试');
      refreshCaptcha('register');
    } else {
      ElMessage.error('网络错误，请检查后端是否运行在127.0.0.1:5000');
    }
  } finally {
    registerLoading.value = false;
  }
};

/**
 * 忘记密码处理
 */
const handleForgot = () => {
  ElMessage.info('忘记密码功能待实现');
};

// 初始化：加载登录验证码
onMounted(() => {
  getCaptcha('login');
});
</script>

<style scoped>
.auth-container {
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

.subtitle {
  font-size: 14px;
  color: #86909c;
  margin: 0;
}

.auth-form {
  width: 100%;
}

/* 验证码样式 */
.captcha-row {
  display: flex;
  gap: 10px;
  align-items: center;
}

.captcha-input {
  flex: 1;
}

.captcha-img-container {
  width: 130px;
  height: 48px;
  position: relative;
  cursor: pointer;
  border-radius: 6px;
  overflow: hidden;
  background-color: #f5f7fa;
}

.captcha-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.2s;
}

.captcha-img-container:hover .captcha-img {
  transform: scale(1.05);
}

.refresh-text {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 20px;
  line-height: 20px;
  text-align: center;
  font-size: 12px;
  color: #606266;
  background-color: rgba(255, 255, 255, 0.8);
}

/* 表单操作区 */
.form-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 10px 0 20px;
  font-size: 14px;
}

/* 提交按钮 */
.submit-btn {
  width: 100%;
  height: 48px;
  font-size: 16px;
  border-radius: 8px;
}

/* 模式切换 */
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
  
  .captcha-img-container {
    width: 110px;
  }
}
</style>
