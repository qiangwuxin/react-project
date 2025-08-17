import axios from './config'

export const getDetail = async (id, options = {}) => {
  return axios.get(`/detail/${id}`, options);
}

