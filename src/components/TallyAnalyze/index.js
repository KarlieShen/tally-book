import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles(theme => ({
  root: {
    width: '35%',
    marginTop: '2rem',
    [theme.breakpoints.up('md')]: {
      marginTop: 0,
    },
  },
}));

export default function TallyAnalyze({analyzeData}) {
  const { data, total } = analyzeData;
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Typography variant="h4" gutterBottom>
        支出排行
      </Typography>
      {
        data.length > 0
        ? data.map(item => (
            <React.Fragment key={item.categoryId}>
              <p>{item.category}  共{item.frequency}笔  占比：{(item.number)/(total)*100}%</p>
              <LinearProgress variant="determinate" value={(item.number)/(total)*100} />
            </React.Fragment>
          ))
        : <Typography variant="h6" gutterBottom>
            暂无数据
          </Typography>
      }
    </div>
  );
}