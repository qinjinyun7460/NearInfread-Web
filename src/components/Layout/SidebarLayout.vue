<template>
  <el-aside class="aside">
    <el-row class="tac">

      <el-menu @open="handleOpen" @close="handleClose" @select="handleMenuSelect" :default-active="currentRoute">
        <el-menu-item>
          <div class="navbar-logo"><a class="logo-text">System</a></div>
        </el-menu-item>
        <el-menu-item index="/" class="text">首页</el-menu-item>
        <el-sub-menu index="/user_manage">
          <template #title><span class="text">用户管理</span></template>
          <el-menu-item index="/user_manage/list">用户列表</el-menu-item>
          <el-menu-item index="/user_manage/loginlogs">登录日志</el-menu-item>
        </el-sub-menu>
        <el-menu-item index="/samples" class="text">样品数据</el-menu-item>


        <!-- <el-sub-menu index="/SampleRecords">
          <template #title><span class="text">样品记录管理</span></template>
          <el-menu-item index="/SampleRecords/sample">列表</el-menu-item>
          <el-menu-item index="/SampleRecords/sample/add">添加</el-menu-item>
          <el-menu-item index="/SampleRecords/sample/edit/:id">编辑</el-menu-item>
          <el-menu-item index="/SampleRecords/sample/:id">详情</el-menu-item>
        </el-sub-menu> -->


        <el-sub-menu index="/settings">
          <template #title><span class="text">设置</span></template>
          <el-menu-item index="/settings/personal">修改信息</el-menu-item>
          <el-menu-item index="/settings/security">重置密码</el-menu-item>
          <el-menu-item index="/settings/cancel">注销账号</el-menu-item>
        </el-sub-menu>

      </el-menu>
    </el-row>
  </el-aside>
</template>


<script setup>
import { ref, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute()
const currentRoute = ref('')

const handleMenuSelect = (index) => {
  router.push(index);
};

const handleOpen = (key, keyPath) => {
  console.log(key, keyPath);
};

const handleClose = (key, keyPath) => {
  console.log(key, keyPath);
};

watch(
  () => route.path,
  (newPath) => {
    currentRoute.value = newPath
  },
  { immediate: true }
)

</script>

<style scoped>
/* Logo样式 */
.navbar-logo .logo-text {
  font-size: 20px;
  font-weight: 600;
  color: #409eff;
  /* 与登录页主色调统一 */
  text-decoration: none;
}

.aside {
  width: auto;
  background-color: #ffffff;
  /* font-size: large; */
}

.aside .text {
  font-size: 16px;
}


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
</style>
