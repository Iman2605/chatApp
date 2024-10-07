import React, {useEffect, useRef, useState} from 'react';
import Grid from '@mui/material/Grid2';
import { Box, Paper, TextField, IconButton, List, ListItem, ListItemText, Divider, Typography } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import Message from "./Message";
import axios from 'axios';
import Cookies from 'js-cookie';


const getTime = (now) => {
    now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
}
/*
const generateRandomUsername = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let username = '';
    const length = 6;
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        username += characters[randomIndex];
    }
    return username;
}
*/
const ChatBox = ({socket}) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [currentUser, setCurrentUser] = useState('');
    const messageEndRef = useRef(null);

  /*  useEffect(() => {
        const savedUser = Cookies.get('username');
        if (savedUser) {
            setCurrentUser(savedUser);
            socket.emit('set_username', { username: savedUser });
        } else {
            const username = generateRandomUsername();
            setCurrentUser(username);
            Cookies.set('username', username, { expires: 7 });
            socket.emit('set_username', { username });
        }
    }, []); */

   /* useEffect(() => {
        // Check if the username cookie exists
        let username = Cookies.get('username');

        if (!username) {
            // If not, listen for the 'set-cookie' event from the server
            socket.on('set-cookie', (generatedUsername) => {
                // Set the cookie with the username received from the server
                Cookies.set('username', generatedUsername, { expires: 7 }); // Cookie expires in 7 days
                console.log(`Username set: ${generatedUsername}`);
            });
        } else {
            console.log(`Existing username: ${username}`);
        }
    }, []);
    */


    useEffect(() => {
        axios.get('http://localhost:4000/messages')
            .then((response) => {
                setMessages(response.data);
            })
            .catch((error) => {
                console.error('Error loading old messages:', error);
            });
    }, []);


    useEffect(() => {
        if (!socket) return;

        socket.on('new_user', (data) => {
            setMessages((prevMessages) => [
                ...prevMessages,
                {
                    sender: data.sender,
                    time: getTime(data.time),
                    message: data.message,
                },
            ]);
        });

        socket.on('welcome_message', (data) => {
            setCurrentUser(data.username);
            setMessages((prevMessages) => [
                ...prevMessages,
                {
                    sender: data.sender,
                    time: getTime(data.time),
                    message: data.message,
                },
            ]);
        });

        socket.on('receive_message', (data) => {
            console.log(data.message);
            setMessages((prevMessages) => [
                ...prevMessages,
                {
                    sender: data.sender,
                    time: getTime(data.time),
                    message: data.message,
                },
            ]);
        });

        socket.on('user_left', (data) => {
            console.log(data.message);
            setMessages((prevMessages) => [
                ...prevMessages,
                {
                    sender: data.sender,
                    time: getTime(data.time),
                    message: data.message,
                },
            ]);
        });

        return () => {
            socket.off('new_user');
            socket.off('welcome_message');
            socket.off('receive_message');
            socket.off('user_left');
        };
    }, [socket]);

    const handleSend = () => {
        if (newMessage.trim()) {
            const time = getTime(new Date());
            socket.emit('send_message', {sender: currentUser, time: time, message: newMessage});
            setNewMessage('');
        }
    };

    const scrollToBottom = () => {
        messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);


    return (
        <Grid container
              sx={{ height: '100%',
                  width: '100%',
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: '#b2dfdb',
                  padding: '20px 0'}}>
            <Grid item  sx={{ height: '100%', width: '100%'}}>
                <Paper
                    square={false}
                    elevation={3}
                    sx={{
                        height: '100%',
                        width: '80%',
                        display: 'flex',
                        flexDirection: 'column',
                        margin: 'auto',
                    }}
                >
                    <Box sx={{padding: '10px', backgroundColor: '#00796b', color: 'white', borderRadius: '5px 5px 0 0' }}>
                        <Typography variant="h5" align="center">Chat</Typography>
                    </Box>

                    <Grid item sx={{ flexGrow: 1, overflowY: 'auto', padding: '16px' }}>
                        <List>
                            {messages?.map((message, index) => (
                                <ListItem key={index}>
                                    <Message data={message} currentUser={currentUser}></Message>
                                </ListItem>
                            ))}
                        </List>
                        <div ref={messageEndRef} />
                    </Grid>

                    <Divider />

                    <Grid item sx={{ padding: '10px', display: 'flex', alignItems: 'center' }}>
                        <TextField
                            label="Type your message"
                            variant="outlined"
                            fullWidth
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSend();
                            }}
                        />
                        <IconButton color="primary" onClick={handleSend}>
                            <SendIcon />
                        </IconButton>
                    </Grid>
                </Paper>
            </Grid>
        </Grid>
    );
};

export default ChatBox;
