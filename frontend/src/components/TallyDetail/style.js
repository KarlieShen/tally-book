import { makeStyles } from '@material-ui/core/styles';

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

export default useStyles;