<template>
  <el-card shadow="hover" class="table-card">
    <el-table :data="sampleList" border stripe :loading="tableLoading" :empty-text="tableLoading ? '加载中...' : '暂无样品数据'"
      @sort-change="handleSortChange" height="750" style="width: 100%">
      <el-table-column label="样品ID" prop="sample_id" align="center" sortable />
      <el-table-column label="用户ID" prop="user_id" align="center" sortable />

      <el-table-column label="用户名" prop="user_name" align="center" sortable />

      <el-table-column label="样品名称" prop="sample_name" align="center" />
      <el-table-column label="采样地点" prop="location" align="center" sortable />
      <el-table-column label="采样时间" prop="detect_time" align="center" sortable>
        <template #default="scope">{{ formatTime(scope.row.detect_time) }}</template>
      </el-table-column>

      <el-table-column label="是否已检测" prop="is_processed" align="center">
        <template #default="scope">
          <el-tag :type="scope.row.is_processed ? 'success' : 'info'">
            {{ scope.row.is_processed ? '已检测' : '未检测' }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column label="检测结果" prop="predict_data" align="center">
        <template #default="scope">
          <span v-if="scope.row.predict_data" class="text-ellipsis" :title="scope.row.predict_data">
            {{ scope.row.predict_data }}
          </span>
          <span v-else class="text-gray-400">-</span>
        </template>
      </el-table-column>

      <el-table-column label="检测时间" prop="processed_time" align="center" sortable>
        <template #default="scope">{{ formatTime(scope.row.processed_time) }}</template>
      </el-table-column>

      <el-table-column label="提示信息" prop="predict_message" align="center" width="120">
        <template #default="scope">{{ formatMessage(scope.row.predict_message) }}</template>
      </el-table-column>

      <el-table-column label="详情" align="center" width="120">
        <template #default="scope">
          <el-button type="text" size="small" icon="Eye" @click="handleViewDetail(scope.row)" text-color="#409EFF">
            查看
          </el-button>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" width="120">
        <template #default="scope">
          <el-button size="small" :type="scope.row.is_processed ? 'info' : 'primary'" @click="handleDetect(scope.row)"
            plain>
            {{ scope.row.is_processed ? '重新检测' : '立即检测' }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container mt-4">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="pagination.currentPage" :page-sizes="[10, 20, 50, 100]" :page-size="pagination.perPage"
        layout="total, sizes, prev, pager, next, jumper" :total="pagination.total" />
    </div>
  </el-card>
</template>


<script setup>
import { watch } from 'vue';
import dayjs from 'dayjs';

const props = defineProps({
  sampleList: {
    type: Array,
    default: () => []
  },
  tableLoading: {
    type: Boolean,
    default: false
  },
  pagination: {
    type: Object,
    default: () => ({
      currentPage: 1,
      perPage: 10,
      total: 0
    })
  }
});

watch(
  () => props.sampleList,
  { immediate: true }
);

const emit = defineEmits(['sizeChange', 'currentChange', 'viewDetail', 'detect', 'sortChange']);

// 处理排序变化
const handleSortChange = (sort) => {
  // sort对象结构：{ prop: '排序字段', order: 'ascending' | 'descending' | null }
  emit('sortChange', sort);
};


const formatTime = (time) => {
  if (!time) return '-';
  return dayjs(time).format('YYYY-MM-DD HH:mm:ss');
};

const formatMessage = (message) => {
  if (!message) return '';
  return message.replace(/\[|\]|'|"/g, '').trim();
};

const handleSizeChange = (val) => {
  emit('sizeChange', val);
};

const handleCurrentChange = (val) => {
  emit('currentChange', val);
};

const handleViewDetail = (row) => {
  emit('viewDetail', row);
};

const handleDetect = (row) => {
  emit('detect', row);
};
</script>

<style scoped>
.table-card {
  background-color: #fff;
}

.pagination-container {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.text-ellipsis {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px;
}
</style>
