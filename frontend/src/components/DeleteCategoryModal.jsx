import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useMutation } from "@apollo/client";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import DELETE_CATEGORY from "../model/delete-category";
import GET_CATEGORY_LIST from "../model/get-category-list";
import { setCategoryInfo } from "../store/actions";

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  categoryItem: {
    display: "flex",
    justifyContent: "space-between",
  }
}));

export default function DeleteCategoryModal({ open, onClose }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const categoryInfo = useSelector(state => state.categories);

  const [deleteCategory] = useMutation(DELETE_CATEGORY, {
    update(cache, { data: { deleteCategory }}) {
      const { categories } = cache.readQuery({ query: GET_CATEGORY_LIST });
      const newCategories = categories.filter(category => category.id !== deleteCategory.id);
      cache.writeQuery({
        query: GET_CATEGORY_LIST,
        data: { categories: newCategories }
      })
      dispatch(setCategoryInfo(newCategories));
    }
  });

  const handleDeleteCategory = (id) => {
    deleteCategory({
      variables: {
        id,
      }
    })
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
    >
      <div className={classes.paper}>
        <h2 id="simple-modal-title">Delete Category</h2>
        {
          categoryInfo.map((category) => (
            <div className={classes.categoryItem} key={category.id}>
              <p>{category.name}</p>
              <IconButton
                size="small"
                aria-label="delete"
                onClick={() => handleDeleteCategory(category.id)} 
              >
                <DeleteIcon/>
              </IconButton>
            </div>
          ))
        }
      </div>
    </Modal>
  );
}