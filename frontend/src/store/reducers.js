const initialState = {
  tallyInfo: [],
  categories: []
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_BILL_LIST':
      return {
        ...state,
        tallyInfo: action.options
      };
    case 'SET_CATEGORY_INFO':
      return {
        ...state,
        categories: action.options
      }
    default:
      return state;
  }
}
export default reducer;
