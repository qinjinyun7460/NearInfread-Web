<template>
  <el-dialog title="添加用户" :visible="visible" width="500px" :before-close="handleClose">
    <el-form :model="userForm" ref="formRef" :rules="rules" label-width="120px">
      <el-form-item label="用户名" prop="user_name">
        <el-input v-model="userForm.user_name" placeholder="请输入用户名" />
      </el-form-item>
      <el-form-item label="手机号" prop="tel">
        <el-input v-model="userForm.tel" placeholder="请输入手机号" />
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="userForm.email" placeholder="请输入邮箱" />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleSubmit">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ElMessage } from 'element-plus';
import { reactive, ref } from 'vue';

// 表单数据
const userForm = reactive({
  user_name: '',
  tel: '',
  email: ''
});

// 表单引用
const formRef = ref(null);

// 验证规则
const rules = reactive({
  user_name: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度在3-20个字符之间', trigger: 'blur' }
  ],
  tel: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^\d{11}$/, message: '请输入正确的手机号格式', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ]
});

// 定义事件
const emit = defineEmits(['close', 'submit', 'update:visible']);

// 关闭弹窗
const handleClose = () => {
  formRef.value?.resetFields();
  emit('close');
};

// 提交表单
const handleSubmit = async () => {
  try {
    await formRef.value.validate();
    emit('submit', { ...userForm });
    handleClose();
  } catch (error) {
    const firstError = error.errors?.[0]?.message || '表单未进行填写';
    ElMessage.error(firstError);
  }
};

</script>
