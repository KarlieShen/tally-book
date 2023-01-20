import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import ADD_Bill from "../../model/add-bill";
import GET_BILL_LIST from '../../model/get-bill-list';
// import { useDispatch  } from 'react-redux';
// import { addCategory } from '../../store/actions';
import { makeStyles } from '@material-ui/core/styles';
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
import Modal from '@material-ui/core/Modal';
import DateFnsUtils from '@date-io/date-fns';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import { useSelector } from "react-redux";

const useStyles = makeStyles((theme) => ({
  title: {
    textAlign: 'center',
    fontSize: '24px',
    lineHeight: '22px',
    width: '100%',
    marginBottom: '1em',
  },
  formContainer: {
    padding: '20px',
    height: '400px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  formControl: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  markSelect: {
    marginRight: '20px',
  },
  typeForm: {
    alignItems: 'center',
    marginTop: '20px',
  },
  formLabel: {
    marginRight: '20px',
    width: '140px',
  },
  descriptionInput: {
    width: '302px',
  },
  categorySelect: {
    width: '250px',
  },
  btnContainer: {
    width: '88px',
  },
  btnRoot: {
    width: '100%',
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addCategoryBtn: {
    padding: '3px',
    fontSize: '12px',
    marginLeft: '3px',
  }
  // paper: {
  //   backgroundColor: theme.palette.background.paper,
  //   border: '2px solid #000',
  //   boxShadow: theme.shadows[5],
  //   padding: theme.spacing(2, 4, 3),
  // }
}));
const dateFns = new DateFnsUtils();
const today = dateFns.format(new Date(), 'yyyy-MM-dd');

const AddTally = ({open, handleClose, handleSubmitSuccess, categories}) => {
  const classes = useStyles();
  const [addBill] = useMutation(ADD_Bill, {
    onCompleted: () => {
      handleSubmitSuccess(formValues.time);
      handleCloseModal();
    },
    update(cache, { data: { addBill }}) {
      const { bills } = cache.readQuery({ query: GET_BILL_LIST });
      cache.writeQuery({
        query: GET_BILL_LIST,
        data: { bills: [...bills, addBill] }
      })
    }
  });

  // const dispatch = useDispatch();
  const categoryInfo = useSelector(state => state.categories);

  const defaultFormValues = {
    time: new Date(),
    description: '',
    type: 'Expense',
    categoryId: '',
    amount: '',
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
  // 关闭Modal后重置数据
  const reset = () => {
    setFormValues(defaultFormValues);
  }
  const handleCloseModal = () => {
    reset();
    handleClose();
  }
  // add new bill
  const handleSubmit = async (event) => {
    event.preventDefault();
     const params = {
      time: dateFns.format(formValues.time, 'yyyy-MM-dd'),
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
    <Modal
      className={classes.modal}
      open={open}
      onClose={handleCloseModal}
    >
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
              >Add Category</Button>
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
    </Modal>
    </>
  );
};


export default AddTally;
