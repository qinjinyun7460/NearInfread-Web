<template>
  <div class="sample-list-container">

    <el-card shadow="hover" class="filter-card mb-4">
      <el-form :inline="true" :model="filterForm" class="filter-form" @submit.prevent="getSampleList">

        <el-form-item label="用户ID">
          <el-input v-model="filterForm.user_id" placeholder="请输入用户ID" clearable @clear="getSampleList"
            style="width: 200px" />
        </el-form-item>

        <el-form-item label="用户名">
          <el-input v-model="filterForm.sample_name" placeholder="请输入用户名称" clearable @clear="getSampleList"
            style="width: 200px" />
        </el-form-item>

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
        新增样品数据
      </el-button>

      <el-button type="primary" @click="showFormDialog = true">
        新增样品并检测
      </el-button>

    </el-card>


    <el-card shadow="hover" class="table-card">
      <el-table :data="sampleList" border stripe :loading="tableLoading"
        :empty-text="tableLoading ? '加载中...' : '暂无样品数据'" height="750" style="width: 100%">
        <el-table-column label="样品ID" prop="sample_id" align="center" sortable />
        <el-table-column label="用户ID" prop="user_id" align="center" sortable />
        <!-- <el-table-column label="用户名" prop="user_name" align="center" sortable /> -->

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
          <template #default="scope">
            {{ formatTime(scope.row.processed_time) }}
          </template>
        </el-table-column>



        <el-table-column label="提示信息" prop="predict_message" align="center" width="120">
          <template #default="scope">
            {{ formatMessage(scope.row.predict_message) }}
          </template>
        </el-table-column>


        <el-table-column label="详情" align="center" width="120">
          <template #default="scope">
            <el-button type="text" size="small" icon="Eye" @click="viewSampleDetail(scope.row)" text-color="#409EFF">
              查看
            </el-button>
          </template>
        </el-table-column>


        <el-table-column label="操作" align="center" width="120">
          <template #default="scope">
            <!-- <el-button type="text" size="small" @click="viewSampleDetail(scope.row)" text-color="#409EFF"
              plain>详情</el-button> -->
            <el-button size="small" :type="scope.row.is_processed ? 'info' : 'primary'"
              @click="handleDetectSample(scope.row.sample_id, 'low_error')" plain>
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


    <el-dialog title="样品详情" v-model="detailDialogVisible" width="600px" :before-close="closeDetailDialog">
      <el-descriptions :column="1" border class="mt-2">
        <el-descriptions-item label="样品ID">{{ currentSample.sample_id }}</el-descriptions-item>
        <el-descriptions-item label="用户ID">{{ currentSample.user_id }}</el-descriptions-item>
        <el-descriptions-item label="样品名称">{{ currentSample.sample_name }}</el-descriptions-item>
        <el-descriptions-item label="采样地点">{{ currentSample.location || '-' }}</el-descriptions-item>
        <el-descriptions-item label="采样时间">{{ formatTime(currentSample.detect_time) }}</el-descriptions-item>
        <el-descriptions-item label="是否已检测">{{ currentSample.is_processed ? '已检测' : '未检测' }}</el-descriptions-item>
        <el-descriptions-item label="检测结果">
          <pre class="bg-gray-50 p-3 rounded text-sm">{{ currentSample.predict_data || '暂无检测结果' }}</pre>
        </el-descriptions-item>
        <el-descriptions-item label="检测时间">{{ formatTime(currentSample.processed_time) }}</el-descriptions-item>
        <el-descriptions-item label="样品原始数据">{{ currentSample.sample_data }}</el-descriptions-item>
      </el-descriptions>


      <template #footer>
        <el-button @click="detailDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>


    <el-dialog title="新增样品数据" v-model="showFormDialog" width="700px" :before-close="handleDialogClose">
      <el-card class="mb-6" shadow="hover">

        <el-form ref="sampleForm" :model="formData" :rules="formRules" label-width="120px" class="mt-4">
          <el-row :gutter="20">

            <el-col :span="12">
              <el-form-item label="用户ID" prop="user_id">
                <el-input v-model="formData.user_id" placeholder="请输入用户ID" clearable></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="样品名称" prop="sample_name">
                <el-input v-model="formData.sample_name" placeholder="请输入样品名称" clearable required></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="检测地点" prop="location">
                <el-input v-model="formData.location" placeholder="请输入检测地点" clearable></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="24">
              <el-form-item label="样品数据" prop="sample_data">
                <el-input v-model="formData.sample_data" type="textarea" :rows="4"
                  placeholder='请输入数据, 例如：[123, 456, ……]' clearable></el-input>
              </el-form-item>
            </el-col>

          </el-row>
        </el-form>
      </el-card>


      <template #footer>
        <div class="text-center" style="width: 100%;">
          <el-button @click="handleDialogClose">取消</el-button>
          <el-button type="primary" @click="handleAddSample" :loading="globalLoading">保存</el-button>
        </div>
      </template>

    </el-dialog>


    <el-dialog title="新增样品并检测" v-model="showFormDialog" width="700px" :before-close="handleDialogClose">
      <el-card class="mb-6" shadow="hover">

        <el-form ref="sampleForm" :model="formData" :rules="formRules" label-width="120px" class="mt-4">
          <el-row :gutter="20">

            <el-col :span="12">
              <el-form-item label="用户ID" prop="user_id">
                <el-input v-model="formData.user_id" placeholder="请输入用户ID" clearable></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="样品名称" prop="sample_name">
                <el-input v-model="formData.sample_name" placeholder="请输入样品名称" clearable required></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="检测地点" prop="location">
                <el-input v-model="formData.location" placeholder="请输入检测地点" clearable></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="24">
              <el-form-item label="样品数据" prop="sample_data">
                <el-input v-model="formData.sample_data" type="textarea" :rows="4"
                  placeholder='请输入数据, 例如：[123, 456, ……]' clearable></el-input>
              </el-form-item>
            </el-col>

          </el-row>
        </el-form>
      </el-card>

      <template #footer>
        <div class="text-center" style="width: 100%;">
          <el-button @click="handleDialogClose">取消</el-button>
          <el-button type="primary" @click="handleSubmit" :loading="submitting">提交检测并保存</el-button>
        </div>
      </template>

    </el-dialog>

  </div>
