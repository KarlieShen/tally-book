import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client";
import DELETE_BILL from '../../model/delete.bill';
import GET_BILL_LIST from '../../model/get-bill-list';
import { useSelector } from 'react-redux';
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
import { Snackbar } from '@material-ui/core';
import useStyles from './style';

const calcMoney = (arr, type) => {
  let expense = 0;
  let income = 0;
  arr?.forEach((item) => {
    if (item.type === TALLY_TYPE_MATCH.EXPENSE) {
      expense += item.amount;
    } else {
      income += item.amount;
    }
  });

  return [expense.toFixed(2), income.toFixed(2)];
}
const filterMonthInfo = (arr, date) => {
  return arr?.filter(item => {
    return new Date(item.time).getMonth() === date.getMonth()
      && new Date(item.time).getFullYear() === date.getFullYear();
  })
}

function BillTable() {
  const classes = useStyles();
  const navigate = useNavigate();
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
    // refetchQueries: [{ query: GET_BILL_LIST }],
    update(cache, { data: { deleteBill }}) {
      const { bills } = cache.readQuery({ query: GET_BILL_LIST });
      cache.writeQuery({
        query: GET_BILL_LIST,
        data: { bills: bills.filter(bill => bill.id !== deleteBill.id) }
      })
    }
  });

  const [rows, setRows] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date(Date.now()));
  const [categoryId, setCategoryId] = useState('');
  const [expense, income] = useMemo(() => calcMoney(rows), [rows]);

  const handleDateChange = (val) => {
    setSelectedDate(val);
  }

  const handleCategoryChange = (event) => {
    const { value } = event.target;
    setCategoryId(value);
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
                onClick={() => navigate("/add-bill")} color="primary">
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

    <Snackbar
      open={deleteFeedback.open}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      autoHideDuration={1000}
      onClose={handleCloseDeleteBillFeedback}
      message={deleteFeedback.message}
    />
    </>
  );
}

export default BillTable;
