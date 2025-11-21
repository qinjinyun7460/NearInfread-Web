<template>
  <el-form ref="userRef" :model="form" :rules="rules" label-width="80px">
    <el-form-item label="用户昵称" prop="user_name">
      <el-input v-model="form.user_name" maxlength="30" />
    </el-form-item>
    <el-form-item label="手机号码" prop="tel">
      <el-input v-model="form.tel" maxlength="11" />
    </el-form-item>
    <el-form-item label="邮箱" prop="email">
      <el-input v-model="form.email" maxlength="50" />
    </el-form-item>
    <!-- <el-form-item label="性别">
      <el-radio-group v-model="form.sex">
        <el-radio value="0">男</el-radio>
        <el-radio value="1">女</el-radio>
      </el-radio-group>
    </el-form-item> -->
    <el-form-item>
      <el-button type="primary" @click="submit">保存</el-button>
      <el-button type="danger" @click="close">关闭</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup>
import { updateUserProfile } from "@/api/system/user"
import { ref, getCurrentInstance, watch } from "vue"
import { ElMessage } from 'element-plus';

const props = defineProps({
  user: {
    type: Object
  }
})

const { proxy } = getCurrentInstance()

const form = ref()
const rules = ref({
  user_name: [{ required: true, message: "用户昵称不能为空", trigger: "blur" }],
  email: [{ required: true, message: "邮箱地址不能为空", trigger: "blur" }, { type: "email", message: "请输入正确的邮箱地址", trigger: ["blur", "change"] }],
  tel: [{ required: true, message: "手机号码不能为空", trigger: "blur" }, { pattern: /(^\d{11}$)/, message: "请输入正确的手机号码", trigger: "blur" }],
})

const submit = async () => {
  const isValid = await proxy.$refs.userRef.validate().catch(() => false);
  if (!isValid) return;

  try {
    const response = await updateUserProfile(form.value);
    ElMessage.success("修改成功");
    proxy.$emit('update-user-info', {
      tel: response.tel,
      email: response.email
    });
  } catch (error) {
    console.error('更新失败：', error);
    ElMessage.error("修改失败，请重试");
  }
};


function close() {
  proxy.$tab.closePage()
}


watch(() => props.user, user => {
  if (user) {
    form.value = { user_name: user.user_name, tel: user.tel, email: user.email, sex: user.sex }
  }
}, { immediate: true })

</script>
