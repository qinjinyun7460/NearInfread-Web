<template>
  <div class="sample-list-container">
    <!-- 筛选组件 -->
    <SampleFilter @search="handleSearch" @reset="handleReset" @openDialog="handleOpenDialog" />

    <!-- 表格组件 -->
    <SampleTable :sampleList="processedSampleList" :tableLoading="tableLoading" :pagination="pagination"
      @sizeChange="handleSizeChange" @currentChange="handleCurrentChange" @viewDetail="handleViewDetail"
      @detect="handleDetectSample" />

    <!-- 表单弹窗 -->
    <AddSampleForm v-model="formDialogVisible" :type="formType" @close="handleCloseForm" @submit="handleFormSubmit" />
  </div>
</template>


<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import SampleFilter from './Sample/SampleFilter.vue';
import SampleTable from './Sample/SampleTable.vue';
import AddSampleForm from './Sample/AddSampleForm.vue';
import { getSampleList, detectSample, saveSampleData } from './Sample/sample_api';
import { getUserList } from './user/user_api';
import { useRouter } from 'vue-router';
const router = useRouter();

// 表格数据
const sampleList = ref([]);
const tableLoading = ref(false);
const pagination = reactive({
  currentPage: 1,
  perPage: 10,
  total: 0
});

const userList = ref([]);
const userMap = computed(() => {
  return userList.value.reduce((map, user) => {
    map[user.user_id] = user.user_name;
    return map;
  }, {});
});

const processedSampleList = computed(() => {
  return sampleList.value.map(sample => ({
    ...sample,
    user_name: userMap.value[sample.user_id] || '-'
  }));
});

onMounted(() => {
  fetchUserData();
  loadSampleList();
});

const fetchUserData = async () => {
  try {
    const response = await getUserList({ page: 1, size: 1000 });
    if (response.data.success) {
      userList.value = response.data.data;
    }
  } catch (error) {
    console.error('获取用户列表失败（用于匹配用户名）：', error);
  }
};

const handleViewDetail = (row) => {
  router.push({
    name: 'SampleDetails',
    params: { sampleId: row.sample_id },
    meta: {
      sampleList: sampleList.value
    }
  });
};

// 筛选参数
const searchParams = ref({});

// 表单弹窗
const formDialogVisible = ref(false);
const formType = ref('save');

// 加载样品列表
const loadSampleList = async () => {
  try {
    tableLoading.value = true;
    const params = {
      ...searchParams.value,
      page: pagination.currentPage,
      per_page: pagination.perPage,
    };
    // 清除空值
    Object.keys(params).forEach(key => {
      if (params[key] === '' || params[key] === undefined) delete params[key];
    });

    const response = await getSampleList(params);
    if (response.data.success) {
      sampleList.value = response.data.data;
      pagination.total = response.data.total;
    } else {
      ElMessage.error(response.data.message || '获取样品列表失败');
    }
  } catch (error) {
    console.error('获取样品列表错误：', error);
    ElMessage.error('网络错误，获取样品列表失败');
  } finally {
    tableLoading.value = false;
  }
};

// 筛选事件
const handleSearch = (params) => {
  searchParams.value = params;
  pagination.currentPage = 1;
  loadSampleList();
};

// 重置筛选
const handleReset = () => {
  searchParams.value = {};
  pagination.currentPage = 1;
  loadSampleList();
};

// 分页事件
const handleSizeChange = (val) => {
  pagination.perPage = val;
  pagination.currentPage = 1;
  loadSampleList();
};

const handleCurrentChange = (val) => {
  pagination.currentPage = val;
  loadSampleList();
};

// 打开表单弹窗
const handleOpenDialog = (type) => {
  formType.value = type;
  formDialogVisible.value = true;
};

const handleCloseForm = () => {
  formDialogVisible.value = false;
};


// 表单提交
const handleFormSubmit = async (data) => {
  try {
    const response = await saveSampleData({
      user_id: data.user_id || null,
      sample_name: data.sample_name,
      sample_data: data.sample_data,
      location: data.location || null
    });
    if (response.data.success) {
      ElMessage.success('保存成功');
      formDialogVisible.value = false;
      loadSampleList();
    } else {
      ElMessage.error('保存失败: ' + response.data.message);
    }
  } catch (error) {
    console.error('操作失败:', error);
    ElMessage.error('服务器错误，操作失败');
  }
};

// 检测样品
const handleDetectSample = async (row) => {
  const isReDetect = row.is_processed;
  if (isReDetect) {
    try {
      await ElMessageBox.confirm(
        '确定要重新检测该样品吗？原有检测结果将被覆盖。',
        '重新检测确认',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      );
    } catch {
      return;
    }
  }

  try {
    tableLoading.value = true;
    const response = await detectSample({
      sample_id: row.sample_id
    });
    if (response.data.success) {
      ElMessage.success(response.data.message);
      loadSampleList();
    } else {
      ElMessage.error('检测失败: ' + response.data.message);
    }
  } catch (error) {
    console.error('检测样品失败:', error);
    ElMessage.error('服务器错误，检测失败');
  } finally {
    tableLoading.value = false;
  }
};

</script>

<style scoped>
.sample-list-container {
  background-color: #f5f7fa;
  min-height: calc(100vh - 64px);
}

@media (max-width: 768px) {
  .sample-list-container {
    padding: 10px;
  }
}
</style>
