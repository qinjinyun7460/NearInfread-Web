<template>
  <div class="auth-container">
    <!-- 背景装饰 -->
    <div class="bg-pattern"></div>

    <!-- 登录注册卡片 -->
    <div class="auth-card">
      <!-- 标题区域 -->
      <div class="auth-header">
        <h2 class="title">{{ isLoginMode ? '账号登录' : '用户注册' }}</h2>
        <!-- <p class="subtitle">{{ isLoginMode ? '请输入账号信息登录' : '填写信息创建新账号' }}</p> -->
      </div>

      <!-- 登录表单 -->
      <el-form v-if="isLoginMode" ref="loginFormRef" :model="loginForm" :rules="loginRules" class="auth-form">
        <el-form-item prop="account">
          <el-input v-model="loginForm.account" placeholder="手机号或邮箱" prefix-icon="User" size="large"
            clearable></el-input>
        </el-form-item>
        

        <el-form-item prop="password">
          <el-input v-model="loginForm.password" type="password" placeholder="密码" prefix-icon="Lock" show-password
            size="large" clearable></el-input>
        </el-form-item>

        <!-- 验证码 -->
        <el-form-item prop="captcha">
          <div class="captcha-row">
            <el-input v-model="loginForm.captcha" placeholder="验证码" prefix-icon="Check" size="large" clearable
              class="captcha-input"></el-input>
            <div class="captcha-img-container" @click="refreshCaptcha('login')">
              <img :src="loginCaptchaUrl" alt="验证码" class="captcha-img" @error="refreshCaptcha('login')">
              <span class="refresh-text">点击刷新</span>
            </div>
          </div>
        </el-form-item>

        <div class="form-actions">
          <el-checkbox v-model="loginForm.remember" size="small">记住我</el-checkbox>
          <el-link type="primary" size="small" @click="handleForgot">忘记密码?</el-link>
        </div>

        <el-form-item>
          <el-button type="primary" @click="handleLogin" class="submit-btn" size="large" :loading="loginLoading">
            登录
          </el-button>
        </el-form-item>
      </el-form>

      <!-- 注册表单 -->
      <el-form v-else ref="registerFormRef" :model="registerForm" :rules="registerRules" class="auth-form">
        <!-- <el-form-item prop="name">
          <el-input 
            v-model="registerForm.name" 
            placeholder="用户名" 
            prefix-icon="User"
            size="large"
            clearable
          ></el-input>
        </el-form-item> -->

        <!-- <el-form-item prop="tel">
          <el-input v-model="registerForm.tel" placeholder="手机号" prefix-icon="Phone" size="large" clearable></el-input>
        </el-form-item>

        <el-form-item prop="email">
          <el-input v-model="registerForm.email" placeholder="邮箱" prefix-icon="Message" size="large"
            clearable></el-input>
        </el-form-item> -->

        <el-form-item prop="account">
          <el-input v-model="registerForm.account" placeholder="手机号或邮箱" prefix-icon="User" size="large"
            clearable></el-input>
        </el-form-item>

        <el-form-item prop="password">
          <el-input v-model="registerForm.password" type="password" placeholder="设置密码（至少6位）" prefix-icon="Lock"
            show-password size="large" clearable></el-input>
        </el-form-item>



        <!-- <el-form-item prop="password">
          <el-input v-model="registerForm.password" type="password" placeholder="再次输入密码" prefix-icon="Lock"
            show-password size="large" clearable></el-input>
        </el-form-item> -->

        <!-- 验证码 -->
        <el-form-item prop="captcha">
          <div class="captcha-row">
            <el-input v-model="registerForm.captcha" placeholder="验证码" prefix-icon="Check" size="large" clearable
              class="captcha-input"></el-input>
            <div class="captcha-img-container" @click="refreshCaptcha('register')">
              <img :src="registerCaptchaUrl" alt="验证码" class="captcha-img" @error="refreshCaptcha('register')">
              <span class="refresh-text">点击刷新</span>
            </div>
          </div>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleRegister" class="submit-btn" size="large" :loading="registerLoading">
            注册
          </el-button>
        </el-form-item>
      </el-form>

      <!-- 切换模式 -->
      <div class="mode-switch">
        <span>
          {{ isLoginMode ? '还没有账号?' : '已有账号?' }}
          <el-link type="primary" @click="toggleMode" class="switch-link">
            {{ isLoginMode ? '立即注册' : '立即登录' }}
          </el-link>
        </span>
        <!-- <el-link type="primary" @click="toggleMode" class="switch-link">
          {{ isLoginMode ? '立即注册' : '立即登录' }}
        </el-link> -->
      </div>
    </div>
  </div>

  <div class="home-container">
    <!-- 导航栏：与登录页蓝色主色调一致 -->
    <nav class="home-nav">
      <div class="container">
        <!-- 系统Logo -->
        <div class="nav-logo">
          <span class="logo-text">AdminSystem</span>
        </div>

        <!-- 导航菜单 -->
        <div class="nav-menu">
          <a href="#" class="menu-item active">首页</a>
          <a href="#" class="menu-item">数据中心</a>
          <a href="#" class="menu-item">系统设置</a>
          <a href="#" class="menu-item">帮助文档</a>
        </div>

        <!-- 用户信息区：显示登录用户信息 -->
        <div class="user-info" @click="showUserMenu = !showUserMenu">
          <img src="https://picsum.photos/id/1005/40/40" alt="用户头像" class="user-avatar">
          <span class="user-name">{{ userInfo?.name || '默认用户' }}</span>
          <i class="el-icon-arrow-down user-arrow"></i>

          <!-- 用户下拉菜单 -->
          <div class="user-dropdown" v-if="showUserMenu">
            <a href="#" class="dropdown-item">
              <i class="el-icon-user"></i> 个人中心
            </a>
            <a href="#" class="dropdown-item">
              <i class="el-icon-setting"></i> 账号设置
            </a>
            <a href="#" class="dropdown-item" @click="handleLogout">
              <i class="el-icon-logout"></i> 退出登录
            </a>
          </div>
        </div>
      </div>
    </nav>

    <!-- 欢迎区域：渐变背景呼应登录页风格 -->
    <section class="welcome-section">
      <div class="container">
        <h1 class="welcome-title">欢迎回来，{{ userInfo?.name || '用户' }}！</h1>
        <p class="welcome-desc">
          这里是系统核心首页，可快速访问各项功能模块，查看实时数据统计
        </p>
        <button class="primary-btn" @click="goToDashboard">
          进入数据控制台
        </button>
      </div>
    </section>

    <!-- 功能模块区：卡片式设计，hover效果增强交互 -->
    <section class="features-section">
      <div class="container">
        <h2 class="section-title">核心功能模块</h2>
        <div class="features-grid">
          <!-- 功能卡片1：数据统计 -->
          <div class="feature-card">
            <div class="card-icon blue">
              <i class="el-icon-data-analysis"></i>
            </div>
            <h3 class="card-title">数据统计</h3>
            <p class="card-desc">实时监控业务数据，生成多维度可视化报表</p>
            <a href="#" class="card-link">查看详情 →</a>
          </div>

          <!-- 功能卡片2：用户管理 -->
          <div class="feature-card">
            <div class="card-icon green">
              <i class="el-icon-user-group"></i>
            </div>
            <h3 class="card-title">用户管理</h3>
            <p class="card-desc">管理系统用户信息，分配角色与权限</p>
            <a href="#" class="card-link">查看详情 →</a>
          </div>

          <!-- 功能卡片3：订单管理 -->
          <div class="feature-card">
            <div class="card-icon orange">
              <i class="el-icon-s-order"></i>
            </div>
            <h3 class="card-title">订单管理</h3>
            <p class="card-desc">处理订单状态，查看订单历史与详情</p>
            <a href="#" class="card-link">查看详情 →</a>
          </div>

          <!-- 功能卡片4：消息通知 -->
          <div class="feature-card">
            <div class="card-icon purple">
              <i class="el-icon-bell"></i>
            </div>
            <h3 class="card-title">消息通知</h3>
            <p class="card-desc">接收系统提醒，查看未读消息</p>
            <a href="#" class="card-link">查看详情 →</a>
          </div>
        </div>
      </div>
    </section>

    <!-- 数据概览区：展示关键业务数据 -->
    <section class="stats-section">
      <div class="container">
        <h2 class="section-title">今日数据概览</h2>
        <div class="stats-grid">
          <div class="stat-card">
            <p class="stat-label">访问量</p>
            <p class="stat-value">3,289</p>
            <p class="stat-trend up">
              <i class="el-icon-arrow-up"></i> 18.2%
            </p>
          </div>
          <div class="stat-card">
            <p class="stat-label">新增用户</p>
            <p class="stat-value">126</p>
            <p class="stat-trend up">
              <i class="el-icon-arrow-up"></i> 9.5%
            </p>
          </div>
          <div class="stat-card">
            <p class="stat-label">订单数量</p>
            <p class="stat-value">258</p>
            <p class="stat-trend down">
              <i class="el-icon-arrow-down"></i> 3.1%
            </p>
          </div>
          <div class="stat-card">
            <p class="stat-label">系统状态</p>
            <p class="stat-value">正常</p>
            <p class="stat-trend normal">
              <i class="el-icon-check"></i> 稳定运行
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- 页脚：简洁风格 -->
    <footer class="home-footer">
      <div class="container">
        <p class="copyright">© 2025 AdminSystem. 保留所有权利</p>
        <div class="footer-links">
          <a href="#" class="footer-link">隐私政策</a>
          <a href="#" class="footer-link">服务条款</a>
          <a href="#" class="footer-link">联系我们</a>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

