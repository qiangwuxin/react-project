import { getHotList } from '@/api/search'
import { getSuggestList } from '@/api/search'
import { create } from 'zustand'

export const useSearchStore = create((set, get) => {
  const suggestHistory = JSON.parse(localStorage.getItem('suggestHistory') || '[]')
  return {
    suggestHistory,
    suggestList: [],
    hotList: [],
    setSuggestList: async (keyword) => {
      const res = await getSuggestList(keyword)
      const data = res.data?.data || []
      set({ suggestList: data })

      // 保存搜索历史
      if (keyword.trim()) {
        const currentHistory = get().suggestHistory;
        if (!currentHistory.includes(keyword)) {
          const newHistory = [keyword, ...currentHistory].slice(0, 10); // 只保留最近10条
          localStorage.setItem('suggestHistory', JSON.stringify(newHistory));
          set({ suggestHistory: newHistory });
        }
      }
    },
    setHotList: async () => {
      const res = await getHotList()
      const data = res.data?.data || []
      set({ hotList: data })
    }
  }
})