import React from "react";
import { useDispatch  } from "react-redux";
import { useMutation } from "@apollo/client";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import { useState } from "react";
import { Button, TextField } from "@material-ui/core";
import ADD_CATEGORY from "../model/add-category";
import GET_CATEGORY_LIST from "../model/get-category-list";
import { setCategoryInfo } from '../store/actions';

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
  saveBtn: {
    verticalAlign: "bottom",
    marginLeft: "1rem",
  }
}));

export default function AddCategoryModal({ open, onClose }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [addCategory] = useMutation(ADD_CATEGORY, {
    variables: {
      name,
    },
    onCompleted: () => {
      onClose();
    },
    update(cache, { data: { addCategory }}) {
      const { categories } = cache.readQuery({ query: GET_CATEGORY_LIST });
      const newCategories = [...categories, addCategory];
      cache.writeQuery({
        query: GET_CATEGORY_LIST,
        data: { categories: newCategories }
      });
      dispatch(setCategoryInfo(newCategories));
    }
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    addCategory();
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
    >
      <div className={classes.paper}>
        <h2 id="simple-modal-title">Add Category</h2>
        <form onSubmit={handleSubmit} autoComplete="off">
          <TextField
            required
            id="category-name-input"
            value={name}
            label="Category Name"
            onChange={(e) => setName(e.target.value)}
          />
          <Button
            className={classes.saveBtn}
            variant="contained"
            color="primary"
            type="submit"
          >Save
          </Button>
        </form>
      </div>
    </Modal>
  );
}