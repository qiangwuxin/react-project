import styles from './loading.module.css'

const Loading = () => {
  return (
    <div className={styles.loadingContainer}>
      <div className={styles.spinner}></div>
      <p className={styles.loadingText}>加載中...</p>
    </div>
  )
}

export default Loading