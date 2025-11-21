<template>
  <div class="captcha-wrap">
    <el-input v-model="captchaValue" placeholder="请输入验证码" prefix-icon="Check" size="large" clearable
      class="captcha-input" @clear="handleClear"></el-input>
    <!-- 验证码图片 -->
    <div class="captcha-img-box" @click="refreshCaptcha">
      <img :src="captchaUrl" alt="验证码" class="captcha-img" @error="refreshCaptcha">
      <span class="refresh-tip">
        {{ countDown }}秒后自动刷新
      </span>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue';
import { v4 as uuidv4 } from 'uuid';
// import { Refresh } from '@element-plus/icons-vue'; // 确保导入图标

// 父组件传递的基础接口地址
const props = defineProps({
  apiBase: {
    type: String,
    required: true,
    default: 'http://127.0.0.1:5000'
  }
});

// 向父组件传递 验证码UUID 和 输入值
const emit = defineEmits(['update:captchaUuid', 'update:captchaValue']);

// 响应式数据
const captchaUuid = ref('');
const captchaUrl = ref('');
const captchaValue = ref('');
const countDown = ref(60); // 倒计时秒数
const autoRefreshTimer = ref(null); // 自动刷新定时器
const countDownTimer = ref(null); // 倒计时更新定时器

// 初始化/刷新验证码（核心：重置倒计时和定时器）
const refreshCaptcha = () => {
  // 1. 清除现有自动刷新定时器（避免重复计时）
  if (autoRefreshTimer.value) {
    clearInterval(autoRefreshTimer.value);
  }

  // 2. 生成新验证码
  const uuid = uuidv4();
  const timestamp = Date.now();
  captchaUuid.value = uuid;
  captchaUrl.value = `${props.apiBase}/api/captcha?uuid=${uuid}&t=${timestamp}`;
  emit('update:captchaUuid', captchaUuid.value);

  // 3. 重置倒计时为60秒
  countDown.value = 60;

  // 4. 重新设置自动刷新定时器（1分钟后再次刷新）
  autoRefreshTimer.value = setInterval(refreshCaptcha, 60000);
};

// 清除输入时同步父组件
const handleClear = () => {
  emit('update:captchaValue', '');
};

// 监听输入值变化，同步给父组件
watch(captchaValue, (newVal) => {
  emit('update:captchaValue', newVal);
});

// 组件挂载时初始化
onMounted(() => {
  // 初始加载验证码
  refreshCaptcha();

  // 启动倒计时更新定时器（每秒减1）
  countDownTimer.value = setInterval(() => {
    if (countDown.value > 0) {
      countDown.value--;
    }
  }, 1000);
});

// 组件卸载时清除所有定时器（防止内存泄漏）
onUnmounted(() => {
  if (autoRefreshTimer.value) {
    clearInterval(autoRefreshTimer.value);
  }
  if (countDownTimer.value) {
    clearInterval(countDownTimer.value);
  }
});
</script>

<style scoped>
.captcha-wrap {
  display: flex;
  gap: 10px;
  align-items: center;
}

.captcha-input {
  flex: 1;
}

.captcha-img-box {
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

.captcha-img-box:hover .captcha-img {
  transform: scale(1.05);
}

.refresh-tip {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 20px;
  line-height: 20px;
  text-align: center;
  font-size: 12px;
  color: #606266;
  /* background-color: rgba(255, 255, 255, 0.8); */
}
</style>
