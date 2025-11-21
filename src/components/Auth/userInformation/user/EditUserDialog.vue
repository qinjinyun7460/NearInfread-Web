<template>
  <el-dialog title="编辑用户" :visible="visible" width="500px" :before-close="handleClose">
    <el-form :model="editForm" ref="formRef" :rules="rules" label-width="120px">
      <el-form-item label="用户ID" prop="user_id">
        <el-input v-model="editForm.user_id" disabled placeholder="用户ID不可修改" />
      </el-form-item>
      <el-form-item label="用户名" prop="user_name">
        <el-input v-model="editForm.user_name" placeholder="请输入用户名" />
      </el-form-item>
      <el-form-item label="手机号" prop="tel">
        <el-input v-model="editForm.tel" placeholder="请输入手机号" />
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="editForm.email" placeholder="请输入邮箱" />
      </el-form-item>
      <el-form-item label="年龄" prop="age">
        <el-input v-model="editForm.age" placeholder="请输入年龄" />
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
import { reactive, ref, watch } from 'vue';

// 接收父组件的属性
const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  userInfo: {
    type: Object,
    default: () => ({
      user_id: '',
      user_name: '',
      tel: '',
      email: '',
      age: ''
    })
  }
});

// 表单数据
const editForm = reactive({
  user_id: '',
  user_name: '',
  tel: '',
  email: '',
  age: ''
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
  ],
  age: [
    { message: '年龄必须是数字', trigger: 'blur' },
    { min: 0, max: 150, message: '年龄范围在0-150之间', trigger: 'blur' }
  ]
});

// 监听用户信息变化，同步到表单
watch(
  () => props.userInfo,
  (newVal) => {
    Object.assign(editForm, newVal);
  },
  { immediate: true }
);

// 定义事件
const emit = defineEmits(['update:visible', 'submit', 'close']);

// 关闭弹窗
const handleClose = () => {
  // formRef.value?.resetFields();
  emit('close');
};

// 提交表单
const handleSubmit = async () => {
  try {
    await formRef.value.validate();
    emit('submit', { ...editForm });
    emit('update:visible', false);
  } catch (error) {
    ElMessage.error(error);
  }
};
</script>
