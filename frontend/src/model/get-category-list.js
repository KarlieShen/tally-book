import { gql } from "@apollo/client";

const GET_CATEGORY_LIST = gql`
  query getCategoryList {
    categories {
      name
      id
    }
  }
`;

export default GET_CATEGORY_LIST;

