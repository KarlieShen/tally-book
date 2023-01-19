import { gql } from "@apollo/client";

const GET_TALLY_LIST = gql`
  query getTallyList {
    bills {
      description
      id
      time
      amount
      category {
        name
        id
      }
    }
  }
`;
export default GET_TALLY_LIST;

