import { reactive, ref, onMounted } from "vue"
import { ElMessage } from "element-plus"
import axios from "axios"
import { getUserInfo } from "@/utils/storage"


const form = reactive({
  target_user_id: "",
  old_password: "",
  new_password: "",
  confirm_password: ""
})

const pwdRef = ref(null)

const userInfo = ref({})
const isAdmin = ref(false)
const API_BASE = 'http://127.0.0.1:5000';

onMounted(() => {
  userInfo.value = getUserInfo() || {}
  isAdmin.value = userInfo.value.role === 1
})

const resetPassword = async () => {
  try {
    await pwdRef.value.validate()
  } catch (error) {
    return ElMessage.warning('请完善表单信息', error)
  }

  const requestData = {
    new_password: form.new_password
  }

  if (!isAdmin.value) {
    requestData.old_password = form.old_password
  } else {
    requestData.user_id = form.target_user_id
  }

  try {
    const response = await axios.put(
      `${API_BASE}/api/user/resetPwd`, requestData,
      {
        params: {
          current_user_id: userInfo.value.user_id
        }
      }
    )

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


export default resetPassword;
