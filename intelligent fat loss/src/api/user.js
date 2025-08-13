import axios from './config.js'

export const doLogin=(data)=>{
  return axios.post('/login',data);
}