<template>
  <div>
    <section class="welcome-section">
      <div class="container">
        <h1 class="welcome-title">欢迎来到该系统，{{ userInfo.user_name }}！</h1>
        <p class="welcome-desc">
          这里是系统核心首页，可快速访问功能模块
        </p>
      </div>
    </section>

    <section class="features-section">
      <div class="container">
        <h2 class="section-title">功能模块</h2>
        <div class="features-grid">

          <div class="feature-card" @click="$router.push('/user_manage/list')">
            <div class="card-icon green">
              <i class="el-icon-user-group"></i>
            </div>
            <h3 class="card-title">用户管理</h3>
            <p class="card-desc">管理系统用户信息，分配角色与权限</p>
            <a href="#" class="card-link">查看详情 →</a>
          </div>

          <div class="feature-card" @click="$router.push('/user_manage/loginlogs')">
            <div class="card-icon blue">
              <i class="el-icon-user-group"></i>
            </div>
            <h3 class="card-title">登录日志</h3>
            <p class="card-desc">浏览登录日志,登录数据</p>
            <a href="#" class="card-link">查看详情 →</a>
          </div>

          <div class="feature-card" @click="$router.push('/samples')">
            <div class="card-icon orange">
              <i class="el-icon-s-order"></i>
            </div>
            <h3 class="card-title">样品数据</h3>
            <p class="card-desc">查看样品数据，对样品进行检测</p>
            <a href="#" class="card-link">查看详情 →</a>
          </div>

        </div>
      </div>
    </section>
  </div>
</template>


<script setup>
import { ref, onMounted, watch } from 'vue';
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';
import { getUserInfo } from '@/utils/storage';


const router = useRouter();
const userInfo = ref({});

onMounted(() => {
  const storedUser = getUserInfo();
  if (storedUser) {
    userInfo.value = storedUser;
  } else {
    ElMessage.warning('请先登录');
    router.push('/login');
  }
});

import { useRoute } from 'vue-router'

const route = useRoute()
const currentRoute = ref('')


watch(
  () => route.path,
  (newPath) => {
    currentRoute.value = newPath
  },
  { immediate: true }
)

</script>

<style scoped>
@media (max-width: 768px) {
  .filter-form {
    flex-direction: column;
    align-items: flex-start !important;
  }

  .filter-form .el-form-item {
    margin-bottom: 12px;
    width: 100%;
  }
}

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
</style>
