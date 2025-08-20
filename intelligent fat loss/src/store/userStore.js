import { create } from 'zustand'
import { persist } from 'zustand/middleware' // 添加持久化中间件
import { doLogin } from '../api/user'


export const useUserStore = create(
  persist( // 添加持久化
    (set, get) => ({
      bodyData: {},
      foodItems: [], // 添加食物數據存儲
      isLogin: false,
      loading: true, // 初始化時設為 true，等待檢查完成

      login: async (data) => {
        set({ loading: true });
        console.log('userStore login called with:', data); // 調試日誌
        try {
          const res = await doLogin(data);
          console.log('doLogin response:', res); // 調試日誌
          if (res.code === 0) {
            // 登錄成功，只設置token和登錄狀態
            localStorage.setItem('token', res.token);
            set({
              isLogin: true,
              loading: false
              // bodyData保持原狀，由BodyData頁面設置
            });
            return true;
          } else {
            set({ loading: false });
            throw new Error(res.message || '登錄失敗');
          }
        } catch (error) {
          set({ loading: false });
          throw error;
        }
      },

      loginOut: () => {
        set({ isLogin: false, bodyData: {} });
        localStorage.removeItem('token');
      },

      setBodyData: (data) => {
        // 從BodyData頁面設置身體數據
        console.log('設置身體數據:', data);
        set({ bodyData: data });
      },

      // 從BodyData頁面獲取身體數據
      getBodyData: () => {
        const state = useUserStore.getState();
        return state.bodyData;
      },

      // 檢查是否有身體數據
      hasBodyData: () => {
        const state = useUserStore.getState();
        return state.bodyData && Object.keys(state.bodyData).length > 0;
      },

      // 初始化检查token和bodyData
      initialize: () => {
        const token = localStorage.getItem('token');
        if (token) {
          set({ isLogin: true, loading: false });
        } else {
          set({ isLogin: false, loading: false });
        }
      },

      // 清除身體數據（用於重新輸入）
      clearBodyData: () => {
        set({ bodyData: {} });
      },

      // 添加食物項目
      addFoodItem: (foodItem) => {
        const state = get();
        set({ foodItems: [...state.foodItems, foodItem] });
      },

      // 移除食物項目
      removeFoodItem: (id) => {
        const state = get();
        set({ foodItems: state.foodItems.filter(item => item.id !== id) });
      },

      // 獲取所有食物項目
      getFoodItems: () => {
        const state = get();
        return state.foodItems;
      },

      // 清除所有食物數據
      clearFoodItems: () => {
        set({ foodItems: [] });
      },

      // 登出時清除所有數據
      loginOut: () => {
        set({ isLogin: false, bodyData: {}, foodItems: [] });
        localStorage.removeItem('token');
      }
    }),
    {
      name: 'user-storage', // 存储名称
    }
  )
);

// 应用启动时初始化
useUserStore.getState().initialize();