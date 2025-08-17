import axios from './config'

export const getPages = (page)=>{
    return axios.get('/pages',{
      params:{page}
    })
}