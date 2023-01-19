import TallyDetail from './components/TallyDetail';
import { useQuery } from '@apollo/client';
import { useEffect } from 'react';
import GET_CATEGORY_LIST from './model/get-category-list';
import GET_TALLY_LIST from './model/get-tally-list';
import store from './store';
import { getCategoryInfo, getTallyList } from './store/actions';

function App() {
  const { loading: categoryListLoading , error: categoryListError ,data: categoryList } = useQuery(GET_CATEGORY_LIST);
  const { loading: tallyListLoading, error: tallyListError, data: tallyList } = useQuery(GET_TALLY_LIST);

  useEffect(() => {
    console.log('categoryList', categoryList);
    categoryList?.categories && store.dispatch(getCategoryInfo(categoryList.categories));
  }, [categoryList]);

  useEffect(() => {
    console.log('tallyList', tallyList);
    tallyList?.bills && store.dispatch(getTallyList(tallyList.bills));
  }, [tallyList]);

  if (categoryListLoading || tallyListLoading) return <p>Loading...</p>;
  if (categoryListError || tallyListError) return <p>Something Went Wrong</p>;

  return (
    <TallyDetail />
  );
}

export default App;