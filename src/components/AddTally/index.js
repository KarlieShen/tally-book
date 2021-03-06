import React, { useState, useEffect } from "react";
import { useToasts } from 'react-toast-notifications';
import { makeStyles } from '@material-ui/core/styles';
import addTally from '../../model/add-tally';
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
import { formatDate } from '../../utils/util';

const useStyles = makeStyles((theme) => ({
  title: {
    textAlign: 'center',
    fontSize: '18px',
    lineHeight: '18px',
    width: '100%',
    marginBottom: '2em',
  },
  formContainer: {
    padding: '30px 50px',
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
  },
  amountInput: {
    width: '190px',
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
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  }
}));

const today = formatDate(new Date());

const AddTally = ({open, handleClose, handleSubmitSuccess, categories}) => {
  const classes = useStyles();

  const [categoryInfo, setCategoryInfo] = useState({
    categoryList: [],
    value: '',
    mark: 0,
  });
  const [amount, setAmount] = useState('');

  const defaultFormValues = {
    time: new Date(),
    type: '0',
  };
  // ????????????
  const [formValues, setFormValues] = useState(defaultFormValues);
  // toast??????
  const { addToast } = useToasts();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
    if (name === 'type') {
      const data = categories.filter(item => item.type === Number(value));
      setCategoryInfo({
        value: '',
        categoryList: data,
        mark: Number(value)
      });
    }
  };
  const handleCategoryChange = (event) => {
    const { value } = event.target;
    setCategoryInfo({
      ...categoryInfo,
      value,
    });
  }
  const handleDateChange = (value) => {
    setFormValues({
      ...formValues,
      time: value,
    });
  };
  const handleAmountChange = (event) => {
    const { value } = event.target;

    if (!isNaN(Number(value)) && /^(([1-9]{1}\d*)|(0{1}))(\.\d{0,2})?$/.test(value)) {
      setAmount(value);
    }

  }
  const handleMarkChange = (event) => {
    const { value } = event.target;
    setCategoryInfo({
      ...categoryInfo,
      mark: value,
    });
  }
  // ??????Modal???????????????
  const reset = () => {
    setFormValues(defaultFormValues);
    setAmount('');
    setCategoryInfo({
      categoryList: categories,
      value: '',
      mark: 0,
    })
  }
  const handleCloseModal = () => {
    reset();
    handleClose();
  }
  // submit new tally
  const handleSubmit = async (event) => {
    event.preventDefault();
    let lastAmount = 0;
    if (categoryInfo.mark === 0) {
      lastAmount = 0 - amount;
    } else {
      lastAmount = amount - 0;
    }
     const params = {
      time: formValues.time.getTime(),
      type: Number(formValues.type),
      amount: parseFloat(lastAmount),
      category: categoryInfo.value
    }
    const res = await addTally(params)
      .catch(err => {
        addToast(`???????????????????????????${err.stack}`, {
          appearance: 'error',
          autoDismiss: true,
        });
      });
    if (res?.code === 0) {
      addToast('??????????????????', {
        appearance: 'success',
        autoDismiss: true,
      });
    } else {
      addToast('??????????????????', {
        appearance: 'error',
        autoDismiss: true,
      });
    }
    handleSubmitSuccess(formValues.time);
    handleCloseModal();
  };

    // ???????????????????????????
    useEffect(() => {
      setCategoryInfo({
        categoryList: categories?.filter(item => item.type === 0),
        value: '',
        mark: 0,
      });
    }, [categories]);

  return (
    <>
    <Modal
      className={classes.modal}
      open={open}
      onClose={handleCloseModal}
    >
      <form onSubmit={handleSubmit} className={classes.formContainer}>
        <Grid container alignItems="baseline" direction="column">
          <p className={classes.title}>????????????</p>
          <Grid item>
            <FormControl className={classes.formControl} required={true}>
              <FormLabel className={classes.formLabel}>????????????</FormLabel>
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
            <FormControl className={`${classes.formControl} ${classes.typeForm}`} required={true}>
              <FormLabel className={classes.formLabel}>????????????</FormLabel>
              <RadioGroup
                name="type"
                value={formValues.type}
                onChange={handleInputChange}
                row
              >
                <FormControlLabel
                  key="0"
                  value="0"
                  control={<Radio size="small" />}
                  label="??????"
                />
                <FormControlLabel
                  key="1"
                  value="1"
                  control={<Radio size="small" />}
                  label="??????"
                />

              </RadioGroup>
            </FormControl>
          </Grid>

          <Grid item>
            <FormControl className={classes.formControl} required={true}>
              <FormLabel className={classes.formLabel}>????????????</FormLabel>
              <Select
                value={categoryInfo.mark}
                className={classes.markSelect}
                onChange={handleMarkChange}
              >
                <MenuItem value={0}>
                -
                </MenuItem>
                <MenuItem value={1}>
                +
                </MenuItem>
              </Select>
              <TextField
                autoComplete="off"
                name="amount"
                label="?????????????????????"
                className={classes.amountInput}
                type="text"
                value={amount}
                required={true}
                onChange={handleAmountChange}
              />
            </FormControl>
          </Grid>
          
          <Grid item>
            <FormControl className={classes.formControl} required={true}>
              <FormLabel className={classes.formLabel}>????????????</FormLabel>
              <Select
                name="category"
                className={classes.categorySelect}
                value={categoryInfo.value}
                onChange={handleCategoryChange}
              >
                {
                  categoryInfo.categoryList.map(category => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
                    </MenuItem>
                  ))
                }
              </Select>
            </FormControl>
          </Grid>


        </Grid>
        <div className={classes.btnContainer}>
          <Button variant="contained"
            color="primary" type="submit"
            classes={{
              root: classes.btnRoot
            }}
          >
            ??????
          </Button>
        </div>
      </form>
    </Modal>
    {/* <Snackbar
      anchorOrigin={{vertical: 'top', horizontal: 'center'}}
      open={snackInfo.open}
      onClose={handleClose}
      message={snackInfo.msg}
      action={
        <React.Fragment>
          <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </React.Fragment>
      }
    /> */}
    </>
  );
};


export default AddTally;
