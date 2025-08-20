import styles from './waterfall.module.css'
import { usePagesStore } from '@/store/usePages'
import { useState, useEffect, useRef, useCallback } from 'react'
import Card from '@/components/card'

const Waterfall = ({ onBuyNow, addCartNum }) => {
  const { cards, loading, fetchMore } = usePagesStore();
  const [columns, setColumns] = useState([[], []]);
  const [heights, setHeights] = useState([0, 0]);
  const observerRef = useRef(null);
  const loadingRef = useRef(null);

  // 無限滾動觀察器
  const lastElementRef = useCallback(node => {
    if (loading) return;
    if (observerRef.current) observerRef.current.disconnect();
    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        console.log('触发无限滚动加载');
        fetchMore();
      }
    }, {
      threshold: 0.1,
      rootMargin: '100px'
    });
    if (node) observerRef.current.observe(node);
  }, [loading, fetchMore]);

  // 清理觀察器
  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    const newColumns = [[], []];
    const newHeights = [0, 0];

    cards.forEach(card => {
      // 计算缩放后的高度
      const scaledHeight = card.height * 0.8;
      const cardTotalHeight = scaledHeight + 110 + 16; // 110是文字区域高度，16是间隙

      // 选择高度较小的列
      const targetColumn = newHeights[0] <= newHeights[1] ? 0 : 1;

      newColumns[targetColumn].push(card);
      newHeights[targetColumn] += cardTotalHeight;
    });

    setColumns(newColumns);
    setHeights(newHeights);
  }, [cards]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.column}>
        {columns[0].map((card, index) => (
          <Card
            key={card.id}
            {...card}
            onBuyNow={onBuyNow}
            addCartNum={addCartNum}
            ref={index === columns[0].length - 1 ? lastElementRef : null}
          />
        ))}
      </div>
      <div className={styles.column}>
        {columns[1].map((card, index) => (
          <Card
            key={card.id}
            {...card}
            onBuyNow={onBuyNow}
            addCartNum={addCartNum}
            ref={index === columns[1].length - 1 ? lastElementRef : null}
          />
        ))}
      </div>
      {/* 添加一個額外的觀察元素 */}
      {cards.length > 0 && (
        <div ref={lastElementRef} style={{ height: '1px', margin: '20px 0' }} />
      )}
      {loading && (
        <div ref={loadingRef} className={styles.loading}>
          加載中...
        </div>
      )}
    </div>
  )
}

export default Waterfall;