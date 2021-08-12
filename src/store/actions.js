export const setInitTallyInfo = options => ({
  type: 'INIT_TALLY_INFO',
  options,
});

export const getCaterogyInfo = options => ({
  type: 'CATEGORY_INFO',
  options,
});

export const getTallyInfo = options => ({
  type: 'GET_TALLY_INFO',
  options,
});

export const addCaterogy = option => ({
  type: 'ADD_CATEGORY',
  option,
});