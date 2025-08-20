import {
  memo,
  useRef,
  useState,
  useEffect,
  useMemo
} from 'react';
import {
  ArrowLeft,
  Close,
  Search
} from '@react-vant/icons'
import {
  debounce
} from '@/utils'
import styles from './box.module.css'

const SearchBox = (props) => {
  const [query, setQuery] = useState("");
  const { handleQuery } = props
  // 非受控组件
  const queryRef = useRef(null);
  // 保存到 localStorage 的函数 - 現在由 store 處理

  // 输入变化处理
  const handleChange = (e) => {
    setQuery(e.target.value);
  };

  // 回车键处理
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      queryRef.current.blur(); //使输入框失去焦点
    }
  };

  const clearQuery = () => {
    setQuery("");
    queryRef.current.value = "";
    queryRef.current.focus();
  }

  const handleSearch = () => {
    if (query.trim()) {
      handleQuery(query);
    }
  }
  //1,防抖 
  //2.useMemo 缓存闭包结果 否则会反复执行
  const handleQueryDebounce = useMemo(() => {
    return debounce(handleQuery, 500);
  }, [handleQuery]);

  const displayStyle = query ? { display: 'block' } : { display: 'none' };
  useEffect(() => {
    // console.log(query,'///');
    handleQueryDebounce(query);
  }, [query])

  return (
    <div className={styles.wrapper}>
      <ArrowLeft
        className={styles.backIcon}
        onClick={() => history.go(-1)}
        style={{ color: '#333', fontSize: '48px' }}
      />
      <input
        type="text"
        value={query}
        className={styles.ipt}
        placeholder='Search'
        ref={queryRef}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />
      {/* 搜索按钮 */}
      <Search
        className={styles.searchIcon}
        onClick={handleSearch}
        style={{
          ...displayStyle,
          color: '#333',
          fontSize: '46px'
        }}
      />
      {/* 清空按钮 */}
      <Close
        className={styles.clearIcon}
        onClick={clearQuery}
        style={{
          ...displayStyle,
          color: '#333',
          fontSize: '44px'
        }}
      />
    </div>
  )
}

export default memo(SearchBox)