import { gql } from "@apollo/client";

const GET_BILL_LIST = gql`
  query getBillList {
    bills {
      description
      id
      time
      amount
      type
      category {
        name
        id
      }
    }
  }
`;
export default GET_BILL_LIST;