import { useRouter } from 'vue-router';

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
  // name: '',          // 用户名
  // tel: '',           // 手机号
  // email: '',         // 邮箱
  account: '',       // 手机号或邮箱
  password: '',      // 密码
  captcha: '',       // 验证码
  captcha_uuid: ''   // 验证码UUID

});

// 登录表单验证规则
const loginRules = reactive({
  account: [
    { required: true, message: '请输入手机号或邮箱', trigger: 'blur' },
    { pattern: /(^\d{11}$)|(^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$)/, message: '请输入正确的手机号或邮箱格式', trigger: 'blur' }

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
  // name: [
  //   { required: true, message: '请输入用户名', trigger: 'blur' },
  //   { min: 2, max: 20, message: '用户名长度在2-20个字符之间', trigger: 'blur' }
  // ],
  // tel: [
  //   { required: true, message: '请输入手机号', trigger: 'blur' },
  //   { pattern: /^\d{11}$/, message: '请输入正确的手机号', trigger: 'blur' }
  // ],
  // email: [
  //   { required: true, message: '请输入邮箱', trigger: 'blur' },
  //   { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  // ],
  account: [
    { required: true, message: '请输入手机号或邮箱', trigger: 'blur' },
    { pattern: /(^\d{11}$)|(^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$)/, message: '请输入正确的手机号或邮箱格式', trigger: 'blur' }
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
      // setTimeout(() => window.location.href = '/', 1000);
      router.push('/'); // 对应Home路由的path

    }
    else {
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
      // name: registerForm.name,
      // tel: registerForm.tel,
      // email: registerForm.email,
      account: registerForm.account,
      password: registerForm.password,
      captcha: registerForm.captcha.toLowerCase(), // 转为小写匹配后端
      captcha_uuid: registerForm.captcha_uuid
    };

    // 判断账号类型
    if (registerForm.account.includes('@')) {
      params.email = registerForm.account;
    } else {
      params.tel = registerForm.account;
    }

    // 发送注册请求
    const { data } = await axios.post(`${API_BASE}/api/user/register`, params);

    if (data.success) {
      ElMessage.success('注册成功，请登录');
      toggleMode(); // 切换到登录模式
    }
    else {
      ElMessage.error(data.message || '注册失败');
      refreshCaptcha('register'); // 失败后刷新验证码
    }
  }
  catch (error) {
    console.error('注册错误:', error);
    if (error.response) {
      ElMessage.error(error.response.data?.message || '注册失败，请重试');
      refreshCaptcha('register');
    }
    else {
      ElMessage.error('网络错误，请检查后端是否运行在127.0.0.1:5000');
    }
  }
  finally {
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


const router = useRouter();
const userInfo = ref(null); 
const showUserMenu = ref(false); // 控制用户下拉菜单显示/隐藏

onMounted(() => {
  const storedUser = localStorage.getItem('userInfo') || sessionStorage.getItem('userInfo');
  if (storedUser) {
    userInfo.value = JSON.parse(storedUser);
  } else {
    ElMessage.warning('请先登录系统');
    setTimeout(() => {
      router.push('/login');
    }, 1000);
  }
});

// 退出登录：清除用户信息并跳转登录页
const handleLogout = async () => {
  try {
    // 弹出确认对话框
    await ElMessageBox.confirm(
      '确定要退出登录吗？退出后需重新登录',
      '退出确认',
      {
        confirmButtonText: '确定退出',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }
    );

    // 清除本地存储的用户信息
    localStorage.removeItem('userInfo');
    sessionStorage.removeItem('userInfo');

    // 提示并跳转登录页
    ElMessage.success('退出登录成功');
    setTimeout(() => {
      router.push('/login');
    }, 1000);
  } catch (error) {
    // 用户取消退出，提示信息
    ElMessage.info('已取消退出登录');
  }
};

const goToDashboard = () => {
  ElMessage.info('即将进入数据控制台');
  // router.push('/dashboard'); // 若有控制台页面，取消注释即可跳转
};


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
