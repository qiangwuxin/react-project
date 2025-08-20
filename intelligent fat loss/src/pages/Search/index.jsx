import {
  useState,
  useEffect,
  memo
} from 'react'
import SearchBox from '@/components/SearchBox'
import { useSearchStore } from '@/store/useSearch';
import styles from './search.module.css'
import useTitle from '@/hooks/useTitle';

const Search = () => {
  const [query, setQuery] = useState("");
  const {
    suggestList,
    suggestHistory,
    setSuggestList,
    hotList,
    setHotList
  } = useSearchStore();

  useTitle('搜索');

  useEffect(() => {
    setHotList();
  }, [])
  //单项数据流
  //反复生成useCallback
  const handleQuery = (query) => {
    //api请求
    // console.log('debounce后',query);
    setQuery(query);
    if (!query) {
      return;
    }
    setSuggestList(query);
  }
  const suggestListStyle = {
    display: query !== "" ? 'block' : 'none'
  }

  const handleHistoryClick = (historyItem) => {
    setQuery(historyItem);
    setSuggestList(historyItem);
  };

  const clearHistory = () => {
    localStorage.removeItem('suggestHistory');
    // 重新加載頁面來更新 suggestHistory
    window.location.reload();
  };
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <SearchBox handleQuery={handleQuery} />

        {/* 搜索历史 */}
        {suggestHistory.length > 0 && query === "" && (
          <div className={styles.history}>
            <div className={styles.historyHeader}>
              <h3>搜索历史</h3>
              <button onClick={clearHistory} className={styles.clearHistory}>
                🗑️
              </button>
            </div>
            <div className={styles.historyList}>
              {suggestHistory.map((item, index) => (
                <div
                  key={index}
                  className={styles.historyItem}
                  onClick={() => handleHistoryClick(item)}
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 热门推荐 */}
        {query === "" && (
          <div className={styles.hot}>
            <h3>你可能感兴趣</h3>
            <div className={styles.hotList}>
              {hotList.map((item) => (
                <div
                  key={item.id}
                  className={styles.hotItem}
                  onClick={() => handleHistoryClick(item.city)}
                >
                  {item.city}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className={styles.list} style={suggestListStyle}>
          {
            suggestList.map(item => (
              <div key={item} className={styles.item}>
                {item}
              </div>
            ))
          }
        </div>
      </div>
    </div>
  )
}
export default Search