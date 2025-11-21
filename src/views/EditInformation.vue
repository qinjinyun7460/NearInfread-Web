<template>
  <div>
    <el-card>
      <el-form :model="userInfo" ref="editFormRef" :rules="editFormRules" label-width="120px">
        <el-form-item label="用户名" prop="user_name">
          <el-input v-model="userInfo.user_name" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="手机号" prop="tel">
          <el-input v-model="userInfo.tel" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="userInfo.email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="年龄" prop="age">
          <el-input v-model="userInfo.age" placeholder="请输入年龄" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitEditForm">保存</el-button>
          <el-button type="danger" @click="handleClose">关闭</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>


<script setup name="Profile">
import { ref, onMounted, reactive } from 'vue';
import { ElMessage, ElForm } from 'element-plus';
import axios from 'axios';
import { getUserInfo } from '@/utils/storage';


const userInfo = ref({});

const API_BASE = 'http://127.0.0.1:5000';
const currentUserId = sessionStorage.getItem('current_user_id');

// const editDialogVisible = ref(false);
const editFormRef = ref(null);
const editFormRules = reactive({
  tel: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /(^\d{11}$)/, message: '请输入正确的手机号格式', trigger: 'blur' }
  ],
  email: [
    { message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
});

// // 接收父组件传递的初始用户信息
// const props = defineProps({
//   initialUser: {
//     type: Object,
//     required: true,
//     default: () => ({})
//   }
// });

onMounted(() => {
  // userInfo.value = { ...props.initialUser };
  userInfo.value = getUserInfo()
});

const emit = defineEmits(['update:user', 'close', 'closeCurrentTab']);

const submitEditForm = async () => {
  if (!currentUserId) {
    ElMessage.warning('请先登录');
    return;
  }

  try {
    await editFormRef.value.validate();

    const response = await axios.put(`${API_BASE}/api/user/${userInfo.value.user_id}`, userInfo.value, { params: { current_user_id: userInfo.value.user_id } });

    if (response.data.success) {
      ElMessage.success('修改成功');
      emit('update:user', userInfo.value);
    } else {
      ElMessage.error(response.data.message || '用户编辑失败');
    }
  } catch (error) {
    if (error.name !== 'ValidationError') {
      ElMessage.error('网络错误，修改失败');
    }
  }
};

const handleClose = () => {
  // 1. 通知布局页关闭当前标签页
  emit('closeCurrentTab');
  emit('close');
};
</script>
