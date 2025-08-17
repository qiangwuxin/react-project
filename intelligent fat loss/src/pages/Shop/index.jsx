import styles from './shop.module.css'
import useTitle from '@/hooks/useTitle'
import { usePagesStore } from '@/store/usePages'
import { useEffect, useState } from 'react'
import Waterfall from '@/components/waterfall'
import Search from '@/pages/Search'
import { SubmitBar } from 'react-vant'

const Shop = () => {
  const { fetchMore } = usePagesStore();
  const [selectedProducts, setSelectedProducts] = useState([]);

  useTitle('健康食品商店');

  useEffect(() => {
    fetchMore()
  }, [fetchMore])

  const handleBuyNow = (product) => {
    setSelectedProducts(prev => {
      // 檢查商品是否已經在購物車中
      const existingIndex = prev.findIndex(item => item.id === product.id);
      if (existingIndex >= 0) {
        // 如果已存在，增加數量
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: (updated[existingIndex].quantity || 1) + 1
        };
        return updated;
      } else {
        // 如果不存在，添加新商品
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
      // 这里可以添加实际的购买逻辑
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

  return (
    <>
      <div className={styles.search}>
        <input
          type="text"
          placeholder="请输入商品名称"
          onClick={() => { location.href = '/search' }}
        />
      </div>
      <div className={styles.container}>
        <Waterfall onBuyNow={handleBuyNow} />
      </div>
      {selectedProducts.length > 0 && (
        <SubmitBar
          price={selectedProducts.reduce((sum, product) =>
            sum + (product.price * (product.quantity || 1)), 0
          ) * 100} // SubmitBar 需要以分为单位
          buttonText="立即购买"
          onSubmit={handleSubmit}
        >
          <div style={{ padding: '0 16px', fontSize: '14px', color: '#666' }}>
            <div style={{ marginBottom: '8px' }}>
              已选择 {selectedProducts.length} 种商品
            </div>
            {selectedProducts.map(product => (
              <div key={product.id} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '4px',
                fontSize: '12px'
              }}>
                <span>{product.title} x{product.quantity || 1}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      updateQuantity(product.id, (product.quantity || 1) - 1);
                    }}
                    style={{
                      width: '20px',
                      height: '20px',
                      border: '1px solid #ddd',
                      background: 'white',
                      borderRadius: '50%',
                      cursor: 'pointer'
                    }}
                  >
                    -
                  </button>
                  <span>{product.quantity || 1}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      updateQuantity(product.id, (product.quantity || 1) + 1);
                    }}
                    style={{
                      width: '20px',
                      height: '20px',
                      border: '1px solid #ddd',
                      background: 'white',
                      borderRadius: '50%',
                      cursor: 'pointer'
                    }}
                  >
                    +
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeProduct(product.id);
                    }}
                    style={{
                      padding: '2px 6px',
                      border: '1px solid #ff4757',
                      background: 'white',
                      color: '#ff4757',
                      borderRadius: '4px',
                      fontSize: '10px',
                      cursor: 'pointer'
                    }}
                  >
                    删除
                  </button>
                </div>
              </div>
            ))}
          </div>
        </SubmitBar>
      )}
    </>
  )
}

export default Shop;