const initialState = {
  tallyInfo: [{
    time: 1561910400000,
    type: 0,
    caterogy: "8s0p77c323",
    amount: 5400,
  }, {
    time: 1561910400000,
    type: 1,
    category: "5il79e11628",
    amount: 30000,
  }],
  categories: [{
      id: "8s0p77c323",
      type: 0,
      name: "房贷"
    },
    {
      id: "s73ijpispio",
      type: 1,
      name: "工资"
    },

  ]
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'INIT_TALLY_INFO':
      return {
        ...state,
        tallyInfo: action.options
      };
    case 'CATEGORY_INFO':
      return {
        ...state,
        categories: action.options
      }
    case 'ADD_CATEGORY':
      return {
        ...state,
        tallyInfo: state.tallyInfo.concat([action.option])
      }
    case 'GET_TALLY_INFO':
      return state.tallyInfo;
    default:
      return state;
  }
}
export default reducer;