</template>


<script setup>
import { ref, reactive, onMounted } from 'vue';
import { ElMessage, ElDialog, ElDescriptions, ElMessageBox } from 'element-plus';
import dayjs from 'dayjs';
import { getUserInfo } from '@/utils/storage';
import request from '@/utils/request';

const userInfo = ref();
userInfo.value = getUserInfo()




const filterForm = reactive({
  user_name: '',
  user_id: '',
  sample_name: '',
  location: '',
  is_processed: '',
});


const sampleList = ref([]);
const tableLoading = ref(false);


const pagination = reactive({
  currentPage: 1,
  perPage: 10,
  total: 0
});


const detailDialogVisible = ref(false);
const currentSample = ref({});


const getSampleList = async () => {
  try {
    tableLoading.value = true;
    const params = {
      sample_name: filterForm.sample_name.trim(),
      location: filterForm.location.trim(),
      is_processed: filterForm.is_processed || undefined,
      page: pagination.currentPage,
      per_page: pagination.perPage
    };
    const response = await request.get('/api/view_samples', { params: params });

    if (response.data.success) {
      sampleList.value = response.data.data;
      pagination.total = response.data.total;
      console.log('接口返回的样品数据：', response.data.data);
    }
    else {
      ElMessage.error(response.data.message || '获取样品列表失败');
    }
  }
  catch (error) {
    console.error('获取样品列表错误：', error);

    if (error.response) {
      console.log('请求地址：', error.config.url);
      console.log('请求参数：', error.config.params);
      console.log('响应状态：', error.response.status);
    }
    ElMessage.error('网络错误，获取样品列表失败');
  }

  finally {
    tableLoading.value = false;
  }
};


const resetFilter = () => {
  filterForm.sample_name = '';
  filterForm.location = '';
  filterForm.is_processed = '';
  filterForm.status = '';
  pagination.currentPage = 1;
  getSampleList();
};


const handleSizeChange = (val) => {
  pagination.perPage = val;
  pagination.currentPage = 1;
  getSampleList();
};


const handleCurrentChange = (val) => {
  pagination.currentPage = val;
  getSampleList();
};


const formatTime = (time) => {
  if (!time) return '-';
  return dayjs(time).format('YYYY-MM-DD HH:mm:ss');
};


const viewSampleDetail = (row) => {
  currentSample.value = { ...row };
  detailDialogVisible.value = true;
};


const closeDetailDialog = () => {
  detailDialogVisible.value = false;
  currentSample.value = {};
};


const globalLoading = ref(false);


const emit = defineEmits(['detectSample', 'pageChange', 'search', 'sizeChange', 'sampleAdded']);


