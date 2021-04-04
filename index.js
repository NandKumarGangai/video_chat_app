const app = require('express')();
const cors = require('cors');

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
    socket.emit('me', socket.id);

    socket.on("disconnect", () => {
		socket.broadcast.emit("callEnded")
	});

    socket.on('callUser', ({ userToCall, signalData, from, name }) => {
        IO.to(userToCall).emit('callUser', { signal: signalData, from, name })
    });

    socket.on('answerCall', data => {
        IO.to(data.to).emit('callAccepted', data.signal);
    });
});

app.get('/', (req, res) => {
    res.send('Server is running....');
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));