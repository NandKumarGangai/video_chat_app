import React, { useContext } from 'react';
import { Button, Container, Paper, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import VideoCallIcon from '@material-ui/icons/VideoCall';
import PhoneDisabled from '@material-ui/icons/PhoneDisabled';

import { SocketContext } from '../../Context';

const useStyles = makeStyles((theme) => ({
    container: {
        width: '600px',
        margin: 'auto',
        padding: 0,
        [theme.breakpoints.down('xs')]: {
            width: '80%',
        },
    },
    paper: {
        padding: '10px 20px',
        border: '2px solid black',
    },
    list: {
        display: 'flex',
        justifyContent: 'space-between'
    }
}));

const OnlineUsers = () => {
    const { onlineUsers, callAccepted, callEnded, leaveCall, callUser, me } = useContext(SocketContext); // eslint-disable-line
    const classes = useStyles();
    console.log('online: ', onlineUsers)
    return (
        <Container className={classes.container}>
            <Paper elevation={10} className={classes.paper}>
                <Typography variant='h5'>
                    {'Online users: '}
                </Typography>
                {
                    !(onlineUsers.length === 1 && onlineUsers[0].id === me) || onlineUsers.length === 0 ?
                        (<List dense>
                            {onlineUsers.map((user) => {
                                const { id, name: userName } = user;
                                return (
                                    id !== me &&
                                    (<ListItem key={id} button>
                                        <ListItemText id={id}>
                                            <div className={classes.list}>
                                                <div>
                                                    <Typography>
                                                        {userName}
                                                    </Typography>
                                                </div>
                                                <div>
                                                    <Button
                                                        variant="contained"
                                                        color="primary"
                                                        startIcon={<VideoCallIcon fontSize="large" />}
                                                        onClick={() => callUser(id)}
                                                    >
                                                        {'Call'}
                                                    </Button>
                                                </div>
                                                <div>
                                                    {
                                                    (callAccepted && !callEnded) && (
                                                        <Button
                                                        variant="contained"
                                                        color="secondary"
                                                        startIcon={<PhoneDisabled fontSize="large" />}
                                                        onClick={leaveCall} className={classes.margin}>
                                                            {'Hang Up'}
                                                        </Button>
                                                    )
                            }
                                                </div>
                                            </div>
                                        </ListItemText>
                                    </ListItem>)
                                );
                            })}
                        </List>)
                        : (
                            <Typography variant='p'>
                                {'No one is online at this moment.'}
                            </Typography>
                        )
                }
            </Paper>
        </Container>
    );
};

export default OnlineUsers;

