  <template>

    <el-card shadow="hover" class="filter-card mb-4">
      <el-form :inline="true" :model="filterForm" class="filter-form" @submit.prevent="getSampleList">
        <el-form-item label="样品名称">
          <el-input v-model="filterForm.sample_name" placeholder="请输入样品名称" clearable @clear="getSampleList"
            style="width: 200px" />
        </el-form-item>

        <el-form-item label="采样地点">
          <el-input v-model="filterForm.location" placeholder="请输入采样地点" clearable @clear="getSampleList"
            style="width: 200px" />
        </el-form-item>

        <el-form-item label="是否已检测">
          <el-select v-model="filterForm.is_processed" clearable @clear="getSampleList" style="width: 120px">
            <el-option label="已检测" value="true" />
            <el-option label="未检测" value="false" />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="getSampleList">查询</el-button>
          <el-button @click="resetFilter" class="ml-2">重置</el-button>
        </el-form-item>

      </el-form>


      <el-button type="primary" @click="showFormDialog = true">
        新增样品并检测
      </el-button>


    </el-card>

  </template>


<script setup>

import { reactive } from 'vue';

const filterForm = reactive({
  sample_name: '',
  location: '',
  is_processed: '',
  status: ''
});

const resetFilter = () => {



  filterForm.sample_name = '';
  filterForm.location = '';
  filterForm.is_processed = '';
  filterForm.status = '';

};

</script>
