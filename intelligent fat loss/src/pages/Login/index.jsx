import { useState, useRef, useEffect } from 'react';
import { useUserStore } from '@/store/userStore';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './login.module.css';
import {
  Field,
  Button,
  CellGroup,
  Toast as VantToast
} from 'react-vant';
import useTitle from '@/hooks/useTitle';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useUserStore();
  const isMountedRef = useRef(true);

  useTitle('用戶登录');
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const handleLogin = async () => {
    try {
      console.log('handleLogin called'); // 調試日誌
      console.log('State values - username:', username, 'password:', password); // 調試日誌

      // 驗證表單
      if (!username || !password) {
        setError('請輸入用戶名和密码');
        return;
      }

      // 調用登錄函數
      await login({
        username,
        password
      });

      if (isMountedRef.current) {
        // 修復：使用location.state獲取重定向路徑
        const from = location.state?.from || '/diet';
        // 直接導航
        try {
          navigate(from, { replace: true });
        } catch (error) {
          console.error('登录后导航错误:', error);
          // 如果導航失敗，使用默認路徑
          navigate('/diet', { replace: true });
        }
      }
    } catch (err) {
      if (isMountedRef.current) {
        if (err.errorFields) {
          VantToast.fail('请填写完整信息');
        } else if (err.message) {
          setError('登录失败: ' + err.message);
          console.error('login error:', err);
        } else {
          setError('登录失败: 用户名或密码错误');
          console.error('登录错误:', err);
        }
      }
    }
  };

  const handleRegister = () => {
    // 跳轉到註冊頁面或顯示註冊提示
    VantToast.info('注册功能开发中...');
  };

  return (
    <div className={styles.container}>
      {/* 背景圖片 */}
      <div className={styles.backgroundImage}>
        <img
          src="https://img95.699pic.com/photo/60022/4436.jpg_wh860.jpg"
          alt="背景"
        />
      </div>

      {/* 返回按鈕 */}
      <div className={styles.backButton}>
        <button onClick={() => navigate(-1)}>
          ←
        </button>
      </div>

      {/* 登錄表單 */}
      <div className={styles.loginForm}>
        <div className={styles.formHeader}>
          <h2>欢迎回来</h2>
          <p>请登录您的账户</p>
        </div>

        <div className={styles.form}>
          <CellGroup>
            {/* 用戶名輸入 */}
            <Field
              value={username}
              onChange={setUsername}
              placeholder="用户名或手机号"
              leftIcon="username"
            />

            {/* 密碼輸入 */}
            <Field
              type="password"
              value={password}
              onChange={setPassword}
              placeholder="密码"
              leftIcon="lock"
            />
          </CellGroup>

          {/* 忘記密碼 */}
          <div className={styles.forgotPassword}>
            <a href="#" onClick={(e) => { e.preventDefault(); VantToast.info('忘记密码功能开发中...'); }}>
              忘记密码?
            </a>
          </div>

          {/* 錯誤信息 */}
          {error && (
            <div className={styles.errorMessage}>
              {error}
            </div>
          )}

          {/* 登錄按鈕 */}
          <div className={styles.buttonGroup}>
            <Button
              type="primary"
              size="large"
              block
              onClick={handleLogin}
              className={styles.loginButton}
            >
              登录
            </Button>

            <Button
              size="large"
              block
              onClick={handleRegister}
              className={styles.registerButton}
            >
              注册
            </Button>
          </div>

          {/* 其他登錄方式 */}
          <div className={styles.otherLogin}>
            <div className={styles.divider}>
              <span>其他快捷方式登录</span>
            </div>
            <div className={styles.socialButtons}>
              <button className={styles.socialButton} style={{ borderColor: '#07C160' }}>
                <span>微信</span>
              </button>
              <button className={styles.socialButton} style={{ borderColor: '#1890FF' }}>
                <span>QQ</span>
              </button>
              <button className={styles.socialButton} style={{ borderColor: '#E6162D' }}>
                <span>微博</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;