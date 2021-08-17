import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from './store';
import getTallyList from './model/get-tally-list';
import getCategoryList from './model/get-category-list';
import { setInitTallyInfo, getCaterogyInfo } from './store/actions';
import './index.css';
import App from './App';

// 初始化获取账单分类及账单明细
const handleGetTallyList = async () => {
  const res = await getTallyList();
  if (res.code === 0 && res.data) {
    store.dispatch(setInitTallyInfo(res.data));
  }
}
const handleGetCategoryList = async () => {
  const res = await getCategoryList();
  if (res.code === 0 && res.data) {
    store.dispatch(getCaterogyInfo(res.data));
  }
}

const init = () => {
  Promise.all([handleGetTallyList(), handleGetCategoryList()]);
}
init();


ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);