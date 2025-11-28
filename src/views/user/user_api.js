import request from '@/utils/request';

export const getUserList = (params) => {
  return request.get('api/view_users', { params });
};

export const addUser = (userData) => {
  return request.post('/api/user/addUser', userData);
};

export const editUser = (userId, formData) => {
  return request.put(`/api/user/${userId}`, formData);
};

export const deleteUser = (userId) => {
  return request.delete(`/api/user/${userId}`);
};

export const updateUserOnlineStatus = (userId, isOnline) => {
  return request.put(`/api/user/${userId}/status`, {
    online_status: isOnline
  });
};
