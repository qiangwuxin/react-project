import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './shop.module.css';
import Waterfall from '@/components/waterfall';
import { SubmitBar, Swiper, ActionSheet } from 'react-vant';
import { showToast } from '@/components/Toast/ToastController';
import useTitle from '@/hooks/useTitle';

const Shop = () => {
  const navigate = useNavigate();
  const [cartNum, setCartNum] = useState({ cart: 0, bell: 0, mail: 0 });
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // 輪播圖片數據
  const swiperImages = [
    {
      id: 1,
      url: 'https://img95.699pic.com/photo/50019/8453.jpg_wh860.jpg',
      title: '美食1'
    },
    {
      id: 2,
      url: 'https://www.shomick.com/uploads/160406/1-160406091101323.jpg',
      title: '美食2'
    },
    {
      id: 3,
      url: 'https://img95.699pic.com/photo/50019/8573.jpg_wh860.jpg',
      title: '美食3'
    }
  ];

  useTitle('商城');

  const addCartNum = () => {
    setCartNum(prev => ({ ...prev, cart: prev.cart + 1 }));
    // 顯示Toast提示
    showToast({ ...cartNum, cart: cartNum.cart + 1 });
  };

  const handleBuyNow = (product) => {
    setSelectedProducts(prev => {
      const existingIndex = prev.findIndex(item => item.id === product.id);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: (updated[existingIndex].quantity || 1) + 1
        };
        return updated;
      } else {
        return [...prev, { ...product, quantity: 1 }];
      }
    });
  };

  const handleSubmit = () => {
    if (selectedProducts.length > 0) {
      const totalPrice = selectedProducts.reduce((sum, product) => {
        return sum + (product.price * (product.quantity || 1));
      }, 0);

      const productList = selectedProducts.map(product =>
        `${product.title} x${product.quantity || 1}`
      ).join(', ');

      alert(`正在购买: ${productList}，总价格: ¥${totalPrice.toFixed(2)}`);
      setSelectedProducts([]);
    }
  };

  const removeProduct = (productId) => {
    setSelectedProducts(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeProduct(productId);
      return;
    }

    setSelectedProducts(prev =>
      prev.map(item =>
        item.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const handleDetailClick = () => {
    if (selectedProducts.length > 0) {
      setShowDetailModal(true);
    }
  };

  const closeDetailModal = () => {
    setShowDetailModal(false);
  };

  const clearAllProducts = () => {
    setSelectedProducts([]);
    setShowDetailModal(false);
  };

  return (
    <div className={selectedProducts.length > 0 ? styles.shopContainerWithSubmitBar : styles.shopContainer}>
      {/* 搜索栏 */}
      <div className={styles.searchBar}>
        <div className={styles.menuIcon}>☰</div>
        <div className={styles.searchBox} onClick={() => navigate('/search')}>
          <span className={styles.searchIcon}>🔍</span>
          <span className={styles.searchPlaceholder}>搜索店内商品</span>
        </div>
        <div className={styles.moreIcon}>⋯</div>
      </div>

      {/* 主横幅区域 - 使用Swiper轮播 */}
      <div className={styles.banner}>
        <Swiper
          autoplay={3000}
          loop
          indicator
          className={styles.bannerSwiper}
        >
          {swiperImages.map((image) => (
            <Swiper.Item key={image.id}>
              <div className={styles.bannerSwiperItem}>
                <img
                  src={image.url}
                  alt={image.title}
                  className={styles.bannerSwiperImage}
                />
                <div className={styles.bannerOverlay}>
                  <h1 className={styles.bannerTitle}>SHETU 美味</h1>
                  <p className={styles.bannerSubtitle}>健康好美味</p>
                  <p className={styles.bannerText}>唯美食不可辜负</p>
                  <p className={styles.bannerEnglish}>FOOD NOT ONLY LIVE UP TO</p>
                </div>
              </div>
            </Swiper.Item>
          ))}
        </Swiper>
      </div>

      {/* 分类图标区域 */}
      <div className={styles.categories}>
        <div className={styles.categoryDots}>
          <span className={styles.dot}></span>
          <span className={styles.dot}></span>
          <span className={styles.dotActive}></span>
          <span className={styles.dot}></span>
          <span className={styles.dot}></span>
        </div>
        <div className={styles.categoryIcons}>
          <div className={styles.categoryItem}>
            <div className={styles.categoryIcon} style={{ backgroundColor: '#87CEEB' }}>
              🍽️
            </div>
            <span>自助美食</span>
          </div>
          <div className={styles.categoryItem}>
            <div className={styles.categoryIcon} style={{ backgroundColor: '#90EE90' }}>
              🍽️
            </div>
            <span>美味西餐</span>
          </div>
          <div className={styles.categoryItem}>
            <div className={styles.categoryIcon} style={{ backgroundColor: '#FFB6C1' }}>
              🍸
            </div>
            <span>酒吧KTV</span>
          </div>
          <div className={styles.categoryItem}>
            <div className={styles.categoryIcon} style={{ backgroundColor: '#90EE90' }}>
              🔥
            </div>
            <span>美味烧烤</span>
          </div>
        </div>
      </div>



      {/* 今日新品区域 - 直接使用Waterfall组件 */}
      <div className={styles.newProducts}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>今日新品</h2>
          <button className={styles.moreButton}>MORE</button>
        </div>

        <div className={styles.waterfallContainer}>
          <Waterfall onBuyNow={handleBuyNow} addCartNum={addCartNum} />
        </div>
      </div>

      {/* 底部购买栏 */}
      {selectedProducts.length > 0 && (
        <div className={styles.customSubmitBar}>
          <div className={styles.submitBarLeft} onClick={handleDetailClick}>
            <span className={styles.selectedCount}>已选{selectedProducts.length}款</span>
            <span className={styles.arrowIcon}>▼</span>
          </div>
          <div className={styles.submitBarRight}>
            <span className={styles.totalLabel}>合计:</span>
            <span className={styles.totalPrice}>
              ¥{selectedProducts.reduce((sum, product) =>
                sum + (product.price * (product.quantity || 1)), 0
              ).toFixed(2)}
            </span>
            <button className={styles.checkoutButton} onClick={handleSubmit}>
              去结算
            </button>
          </div>
        </div>
      )}

      {/* 详情弹窗 */}
      <ActionSheet
        visible={showDetailModal}
        onClose={closeDetailModal}
        title={
          <div className={styles.modalHeader}>
            <span className={styles.clearButton} onClick={clearAllProducts}>清空选择</span>
            <span className={styles.modalTitle}>已选{selectedProducts.length}款商品</span>
            <span className={styles.closeButton} onClick={closeDetailModal}>✕</span>
          </div>
        }
        closeOnClickOverlay={true}
        className={styles.detailActionSheet}
        closeable={false}
        duration={300}
      >
        <div className={styles.modalContent}>
          <div className={styles.modalBody}>
            {selectedProducts.map(product => (
              <div key={product.id} className={styles.modalProductItem}>
                <div className={styles.productImage}>
                  <img src={product.url} alt={product.title} />
                </div>
                <div className={styles.productInfo}>
                  <div className={styles.productTitle}>{product.title}</div>
                  <div className={styles.productDesc}>{product.description || '盐焗鸡蛋*10【共300g】新货'}</div>
                  <div className={styles.productPrice}>¥{product.price}</div>
                </div>
                <div className={styles.productControls}>
                  <button
                    onClick={() => updateQuantity(product.id, (product.quantity || 1) - 1)}
                    className={styles.quantityBtn}
                  >
                    -
                  </button>
                  <span className={styles.quantityText}>{product.quantity || 1}</span>
                  <button
                    onClick={() => updateQuantity(product.id, (product.quantity || 1) + 1)}
                    className={styles.quantityBtn}
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className={styles.modalFooter}>
            <div className={styles.footerSummary}>
              <span className={styles.footerCount}>已选{selectedProducts.length}款</span>
              <div className={styles.footerRight}>
                <span className={styles.footerTotal}>
                  合计: ¥{selectedProducts.reduce((sum, product) =>
                    sum + (product.price * (product.quantity || 1)), 0
                  ).toFixed(2)}
                </span>
                <button className={styles.footerCheckoutButton} onClick={handleSubmit}>
                  去结算
                </button>
              </div>
            </div>
          </div>
        </div>
      </ActionSheet>
    </div>
  );
};

export default Shop;