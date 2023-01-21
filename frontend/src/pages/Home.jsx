import React, { useEffect } from "react";
import BillTable from "../components/BillTable";
import { useQuery } from '@apollo/client';
import GET_CATEGORY_LIST from '../model/get-category-list';
import GET_BILL_LIST from '../model/get-bill-list';
import store from '../store';
import { getCategoryInfo, getBillList } from '../store/actions';

function Home() {
  const { loading: categoryListLoading , error: categoryListError ,data: categoryList } = useQuery(GET_CATEGORY_LIST);
  const { loading: tallyListLoading, error: tallyListError, data: tallyList } = useQuery(GET_BILL_LIST);

  useEffect(() => {
    categoryList?.categories && store.dispatch(getCategoryInfo(categoryList.categories));
  }, [categoryList]);

  useEffect(() => {
    tallyList?.bills && store.dispatch(getBillList(tallyList.bills));
  }, [tallyList]);

  if (categoryListLoading || tallyListLoading) return <p>Loading...</p>;
  if (categoryListError || tallyListError) return <p>Something Went Wrong</p>;

  return (
    <BillTable />
  );
}

export default Home;