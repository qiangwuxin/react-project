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
import RequireAuth from '@/components/RequireAuth';

const Login = lazy(() => import('@/pages/Login'));
const Shop = lazy(() => import('@/pages/Shop'));
const Diet = lazy(() => import('@/pages/Diet'));
const DietArrangement = lazy(() => import('@/pages/DietArrangement'));
const BodyData = lazy(() => import('@/pages/BodyData'));
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
            <Route path="/diet" element={<RequireAuth><Diet /></RequireAuth>}>
              <Route index element={<BodyData />} />
              <Route path="plan" element={<BodyData />} />
              <Route path="arrangement" element={<DietArrangement />} />
            </Route>
            <Route path="/body-data" element={<RequireAuth><BodyData /></RequireAuth>} />
            <Route path="/aichat" element={<AIChat />} />
            <Route path="/account" element={<Account />} />
          </Route>
          {/* 空的Layout */}
          <Route element={<BlankLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/search" element={<Search />} />
            <Route path="/detail/:id" element={
              <RequireAuth>
                <Detail />
              </RequireAuth>
            }
            />
          </Route>
        </Routes>

      </Suspense>
      <Toast />
    </>
  )
}

export default App
