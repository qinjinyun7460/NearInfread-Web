<template>
  <el-dialog title="样品详情" visible="visible" width=auto :before-close="handleClose">

    <el-descriptions :column="1" border class="mt-2">
      <el-descriptions-item label="样品ID">{{ sample.sample_id }}</el-descriptions-item>
      <el-descriptions-item label="用户ID">{{ sample.user_id }}</el-descriptions-item>
      <el-descriptions-item label="样品名称">{{ sample.sample_name }}</el-descriptions-item>
      <el-descriptions-item label="采样地点">{{ sample.location || '-' }}</el-descriptions-item>
      <el-descriptions-item label="采样时间">{{ formatTime(sample.detect_time) }}</el-descriptions-item>
      <el-descriptions-item label="是否已检测">{{ sample.is_processed ? '已检测' : '未检测' }}</el-descriptions-item>
      <el-descriptions-item label="检测结果">
        <pre class="bg-gray-50 p-3 rounded text-sm">{{ sample.predict_data || '暂无检测结果' }}</pre>
      </el-descriptions-item>
      <el-descriptions-item label="检测时间">{{ formatTime(sample.processed_time) }}</el-descriptions-item>
      <el-descriptions-item label="样品原始数据">{{ sample.sample_data }}</el-descriptions-item>
    </el-descriptions>


    <template #footer>
      <el-button @click="handleClose">关闭</el-button>
    </template>

  </el-dialog>
</template>

<script setup>
import { watch } from 'vue';
import dayjs from 'dayjs';

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  sample: {
    type: Object,
    default: () => ({})
  }
});


watch(
  () => props.sample,
  { immediate: true }
);

const emit = defineEmits(['close']);

const formatTime = (time) => {
  if (!time) return '-';
  return dayjs(time).format('YYYY-MM-DD HH:mm:ss');
};

const handleClose = () => {
  emit('close');
};
</script>

<style scoped>
pre {
  white-space: pre-wrap;
  word-break: break-all;
  color: #333;
}
</style>
