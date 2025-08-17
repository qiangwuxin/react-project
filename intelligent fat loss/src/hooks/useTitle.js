import { useEffect } from 'react'

function useTitle(title) {
  useEffect(() => {
    // 使用 setTimeout 確保在 DOM 更新完成後再設置標題
    const timer = setTimeout(() => {
      document.title = title
    }, 0)

    return () => {
      clearTimeout(timer)
    }
  }, [title])
}

export default useTitle;