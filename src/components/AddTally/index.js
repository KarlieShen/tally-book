import React, { useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { addCaterogy } from '../../store/actions';
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

const AddTally = ({open, handleClose, handleSubmitSuccess}) => {
  const dispatch = useDispatch()
  const classes = useStyles();
  const categories = useSelector(state => state.categories);

  const defaultCategoryList = categories?.filter(item => item.type === 0);
  const [categoryInfo, setCategoryInfo] = useState({
    categoryList: defaultCategoryList,
    value: '',
    mark: 0,
  });
  const [amount, setAmount] = useState('');

  const defaultFormValues = {
    time: new Date(),
    type: '0',
  };
  const [formValues, setFormValues] = useState(defaultFormValues);

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
  // 关闭Modal后重置数据
  const reset = () => {
    setFormValues(defaultFormValues);
    setAmount('');
    setCategoryInfo({
      categoryList: defaultCategoryList,
      value: '',
      mark: 0,
    })
  }
  const handleCloseModal = () => {
    reset();
    handleClose();
  }

  const handleSubmit = (event) => {
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

    dispatch(addCaterogy(params));
    handleSubmitSuccess();
    handleCloseModal();
  };
  return (
    <Modal
      className={classes.modal}
      open={open}
      onClose={handleCloseModal}
    >
      <form onSubmit={handleSubmit} className={classes.formContainer}>
        <Grid container alignItems="baseline" direction="column">
          <p className={classes.title}>添加账单</p>
          <Grid item>
            <FormControl className={classes.formControl} required={true}>
              <FormLabel className={classes.formLabel}>消费时间</FormLabel>
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
              <FormLabel className={classes.formLabel}>账单类型</FormLabel>
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
                  label="支出"
                />
                <FormControlLabel
                  key="1"
                  value="1"
                  control={<Radio size="small" />}
                  label="收入"
                />

              </RadioGroup>
            </FormControl>
          </Grid>

          <Grid item>
            <FormControl className={classes.formControl} required={true}>
              <FormLabel className={classes.formLabel}>交易金额</FormLabel>
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
                label="请填写交易金额"
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
              <FormLabel className={classes.formLabel}>详细分类</FormLabel>
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
            保存
          </Button>
        </div>
      </form>
    </Modal>
  );
};


export default AddTally;
