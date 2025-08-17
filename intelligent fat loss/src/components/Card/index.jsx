import { forwardRef } from 'react'
import styles from './card.module.css'

const Card = forwardRef((props, ref) => {
  const {
    id,
    height,
    url,
    title,
    price,
    desc,
    onBuyNow,
  } = props;

  const handleClick = () => {
    window.location.href = `/detail/${id}`;
  };

  const handleBuyNow = (e) => {
    e.stopPropagation(); // 阻止事件冒泡，避免觸發卡片的點擊事件
    onBuyNow && onBuyNow({
      id,
      title,
      price,
      url,
      desc
    });
  };

  return (
    <div
      ref={ref}
      className={styles.card}
      style={{ height }}
      onClick={handleClick}
    >
      <div className={styles['img-container']}>
        <img
          src={url}
          alt={title}
          className={styles.img}
          style={{ opacity: 1 }}
        />
      </div>
      <div className={styles.content}>
        <div className={styles.title}>{title}</div>
        <div className={styles.price}>¥{price}</div>
        <div className={styles.desc}>{desc}</div>
        <button className={styles.Btn} onClick={handleBuyNow}>立即购买</button>
      </div>
    </div>
  );
});

export default Card;