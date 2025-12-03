<template>
  <el-dialog :title="dialogTitle" :visible="visible" width="700px" :before-close="handleClose">
    <el-card shadow="hover">
      <el-form ref="sampleForm" :model="formData" :rules="formRules" label-width="120px" class="mt-4">
        <el-row :gutter="20">
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
import { reactive, ref } from 'vue';
import { ElMessage } from 'element-plus';
import { getCurrentUserId } from '@/utils/storage';

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  type: {
    type: String,
    default: 'save'
  }
});

const currentUserId = getCurrentUserId();

const emit = defineEmits(['close', 'submit']);

const sampleForm = ref(null);

const formData = reactive({
  user_id: currentUserId,
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

const dialogTitle = ref('新增样品数据');
const submitText = ref('保存');

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