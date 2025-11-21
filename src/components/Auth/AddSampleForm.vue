<template>
  <el-card class="mb-6" shadow="hover">
    <template #header>
      <div class="flex items-center">
        <h2 class="text-xl font-semibold">新增样品检测</h2>
      </div>
    </template>

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
              placeholder='请输入JSON格式数据, 例如：{"value1": 123, "value2": 456}' clearable></el-input>
            <el-text type="info" class="text-xs mt-1 block">
              <el-icon size="14">
                <InfoFilled />
              </el-icon>
              请输入有效的JSON格式数据, 确保键值对格式正确
            </el-text>
          </el-form-item>
        </el-col>

        <!-- <el-col :span="12">
          <el-form-item label="检测模型" prop="model_type">
            <el-select v-model="formData.model_type" placeholder="请选择检测模型" clearable>
              <el-option label="低误差模型（默认）" value="low_error"></el-option>
              <el-option label="高速模型" value="high_speed"></el-option>
            </el-select>
          </el-form-item>
        </el-col> -->


        <el-col :span="24" class="text-right">
          <el-button type="primary" @click="handleSubmit" :loading="submitting">
            提交检测并保存
          </el-button>
        </el-col>

      </el-row>
    </el-form>

  </el-card>
</template>

<script setup>
import { ref, reactive } from 'vue';
// import axios from 'axios';
import {
  InfoFilled,
} from '@element-plus/icons-vue';
// import { ElMessage } from 'element-plus';


// const API_BASE = 'http://127.0.0.1:5000';

// 表单数据
const formData = reactive({
  user_id: '',
  sample_name: '',
  sample_data: '',
  location: '',
  // model_type: 'low_error'
});

// 表单验证规则
const formRules = reactive({
  sample_name: [
    { required: true, message: '请输入样品名称', trigger: 'blur' },
    { min: 2, max: 50, message: '样品名称长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  sample_data: [
    { required: true, message: '请输入样品数据', trigger: 'blur' }
  ]
});

// 提交状态
const submitting = ref(false);
const sampleForm = ref(null);

// // 提交事件
// const emit = defineEmits(['sampleAdded']);

// const handleSubmit = async () => {
//   // 表单验证
//   try {
//     await sampleForm.value.validate();
//   } catch (error) {
//     return error; // 验证失败时终止提交
//   }

//   try {
//     submitting.value = true;

//     // 验证JSON格式
//     let parsedData;
//     try {
//       parsedData = JSON.parse(formData.sample_data);
//     } catch (error) {
//       ElMessage.error('样品数据格式错误, 请输入有效的JSON', error);
//       return;
//     }

//     // 发送请求
//     const response = await axios.post(`${API_BASE}/api/detect_sample`, {
//       new_sample: {
//         user_id: formData.user_id || null,
//         sample_name: formData.sample_name,
//         sample_data: parsedData,
//         location: formData.location || null
//       },
//       model_type: formData.model_type
//     });

//     if (response.data.success) {
//       ElMessage.success('新增样品检测成功');
//       // 重置表单
//       sampleForm.value.resetFields();
//       // 通知父组件刷新列表
//       emit('sampleAdded');
//     } else {
//       ElMessage.error('提交失败: ' + response.data.message);
//     }
//   } catch (error) {
//     console.error('新增样品失败:', error);
//     ElMessage.error('服务器错误，提交失败');
//   } finally {
//     submitting.value = false;
//   }
// };
</script>

<style scoped>
.text-xs {
  font-size: 12px;
}

.el-card {
  border-radius: 8px;
}

.el-form-item__label {
  font-weight: 500;
}

.el-textarea__inner {
  font-family: monospace;
}
</style>
