// 自定義導航 hook，避免 React 17 環境下的 DOM 錯誤
export const useCustomNavigate = () => {
  const navigate = (path) => {
    if (path === -1) {
      window.history.back();
    } else {
      window.location.href = path;
    }
  };

  return navigate;
};
