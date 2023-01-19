import { gql } from "@apollo/client";

const ADD_TALLY = gql`
  query getCategoryList {
    categories {
      name
      id
    }
  }
`;

export default ADD_TALLY;