import './App.css'
import {
  Suspense,
  lazy
} from 'react';
import {
  Routes,
  Route,
  Navigate
} from 'react-router-dom'
import MainLayout from '@/components/MainLayout'
import BlankLayout from '@/components/BlankLayout'
import Loading from '@/components/Loading';
import Toast from '@/components/Toast';

const Home = lazy(() => import('@/pages/Home'));
const Shop = lazy(() => import('@/pages/Shop'));
const Sport = lazy(() => import('@/pages/Sport'));
const Diet = lazy(() => import('@/pages/Diet'));
const AIChat = lazy(() => import('@/pages/AIChat'));
const Account = lazy(() => import('@/pages/Account'));
const Search = lazy(() => import('@/pages/Search'));
const Detail = lazy(() => import('@/pages/Detail'));

function App() {
  return (
    <>
      <Suspense fallback={<Loading />}>
        {/* 带有tabbar的Layout */}
        <Routes >
          <Route element={<MainLayout />}>
            <Route path="/" element={<Navigate to="/shop" />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/sport" element={<Sport />} />
            <Route path="/diet" element={<Diet />} />
            <Route path="/aichat" element={<AIChat />} />
            <Route path="/account" element={<Account />} />
          </Route>
          {/* 空的Layout */}
          <Route element={<BlankLayout />}>
            <Route path="/search" element={<Search />} />
            <Route path="/detail/:id" element={<Detail />} />
          </Route>
        </Routes>

      </Suspense>
      <Toast />
    </>
  )
}

export default App
