import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState, useRef, useCallback, memo } from 'react'
import { Skeleton, Image, Swiper } from 'react-vant'
import { ArrowLeft, CartO, ShopO, Cart, Logistics, LikeO, Description, ServiceO, StarO } from '@react-vant/icons'
import useDetailStore from '@/store/useDetails'
import useTitle from '@/hooks/useTitle'
import styles from './detail.module.css'

const BottomBar = memo(() => {
  return (
    <div className={styles.bottomBar}>
      <div className={styles.left}>
        <div className={styles.iconBlock}>
          <ShopO />
          <span>店铺</span>
        </div>
        <div className={styles.iconBlock}>
          <ServiceO />
          <span>客服</span>
        </div>
        <div className={styles.iconBlock}>
          <StarO />
          <span>收藏</span>
        </div>
      </div>
      <div className={styles.right}>
        <div className={styles.cartBtn}>加入购物车</div>
        <div className={styles.buyBtn}>立即购买</div>
      </div>
    </div>
  )
})

const Detail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { detail, loading, setDetail, clearDetail } = useDetailStore();
  const [mounted, setMounted] = useState(false);
  const abortControllerRef = useRef(null);

  useTitle(detail.title || "商品详情");

  const handleBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);



  useEffect(() => {
    setMounted(true);

    // 創建 AbortController 來取消請求
    abortControllerRef.current = new AbortController();

    const fetchData = async () => {
      try {
        await setDetail(id, abortControllerRef.current.signal);
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('獲取詳情失敗:', error);
        }
      }
    };

    fetchData();

    return () => {
      setMounted(false);
      // 取消正在進行的請求
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      clearDetail();
    };
  }, [id, setDetail, clearDetail]);



  // 如果組件未掛載，不渲染任何內容
  if (!mounted) {
    return null;
  }

  // 如果正在加載，顯示骨架屏
  if (loading) {
    return (
      <div className={styles.detailWrapper}>
        <Skeleton />
      </div>
    );
  }

  const hasImages = detail.images && detail.images.length > 0;

  return (
    <div className={styles.detailWrapper}>
      <nav className={styles.nav}>
        <ArrowLeft fontSize={36} onClick={handleBack} />
        <Cart fontSize={36} />
      </nav>

      <div className={styles.container}>
        {hasImages ? (
          <div className={styles.swiperContainer}>
            <Swiper
              key={`swiper-${id}`}
              autoplay={3000}
              loop={true}
              showIndicators={true}
            >
              {detail.images.map((item, index) => (
                <Swiper.Item key={`${id}-${index}`}>
                  <div className={styles.imageWrapper}>
                    <Image
                      src={item.url}
                      alt={item.alt || `img-${index}`}
                      loading="lazy"
                      fit="cover"
                      width="100%"
                      height="100%"
                    />
                  </div>
                </Swiper.Item>
              ))}
            </Swiper>
          </div>
        ) : (
          <div className={styles.imageWrapper}>
            <Image
              src="/default.jpg"
              alt="default"
              width="100%"
              height="100%"
            />
          </div>
        )}

        <div>
          <div className={styles.priceRow}>
            <div className={styles.price}>￥{detail.price}</div>
            <div className={styles.couponBtn}>登录查看更多</div>
          </div>
        </div>

        <div className={styles.titleRow}>
          <span className={styles.tag}>IFASHION</span>
          <span className={styles.title}>{detail.title}</span>
        </div>

        <div className={styles.deliveryRow}>
          <Logistics className={styles.icon} fontSize={30} />
          <span className={styles.deliveryText}>
            预计3小时内发货 | 承诺48小时内发货
          </span>
          <br />
          <span className={styles.extraInfo}>河北保定 · 快递 · 免运费</span>
        </div>

        <div className={styles.row}>
          <LikeO className={styles.icon} />
          <span>7天无理由退货</span>
        </div>
        <div className={styles.row}>
          <Description className={styles.icon} />
          <span>风格 减脂食物 0添加 0糖 0脂肪</span>
        </div>
      </div>

      <BottomBar />
    </div>
  )
}

export default Detail;