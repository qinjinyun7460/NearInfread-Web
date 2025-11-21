<template>
  <el-card shadow="never" class="filter-card">
    <el-form :inline="true" :model="filterForm" class="filter-form">
      <el-form-item label="用户名">
        <el-input v-model="filterForm.user_name" placeholder="请输入用户名" clearable @clear="handleClear" />
      </el-form-item>
      <el-form-item label="手机号">
        <el-input v-model="filterForm.tel" placeholder="请输入手机号" clearable @clear="handleClear" />
      </el-form-item>
      <el-form-item label="邮箱">
        <el-input v-model="filterForm.email" placeholder="请输入邮箱" clearable @clear="handleClear" />
      </el-form-item>
      <el-form-item label="在线状态">
        <el-select v-model="filterForm.online_status" placeholder="是否在线" clearable @clear="handleClear"
          style="width: 120px">
          <el-option label="在线" value="true" />
          <el-option label="离线" value="false" />
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="handleSearch">查询</el-button>
        <el-button @click="handleReset">重置</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleAdd">添加用户</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup>
import { reactive } from 'vue';

// 接收父组件的初始筛选条件
const props = defineProps({
  initialFilter: {
    type: Object,
    default: () => ({
      user_name: '',
      tel: '',
      email: '',
      online_status: ''
    })
  }
});

// 筛选表单数据
const filterForm = reactive({ ...props.initialFilter });

// 定义事件
const emit = defineEmits(['search', 'reset', 'add']);

// 触发查询
const handleSearch = () => {
  emit('search', { ...filterForm });
};

// 重置筛选条件
const handleReset = () => {
  filterForm.user_name = '';
  filterForm.tel = '';
  filterForm.email = '';
  filterForm.online_status = '';
  emit('reset');
};

// 清空单个筛选条件时触发查询
const handleClear = () => {
  emit('search', { ...filterForm });
};

// 触发添加用户
const handleAdd = () => {
  emit('add');
};
</script>

<style scoped>
/* .filter-card {
  margin-bottom: 20px;
} */
.filter-form {
  margin-bottom: 0;
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
