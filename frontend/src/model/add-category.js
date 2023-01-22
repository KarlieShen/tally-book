import { gql } from "@apollo/client";

const ADD_CATEGORY = gql`
  mutation addCategory(
    $name: String!,
  ) {
    addCategory(
      name: $name,
    ) {
      id
      name
    }
  }
`;

export default ADD_CATEGORY;