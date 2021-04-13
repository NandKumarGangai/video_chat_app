const app = require('express')();
const cors = require('cors');

const USERS = require('./users');

const server = require('http').createServer(app);
const IO = require('socket.io')(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

app.use(cors());

IO.on('connection', (socket) => {
    // When user joins from front end side
    // socket.emit('me', socket.id);

    socket.on('join', ({ name }) => {
        socket.emit('me', socket.id);
        USERS.push({ name, id: socket.id });

        IO.sockets.emit('allUsers', { onlineUsers: USERS });
    });

    socket.on("disconnect", (data) => {
        console.log('dis: ', data);
        // socket.broadcast.emit("callEnded");

        USERS.splice(USERS.findIndex(({ id }) => id === socket.id), 1);
        IO.sockets.emit('allUsers', { onlineUsers: USERS });
    });

    socket.on('callUser', ({ userToCall, signalData, from, name }) => {
        IO.to(userToCall).emit('callUser', { signal: signalData, from, name })
    });

    socket.on('answerCall', data => {
        IO.to(data.to).emit('callAccepted', data.signal);
    });

    socket.on('endCall', data => {
        console.log('callEnded');

        socket.broadcast.emit("callEnded");
    });
});

app.get('/', (req, res) => {
    res.send('Server is running....');
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));