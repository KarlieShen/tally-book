import { gql } from "@apollo/client";

const DELETE_BILL = gql`
  mutation deleteBill($id: ID!) {
    deleteBill(id: $id) {
      id
      description
      time
      amount
      type
    }
  }
`;

export default DELETE_BILL;