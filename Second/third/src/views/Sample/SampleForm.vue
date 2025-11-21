<template>
  <el-dialog :title="dialogTitle" :visible="visible" width="700px" :before-close="handleClose">
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
              <el-input v-model="formData.sample_data" type="textarea" :rows="4" placeholder='请输入数据, 例如：[123, 456, ……]'
                clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <template #footer>
      <div class="text-center" style="width: 100%;">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleSubmit">
          {{ submitText }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { defineProps, reactive, ref } from 'vue';
import { ElMessage } from 'element-plus';

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  type: {
    type: String,
    default: 'save' // save/detect
  }
});

const emit = defineEmits(['close', 'submit']);

const sampleForm = ref(null);

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

// 动态标题和按钮文字

const dialogTitle = ref('新增样品数据');
const submitText = ref('保存');

// const dialogTitle = ref('');
// const submitText = ref('');

// watch(() => props.type, (newVal) => {
//   dialogTitle.value = newVal === 'save' ? '新增样品数据' : '新增样品并检测';
//   submitText.value = newVal === 'save' ? '保存' : '提交检测并保存';
// }, { immediate: true });

const handleSubmit = async () => {
  try {
    await sampleForm.value.validate();
  } catch (error) {
    return error;
  }

  let parsedData;
  try {
    parsedData = JSON.parse(formData.sample_data);
  } catch (error) {
    ElMessage.error('样品数据格式错误, 请输入有效的JSON', error);
    return;
  }

  emit('submit', {
    ...formData,
    sample_data: parsedData,
    type: props.type
  })
  handleClose();
};

const handleClose = () => {
  sampleForm.value?.resetFields();
  emit('close');
};
</script>
