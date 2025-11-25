<template>
    <div class="container">
        <el-card shadow="never">
            <template #header>
                <span>检测记录</span>
            </template>

            <el-button class="button-container" @click="handleDetectSample" type="primary" plain>样品检测</el-button>

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

            </el-table>

            <div class="pagination-container">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                    :current-page="pagination.currentPage" :page-sizes="[5, 10, 20, 50]"
                    :page-size="pagination.pageSize" layout="total, sizes, prev, pager, next, jumper"
                    :total="pagination.total" />
            </div>
        </el-card>
    </div>
</template>

<script setup>
import { ref, reactive, watch, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import request from '@/utils/request';
import formatTime from '@/components/FormatTime';
import { detectSample } from './Sample/api';


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


const handleDetectSample = async () => {
    try {
        tableLoading.value = true;
        const response = await detectSample({
            sample_id: props.sampleId
        });
        if (response.data.success) {
            ElMessage.success(response.data.message);
            getSampleRecords();
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


const records = ref([]);
const tableLoading = ref(false);

const pagination = reactive({
    currentPage: 1,
    pageSize: 5,
    total: 0
});


const getSampleRecords = async () => {
    try {
        tableLoading.value = true;

        const currentUserId = sessionStorage.getItem('current_user_id');
        if (!currentUserId) {
            ElMessage.warning('请先登录');
            tableLoading.value = false;
            return;
        }

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


watch(
    () => props.sampleId,
    () => {
        pagination.currentPage = 1;
        getSampleRecords();
    },
    { immediate: true }
);


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
.container {
    background-color: transparent;
}

.button-container {
    margin-bottom: 16px;
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
