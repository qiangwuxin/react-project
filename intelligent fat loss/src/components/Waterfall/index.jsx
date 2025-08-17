import styles from './waterfall.module.css'
import { usePagesStore } from '@/store/usePages'
import { useState, useEffect, useRef, useCallback } from 'react'
import Card from '@/components/card'

const Waterfall = ({ onBuyNow }) => {
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
        fetchMore();
      }
    });
    if (node) observerRef.current.observe(node);
  }, [loading, fetchMore]);

  useEffect(() => {
    const newColumns = [[], []];
    const newHeights = [0, 0];

    cards.forEach(card => {
      // 计算缩放后的高度
      const scaledHeight = card.height * 0.7;
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
            ref={index === columns[1].length - 1 ? lastElementRef : null}
          />
        ))}
      </div>
      {loading && (
        <div ref={loadingRef} className={styles.loading}>
          加載中...
        </div>
      )}
    </div>
  )
}

export default Waterfall;