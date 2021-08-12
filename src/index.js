import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from './store';
import { setInitTallyInfo, getCaterogyInfo } from './store/actions';
import './index.css';
import App from './App';
import { TALLY_INFOS, CATEGORIES } from './utils/constants';

const init = () => {
  store.dispatch(setInitTallyInfo(TALLY_INFOS));
  store.dispatch(getCaterogyInfo(CATEGORIES));
}
init();

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);

