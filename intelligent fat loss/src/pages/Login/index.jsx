import { useState, useRef, useEffect } from 'react';
import { useUserStore } from '@/store/userStore';
import { useNavigate, useLocation } from 'react-router-dom'; // 添加了useLocation
import styles from './login.module.css';
import { 
  Field, 
  Radio, 
  RadioGroup, 
  Button, 
  Form, 
  CellGroup,
  Toast as VantToast
} from 'react-vant';
import useTitle from '@/hooks/useTitle';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation(); // 添加useLocation钩子
  const [form] = Form.useForm();
  const [error, setError] = useState('');
  const { login } = useUserStore();
  const isMountedRef = useRef(true);
  
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
    useTitle('用户登录');
  }, []);
  
  const handleLogin = async () => {
    try {
      // 验证表单
      await form.validateFields();
      
      // 获取表单值
      const values = form.getFieldsValue();
      const { username, password, age, height, weight, targetweight, bodyType, sportType } = values;
      
      // 调用登录函数
      await login({
        username,
        password,
        bodyData: {
          age,
          height,
          weight,
          targetweight,
          bodyType,
          sportType
        }
      });
      
      if (isMountedRef.current) {
        // 修复：使用location.state获取重定向路径
        const from = location.state?.from || '/diet';
        navigate(from, { replace: true });
      }
    } catch (err) {
      if (isMountedRef.current) {
        if (err.errorFields) {
          VantToast.fail('请填写完整信息');
        } else if (err.message) {
          setError('登录失败: ' + err.message);
          console.error('登录错误:', err);
        } else {
          setError('登录失败: 用户名或密码错误');
          console.error('登录错误:', err);
        }
      }
    }
  };

  return (
    <>
    <div className="login-container">
      <div className="login-left">
        <div className="logo">
          <h1>健康管理</h1>
        </div>
        <div className="slogan">
          个性化饮食与运动计划，助您达成健康目标
        </div>
        <div className="features">
          <div className="feature">
            <div className="icon">🍎</div>
            <h3>智能饮食规划</h3>
            <p>根据您的身体数据定制专属饮食方案</p>
          </div>
          <div className="feature">
            <div className="icon">💪</div>
            <h3>科学运动指导</h3>
            <p>个性化健身计划，专业动作指导</p>
          </div>
          <div className="feature">
            <div className="icon">📊</div>
            <h3>数据追踪分析</h3>
            <p>记录每日摄入，可视化进度报告</p>
          </div>
          <div className="feature">
            <div className="icon">🎯</div>
            <h3>目标达成系统</h3>
            <p>设定目标，实时追踪，成就健康生活</p>
          </div>
        </div>
      </div>
      
      <div className="login-right">
        <div className="login-form">
          <h2>用户登录</h2>
          <p className="subtitle">请输入您的个人信息</p>
          
          {error && <div className="error-message">{error}</div>}
          
          <Form
            form={form}
            onFinish={handleLogin}
            footer={
              <Button 
                round 
                nativeType="submit" 
                type="primary" 
                block
                className="login-btn"
              >
                登录
              </Button>
            }
          >
            <CellGroup inset>
              <Form.Item
                name="username"
                label="用户名"
                rules={[
                  { required: true, message: '请输入用户名' },
                  { min: 3, message: '用户名至少3位' },
                  { max: 20, message: '用户名最多20位' }
                ]}
              >
                <Field 
                  placeholder="请输入用户名"
                  leftIcon="user-o"
                />
              </Form.Item>
              
              <Form.Item
                name="password"
                label="密码"
                rules={[
                  { required: true, message: '请输入密码' },
                  { min: 6, message: '密码至少6位' },
    
                ]}
              >
                <Field 
                  type="password"
                  placeholder="请输入密码"
                  leftIcon="lock-o"
                />
              </Form.Item>
              
              <Form.Item
                name="age"
                label="年龄"
                rules={[
                  { required: true, message: '请输入年龄' },
                  { pattern: /^(?:[1-9][0-9]?|1[01][0-9]|120)$/, message: '年龄应在1-120之间' }
                ]}
              >
                <Field 
                  type="number"
                  placeholder="请输入年龄"
                  leftIcon="flower-o"
                />
              </Form.Item>
              
              <Form.Item
                name="height"
                label="身高(cm)"
                rules={[
                  { required: true, message: '请输入身高' },
                  { pattern: /^(5[0-9]|1[0-9]{2}|2[0-4][0-9]|250)$/, message: '身高应在50-250之间' }
                ]}
              >
                <Field 
                  type="number"
                  placeholder="请输入身高"
                  leftIcon="column"
                />
              </Form.Item>
              
              <Form.Item
                name="weight"
                label="体重(kg)"
                rules={[
                  { required: true, message: '请输入体重' },
                  { pattern: /^([1-9][0-9]{0,2})(\.[0-9])?$/, message: '请输入有效体重' }
                ]}
              >
                <Field 
                  type="number"
                  placeholder="请输入体重"
                  leftIcon="balance-o"
                />
              </Form.Item>
              
              <Form.Item
                name="targetweight"
                label="目标体重(kg)"
                rules={[
                  { required: true, message: '请输入目标体重' },
                  { pattern: /^([1-9][0-9]{0,2})(\.[0-9])?$/, message: '请输入有效体重' }
                ]}
              >
                <Field 
                  type="number"
                  placeholder="请输入目标体重"
                  leftIcon="aim"
                />
              </Form.Item>
              
              <Form.Item
                name="bodyType"
                label="体型选择"
                rules={[{ required: true, message: '请选择体型' }]}
              >
                <RadioGroup direction="horizontal">
                  <Radio name="梨形">梨形</Radio>
                  <Radio name="苹果型">苹果型</Radio>
                  <Radio name="匀称型">匀称型</Radio>
                </RadioGroup>
              </Form.Item>
              
              <Form.Item
                name="sportType"
                label="运动方式"
                rules={[{ required: true, message: '请选择运动方式' }]}
              >
                <RadioGroup direction="horizontal">
                  <Radio name="久坐不动">久坐不动</Radio>
                  <Radio name="有氧运动">有氧运动</Radio>
                  <Radio name="无氧运动">无氧运动</Radio>
                  <Radio name="有氧和无氧结合">有氧和无氧结合</Radio>
                </RadioGroup>
              </Form.Item>
            </CellGroup>
          </Form>
          
          <div className="additional-options">
            <p className="register-link">
              没有账号？<a onClick={() => navigate('/register')}>立即注册</a>
            </p>
            <p className="forgot-password">
              <a onClick={() => navigate('/reset-password')}>忘记密码？</a>
            </p>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default Login;