import React, { createContext, useState, useRef } from 'react';
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
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [userStream, setUserStream] = useState(null);

    const myVideo = useRef();
    const userVideo = useRef();
    const connectionRef = useRef();

    const leaveCallAction = () => {
        setCallEnded(true);

        if (connectionRef.current) {
            connectionRef.current.destroy();
        }
        window.location.assign('/');
    };

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

        socket.on('callEnded', () => { console.log('call End called'); leaveCallAction()});

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
            setUserStream(currentStream);
            if (userVideo.current) {
                userVideo.current.srcObject = currentStream;
            }
        });

        peer.on('disconnected', () => { console.log('Called user disconnected') });

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
            setUserStream(stream);
            userVideo.current.srcObject = stream;
        });

        peer.on('disconnected', () => { console.log('Answered user disconnected') });

        peer.signal(call.signal);

        connectionRef.current = peer;
    };
    
    const leaveCall = () => {
        socket.emit('endCall', () => {});

        leaveCallAction();
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
            onlineUsers,
            userStream
        }}>
            { children}
        </SocketContext.Provider>
    )
}

export default ContextProvider;
