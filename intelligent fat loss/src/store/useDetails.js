import { create } from 'zustand';
import { getDetail } from '@/api/details';

const placeholderImage = {
  url: 'https://img95.699pic.com/photo/60014/0156.jpg_wh860.jpg',
  alt: 'placeholder'
};

const defaultDetail = {
  title: '商品詳情',
  desc: '正在加載商品信息...',
  images: [placeholderImage],
  price: '--'
};

const useDetailStore = create((set) => ({
  detail: { ...defaultDetail },
  loading: false,
  currentId: null, // 添加当前加载的ID

  setDetail: async (id, signal) => {
    if (!id) {
      set({ detail: { ...defaultDetail }, loading: false });
      return;
    }

    // 设置当前加载的ID和loading状态
    set({ loading: true, currentId: id });
    
    try {
      const res = await getDetail(id, { signal });
      const data = res.data?.data || {};

      // 检查当前请求是否已被新请求覆盖
      if (signal?.aborted) {
        console.log('请求已被取消');
        return;
      }

      const processedData = {
        title: data.title || '商品詳情',
        desc: data.desc || '商品描述',
        images: (data.images && Array.isArray(data.images) && data.images.length > 0)
          ? data.images.map(img => ({
            url: img.url || placeholderImage.url,
            alt: img.alt || '商品圖片'
          }))
          : [placeholderImage],
        price: data.price || '--'
      };

      // 只更新当前请求对应的数据
      set(state => {
        if (state.currentId === id) {
          return {
            loading: false,
            detail: processedData
          };
        }
        return state; // 如果不是最新请求，不更新状态
      });

    } catch (error) {
      if (error.name === 'AbortError') return;
      
      console.error('獲取詳情失敗:', error);
      set(state => {
        if (state.currentId === id) {
          return {
            loading: false,
            detail: {
              ...defaultDetail,
              title: '加載失敗'
            }
          };
        }
        return state;
      });
    }
  },

  clearDetail: () => {
    set({
      detail: { ...defaultDetail },
      loading: false,
      currentId: null
    });
  }
}));

export default useDetailStore;