import { useUserStore } from '@/store/userStore'
import { useNavigate, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Loading from '@/components/Loading'; // 添加加载组件

const RequireAuth = ({ children }) => {
  const { isLogin, loading } = useUserStore(); // 添加加载状态
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isLogin && !loading) {
      navigate('/login', { 
        state: { from: location.pathname } 
      });
    }
  }, [isLogin, loading, navigate, location.pathname])

  if (loading) {
    return <Loading />;
  }

  return isLogin ? children : null;
}

export default RequireAuth;