import React, {useEffect, useRef, useState} from 'react';
import Grid from '@mui/material/Grid2';
import { Box, Paper, TextField, IconButton, List, ListItem, ListItemText, Divider, Typography } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import Message from "./Message";

const getTime = (now) => {
    now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
}

const ChatBox = ({socket}) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [currentUser, setCurrentUser] = useState('');
    const messageEndRef = useRef(null);

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
            console.log(data.message);
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

    React.useEffect(() => {
        scrollToBottom();
    }, [messages]);


    return (
        <Grid container sx={{ height: '100%', width: '100%', justifyContent: 'center', alignItems: 'center', backgroundColor: '#b2dfdb'}}>
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
                    <Box sx={{ padding: '10px', backgroundColor: '#00796b', color: 'white' }}>
                        <Typography variant="h5" align="center">Chat</Typography>
                    </Box>

                    <Grid item sx={{ flexGrow: 1, overflowY: 'auto', padding: '16px' }}>
                        <List>
                            {messages.map((message, index) => (
                                <ListItem key={index}>
                                    <Message data={message} currentUser={currentUser}></Message>
                                </ListItem>
                            ))}
                        </List>
                        <div ref={messageEndRef} />
                    </Grid>

                    <Divider />

                    {/* Input Area */}
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
