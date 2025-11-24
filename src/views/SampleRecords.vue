<!-- <template>
    <div class="user-list-container">

        <el-card shadow="hover" class="table-card">
            <el-table :data="records" border stripe :loading="tableLoading" style="width: 100%" max-height="800">
                <el-table-column label="样品ID" prop="sample_id" align="center" />
                <el-table-column label="检测人ID" prop="detector_id" align="center" sortable />
                <el-table-column label="检测人名称" prop="detector_name" align="center" />
                <el-table-column label="检测时间" prop="detect_time" align="center" />
                <el-table-column label="检测结果" prop="predict_data" align="center" />
                <el-table-column label="检测结果分析" prop="predict_message" align="center" />
                <el-table-column label="备注" prop="remark" align="center" />

            </el-table>

            <div class="pagination-container">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                    :current-page="pagination.currentPage" :page-sizes="[10, 20, 50, 100]"
                    :page-size="pagination.pageSize" layout="total, sizes, prev, pager, next, jumper"
                    :total="pagination.total" />
            </div>
        </el-card>

    </div>
</template>


<script setup>
import { ref, reactive, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import request from '@/utils/request';

const records = ref([]);
const tableLoading = ref(false);

const pagination = reactive({
    currentPage: 1,
    pageSize: 10,
    total: 0
});


import { useRoute } from 'vue-router';
const route = useRoute();

const getSampleRecords = async () => {
    try {
        tableLoading.value = true;

        const currentUserId = sessionStorage.getItem('current_user_id');
        if (!currentUserId) {
            ElMessage.warning('请先登录');
            tableLoading.value = false;
            return;
        }
        const sampleId = route.params.sampleId;

        const response = await request.get(`/api/samples/${sampleId}/detect-history`);

        if (response.data.success) {
            records.value = response.data.data;
            pagination.total = response.data.total;
        } else {
            ElMessage.error(response.data.message || '获取检测记录失败');
        }
    } catch (error) {
        console.error('检测记录查询失败：', error);
        if (error.response) {
            console.log('请求地址：', error.config.url);
            console.log('传递的参数：', error.config.params);
        }
        ElMessage.error('网络错误，获取检测记录失败');
    } finally {
        tableLoading.value = false;
    }
};



const handleSizeChange = (val) => {
    pagination.pageSize = val;
    pagination.currentPage = 1;
    getSampleRecords();
};


const handleCurrentChange = (val) => {
    pagination.currentPage = val;
    getSampleRecords();
};


onMounted(() => {
    getSampleRecords();
});


</script>


<style scoped>
.user-list-container {
    /* padding: 20px; */
    background-color: #f5f7fa;
    min-height: calc(100vh - 64px);
    /* 适配导航栏高度 */
}

.page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

.filter-form {
    margin-bottom: 0;
}

.table-card {
    margin-bottom: 20px;
}

.pagination-container {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin-top: 16px;
}

/* 适配小屏幕 */
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
</style> -->


<template>
    <div class="user-list-container">
        <el-table :data="records" border stripe :loading="tableLoading" style="width: 100%" max-height="600">
            <el-table-column label="检测记录ID" prop="id" align="center" />
            <el-table-column label="样品ID" prop="sample_id" align="center" />
            <el-table-column label="检测人ID" prop="detector_id" align="center" sortable />
            <el-table-column label="检测人名称" prop="detector_name" align="center" />
            <el-table-column label="检测时间" prop="detect_time" align="center">
                <template #default="scope">
                    {{ formatTime(scope.row.detect_time) }}
                </template>
            </el-table-column>
            <el-table-column label="检测结果" prop="predict_data" align="center" />
            <el-table-column label="检测结果分析" prop="predict_message" align="center" />
            <el-table-column label="备注" prop="remark" align="center" />
            <el-table-column label="操作" align="center">
                <template #default="scope">
                    <el-button type="text" @click="viewRecordDetail(scope.row)">
                        查看详情
                    </el-button>
                </template>
            </el-table-column>
        </el-table>

        <div class="pagination-container">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :current-page="pagination.currentPage" :page-sizes="[10, 20, 50, 100]" :page-size="pagination.pageSize"
                layout="total, sizes, prev, pager, next, jumper" :total="pagination.total" />
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, watch, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import request from '@/utils/request';
import formatTime from '@/components/FormatTime';

// 接收父组件传递的props
const props = defineProps({
    sampleId: {
        type: [Number, String],
        required: true
    },
    sampleName: {
        type: String,
        default: ''
    }
});


const records = ref([]);
const tableLoading = ref(false);

const pagination = reactive({
    currentPage: 1,
    pageSize: 10,
    total: 0
});

// 获取检测记录数据
const getSampleRecords = async () => {
    try {
        tableLoading.value = true;

        const currentUserId = sessionStorage.getItem('current_user_id');
        if (!currentUserId) {
            ElMessage.warning('请先登录');
            tableLoading.value = false;
            return;
        }

        // 传递分页参数
        const params = {
            page: pagination.currentPage,
            per_page: pagination.pageSize
        };

        const response = await request.get(`/api/samples/${props.sampleId}/detect-history`, { params });

        if (response.data.success) {
            records.value = response.data.detect_records || response.data.data || [];
            pagination.total = response.data.total_detects || response.data.total || 0;
        } else {
            ElMessage.error(response.data.message || '获取检测记录失败');
        }
    } catch (error) {
        console.error('检测记录查询失败：', error);
        ElMessage.error('网络错误，获取检测记录失败');
    } finally {
        tableLoading.value = false;
    }
};

// 监听sampleId变化，重新加载数据
watch(
    () => props.sampleId,
    () => {
        pagination.currentPage = 1; // 重置页码
        getSampleRecords();
    },
    { immediate: true }
);

// 分页事件处理
const handleSizeChange = (val) => {
    pagination.pageSize = val;
    pagination.currentPage = 1;
    getSampleRecords();
};

const handleCurrentChange = (val) => {
    pagination.currentPage = val;
    getSampleRecords();
};

// 查看记录详情
const viewRecordDetail = (record) => {
    // 可以打开详情弹窗或跳转到详情页
    ElMessage.info(`查看检测记录ID: ${record.id} 的详情`);
    // 或者跳转到详情页
    // router.push({ 
    //   path: `/detect-record/${record.id}`,
    //   query: { sampleId: props.sampleId, sampleName: props.sampleName }
    // });
};

onMounted(() => {
    getSampleRecords();
});
</script>

<style scoped>
.user-list-container {
    background-color: transparent;
}

.pagination-container {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin-top: 16px;
}

/* 适配小屏幕 */
@media (max-width: 768px) {
    .el-table {
        font-size: 12px;
    }
}
</style>
