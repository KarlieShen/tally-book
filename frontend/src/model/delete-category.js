import { gql } from "@apollo/client";

const DELETE_CATEGORY = gql`
  mutation deleteCategory($id: ID!) {
    deleteCategory(id: $id) {
      id
      name
    }
  }
`;

export default DELETE_CATEGORY;