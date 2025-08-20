// DietArrangement.jsx - 饮食安排页面
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  ActionSheet,
  Button,
  Field,
  CellGroup,
  Card,
  Image,
  Swiper,
  Skeleton,
  Toast
} from 'react-vant';
import { getCaloriesFromText, analyzeFoodImage, getDietPlan } from '@/llm';
import { useUserStore } from '@/store/userStore';
import styles from './dietArrangement.module.css';

const DietArrangement = () => {
  const { bodyData, isLogin, foodItems, addFoodItem, removeFoodItem } = useUserStore();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showImageDialog, setShowImageDialog] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [dietPlan, setDietPlan] = useState(null);
  const [loadingPlan, setLoadingPlan] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [dietLoading, setDietLoading] = useState(false);
  const [selectedMealType, setSelectedMealType] = useState('');

  // 食物分類 - 更新圖標以匹配圖片
  const foodCategories = [
    { name: '主食', icon: '🍚', english: 'Staple Food' },
    { name: '肉类', icon: '🥩', english: 'Meat' },
    { name: '牛奶', icon: '🥛', english: 'Dairy' },
    { name: '蔬果', icon: '🥬', english: 'Fruits & Veg' },
    { name: '健身餐', icon: '🥤', english: 'Fitness Food' },
    { name: '其他', icon: '🍰', english: 'Other Food' }
  ];

  useEffect(() => {
    if (isLogin) {
      if (bodyData && Object.keys(bodyData).length > 0) {
        const hasValidData = bodyData.height && bodyData.weight && bodyData.gender && bodyData.activityLevel;
        if (hasValidData) {
          fetchDietPlan();
        } else {
          navigate('/body-data');
        }
      } else {
        navigate('/body-data');
      }
    }
  }, [bodyData, isLogin, navigate]);

  const fetchDietPlan = async () => {
    setLoadingPlan(true);
    try {
      const plan = await getDietPlan(bodyData);
      setDietPlan(plan);
    } catch (error) {
      console.error('获取饮食计划失败:', error);
      if (!dietPlan) {
        setDietPlan({
          'max-calorie': 1960,
          'breakfast-calorie': 340,
          'lunch-calorie': 540,
          'dinner-calorie': 400,
          'snack-calorie': 67
        });
      }
    } finally {
      setLoadingPlan(false);
    }
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const getTargetCalories = () => {
    if (!dietPlan) return 1960;
    return dietPlan['max-calorie'] || 1960;
  };

  const targetCalories = getTargetCalories();

  const getMealCaloriesFromPlan = (mealType) => {
    if (!dietPlan) {
      const defaults = {
        breakfast: { range: '290~390', max: 390 },
        lunch: { range: '460~620', max: 620 },
        dinner: { range: '340~460', max: 460 },
        snack: { range: '<67', max: 67 }
      };
      return defaults[mealType] || { range: '200~300', max: 300 };
    }

    const mealMapping = {
      breakfast: 'breakfast-calorie',
      lunch: 'lunch-calorie',
      dinner: 'dinner-calorie',
      snack: 'snack-calorie'
    };

    const calorieKey = mealMapping[mealType];
    if (dietPlan[calorieKey]) {
      const calories = dietPlan[calorieKey];
      return {
        range: `${calories - 50}~${calories + 50}`,
        max: calories + 50
      };
    }

    const defaults = {
      breakfast: { range: '290~390', max: 390 },
      lunch: { range: '460~620', max: 620 },
      dinner: { range: '340~460', max: 460 },
      snack: { range: '<67', max: 67 }
    };
    return defaults[mealType] || { range: '200~300', max: 300 };
  };

  const mealTypes = [
    {
      type: 'breakfast',
      name: '早餐',
      icon: '🌅',
      color: '#4A90E2'
    },
    {
      type: 'lunch',
      name: '午餐',
      icon: '☀️',
      color: '#4A90E2'
    },
    {
      type: 'dinner',
      name: '晚餐',
      icon: '🌙',
      color: '#4A90E2'
    },
    {
      type: 'snack',
      name: '加餐',
      icon: '🍎',
      color: '#4A90E2'
    }
  ];

  const handleAddFood = (mealType) => {
    setSelectedMealType(mealType);
    setShowAddDialog(true);
  };

  const handleTextSubmit = async () => {
    if (!textInput.trim()) {
      Toast('请输入食物名称');
      return;
    }

    setAnalyzing(true);
    try {
      const result = await getCaloriesFromText(textInput);
      const newItem = {
        id: Date.now(),
        name: result.food_name || textInput,
        calories: result.calories || 0,
        imageUrl: result.imageUrl || null,
        type: 'text',
        mealType: selectedMealType
      };
      addFoodItem(newItem);
      setTextInput('');
      setShowAddDialog(false);
      setSelectedMealType('');
    } catch (error) {
      console.error('分析食物失败:', error);
      Toast('分析失败，请重试');
    } finally {
      setAnalyzing(false);
      setShowAddDialog(false);
    }
  };

  const handleImageSubmit = async (file) => {
    setAnalyzing(true);
    try {
      const result = await analyzeFoodImage(file);
      const newItem = {
        id: Date.now(),
        name: result.food_name || '未知食物',
        calories: result.calories || 0,
        type: 'image',
        imageUrl: URL.createObjectURL(file),
        mealType: selectedMealType
      };
      addFoodItem(newItem);
      setShowImageDialog(false);
      setSelectedMealType('');
    } catch (error) {
      console.error('分析图片失败:', error);
      Toast('分析失败，请重试');
    } finally {
      setAnalyzing(false);
    }
  };



  const getFoodItemsByMeal = (mealType) => {
    return foodItems.filter(item => item.mealType === mealType);
  };

  const getMealTotalCalories = (mealType) => {
    return getFoodItemsByMeal(mealType).reduce((sum, item) => sum + item.calories, 0);
  };

  const totalCalories = foodItems.reduce((sum, item) => sum + item.calories, 0);
  const remainingCalories = targetCalories - totalCalories;
  const progressPercent = Math.min((totalCalories / targetCalories) * 100, 100);

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}.${month}.${day}`;
  };

  const handleModalBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      setShowAddDialog(false);
      setShowImageDialog(false);
      setSelectedMealType('');
    }
  };

  const handleSearchClick = () => {
    navigate('/search');
  };

  const handleSearchIconClick = (e) => {
    e.stopPropagation();
    navigate('/search');
  };

  return (
    <div className={styles.container}>
      {/* 搜索和分類區域 */}
      <div className={styles.searchSection}>
        <div className={styles.searchBar} onClick={handleSearchClick}>
          <div className={styles.searchIcon} onClick={handleSearchIconClick}>🔍</div>
          <input
            type="text"
            placeholder="搜索食物"
            className={styles.searchInput}
            readOnly
          />
        </div>

        <div className={styles.categoriesGrid}>
          {foodCategories.map((category, index) => (
            <div key={index} className={styles.categoryItem}>
              <div className={styles.categoryIcon}>{category.icon}</div>
              <div className={styles.categoryName}>{category.name}</div>
              <div className={styles.categoryEnglish}>{category.english}</div>
            </div>
          ))}
        </div>


      </div>

      {/* 飲食記錄分析 */}
      <div className={styles.dietAnalysisSection}>
        <h2 className={styles.analysisTitle}>
          <span>饮食记录分析</span>
          <span>{formatDate(selectedDate)}</span>
        </h2>

        <div className={styles.mealCards}>
          {mealTypes.map((meal) => {
            const mealCalories = getMealCaloriesFromPlan(meal.type);
            const mealFoods = getFoodItemsByMeal(meal.type);
            const mealTotalCalories = getMealTotalCalories(meal.type);
            const isOverLimit = mealTotalCalories > mealCalories.max;

            return (
              <div key={meal.type} className={styles.mealCard}>
                <div className={styles.mealCardHeader}>
                  <div className={styles.mealCardIcon}>
                    {meal.icon}
                  </div>
                  <div className={styles.mealCardInfo}>
                    <div className={styles.mealCardName}>{meal.name}</div>
                    <div className={styles.mealCardCalories}>
                      建議攝入{mealCalories.range}千卡
                    </div>
                  </div>
                  <button
                    className={styles.addButton}
                    onClick={() => handleAddFood(meal.type)}
                  >
                    +
                  </button>
                </div>

                {/* 該餐點的食物列表 */}
                {mealFoods.length > 0 && (
                  <div className={styles.mealFoodsList}>
                    {mealFoods.map(food => (
                      <div key={food.id} className={styles.foodListItem}>
                        {/* 食物圖片區域 */}
                        <div className={styles.foodImageContainer}>
                          {food.imageUrl && (
                            <img
                              src={food.imageUrl}
                              alt={food.name}
                              className={styles.foodImage}
                              onError={(e) => {
                                e.target.style.display = 'none';
                              }}
                            />
                          )}
                        </div>

                        {/* 食物信息區域 */}
                        <div className={styles.foodListInfo}>
                          <span className={styles.foodListName}>{food.name}</span>
                          <span className={styles.foodListCalories}>{food.calories} kcal</span>
                        </div>

                        {/* 刪除按鈕 */}
                        <button
                          className={styles.deleteButton}
                          onClick={() => removeFoodItem(food.id)}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                    <div className={styles.mealTotal}>
                      小计: {mealTotalCalories} kcal
                      {isOverLimit && (
                        <span className={styles.overLimit}> (超出建议范围)</span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 文字輸入模態框 */}
      {showAddDialog && (
        <div className={styles.modalOverlay} onClick={handleModalBackdropClick}>
          <div className={styles.modalContent}>
            <h3 className={styles.modalTitle}>
              添加{selectedMealType === 'breakfast' ? '早餐' :
                selectedMealType === 'lunch' ? '午餐' :
                  selectedMealType === 'dinner' ? '晚餐' : '加餐'}食物
            </h3>
            <input
              type="text"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="请输入食物名称,如:苹果一个"
              className={styles.modalInput}
              disabled={analyzing}
            />
            <div className={styles.modalButtons}>
              <button
                className={styles.uploadButton}
                onClick={() => {
                  setShowImageDialog(true);
                  setShowAddDialog(false);
                }}
                disabled={analyzing}
              >
                上传图片
              </button>
              <button
                className={styles.confirmButton}
                onClick={handleTextSubmit}
                disabled={analyzing}
              >
                {analyzing ? '分析中...' : '确定'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 圖片上傳模態框 */}
      {showImageDialog && (
        <div className={styles.modalOverlay} onClick={handleModalBackdropClick}>
          <div className={styles.modalContent}>
            <h3 className={styles.modalTitle}>
              上传{selectedMealType === 'breakfast' ? '早餐' :
                selectedMealType === 'lunch' ? '午餐' :
                  selectedMealType === 'dinner' ? '晚餐' : '加餐'}食物图片
            </h3>
            <div className={styles.imageUpload}>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    handleImageSubmit(file);
                  }
                }}
                disabled={analyzing}
                className={styles.fileInput}
              />
              {analyzing && (
                <div className={styles.analyzing}>
                  <p>正在分析图片...</p>
                </div>
              )}
            </div>
            <div className={styles.modalButtons}>
              <button
                className={styles.cancelButton}
                onClick={() => {
                  setShowImageDialog(false);
                  setSelectedMealType('');
                }}
                disabled={analyzing}
              >
                取消
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DietArrangement;