import React, { useCallback, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { ToastProvider, useToasts } from 'react-toast-notifications';
import { Provider } from 'react-redux';
import store from './store';
import getTallyList from './model/get-tally-list';
import getCategoryList from './model/get-category-list';
import { setInitTallyInfo, getCaterogyInfo } from './store/actions';
import './index.css';
import App from './App';

const AppWithToasts = () => {
  const { addToast } = useToasts();

  // 初始化获取账单分类及账单明细
  const handleGetTallyList = useCallback(async () => {
    const res = await getTallyList()
      .catch(() => {
        addToast(`获取账单分类失败：跨域问题导致的失败，本地预览装个Allow CORS插件吧`, {
          appearance: 'error',
          autoDismiss: true,
        });
      });
    if (res?.code === 0 && res?.data) {
      store.dispatch(setInitTallyInfo(res.data));
    }
  }, [addToast]);
  const handleGetCategoryList = useCallback(async () => {
    const res = await getCategoryList()
      .catch(() => {
        addToast(`获取账单详情失败：跨域问题导致的失败，本地预览装个Allow CORS插件吧`, {
          appearance: 'error',
          autoDismiss: true,
        });
      });
    if (res?.code === 0 && res?.data) {
      store.dispatch(getCaterogyInfo(res.data));
    }
  }, [addToast])

  const init = useCallback(() => {
    Promise.all([handleGetTallyList(), handleGetCategoryList()]);
  }, [handleGetTallyList, handleGetCategoryList])
  useEffect(() => [
    init()
  ], [init]);

  return <App />;
};


ReactDOM.render(
  <Provider store={store}>
      <ToastProvider>
        <AppWithToasts />
      </ToastProvider>
  </Provider>,
  document.getElementById('root')
);