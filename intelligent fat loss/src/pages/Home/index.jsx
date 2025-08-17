import { Navigate } from 'react-router-dom'

const Home = () => {
  // 首頁直接重定向到商店頁面
  return <Navigate to="/shop" replace />
}

export default Home;
