// BodyData.jsx - 用户信息页面
import { useState, useEffect } from 'react';
import { Button, Field, CellGroup } from 'react-vant';
import { useUserStore } from '@/store/userStore';
import { useNavigate } from 'react-router-dom';
import styles from './bodyData.module.css';

const BodyData = () => {
  const { setBodyData, getBodyData, isLogin, loading } = useUserStore();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    age: '',
    height: '',
    weight: '',
    targetWeight: '',
    gender: 'male',
    bodyType: 'pear',
    activityLevel: 'none'
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!loading && !isLogin) {
      navigate('/login', { state: { from: '/body-data' } });
      return;
    }
  }, [isLogin, loading, navigate]);

  useEffect(() => {
    if (isLogin) {
      const existingData = getBodyData();
      if (existingData && Object.keys(existingData).length > 0) {
        const hasValidData = existingData.height && existingData.weight && existingData.gender && existingData.activityLevel;
        if (hasValidData) {
          setFormData(existingData);
        }
      }
    }
  }, [isLogin, getBodyData]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.age || formData.age < 1 || formData.age > 120) {
      newErrors.age = '請輸入有效年齡';
    }

    if (!formData.height || formData.height < 100 || formData.height > 250) {
      newErrors.height = '請輸入有效身高';
    }

    if (!formData.weight || formData.weight < 20 || formData.weight > 300) {
      newErrors.weight = '請輸入有效體重';
    }

    if (!formData.targetWeight || formData.targetWeight < 20 || formData.targetWeight > 300) {
      newErrors.targetWeight = '請輸入有效目標體重';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (validateForm()) {
      setBodyData(formData);
      navigate('/diet/arrangement');
    }
  };

  return (
    <div className={styles.container}>
      {/* 顶部标题 - 在数据输入区域外面 */}
      <div className={styles.pageTitle}>
        <h2 style={{ color: '#000000', textShadow: '0 2px 8px rgba(255, 255, 255, 0.8)' }}>
          用户信息输入
        </h2>
      </div>

      <div className={styles.formContainer}>
        {/* 数据输入区域 - 带圆角和滚动 */}
        <div className={styles.inputSection}>
          <CellGroup className={styles.inputGroup}>
            <Field
              label="年齡"
              placeholder="請輸入年齡"
              type="number"
              value={formData.age}
              onChange={(value) => handleInputChange('age', value)}
              error={errors.age}
            />

            <Field
              label="身高"
              placeholder="請輸入身高 (cm)"
              type="number"
              value={formData.height}
              onChange={(value) => handleInputChange('height', value)}
              error={errors.height}
            />

            <Field
              label="體重"
              placeholder="請輸入體重 (kg)"
              type="number"
              value={formData.weight}
              onChange={(value) => handleInputChange('weight', value)}
              error={errors.weight}
            />

            <Field
              label="目標體重"
              placeholder="請輸入目標體重 (kg)"
              type="number"
              value={formData.targetWeight}
              onChange={(value) => handleInputChange('targetWeight', value)}
              error={errors.targetWeight}
            />

            <div className={styles.radioGroup}>
              <label>性別</label>
              <div className={styles.radioOptions}>
                <div
                  className={`${styles.customRadio} ${formData.gender === 'male' ? styles.checked : ''}`}
                  onClick={() => handleInputChange('gender', 'male')}
                >
                  <div className={styles.radioIcon}></div>
                  <span className={styles.radioLabel}>男性</span>
                </div>
                <div
                  className={`${styles.customRadio} ${formData.gender === 'female' ? styles.checked : ''}`}
                  onClick={() => handleInputChange('gender', 'female')}
                >
                  <div className={styles.radioIcon}></div>
                  <span className={styles.radioLabel}>女性</span>
                </div>
              </div>
            </div>

            <div className={styles.radioGroup}>
              <label>體型</label>
              <div className={styles.radioOptions}>
                <div
                  className={`${styles.customRadio} ${formData.bodyType === 'pear' ? styles.checked : ''}`}
                  onClick={() => handleInputChange('bodyType', 'pear')}
                >
                  <div className={styles.radioIcon}></div>
                  <span className={styles.radioLabel}>梨型</span>
                </div>
                <div
                  className={`${styles.customRadio} ${formData.bodyType === 'apple' ? styles.checked : ''}`}
                  onClick={() => handleInputChange('bodyType', 'apple')}
                >
                  <div className={styles.radioIcon}></div>
                  <span className={styles.radioLabel}>蘋果型</span>
                </div>
                <div
                  className={`${styles.customRadio} ${formData.bodyType === 'balanced' ? styles.checked : ''}`}
                  onClick={() => handleInputChange('bodyType', 'balanced')}
                >
                  <div className={styles.radioIcon}></div>
                  <span className={styles.radioLabel}>勻稱型</span>
                </div>
              </div>
            </div>

            <div className={styles.radioGroup}>
              <label>運動</label>
              <div className={styles.radioOptions}>
                <div
                  className={`${styles.customRadio} ${formData.activityLevel === 'none' ? styles.checked : ''}`}
                  onClick={() => handleInputChange('activityLevel', 'none')}
                >
                  <div className={styles.radioIcon}></div>
                  <span className={styles.radioLabel}>不運動</span>
                </div>
                <div
                  className={`${styles.customRadio} ${formData.activityLevel === 'aerobic' ? styles.checked : ''}`}
                  onClick={() => handleInputChange('activityLevel', 'aerobic')}
                >
                  <div className={styles.radioIcon}></div>
                  <span className={styles.radioLabel}>有氧運動</span>
                </div>
                <div
                  className={`${styles.customRadio} ${formData.activityLevel === 'anaerobic' ? styles.checked : ''}`}
                  onClick={() => handleInputChange('activityLevel', 'anaerobic')}
                >
                  <div className={styles.radioIcon}></div>
                  <span className={styles.radioLabel}>無氧運動</span>
                </div>
                <div
                  className={`${styles.customRadio} ${formData.activityLevel === 'both' ? styles.checked : ''}`}
                  onClick={() => handleInputChange('activityLevel', 'both')}
                >
                  <div className={styles.radioIcon}></div>
                  <span className={styles.radioLabel}>無氧和有氧運動</span>
                </div>
              </div>
            </div>
          </CellGroup>
        </div>

        <div className={styles.submitButton}>
          <Button
            type="primary"
            size="large"
            block
            onClick={handleSubmit}
            onMouseDown={handleSubmit}
          >
            保存数据
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BodyData;