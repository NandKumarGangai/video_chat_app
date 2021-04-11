import React, { useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { SocketContext } from '../../Context';
import { withRouter } from 'react-router';

const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            margin: theme.spacing(1),
            width: '25ch',
        },
    },
    margin: {
        margin: theme.spacing(1),
        marginLeft: '0'
    },
}));

const JoinConference = ({ history, navigateTo }) => {
    const classes = useStyles();
    const { name, setName } = useContext(SocketContext);
    return (
        <div>
            <div className={classes.root}>
                <div>
                    <TextField
                        id="name"
                        label="Name"
                        variant='outlined'
                        placeholder='Enter your name....'
                        onChange={({ target }) => setName(target.value)} />
                </div>
                <div>
                    <Button
                        variant="contained"
                        size="medium"
                        color="primary"
                        fullWidth
                        className={classes.margin}
                        disabled={!name}
                        onClick={ () => navigateTo(history, '/meeting')}
                    >
                        {'Join'}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default withRouter(JoinConference);