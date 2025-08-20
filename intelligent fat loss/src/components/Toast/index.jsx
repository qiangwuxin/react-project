import styles from './toast.module.css'
import { toastEvent } from './Toastcontroller.jsx'
import {
  useState,
  useEffect
} from 'react'

const Toast = () => {
  const [isVisable, setIsVisable] = useState(false);
  const [data, setData] = useState({
    cart: 0,
    bell: 0,
    mail: 0
  })
  useEffect(() => {
    const show = (info) => {
      setIsVisable(true);
      setData({ ...info });
      setTimeout(() => setIsVisable(false), 3000);
    }
    toastEvent.on("show", show);
    return () => { toastEvent.off("show", show) }
  }, [])
  return (
    <div className={styles.toastWrapper} style={{ display: isVisable ? 'block' : 'none' }}>
      <div className={styles.toastItem}>🛒 {data.cart || 0}</div>
      <div className={styles.toastItem}>🔔 {data.bell || 0}</div>
      <div className={styles.toastItem}>✉️ {data.mail || 0}</div>
      <div className={styles.toastArrow}></div>
    </div>
  )
}
export default Toast;