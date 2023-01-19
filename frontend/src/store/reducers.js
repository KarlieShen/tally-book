const initialState = {
  tallyInfo: [],
  categories: []
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'GET_TALLY_LIST':
      return {
        ...state,
        tallyInfo: action.options
      };
    case 'GET_CATEGORY_LIST':
      return {
        ...state,
        categories: action.options
      }
    default:
      return state;
  }
}
export default reducer;
