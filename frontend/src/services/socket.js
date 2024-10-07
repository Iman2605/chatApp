import io from 'socket.io-client';
import {useEffect, useState} from "react";

const SERVER = "http://127.0.0.1:4000";

const useSocket = () => {
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const newSocket = io(SERVER);
        setSocket(newSocket);
        console.log('New user from frontend');

        return () => {
            newSocket.disconnect();
        };
    }, []);

    return socket;
};

export default useSocket;