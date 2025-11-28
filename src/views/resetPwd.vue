<template>
  <el-card>
    <el-form ref="pwdRef" :model="form" :rules="rules" label-width="auto">

      <el-form-item v-if="isAdmin && !isSelfMode" label="目标用户ID" prop="target_user_id">
        <el-input v-model="form.target_user_id" placeholder="请输入要重置密码的用户ID" />
      </el-form-item>

      <el-form-item v-if="isAdmin && !isSelfMode" label="目标用户名" prop="target_user_name">
        <el-input v-model="form.target_user_name" placeholder="请输入要重置密码的用户名" />
      </el-form-item>

      <el-form-item v-if="isSelfMode" label="旧密码" prop="old_password">
        <el-input v-model="form.old_password" placeholder="请输入旧密码" type="password" show-password />
      </el-form-item>

      <el-form-item label="新密码" prop="new_password">
        <el-input v-model="form.new_password" placeholder="请输入新密码（6-20位）" type="password" show-password />
      </el-form-item>

      <el-form-item label="确认密码" prop="confirm_password">
        <el-input v-model="form.confirm_password" placeholder="请确认新密码" type="password" show-password />
      </el-form-item>
    </el-form>

    <el-form-item>
      <el-button type="primary" @click="resetPassword">保存</el-button>
      <el-button @click="close">关闭</el-button>
    </el-form-item>
  </el-card>
</template>

<script setup>
import { reactive, ref, onMounted, watch } from "vue"
import { ElMessage } from "element-plus"
import { getUserInfo } from "@/utils/storage"
import request from "@/utils/request"


const props = defineProps({
  isSelfMode: {
    type: Boolean,
    default: true
  },
  targetUserId: {
    type: Number
  },
  targetUserName: {
    type: String
  }
})

const form = reactive({
  target_user_id: props.targetUserId || "",
  target_user_name: props.targetUserName || "",
  old_password: "",
  new_password: "",
  confirm_password: ""
})

watch(
  () => [props.targetUserId, props.targetUserName],
  ([newUserId, newUserName]) => {
    form.target_user_id = newUserId || "";
    form.target_user_name = newUserName || "";
    form.new_password = "";
    form.confirm_password = "";
  },
  { immediate: true }
)

watch(
  () => props.isSelfMode,
  () => {
    if (props.isSelfMode) {
      form.target_user_id = "";
    } else {
      form.old_password = "";
    }
    form.new_password = "";
    form.confirm_password = "";
    if (pwdRef.value) {
      pwdRef.value.clearValidate();
    }
  }
)

const pwdRef = ref(null)
const userInfo = ref({})
const isAdmin = ref(false)

onMounted(() => {
  userInfo.value = getUserInfo() || {}
  isAdmin.value = userInfo.value.role === 1
})

const equalToPassword = (rule, value, callback) => {
  if (form.new_password !== value) {
    callback(new Error("两次输入的密码不一致"))
  } else {
    callback()
  }
}

const rules = ref({
  target_user_id: isAdmin.value ? [
    { required: true, message: "请输入目标用户ID", trigger: "blur" },
    { type: "number", message: "用户ID必须是数字", trigger: "blur" }
  ] : [],

  target_user_name: isAdmin.value ? [
    { required: true, message: "请输入目标用户名", trigger: "blur" },
  ] : [],

  old_password: !isAdmin.value ? [
    { required: true, message: "旧密码不能为空", trigger: "blur" }
  ] : [],

  new_password: [
    { required: true, message: "新密码不能为空", trigger: "blur" },
    { min: 6, max: 20, message: "长度在 6 到 20 个字符", trigger: "blur" },
    { pattern: /^[^<>"'|\\]+$/, message: "不能包含非法字符：< > \" ' \\ |", trigger: "blur" }
  ],
  confirm_password: [
    { required: true, message: "确认密码不能为空", trigger: "blur" },
    { validator: equalToPassword, trigger: "blur" }
  ]
})

const emit = defineEmits(['close'])
const close = () => {
  pwdRef.value?.resetFields();
  emit('close')
}


const resetPassword = async () => {
  try {
    await pwdRef.value.validate()
  } catch {
    return ElMessage.warning('请完善表单信息')
  }

  const requestData = {
    new_password: form.new_password
  }

  if (isAdmin.value && !props.isSelfMode) {
    requestData.target_user_id = form.target_user_id
    requestData.operator_id = userInfo.value.user_id
  }

  else {
    requestData.old_password = form.old_password
    requestData.user_id = userInfo.value.user_id
  }

  try {
    const response = await request.put('/api/user/resetPwd', requestData)

    if (response.data.success) {
      ElMessage.success(response.data.message)
      close()
    } else {
      ElMessage.error(response.data.message || '修改失败')
    }
  } catch (error) {
    console.error('密码重置失败：', error)
    ElMessage.error('网络异常，请稍后重试')
  }
};

</script>