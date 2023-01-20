import { gql } from "@apollo/client";

const ADD_Bill = gql`
  mutation addBill($description: String!) {
    addBill(description: $description) {
      description
      id
      time
      amount
      category
      type
    }
  }
`;

export default ADD_Bill;