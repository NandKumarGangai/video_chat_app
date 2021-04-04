import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';

import VideoPlayer from './components/VideoPlayer';
import Sidebar from './components/SideBar';
import Notifications from './components/Notifications';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
  },
  appBar: {
    borderRadius: 15,
    border: 'none',
    outline: 'none',
    margin: '30px 100px',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '80%',
    padding: '0.5rem',

    [theme.breakpoints.down('xs')]: {
      width: '90%',
    },
  },
}));

const App = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar position="static" className={classes.appBar}>
        <Typography variant="h6" color="inherit" className={classes.margin}>
          {'Video Chat'}
        </Typography>
      </AppBar>
      <VideoPlayer />
      <Sidebar />
      <Notifications />
    </div>
  );
}

export default App;
