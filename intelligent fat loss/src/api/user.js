import axios from './config.js'

export const doLogin = async (data) => {
  console.log('doLogin API called with:', data); // 調試日誌
  const res = await axios.post('/login', data);
  console.log('API response received:', res); // 調試日誌
  // 統一返回 mock 結構中的實際 payload
  return res.data;
}