<template>
  <el-card shadow="hover" class="filter-card mb-4">
    <el-form :inline="true" :model="filterForm" class="filter-form" @submit.prevent="handleSearch">
      <!-- <el-form-item label="用户ID">
        <el-input v-model="filterForm.user_id" placeholder="请输入用户ID" clearable @clear="handleSearch"
          style="width: 200px" />
      </el-form-item> -->

      <el-form-item label="用户名">
        <el-input v-model="filterForm.user_name" placeholder="请输入用户名称" clearable @clear="handleSearch"
          style="width: 200px" />
      </el-form-item>

      <el-form-item label="样品名称">
        <el-input v-model="filterForm.sample_name" placeholder="请输入样品名称" clearable @clear="handleSearch"
          style="width: 200px" />
      </el-form-item>

      <el-form-item label="采样地点">
        <el-input v-model="filterForm.location" placeholder="请输入采样地点" clearable @clear="handleSearch"
          style="width: 200px" />
      </el-form-item>

      <el-form-item label="是否已检测">
        <el-select v-model="filterForm.is_processed" clearable @clear="handleSearch" style="width: 120px">
          <el-option label="已检测" value="true" />
          <el-option label="未检测" value="false" />
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="handleSearch">查询</el-button>
        <el-button @click="resetFilter" class="ml-2">重置</el-button>
      </el-form-item>
    </el-form>

    <el-button type="primary" @click="handleAdd('save')">
      新增样品数据
    </el-button>
    
  </el-card>
</template>

<script setup>
import { reactive } from 'vue';

const filterForm = reactive({
  user_name: '',
  user_id: '',
  sample_name: '',
  location: '',
  is_processed: '',
});

const emit = defineEmits(['search', 'reset', 'openDialog']);

const handleSearch = () => {
  emit('search', { ...filterForm });
};

const resetFilter = () => {
  filterForm.user_name = '';
  filterForm.user_id = '';
  filterForm.sample_name = '';
  filterForm.location = '';
  filterForm.is_processed = '';
  emit('reset');
};

const handleAdd = (type) => {
  emit('openDialog', type);
};
</script>

<style scoped>
.filter-card {
  background-color: #fff;
}

.filter-form {
  margin-bottom: 16px;
}
</style>
