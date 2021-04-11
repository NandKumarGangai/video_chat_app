import React, { createContext, useState, useRef, useEffect } from 'react';
import { io } from 'socket.io-client';
import Peer from 'simple-peer';

export const SocketContext = createContext();

// const socket = io('http://localhost:5000');
const socket = io('https://video-chat-app-ng.herokuapp.com/');

const ContextProvider = ({ children }) => {
    const [stream, setStream] = useState(null);
    const [call, setCall] = useState({});
    const [me, setMe] = useState('');
    const [callAccepted, setCallAccepted] = useState(false);
    const [name, setName] = useState('');
    const [callEnded, setCallEnded] = useState(false);
    const [ onlineUsers, setOnlineUsers ] = useState([]);

    const myVideo = useRef();
    const userVideo = useRef();
    const connectionRef = useRef();

    // socket.on('me', (id) => {
    //     console.log('client socket called outside: ', id);
    //     setMe(id);
    // });

    // socket.on('allUsers', ({ onlineUsers }) => console.log('onlineUsers: ', onlineUsers))

    // useEffect(() => {
    //     socket.emit('join', { name, id: me }, () => {});

    //     socket.on('me', id => setMe(id));

    //     socket.on('callUser', ({ from, name: callerName, signal }) => {
    //         setCall({ isReceivingCall: true, from, name: callerName, signal });
    //     });
    // }, []);

    const initiateWebcamAndMicrophone = () => {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then(currentStream => {
                setStream(currentStream);

                myVideo.current.srcObject = currentStream;
            })
            .catch(err => console.trace('Webcam error: ', err));

        socket.emit('join', { name }, () => { });

        socket.on('me', (id) => {
            console.log('client socket called inside: ', id);
            setMe(id);
        });

        socket.on('broadcast', (data) => console.log(data, 'broadcast'));
        socket.on('allUsers', ({ onlineUsers }) => setOnlineUsers(onlineUsers));

        socket.on('callUser', ({ from, name: callerName, signal }) => {
            setCall({ isReceivingCall: true, from, name: callerName, signal });
        });
    };

    const callUser = id => {
        const peer = new Peer({
            initiator: true,
            trickle: false,
            stream
        });

        peer.on('signal', (data) => {
            socket.emit('callUser', {
                userToCall: id,
                signalData: data,
                from: me,
                name
            });
        });

        peer.on('stream', currentStream => {
            userVideo.current.srcObject = currentStream;
        });

        socket.on('callAccepted', (signal) => {
            setCallAccepted(true);

            peer.signal(signal);
        });

        connectionRef.current = peer;
    };

    const answerCall = () => {
        setCallAccepted(true);

        const peer = new Peer({
            initiator: false,
            trickle: false,
            stream
        });

        peer.on('signal', signal => {
            socket.emit('answerCall', { signal, to: call.from });
        });

        peer.on('stream', (stream) => {
            userVideo.current.srcObject = stream;
        });

        peer.signal(call.signal);

        connectionRef.current = peer;
    };

    const leaveCall = () => {
        setCallEnded(true);

        connectionRef.current.destroy();

        window.location.reload();
    };

    return (
        <SocketContext.Provider value={{
            call,
            callAccepted,
            myVideo,
            userVideo,
            stream,
            name,
            setName,
            callEnded,
            me,
            callUser,
            leaveCall,
            answerCall,
            initiateWebcamAndMicrophone,
            onlineUsers
        }}>
            { children}
        </SocketContext.Provider>
    )
}

export default ContextProvider;
