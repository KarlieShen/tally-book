import { gql } from "@apollo/client";

const ADD_Bill = gql`
  mutation addBill(
    $description: String!,
    $categoryId: ID!,
    $time: String!,
    $amount: Float!,
    $type: BillKind!
  ) {
    addBill(
      description: $description,
      categoryId: $categoryId,
      time: $time,
      amount: $amount,
      type: $type
    ) {
      id
      description
      time
      amount
      type
      category {
        id
        name
      }
    }
  }
`;

export default ADD_Bill;