import React, { useState, useMemo, useEffect, useCallback } from 'react';
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
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import MenuItem from "@material-ui/core/MenuItem";
import DateFnsUtils from '@date-io/date-fns';
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import { formatDate } from '../../utils/util';
import { TALLY_TYPE_MATCH } from '../../utils/constants';
import AddTallyModal from '../AddTally';
import TallyAnalyze from '../TallyAnalyze';
import { Button } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles(theme => ({
  root: {
    padding: '1rem',
    minWidth: '300px',
    display: 'flex',
    flexDirection: 'column',
    [theme.breakpoints.up('md')]: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
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
    width: '125px',
  },
  dataPanel: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '60%',
    },
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
    margin: '0 .5rem',
    [theme.breakpoints.down('xs')]: {
      flex: 1,
    },
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
  addBtnLabel: {
    width: '60px',
  }
}));
// 格式化列表数据
function formatInfo(info, categories) {
  return info?.map((item, index) => {
    const categoryObj = categories.find(category => category.id === item.category);
    const category = categoryObj?.name;

    return {
      ...item,
      category,
      categoryId: categoryObj?.id,
      id: index,
    }
  }).sort((a, b) => a.time - b.time); 
}
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
// 获取支出排行组件数据
const handleAnalyze = (rows, categories) => {
  let total = 0;
  const formatData =  rows?.reduce((accu, curr) => {
    if (curr.type === 0) {
      total += curr.amount;
      const categoryObj = categories.find(category => category.id === curr.categoryId);
      const category = categoryObj?.name;

      const params = {
        number: accu[curr.categoryId] ? accu[curr.categoryId].number + curr.amount : curr.amount,
        frequency: accu[curr.categoryId] ? ++accu[curr.categoryId].frequency : 1,
        category,
      }
      accu[curr.categoryId] = params;
      return accu;
    } else {
      return accu;
    }
  }, {});
  const keys = formatData ? Object.keys(formatData) : [];
  const data = keys.map(categoryId => {
    formatData[categoryId] = {
      ...formatData[categoryId],
      categoryId,
    }
    return formatData[categoryId];
  });
  data.sort((a, b) => b.number - a.number);

  return {
    data,
    total,
  };
}


export default function TallyTable() {
  const classes = useStyles();
  const tallyInfo = useSelector(state => state.tallyInfo);
  const categories = useSelector(state => state.categories);

  const [rows, setRows] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date('2023-01-01'));

  const [categoryInfo, setCategoryInfo] = useState({
    categoryList: [],
    value: '',
  });

  const expense = useMemo(() => calcMoney(rows, TALLY_TYPE_MATCH.EXPENSE), [rows]);
  const income = useMemo(() => calcMoney(rows, TALLY_TYPE_MATCH.INCOME), [rows]);

  const [open, setOpen] = useState(false);

  const analyzeData = useMemo(() => handleAnalyze(rows, categories), [rows, categories]);

  const handleDateChange = (val) => {
    console.log('handleDateChange', val);
    setSelectedDate(val);
  }

  const handleCategoryChange = (event) => {
    const { value } = event.target;
    setCategoryInfo({
      ...categoryInfo,
      value,
    });
  }
  // 添加账单modal的回调函数
  const handleAddBill = () => {
    setOpen(true);
  };
  // 添加账单分类
  const handleAddCategory = () => {
    console.log('add category');
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleAddTallySuccess = (date) => {
    setSelectedDate(date);
  }

  const filterRowsFn = () => {
    let data = formatInfo(tallyInfo, categories);
    if (categoryInfo.value) {
      data = data.filter(item => item.categoryId === categoryInfo.value);
    }
    data = filterMonthInfo(data, selectedDate);
    setRows(data);
  };
  // 条件变化时筛选列表数据
  const handleFilterRows = useCallback(filterRowsFn, [
    categoryInfo.value,
    selectedDate,
    tallyInfo,
    categories
  ])
  // 初始化账单分类信息
  useEffect(() => {
    setCategoryInfo({
      categoryList: categories,
      value: '',
    });
  }, [categories]);

  useEffect(() => {
    handleFilterRows();
  }, [handleFilterRows]);


  return (
    <>
    <div className={classes.root}>
      <section className={classes.dataPanel}>
        <Typography variant="h4" gutterBottom>
          账单明细
        </Typography>

        <section className={classes.tallySection}>
          <div className={classes.tallySectionPartOne}>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <DatePicker
                variant="inline"
                openTo="month"
                views={["year", "month"]}
                helperText="选择时间范围"
                format="yyyy.MM"
                autoOk={true}
                value={selectedDate}
                onChange={handleDateChange}
              />
            </MuiPickersUtilsProvider>

            <div className={classes.numContainer}>
              <div className={classes.expensePara}>
                支出
                <p className={classes.expense}>{expense}</p>
              </div>
              <div>
                收入
                <p className={classes.income}>{income}</p>
              </div>
            </div>
          </div>
          <div className={classes.tallySectionPartTwo}>
            <FormControl className={classes.formControl}>
              <Select
                className={classes.categorySelect}
                value={categoryInfo.value}
                displayEmpty
                onChange={handleCategoryChange}
              >
                <MenuItem value="">
                全部
                </MenuItem>
                {
                  categoryInfo.categoryList.map(category => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
                    </MenuItem>
                  ))
                }
              </Select>
              <FormHelperText>账单分类筛选</FormHelperText>
            </FormControl>

            <div className={classes.addBtnContainer}>
              <Button variant="contained"
                classes={{
                  label: classes.addBtnLabel
                }}
                onClick={handleAddCategory} color="primary">
                添加分类
              </Button>
              <Button variant="contained"
                classes={{
                  label: classes.addBtnLabel
                }}
                onClick={handleAddBill} color="primary">
                添加账单
              </Button>
            </div>
          </div>
        </section>

        <TableContainer className={classes.tableContainer} component={Paper}>
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>账单时间</TableCell>
                <TableCell align="right">账单类型</TableCell>
                <TableCell align="right">账单分类</TableCell>
                <TableCell align="right">账单金额</TableCell>

              </TableRow>
            </TableHead>
            <TableBody>
              {rows?.map((row, index) => (
                <TableRow key={`${index}-${row.time}`}>
                  <TableCell component="th" scope="row">
                    {formatDate(new Date(row.time))}
                  </TableCell>
                  <TableCell align="right">{row.type}</TableCell>
                  <TableCell align="right">{row.category}</TableCell>
                  <TableCell align="right">{row.amount}</TableCell>
                </TableRow>
              ))}
              {
                rows?.length === 0
                ? <TableRow style={{ height: '200px' }}>
                    <TableCell colSpan={6} className={classes.emptyRow}>暂无数据</TableCell>
                  </TableRow>
                : null
              }
            </TableBody>
          </Table>
        </TableContainer>

      </section>
      <section className={classes.analyzePanel}>
        <TallyAnalyze analyzeData={analyzeData} />
      </section>
      
    </div>
    <AddTallyModal open={open} categories={categories}
      handleClose={handleClose} handleSubmitSuccess={handleAddTallySuccess} />
    </>
  );
}
