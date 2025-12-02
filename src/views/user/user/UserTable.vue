<template>
  <el-card shadow="never" class="table-card">
    <el-table :data="userList" border stripe :loading="loading" style="width: 100%" max-height="700">
      <el-table-column width="80" label="序号" align="center">
        <template #default="scope">
          {{ (pagination.currentPage - 1) * pagination.pageSize + scope.$index + 1 }}
        </template>
      </el-table-column>
      <!-- <el-table-column label="用户ID" prop="user_id" align="center" sortable /> -->
      <el-table-column label="用户名" prop="user_name" align="center" />
      <el-table-column label="手机号" prop="tel" align="center" />
      <el-table-column label="邮箱" prop="email" align="center" />
      <el-table-column label="年龄" prop="age" align="center" />
      <el-table-column label="创建时间" prop="create_time" align="center" sortable />
      <el-table-column label="在线状态" prop="online_status" align="center">
        <template #default="scope">
          <el-tag :type="scope.row.online_status === 1 ? 'success' : 'danger'">
            {{ scope.row.online_status === 1 ? '在线' : '离线' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="用户角色" prop="role" align="center" :formatter="row => row.role ? '管理员' : '普通用户'" />
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button type="text" size="small" @click="handleEdit(scope.row)" icon="Edit">修改</el-button>
          <el-button type="text" size="small" @click="handleDelete(scope.row.user_id)" icon="Delete"
            text-color="#ff4d4f">删除</el-button>
          <el-button type="text" size="small" @click="handleResetPwd(scope.row)" icon="Lock">重置密码</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="pagination.currentPage" :page-sizes="[10, 20, 50, 100]" :page-size="pagination.pageSize"
        layout="total, sizes, prev, pager, next, jumper" :total="pagination.total" />
    </div>
  </el-card>
</template>

<script setup>
import { watch } from 'vue';

// 接收父组件传递的属性
const props = defineProps({
  userList: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  },
  pagination: {
    type: Object,
    default: () => ({
      currentPage: 1,
      pageSize: 10,
      total: 0
    })
  }
});

watch(
  () => props.userList,
  { immediate: true }
);

const emit = defineEmits(['edit', 'delete', 'resetPwd', 'sizeChange', 'currentChange']);

const handleEdit = (row) => {
  emit('edit', row);
};

const handleDelete = (userId) => {
  emit('delete', userId);
};

const handleResetPwd = (row) => {
  emit('resetPwd', row);
};

// 分页大小变化
const handleSizeChange = (val) => {
  emit('sizeChange', val);
};

// 页码变化
const handleCurrentChange = (val) => {
  emit('currentChange', val);
};
</script>

<style scoped>
.table-card {
  margin-bottom: 20px;
}

.pagination-container {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: 16px;
}

@media (max-width: 768px) {
  .pagination-container {
    justify-content: center;
  }
}
</style>
