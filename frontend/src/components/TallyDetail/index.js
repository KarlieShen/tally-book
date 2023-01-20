import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useMutation } from "@apollo/client";
import DELETE_BILL from '../../model/delete.bill';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Select from "@material-ui/core/Select";
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import MenuItem from "@material-ui/core/MenuItem";
import DateFnsUtils from '@date-io/date-fns';
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import { TALLY_TYPE_MATCH } from '../../utils/constants';
import AddTallyModal from '../AddTally';
import { Snackbar } from '@material-ui/core';
import GET_BILL_LIST from '../../model/get-bill-list';

const useStyles = makeStyles(theme => ({
  root: {
    padding: '2rem',
    minWidth: 500,
  },
  table: {
    minWidth: 500,
  },
  emptyRow: {
    textAlign: 'center',
  },
  tallySection: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column',
      alignItems: 'flex-start',
    },
  },
  tallySectionPartOne: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    [theme.breakpoints.down('xs')]: {
      width: '100%',
    },
  },
  tallySectionPartTwo: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    [theme.breakpoints.down('xs')]: {
      width: '100%',
      marginBottom: '1rem'
    },
  },
  categorySelect: {
    width: '130px',
    marginRight: '1rem'
  },
  dataPanel: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  },
  analyzePanel: {
    width: '100%',
    marginTop: '2rem',
    [theme.breakpoints.up('md')]: {
      marginTop: 0,
      width: '30%',
    },
  },
  numContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    margin: '0',
  },
  expensePara: {
    marginLeft: '1rem',
    marginRight: '1rem',
  },
  expense: {
    marginTop: 0,
    color: 'red',
  },
  income: {
    margin: 0,
    color: 'green',
  },
}));

const calcMoney = (arr, type) => {
  let res = 0;
  arr?.forEach((item) => {
    if (item.type === type) {
      res += item.amount;
    }
  });
  return res;
}
const filterMonthInfo = (arr, date) => {
  return arr?.filter(item => {
    return new Date(item.time).getMonth() === date.getMonth()
      && new Date(item.time).getFullYear() === date.getFullYear();
  })
}
// // 获取支出排行组件数据
// const handleAnalyze = (rows, categories) => {
//   let total = 0;
//   const formatData =  rows?.reduce((accu, curr) => {
//     if (curr.type === 0) {
//       total += curr.amount;
//       const categoryObj = categories.find(category => category.id === curr.categoryId);
//       const category = categoryObj?.name;

//       const params = {
//         number: accu[curr.categoryId] ? accu[curr.categoryId].number + curr.amount : curr.amount,
//         frequency: accu[curr.categoryId] ? ++accu[curr.categoryId].frequency : 1,
//         category,
//       }
//       accu[curr.categoryId] = params;
//       return accu;
//     } else {
//       return accu;
//     }
//   }, {});
//   const keys = formatData ? Object.keys(formatData) : [];
//   const data = keys.map(categoryId => {
//     formatData[categoryId] = {
//       ...formatData[categoryId],
//       categoryId,
//     }
//     return formatData[categoryId];
//   });
//   data.sort((a, b) => b.number - a.number);

//   return {
//     data,
//     total,
//   };
// }


