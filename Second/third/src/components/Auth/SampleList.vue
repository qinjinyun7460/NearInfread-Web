<template>
  <el-card class="shadow-md" shadow="hover" border-radius="8px">
    <!-- 卡片头部：标题区域 -->
    <template #header>
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <el-icon class="mr-2 text-blue-600">
            <List />
          </el-icon>
          <h2 class="text-xl font-semibold text-gray-800">样品数据列表</h2>
        </div>
        <el-text type="info" class="text-sm">
          共 {{ pagination.total }} 条记录
        </el-text>
      </div>
    </template>

    <!-- 搜索筛选区 -->
    <el-form :inline="true" class="mb-6" @submit.prevent="handleSearch">
      <el-form-item label="样品名称">
        <el-input v-model="searchForm.sampleName" placeholder="请输入名称搜索" clearable @clear="handleSearch"
          style="width: 220px">
          <template #prepend>
            <el-icon class="text-gray-400">
              <Search />
            </el-icon>
          </template>
        </el-input>
      </el-form-item>

      <el-form-item label="检测状态">
        <el-select v-model="searchForm.isProcessed" placeholder="全部状态" clearable @clear="handleSearch"
          style="width: 180px">
          <el-option label="已检测" value="true"></el-option>
          <el-option label="未检测" value="false"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="handleRefresh" icon="Refresh" plain>
          刷新列表
        </el-button>
      </el-form-item>
    </el-form>

    <!-- 加载状态 -->
    <el-skeleton v-if="loading" :count="5" :rows="1" class="mb-4"></el-skeleton>


    <el-table v-else :data="samples" border stripe
      :header-cell-style="{ 'background-color': '#f5f7fa', 'font-weight': 500 }"
      :row-class-name="({ row }) => row.is_processed ? '' : 'table-unprocessed-row'" empty-text="暂无匹配数据"
      style="width: 100%">

      <el-table-column label="样品ID" prop="sample_id" align="left" width="100"></el-table-column>

      <el-table-column label="样品名称" align="left">
        <template #default="scope">
          <el-text>{{ scope.row.sample_name || '未命名' }}</el-text>
        </template>
      </el-table-column>

      <el-table-column label="用户ID" prop="user_id" align="left" width="120">
        <template #default="scope">
          <el-text type="secondary">{{ scope.row.user_id || '未设置' }}</el-text>
        </template>
      </el-table-column>

      <el-table-column label="检测地点" prop="location" align="left" width="160">
        <template #default="scope">
          <el-text type="secondary">{{ scope.row.location || '未填写' }}</el-text>
        </template>
      </el-table-column>

      <el-table-column label="检测状态" align="left" width="120">
        <template #default="scope">
          <el-tag :type="scope.row.is_processed ? 'success' : 'warning'" size="small">
            {{ scope.row.is_processed ? '已检测' : '未检测' }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column label="检测时间" align="left" width="200">
        <template #default="scope">
          <el-text type="secondary">
            {{ scope.row.detect_time ? new Date(scope.row.detect_time).toLocaleString() : '未检测' }}
          </el-text>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="left" width="140">
        <template #default="scope">
          <el-button size="small" :type="scope.row.is_processed ? 'info' : 'primary'" @click="handleDetect(scope.row)"
            icon="Refresh" plain>
            {{ scope.row.is_processed ? '重新检测' : '立即检测' }}
          </el-button>
        </template>
      </el-table-column>

    </el-table>


    <div class="mt-6 flex justify-end">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="pagination.currentPage" :page-sizes="[10, 20, 50, 100]" :page-size="pagination.perPage"
        layout="total, sizes, prev, pager, next, jumper" :total="pagination.total" :disabled="loading"></el-pagination>
    </div>
  </el-card>
</template>

<script setup>
import { ref, computed } from 'vue';
import { List, Search } from '@element-plus/icons-vue';
import { ElMessageBox, ElMessage } from 'element-plus';

const props = defineProps({
  samples: {
    type: Array,
    default: () => []
  },
  pagination: {
    type: Object,
    default: () => ({
      currentPage: 1,
      perPage: 20,
      total: 0
    })
  },
  loading: {
    type: Boolean,
    default: false
  }
});

const searchForm = ref({
  sampleName: '',
  isProcessed: ''
});

const totalPages = computed(() => {
  return Math.ceil(props.pagination.total / props.pagination.perPage) || 1;
});

const emit = defineEmits(['detectSample', 'pageChange', 'search', 'sizeChange']);

const handleDetect = (sample) => {
  const confirmText = sample.is_processed
    ? '确定要重新检测该样品吗？此操作将覆盖原有检测结果'
    : '确定要检测该样品吗？';

  ElMessageBox.confirm(
    confirmText,
    '操作确认',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: sample.is_processed ? 'info' : 'primary'
    }
  ).then(() => {
    emit('detectSample', sample.id, 'low_error');
  }).catch(() => {
    ElMessage.info('已取消检测操作');
  });
};

// 处理页码变化
const handleCurrentChange = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    emit('pageChange', page);
  }
};

// 处理每页条数变化
const handleSizeChange = (size) => {
  emit('sizeChange', size);
};

// 处理搜索
const handleSearch = () => {
  emit('search', {
    sampleName: searchForm.value.sampleName,
    isProcessed: searchForm.value.isProcessed
  });
};

// 刷新列表（重置搜索条件+刷新数据）
const handleRefresh = () => {
  searchForm.value = {
    sampleName: '',
    isProcessed: ''
  };
  emit('search', searchForm.value);
};

</script>

<style scoped>
/* 未检测行背景色轻微高亮 */
.table-unprocessed-row {
  background-color: #fff8f0 !important;
}

/* 调整分页控件间距 */
.el-pagination {
  margin-top: 16px;
}

/* 优化骨架屏样式 */
.el-skeleton {
  margin-bottom: 12px;
}

/* 表格空状态文字调整 */
.el-table__empty-text {
  font-size: 14px;
  color: #909399;
}
</style>
