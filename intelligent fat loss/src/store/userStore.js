import { create } from 'zustand'
import { persist } from 'zustand/middleware' // 添加持久化中间件
import { doLogin } from '../api/user'

export const useUserStore = create(
  persist( // 添加持久化
    (set) => ({
      bodyData: {},
      isLogin: false,
      loading: false, // 添加加载状态
      
      login: async (data) => {
        set({ loading: true });
        try {
          const res = await doLogin(data);
          if (res.code === 0) {
            set({
              isLogin: true,
              bodyData: res.data,
              loading: false
            });
            localStorage.setItem('token', res.token);
            return true;
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
      
      // 初始化检查token
      initialize: () => {
        const token = localStorage.getItem('token');
        if (token) {
          set({ isLogin: true });
        }
      }
    }),
    {
      name: 'user-storage', // 存储名称
    }
  )
);

// 应用启动时初始化
useUserStore.getState().initialize();