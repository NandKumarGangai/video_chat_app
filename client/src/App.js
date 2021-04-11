import React, { useContext, Suspense, lazy } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Redirect, Route } from "react-router-dom";
import { SocketContext } from './Context';
import SpinnerLoader from './components/SpinnerLoader';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'center',
    minHeight: '95vh'
  },
}));

const navigateTo = (history, to) => history.push(to);
const JoinConference = lazy(() => import('./components/JoinConference'));
const ConferencePage = lazy(() => import('./components/ConferencePage'));

const App = () => {
  const classes = useStyles();
  const { name } = useContext(SocketContext);

  const joinConferenceProps = {
    navigateTo
  }

  return (
    <Suspense fallback={() => <SpinnerLoader />}>
    <div className={classes.root}>
      <Route
        exact path={['/', '/join']}
        render={(props) => <JoinConference {...props} {...joinConferenceProps} />}
      />
      <Route
        exact path={['/meeting']}
        render={(props) => name ? <ConferencePage {...props} /> : <Redirect to='/' />}
      />
    </div>
    </Suspense>
  );
}

export default App;
