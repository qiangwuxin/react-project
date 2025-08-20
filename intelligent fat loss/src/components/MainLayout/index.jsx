import {
  useState,
  useEffect
} from 'react';
import {
  Tabbar,
} from 'react-vant';
import {
  HomeO,
  UserO
} from '@react-vant/icons';
import {
  Outlet,
  useNavigate,
  useLocation
} from 'react-router-dom'

//菜单栏配置
const tabs = [
  { icon: <HomeO />, title: '首页', path: '/shop' },
  { icon: <span>🍴</span>, title: '饮食', path: '/diet' },
  { icon: <span>🤖</span>, title: 'AI', path: '/aichat' },
  { icon: <UserO />, title: '用户信息', path: '/account' }
]

const MainLayout = () => {
  const [active, setActive] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    console.log(location.pathname, '////')
    // es6的使用power 
    const index = tabs.findIndex(
      tab => location.pathname.startsWith(tab.path)
    );
    setActive(index >= 0 ? index : 0)
  }, [location.pathname])

  const handleTabChange = (key) => {
    // 防止重複點擊同一個標籤
    if (active === key) return;

    const targetPath = tabs[key].path;
    // 若當前已在目標路徑（前綴匹配），則不再導航
    if (location.pathname.startsWith(targetPath)) return;

    try {
      navigate(targetPath, { replace: true });
      setActive(key);
    } catch (error) {
      console.error('導航錯誤:', error);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 overflow-hidden">
        <Outlet />
      </div>
      {/* tabbar */}
      <Tabbar
        value={active}
        onChange={handleTabChange}
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          height: '50px'
        }}
      >
        {tabs.map((tab, index) => (
          <Tabbar.Item
            key={index}
            icon={tab.icon}
          >
            {tab.title}
          </Tabbar.Item>
        ))}
      </Tabbar>
    </div>
  )
}

export default MainLayout;