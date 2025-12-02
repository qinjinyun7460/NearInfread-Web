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

const filterForm = reactive({ ...props.initialFilter });

const emit = defineEmits(['search', 'reset', 'add']);

const handleSearch = () => {
  emit('search', { ...filterForm });
};

const handleReset = () => {
  filterForm.user_name = '';
  filterForm.tel = '';
  filterForm.email = '';
  filterForm.online_status = '';
  emit('reset');
};

const handleClear = () => {
  emit('search', { ...filterForm });
};

const handleAdd = () => {
  emit('add');
};
</script>