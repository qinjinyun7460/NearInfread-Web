<template>
  <el-dialog title="删除确认" :visible="visible" width="30%" :before-close="handleClose">
    <div>确定要删除该用户吗？删除后数据不可恢复！</div>
    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="danger" @click="handleConfirm">确定删除</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { defineEmits } from 'vue';

// 定义事件
const emit = defineEmits(['close', 'confirm']);

// 关闭弹窗
const handleClose = () => {
  emit('close');
};

// 确认删除
const handleConfirm = () => {
  emit('confirm');
};
</script>
