import request from '@/utils/request';

/**
 * 获取用户列表
 * @param {Object} params - 查询参数
 * @param {number} params.page - 页码
 * @param {number} params.size - 每页条数
 * @param {string} [params.user_name] - 用户名筛选
 * @param {string} [params.tel] - 电话筛选
 * @param {string} [params.email] - 邮箱筛选
 * @param {string} [params.online_status] - 在线状态筛选
 * @returns {Promise} - 接口返回的Promise对象
 */
export const getUserList = (params) => {
  return request.get('api/view_users', { params });
};

/**
 * 添加新用户
 * @param {Object} userData - 用户信息
 * @param {string} userData.user_name - 用户名
 * @param {string} userData.tel - 电话
 * @param {string} userData.email - 邮箱
 * @param {string} [userData.otherFields] - 其他用户信息字段
 * @returns {Promise} - 接口返回的Promise对象
 */
export const addUser = (userData) => {
  return request.post('/api/user/addUser', userData);
};

/**
 * 编辑用户信息
 * @param {string} userId - 用户ID
 * @param {Object} formData - 编辑后的用户信息
 * @returns {Promise} - 接口返回的Promise对象
 */
export const editUser = (userId, formData) => {
  return request.put(`/api/user/${userId}`, formData);
};

/**
 * 删除用户
 * @param {string} userId - 要删除的用户ID
 * @returns {Promise} - 接口返回的Promise对象
 */
export const deleteUser = (userId) => {
  return request.delete(`/api/user/${userId}`);
};

/**
 * 更新用户在线状态
 * @param {string} userId - 用户ID
 * @param {boolean} isOnline - 在线状态（true: 在线, false: 离线）
 * @returns {Promise}
 */
export const updateUserOnlineStatus = (userId, isOnline) => {
  return request.put(`/api/user/${userId}/status`, {
    online_status: isOnline
  });
};
