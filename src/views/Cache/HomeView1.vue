<template>
  <div class="home-page">
    <!-- 导航栏 -->
    <Navbar />

    <!-- 欢迎区域 -->
    <section class="welcome-section">
      <div class="container">
        <h1 class="welcome-title">欢迎回来，{{ userInfo.name || '用户' }}！</h1>
        <p class="welcome-desc">
          这里是系统核心首页，可快速访问各项功能模块，查看实时数据统计
        </p>
        <button class="primary-btn" @click="goToDashboard">
          进入数据控制台
        </button>
      </div>
    </section>

    <!-- 功能模块区 -->
    <section class="features-section">
      <div class="container">
        <h2 class="section-title">核心功能模块</h2>
        <div class="features-grid">
          <!-- 功能卡片1：数据统计 -->
          <div class="feature-card" @click="$router.push('/dashboard')">
            <div class="card-icon blue">
              <i class="el-icon-data-analysis"></i>
            </div>
            <h3 class="card-title">数据统计</h3>
            <p class="card-desc">实时监控业务数据，生成多维度可视化报表</p>
            <a href="#" class="card-link">查看详情 →</a>
          </div>

          <!-- 功能卡片2：用户管理 -->
          <div class="feature-card" @click="$router.push('/user-manage')">
            <div class="card-icon green">
              <i class="el-icon-user-group"></i>
            </div>
            <h3 class="card-title">用户管理</h3>
            <p class="card-desc">管理系统用户信息，分配角色与权限</p>
            <a href="#" class="card-link">查看详情 →</a>
          </div>

          <!-- 功能卡片3：订单管理 -->
          <div class="feature-card" @click="$router.push('/order')">
            <div class="card-icon orange">
              <i class="el-icon-s-order"></i>
            </div>
            <h3 class="card-title">订单管理</h3>
            <p class="card-desc">处理订单状态，查看订单历史与详情</p>
            <a href="#" class="card-link">查看详情 →</a>
          </div>

          <!-- 功能卡片4：消息通知 -->
          <div class="feature-card" @click="$router.push('/message')">
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

    <!-- 数据概览区 -->
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

    <!-- 页脚 -->
    <Footer />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';
import { getUserInfo } from '@/utils/storage';
import Navbar from '@/components/Layout/NavbarLayout.vue';
import Footer from '@/components/Layout/FooterLayout.vue';

// 路由实例
const router = useRouter();

// 用户信息
const userInfo = ref({});

// 页面加载时获取用户信息
onMounted(() => {
  const storedUser = getUserInfo();
  if (storedUser) {
    userInfo.value = storedUser;
  } else {
    // 未登录自动跳转登录页
    ElMessage.warning('请先登录');
    router.push('/login');
  }
});

// 进入数据控制台
const goToDashboard = () => {
  router.push('/dashboard');
};
</script>

<style scoped>
/* 基础样式 */
.home-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f5f7fa;
}

.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* 欢迎区域 */
.welcome-section {
  background: linear-gradient(135deg, #409eff 0%, #66b1ff 100%);
  color: #fff;
  padding: 80px 0;
  text-align: center;
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

/* 功能模块区 */
.features-section {
  padding: 80px 0;
  background-color: #fff;
}

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

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
}

.feature-card {
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  padding: 30px;
  transition: all 0.3s;
  border: 1px solid #f5f7fa;
  cursor: pointer;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
  border-color: #e6f7ff;
}

.card-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  font-size: 24px;
  color: #fff;
}

.card-icon.blue {
  background-color: rgba(64, 158, 255, 0.15);
  color: #409eff;
}

.card-icon.green {
  background-color: rgba(103, 194, 58, 0.15);
  color: #67c23a;
}

.card-icon.orange {
  background-color: rgba(230, 162, 60, 0.15);
  color: #e6a23c;
}

.card-icon.purple {
  background-color: rgba(160, 132, 247, 0.15);
  color: #a084f7;
}

.card-title {
  font-size: 18px;
  font-weight: 500;
  color: #1d2129;
  margin-bottom: 10px;
}

.card-desc {
  font-size: 14px;
  color: #606266;
  line-height: 1.6;
  margin-bottom: 20px;
}

.card-link {
  font-size: 14px;
  color: #409eff;
  text-decoration: none;
  display: inline-block;
  transition: color 0.3s;
}

.card-link:hover {
  color: #66b1ff;
}

/* 数据概览区 */
.stats-section {
  padding: 80px 0;
  background-color: #f5f7fa;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.stat-card {
  background-color: #fff;
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

.stat-label {
  font-size: 14px;
  color: #606266;
  margin: 0 0 10px;
}

.stat-value {
  font-size: 28px;
  font-weight: 600;
  color: #1d2129;
  margin: 0 0 15px;
}

.stat-trend {
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 5px;
  margin: 0;
}

.stat-trend.up {
  color: #67c23a;
}

.stat-trend.down {
  color: #f56c6c;
}

.stat-trend.normal {
  color: #409eff;
}
</style>
