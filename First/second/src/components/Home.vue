<template>
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
          <img 
            src="https://picsum.photos/id/1005/40/40" 
            alt="用户头像" 
            class="user-avatar"
          >
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
import { ref, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useRouter } from 'vue-router'; // 依赖Vue Router实现路由跳转

// 初始化路由实例
const router = useRouter();

// 响应式数据
const userInfo = ref(null); // 存储登录用户信息（从本地存储获取）
const showUserMenu = ref(false); // 控制用户下拉菜单显示/隐藏

// 页面加载时初始化：获取用户信息，未登录则跳转登录页
onMounted(() => {
  const storedUser = localStorage.getItem('userInfo') || sessionStorage.getItem('userInfo');
  if (storedUser) {
    // 解析本地存储的用户信息
    userInfo.value = JSON.parse(storedUser);
  } else {
    // 未登录，提示并跳转登录页
    ElMessage.warning('请先登录系统');
    setTimeout(() => {
      router.push('/login'); // 跳转至登录页路由（需与路由配置一致）
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

// 进入数据控制台（示例：可替换为实际路由跳转）
const goToDashboard = () => {
  ElMessage.info('即将进入数据控制台');
  // router.push('/dashboard'); // 若有控制台页面，取消注释即可跳转
};
</script>

<style scoped>
/* 基础容器：确保页面占满屏幕 */
.home-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f5f7fa;
}

/* 导航栏：白色背景+阴影，与登录卡片风格统一 */
.home-nav {
  background-color: #fff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  padding: 12px 0;
  position: sticky;
  top: 0;
  z-index: 100;
}

.home-nav .container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* Logo样式 */
.nav-logo .logo-text {
  font-size: 20px;
  font-weight: 600;
  color: #409eff; /* 与登录页主色调一致 */
  cursor: pointer;
}

/* 导航菜单 */
.nav-menu {
  display: flex;
  gap: 30px;
}

.menu-item {
  font-size: 14px;
  color: #606266;
  text-decoration: none;
  padding: 5px 0;
  position: relative;
  transition: color 0.3s;
}

.menu-item.active {
  color: #409eff;
  font-weight: 500;
}

.menu-item.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: #409eff;
  border-radius: 1px;
}

.menu-item:hover {
  color: #409eff;
}

/* 用户信息区 */
.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 5px 10px;
  border-radius: 20px;
  transition: background-color 0.3s;
  position: relative;
}

.user-info:hover {
  background-color: #f5f7fa;
}

.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #f5f7fa;
}

.user-name {
  font-size: 14px;
  color: #303133;
}

.user-arrow {
  font-size: 12px;
  color: #909399;
  transition: color 0.3s;
}

.user-info:hover .user-arrow {
  color: #409eff;
}

/* 用户下拉菜单 */
.user-dropdown {
  position: absolute;
  top: 60px;
  right: 0;
  width: 180px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  padding: 10px 0;
  z-index: 101;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  font-size: 14px;
  color: #606266;
  text-decoration: none;
  transition: background-color 0.3s, color 0.3s;
}

.dropdown-item:hover {
  background-color: #f5f7fa;
  color: #409eff;
}

.dropdown-item i {
  font-size: 16px;
  width: 20px;
  text-align: center;
}

/* 欢迎区域：渐变背景 */
.welcome-section {
  background: linear-gradient(135deg, #409eff 0%, #66b1ff 100%);
  color: #fff;
  padding: 80px 0;
  text-align: center;
}

.welcome-section .container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.welcome-title {
  font-size: 42px;
  font-weight: 600;
  margin-bottom: 16px;
}

.welcome-desc {
  font-size: 18px;
  opacity: 0.9;
  margin-bottom: 32px;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
}

/* 主按钮样式：与登录按钮风格统一 */
.primary-btn {
  background-color: #fff;
  color: #409eff;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);
}

.primary-btn:hover {
  background-color: #f5f7fa;
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(64, 158, 255, 0.4);
}

.primary-btn:active {
  transform: translateY(0);
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.3);
}

/* 功能模块区 */
.features-section {
  padding: 80px 0;
  background-color: #fff;
}

.features-section .container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* 区域标题样式 */
.section-title {
  font-size: 28px;
  font-weight: 600;
  color: #1d2129;
  text-align: center;
  margin-bottom: 50px;
  position: relative;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: -15px;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 3px;
  background-color: #409eff;
  border-radius: 3px;
}

/* 功能卡片网格 */
.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
}

/* 功能卡片样式 */
.feature-card {
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  padding: 30px;
  transition: all 0.3s;
  border: 1px solid #f5f7fa;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
  border-color: #e6f7ff;
}

/* 卡片图标 */
.card-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
}
</style>