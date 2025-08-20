import { forwardRef } from 'react'
import { useNavigate } from 'react-router-dom'
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
    addCartNum,
  } = props;
  const navigate = useNavigate();

  const handleClick = () => {
    try {
      navigate(`/detail/${id}`);
    } catch (error) {
      console.error('商品详情导航错误:', error);
    }
  };

  const handleAddCart = (e) => {
    e.stopPropagation();
    console.log('handleAddCart called');
    addCartNum && addCartNum();
  }
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
        <div className={styles.buttonContainer}>
          <button className={styles.Btn} onClick={handleBuyNow}>立即购买</button>
          <button className={styles.Btn} onClick={handleAddCart}>加入购物车</button>
        </div>
      </div>
    </div>
  );
});

export default Card;