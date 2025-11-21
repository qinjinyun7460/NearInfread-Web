
import { getUserList } from '@/views/user/user_api';

let userMapCache = null;

/**
 * 获取用户ID到用户名的映射表
 * @returns {Promise<Map>} 用户ID为键，用户名为值的Map对象
 */
export const getUserIdToNameMap = async () => {
  if (userMapCache) {
    return userMapCache;
  }

  try {
    const response = await getUserList({ page: 1, size: 100 });
    if (response.data.success && Array.isArray(response.data.data)) {
      const userMap = new Map();
      response.data.data.forEach(user => {
        if (user.user_id && user.user_name) {
          userMap.set(String(user.user_id), user.user_name);
        }
      });
      userMapCache = userMap;
      return userMap;
    } else {
      console.warn('获取用户列表数据格式异常');
      return new Map();
    }
  } catch (error) {
    console.error('获取用户映射失败：', error);
    return new Map();
  }
};

/**
 * 清除用户映射缓存（用于用户数据更新后刷新）
 */
export const clearUserMapCache = () => {
  userMapCache = null;
};
