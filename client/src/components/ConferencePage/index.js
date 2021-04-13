import { useEffect, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';

import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';

import VideoPlayer from './VideoPlayer';
import Notifications from './Notifications';
import OnlineUsers from './OnlineUsers';

import { SocketContext } from '../../Context';

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
        margin: 'auto',
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

const ConferencePage = () => {
    const classes = useStyles();
    const { initiateWebcamAndMicrophone } = useContext(SocketContext);

    useEffect(() => {
        initiateWebcamAndMicrophone();
    }, []); // eslint-disable-line
    return (
        <div>
            <AppBar position="static" className={classes.appBar}>
                <Typography variant="h6" color="inherit" className={classes.margin}>
                    {'Video Chat'}
                </Typography>
            </AppBar>
            <VideoPlayer />
            {/* <Sidebar /> */}
            <Notifications />
            <OnlineUsers />
        </div>
    )
};

export default ConferencePage
