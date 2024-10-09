import io from 'socket.io-client';
import {useEffect, useState} from "react";

const SERVER = process.env.REACT_APP_SERVER;
const useSocket = () => {
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const newSocket = io(SERVER, {
            withCredentials: true,
            transports: ['websocket'],
        });
        setSocket(newSocket);
        return () => {
            newSocket.disconnect();
        };
    }, []);

    return socket;
};

export default useSocket;