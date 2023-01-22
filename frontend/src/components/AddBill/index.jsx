import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client";
import ADD_BILL from "../../model/add-bill";
import GET_BILL_LIST from "../../model/get-bill-list";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import RadioGroup from "@material-ui/core/RadioGroup";
import Radio from "@material-ui/core/Radio";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
import DateFnsUtils from "@date-io/date-fns";
import { KeyboardDatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import { useSelector } from "react-redux";
import AddCategoryModal from "../AddCategoryModal";
import DeleteCategoryModal from "../DeleteCategoryModal";

const useStyles = makeStyles((theme) => ({
  title: {
    fontSize: "24px",
    lineHeight: "22px",
    width: "100%",
    marginBottom: "1em",
  },
  formContainer: {
    padding: "20px",
    height: "400px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    backgroundColor: "#fff",
  },
  formControl: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  markSelect: {
    marginRight: "20px",
  },
  typeForm: {
    alignItems: "center",
    marginTop: "20px",
  },
  formLabel: {
    marginRight: "20px",
    width: "140px",
  },
  descriptionInput: {
    width: "302px",
  },
  categorySelect: {
    width: "250px",
  },
  btnContainer: {
    width: "88px",
  },
  btnRoot: {
    width: "100%",
  },
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  addCategoryBtn: {
    padding: "4px",
    fontSize: "14px",
    marginLeft: "1rem",
  },
}));
const dateFns = new DateFnsUtils();
const today = dateFns.format(new Date(), "yyyy-MM-dd");

const AddBill = () => {
  const classes = useStyles();
  const navigate = useNavigate();

  const [openAddCategoryModal, setOpenAddCategoryModal] = useState(false);
  const [openDeleteCategoryModal, setOpenDeleteCategoryModal] = useState(false);

  const [addBill] = useMutation(ADD_BILL, {
    onCompleted: () => {
      navigate("/");
    },
    update(cache, { data: { addBill }}) {
      const { bills } = cache.readQuery({ query: GET_BILL_LIST });
      cache.writeQuery({
        query: GET_BILL_LIST,
        data: { bills: [...bills, addBill] }
      })
    }
  });

  const categoryInfo = useSelector(state => state.categories);

  const defaultFormValues = {
    time: new Date(),
    description: "",
    type: "Expense",
    categoryId: "",
    amount: "",
  };
  // 表单信息
  const [formValues, setFormValues] = useState(defaultFormValues);

  const handleDescAndTypeAndCategoryChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const handleDateChange = (value) => {
    setFormValues({
      ...formValues,
      time: value,
    });
  };
  const handleAmountChange = (event) => {
    const { value } = event.target;

    if (!isNaN(Number(value)) && /^(([1-9]{1}\d*)|(0{1}))(\.\d{0,2})?$/.test(value)) {
      setFormValues({
        ...formValues,
        amount: value,
      });
    }
  }

  // add new bill
  const handleSubmit = async (event) => {
    event.preventDefault();
     const params = {
      time: dateFns.format(formValues.time, "yyyy-MM-dd"),
      description: formValues.description,
      type: formValues.type,
      amount: parseFloat(formValues.amount),
      categoryId: formValues.categoryId
    }
    addBill({
      variables: params
    });
  };

  return (
    <>
      <form onSubmit={handleSubmit} className={classes.formContainer}>
        <Grid container alignItems="baseline" direction="column">
          <p className={classes.title}>Add Bill</p>
          <Grid item>
            <FormControl className={classes.formControl} required={true}>
              <FormLabel className={classes.formLabel}>operate time</FormLabel>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker
                  placeholder={today}
                  disableFuture
                  value={formValues.time}
                  name="time"
                  onChange={val => handleDateChange(val)}
                  format="yyyy/MM/dd"
                />
              </MuiPickersUtilsProvider>
            </FormControl>
          </Grid>

          <Grid item>
            <FormControl className={classes.formControl} required={true}>
              <FormLabel className={classes.formLabel}>description</FormLabel>
              <TextField
                name="description"
                label="please input bill description"
                className={classes.descriptionInput}
                type="text"
                value={formValues.description}
                required={true}
                onChange={handleDescAndTypeAndCategoryChange}
              />
            </FormControl>
          </Grid>

          <Grid item>
            <FormControl className={`${classes.formControl} ${classes.typeForm}`} required={true}>
              <FormLabel className={classes.formLabel}>type</FormLabel>
              <RadioGroup
                name="type"
                value={formValues.type}
                onChange={handleDescAndTypeAndCategoryChange}
                row
              >
                <FormControlLabel
                  key="Expense"
                  value="Expense"
                  control={<Radio size="small" />}
                  label="Expense"
                />
                <FormControlLabel
                  key="Income"
                  value="Income"
                  control={<Radio size="small" />}
                  label="Income"
                />

              </RadioGroup>
            </FormControl>
          </Grid>

          <Grid item>
            <FormControl className={classes.formControl} required={true}>
              <FormLabel className={classes.formLabel}>amount</FormLabel>
              <TextField
                autoComplete="off"
                name="amount"
                label="please input bill amount"
                type="text"
                value={formValues.amount}
                required={true}
                onChange={handleAmountChange}
              />
            </FormControl>
          </Grid>
          
          <Grid item>
            <FormControl className={classes.formControl} required={true}>
              <FormLabel className={classes.formLabel}>category</FormLabel>
              <Select
                name="categoryId"
                className={classes.categorySelect}
                value={formValues.categoryId}
                onChange={handleDescAndTypeAndCategoryChange}
              >
                {
                  categoryInfo.map(category => (
                    <MenuItem
                      key={category.id}
                      value={category.id}>
                      {category.name}
                    </MenuItem>
                  ))
                }
              </Select>
              <Button
                className={classes.addCategoryBtn}
                variant="outlined"
                size="small"
                color="primary"
                onClick={() => setOpenAddCategoryModal(true)}
              >Add Category</Button>

              <Button
                className={classes.addCategoryBtn}
                variant="outlined"
                size="small"
                color="primary"
                onClick={() => setOpenDeleteCategoryModal(true)}
              >Delete Category</Button>
            </FormControl>
          </Grid>


        </Grid>
        <div className={classes.btnContainer}>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            classes={{
              root: classes.btnRoot
            }}
          >
            Save
          </Button>
        </div>
      </form>
      <AddCategoryModal
        open={openAddCategoryModal}
        onClose={() => setOpenAddCategoryModal(false)}
      />
      <DeleteCategoryModal
        open={openDeleteCategoryModal}
        onClose={() => setOpenDeleteCategoryModal(false)}
      />
    </>
  );
};


export default AddBill;
