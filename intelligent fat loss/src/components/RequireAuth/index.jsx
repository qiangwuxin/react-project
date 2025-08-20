import { useUserStore } from '@/store/userStore'
import { useNavigate, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Loading from '@/components/Loading'; // 添加加载组件

const RequireAuth = ({ children }) => {
  const { isLogin, loading } = useUserStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    // 防止重複導航
    if (isNavigating) return;

    // 如果沒有登錄且不在加載中，則重定向到登錄頁面
    if (!isLogin && !loading) {
      try {
        setIsNavigating(true);
        navigate('/login', {
          state: { from: location.pathname }
        });
      } catch (error) {
        console.error('重定向錯誤:', error);
        setIsNavigating(false);
      }
    }
  }, [isLogin, loading, navigate, location.pathname, isNavigating])

  // 如果正在加載或導航，顯示加載組件
  if (loading || isNavigating) {
    return <Loading />;
  }

  // 如果已登錄，顯示子組件；否則返回 null
  return isLogin ? children : null;
}

export default RequireAuth;