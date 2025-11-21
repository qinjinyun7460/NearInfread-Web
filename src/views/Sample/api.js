import request from '@/utils/request';

// 获取样品列表
export const getSampleList = (params) => {
  return request.get('/api/view_samples', { params });
};

// 检测样品
export const detectSample = (params) => {
  return request.post('/api/detect_sample', params);
};

// 保存样品数据
export const saveSampleData = (params) => {
  return request.post('/api/save_sample_data', params);
};
