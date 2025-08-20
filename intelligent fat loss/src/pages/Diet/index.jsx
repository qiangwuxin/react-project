// Diet.jsx - 主页面组件
import { useState, useEffect } from 'react';
import useTitle from '@/hooks/useTitle';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import styles from './diet.module.css';

const Diet = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('plan');

  useTitle('饮食');
  useEffect(() => {
    if (location.pathname.includes('/arrangement')) {
      setActiveTab('arrangement');
    } else {
      setActiveTab('plan');
    }
  }, [location.pathname]);

  const handleTabChange = (tab) => {
    if (activeTab === tab) return;

    try {
      setActiveTab(tab);
      if (tab === 'plan') {
        navigate('/diet/plan');
      } else {
        navigate('/diet/arrangement');
      }
    } catch (error) {
      console.error('標籤切換錯誤:', error);
    }
  };

  return (
    <div className={styles.container}>
      {/* 導航選項卡 */}
      <div className={styles.tabHeader}>
        <button
          className={`${styles.tabButton} ${activeTab === 'plan' ? styles.active : ''}`}
          onClick={() => handleTabChange('plan')}
        >
          <span className={styles.tabText}>用戶信息</span>
        </button>
        <button
          className={`${styles.tabButton} ${activeTab === 'arrangement' ? styles.active : ''}`}
          onClick={() => handleTabChange('arrangement')}
        >
          <span className={styles.tabText}>饮食安排</span>
        </button>
      </div>

      {/* 子路由內容 */}
      <div className={styles.tabContent}>
        <Outlet />
      </div>
    </div>
  );
};

export default Diet;