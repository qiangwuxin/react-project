import jwt from 'jsonwebtoken'

const secret='!&124coddefgg';

//login 模块 mock 
export default[
  {
    url:'/api/login',
    method:'post',
    timeout:2000,//请求耗时
    response:(req,res)=>{
      //req username,password
      const{username,password,bodyData}=req.body;
      if(username!=='admin'||password!=='123456'){
        return{
          code:1,
          message:'用户名或密码错误'
        }
      }
      //生成token 颁发令牌
      //json 用户数据
      const token=jwt.sign({
        user:{
          id:"001",
          username,
          height:bodyData.height,
          weight:bodyData.weight,
          age:bodyData.age,
          targetweight:bodyData.targetweight,
          sportType:bodyData.sportType,
          bodyType:bodyData.bodyType
        }
      },secret,{
        expiresIn:86400
      })
      return{
        code:0,
        token,
        data:{
          id:"001",
          username,
          bodyData,
        }
      }
    }
  }
]