export default function TallyTable() {
  const classes = useStyles();
  const tallyInfo = useSelector(state => state.tallyInfo);
  const categories = useSelector(state => state.categories);
  const [deleteFeedback, setDeleteFeedback] = useState({
    open: false,
    message: '',
  })
  const handleCloseDeleteBillFeedback = () => {
    setDeleteFeedback({
      open: false,
      message: '',
    });
  }
 
  const [deleteBill] = useMutation(DELETE_BILL, {
    onCompleted: () => {
      setDeleteFeedback({
        open: true,
        message: 'delete success',
      });
    },
    onError: () => {
      setDeleteFeedback({
        open: true,
        message: 'delete failed',
      });
    },
    refetchQueries: [{ query: GET_BILL_LIST }],
  });

  const [rows, setRows] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date(Date.now()));

  const [categoryId, setCategoryId] = useState('');

  const expense = useMemo(() => calcMoney(rows, TALLY_TYPE_MATCH.EXPENSE), [rows]);
  const income = useMemo(() => calcMoney(rows, TALLY_TYPE_MATCH.INCOME), [rows]);

  const [open, setOpen] = useState(false);

  // const analyzeData = useMemo(() => handleAnalyze(rows, categories), [rows, categories]);

  const handleDateChange = (val) => {
    console.log('handleDateChange', val);
    setSelectedDate(val);
  }

  const handleCategoryChange = (event) => {
    const { value } = event.target;
    setCategoryId(value);
  }
  // 添加账单modal的回调函数
  const handleAddBill = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleAddTallySuccess = (date) => {
    setSelectedDate(date);
  }

  const handleDeleteBill = (id) => {
    deleteBill({
      variables: {
        id,
      }
    })
  }

  const filterRowsFn = () => {
    let data = tallyInfo;
    if (categoryId) {
      data = data.filter(item => item['category'].id === categoryId);
    }
    data = filterMonthInfo(data, selectedDate);
    data.sort((a, b) => a.time - b.time);
    setRows(data);
  };
  // 条件变化时筛选列表数据
  const handleFilterRows = useCallback(filterRowsFn, [categoryId, selectedDate, tallyInfo])

  useEffect(() => {
    handleFilterRows();
  }, [handleFilterRows]);

  return (
    <>
    <div className={classes.root}>
      <section className={classes.dataPanel}>
        <section className={classes.tallySection}>
          <div className={classes.tallySectionPartOne}>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <DatePicker
                variant="inline"
                openTo="month"
                views={["year", "month"]}
                helperText="choose time span"
                format="yyyy.MM"
                autoOk={true}
                value={selectedDate}
                onChange={handleDateChange}
              />
            </MuiPickersUtilsProvider>

            <div className={classes.numContainer}>
              <div className={classes.expensePara}>
                Expense
                <p className={classes.expense}>{expense}</p>
              </div>
              <div>
                Income
                <p className={classes.income}>{income}</p>
              </div>
            </div>
          </div>
          <div className={classes.tallySectionPartTwo}>
            <FormControl>
              <Select
                className={classes.categorySelect}
                value={categoryId}
                displayEmpty
                onChange={handleCategoryChange}
              >
                <MenuItem value="">
                All
                </MenuItem>
                {
                  categories.map(category => (
                    <MenuItem
                      key={category.id}
                      value={category.id}
                    >{category.name}
                    </MenuItem>
                  ))
                }
              </Select>
              <FormHelperText>Filter Bill Category</FormHelperText>
            </FormControl>

            <div className={classes.addBtnContainer}>
              <Button variant="contained"
                classes={{
                  label: classes.addBtnLabel
                }}
                onClick={handleAddBill} color="primary">
                Add Bill
              </Button>
            </div>
          </div>
        </section>

        <TableContainer className={classes.tableContainer} component={Paper}>
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="left">description</TableCell>
                <TableCell align="left">time</TableCell>
                <TableCell align="left">type</TableCell>
                <TableCell align="left">category</TableCell>
                <TableCell align="left">amount</TableCell>
                <TableCell align='left'></TableCell>

              </TableRow>
            </TableHead>
            <TableBody>
              {rows?.map(row => (
                <TableRow key={row.id}>
                  <TableCell align="left">{row.description}</TableCell>
                  <TableCell align="left">{row.time}</TableCell>
                  <TableCell align="left">{row.type}</TableCell>
                  <TableCell align="left">{row.category?.name}</TableCell>
                  <TableCell align="left">{row.amount}</TableCell>
                  <TableCell align='left'>
                    <IconButton
                      aria-label="delete"
                      onClick={() => handleDeleteBill(row.id)} 
                    >
                      <DeleteIcon/>
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {
                rows?.length === 0
                ? <TableRow style={{ height: '200px' }}>
                    <TableCell colSpan={6} className={classes.emptyRow}>Empty</TableCell>
                  </TableRow>
                : null
              }
            </TableBody>
          </Table>
        </TableContainer>

      </section>
    </div>
    <AddTallyModal
      open={open}
      categories={categories}
      handleClose={handleClose}
      handleSubmitSuccess={handleAddTallySuccess}
    />
    <Snackbar
      open={deleteFeedback.open}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      autoHideDuration={6000}
      onClose={handleCloseDeleteBillFeedback}
      message={deleteFeedback.message}
    />
    </>
  );
}