const handleDetectSample = async (sampleId) => {

  const isReDetect = sampleList.value.some(item => item.sample_id === sampleId && item.is_processed);

  if (isReDetect) {
    const confirm = await ElMessageBox.confirm(
      '确定要重新检测该样品吗？原有检测结果将被覆盖。',
      '重新检测确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    ).catch(() => { });

    if (!confirm) return;
  }

  const params = {
    sample_id: sampleId,
    // model_type: modelType
  }

  try {
    globalLoading.value = true;
    const response = await request.post('/api/detect_sample', params);

    if (response.data.success) {
      // const message = response.data.message ||
      // (scope.row.is_processed ? '重新检测完成' : '检测完成');
      // ElMessage.success(message);
      ElMessage.success(response.data.message);
      getSampleList();
    } else {
      ElMessage.error('检测失败: ' + response.data.message);
    }
  }
  catch (error) {
    console.error('检测样品失败:', error);
    ElMessage.error('服务器错误，检测失败');
  } finally {
    globalLoading.value = false;
  }
};


const showFormDialog = ref(false);

const formData = reactive({
  user_id: '',
  sample_name: '',
  sample_data: '',
  location: '',
});

const formRules = reactive({
  sample_name: [
    { required: true, message: '请输入样品名称', trigger: 'blur' },
    { min: 2, max: 50, message: '样品名称长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  sample_data: [
    { required: true, message: '请输入样品数据', trigger: 'blur' }
  ]
});

const submitting = ref(false);
const sampleForm = ref(null);


const handleSubmit = async () => {
  try {
    await sampleForm.value.validate();
  } catch (error) {
    return error;
  }

  try {
    // submitting.value = true;
    globalLoading.value = true

    // 验证JSON格式
    let parsedData;
    try {
      parsedData = JSON.parse(formData.sample_data);
    } catch (error) {
      ElMessage.error('样品数据格式错误, 请输入有效的JSON', error);
      return;
    }

    const params = {
      new_sample: {
        user_id: formData.user_id || null,
        sample_name: formData.sample_name,
        sample_data: parsedData,
        location: formData.location || null
      },
      model_type: formData.model_type
    };

    const response = await request.post('/api/detect_sample', params)


    if (response.data.success) {
      ElMessage.success(response.data.message);
      showFormDialog.value = false;
      sampleForm.value.resetFields();
      emit('sampleAdded');
      getSampleList();
    } else {
      ElMessage.error('提交失败: ' + response.data.message);
    }
  } catch (error) {
    console.error('新增样品失败:', error);
    ElMessage.error('服务器错误，提交失败');
  } finally {
    // submitting.value = false;
    globalLoading.value = false;
  }
};


const handleDialogClose = () => {
  sampleForm.value?.resetFields();
  showFormDialog.value = false;
};


const formatMessage = (message) => {
  if (!message) return '';
  return message.replace(/\[|\]|'|"/g, '').trim();
};



const handleAddSample = async () => {
  // try {
  //   await sampleForm.value.validate();
  // } catch (error) {
  //   return error;
  // }

  try {
    globalLoading.value = true

    // 验证JSON格式
    let parsedData;
    try {
      parsedData = JSON.parse(formData.sample_data);
    } catch (error) {
      ElMessage.error('样品数据格式错误, 请输入有效的JSON', error);
      return;
    }

    const params = {
      user_id: formData.user_id || null,
      sample_name: formData.sample_name,
      sample_data: parsedData,
      location: formData.location || null
    }

    const response = await request.post('/api/save_sample_data', params);

    if (response.data.success) {
      ElMessage.success(response.data.message);
      showFormDialog.value = false;
      sampleForm.value.resetFields();
      emit('sampleAdded');
      getSampleList();
    } else {
      ElMessage.error('提交失败: ' + response.data.message);
    }
  } catch (error) {
    console.error('新增样品失败:', error);
    ElMessage.error('服务器错误，提交失败');
  } finally {
    globalLoading.value = false;
  }
};


// const fetchSampleInfo = async () => {
//     const response = await axios.get(`/api/view_samples?sample_id=${sampleId.value}`);
//     if (response.data.success) {
//       sampleInfo.value = response.data.data[0];
//     }
//   };
//   fetchSampleInfo();


onMounted(() => {
  getSampleList();
});

</script>


<style scoped>
.sample-list-container {
  /* padding: 20px; */
  background-color: #f5f7fa;
  min-height: calc(100vh - 64px);
  /* 适配导航栏高度，避免页面滚动异常 */
}

.page-header {
  margin-bottom: 16px;
}

.filter-card {
  background-color: #fff;
}

.pagination-container {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

/* 表格文字溢出处理 */
.text-ellipsis {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px;
  /* 根据列宽调整 */
}

/* 详情弹窗代码块样式 */
pre {
  white-space: pre-wrap;
  /* 自动换行 */
  word-break: break-all;
  color: #333;
}

/* 适配小屏幕 */
@media (max-width: 1200px) {
  .filter-form .el-form-item {
    margin-bottom: 12px;
  }
}

@media (max-width: 768px) {
  .sample-list-container {
    padding: 10px;
  }

  .filter-form {
    flex-direction: column;
    align-items: flex-start !important;
  }

  .el-table-column {
    font-size: 12px;
  }
}
</style>
