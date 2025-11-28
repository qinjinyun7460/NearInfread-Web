// 存储用户信息（localStorage/sessionStorage 切换）
export const setUserInfo = (userInfo, current_user_id, role, remember = false) => {
  const storage = remember ? localStorage : sessionStorage;
  storage.setItem('userInfo', JSON.stringify(userInfo));
  storage.setItem('current_current_user_id', JSON.stringify(current_user_id));
  storage.setItem('role', JSON.stringify(role));
};

// 获取用户信息
export const getUserInfo = () => {
  const localUser = localStorage.getItem('userInfo');
  const sessionUser = sessionStorage.getItem('userInfo');
  return localUser ? JSON.parse(localUser) : sessionUser ? JSON.parse(sessionUser) : null;
};

export const getCurrentUserId = () => {
  const localUser = localStorage.getItem('current_user_id');
  const sessionUser = sessionStorage.getItem('current_user_id');
  return localUser ? JSON.parse(localUser) : sessionUser ? JSON.parse(sessionUser) : null;
};

// 清除用户信息
export const removeUserInfo = () => {
  localStorage.removeItem('userInfo');
  sessionStorage.removeItem('userInfo');
  localStorage.removeItem('current_user_id');
  sessionStorage.removeItem('current_user_id');
  localStorage.removeItem('role');
  sessionStorage.removeItem('role');
};
