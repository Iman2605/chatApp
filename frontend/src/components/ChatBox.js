import React, { useState } from 'react';
import Grid from '@mui/material/Grid2';
import { Box, Paper, TextField, IconButton, List, ListItem, ListItemText, Divider, Typography } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import socketClient  from "socket.io-client";
import Message from "./Message";


const SERVER = "http://127.0.0.1:4000";

const ChatBox = () => {
    var socket = socketClient (SERVER);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');

    const handleSend = () => {
        if (newMessage.trim()) {
            setMessages([...messages, { text: newMessage, time: new Date().toLocaleTimeString() }]);
            setNewMessage('');
        }
    };

    const messageEndRef = React.useRef(null);

    const scrollToBottom = () => {
        messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    React.useEffect(() => {
        scrollToBottom();
    }, [messages]);


    return (
        <Box sx={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Paper
                elevation={3}
                sx={{
                    width: { xs: '95%', sm: '80%', md: '60%' },
                    height: '80vh',
                    display: 'flex',
                    flexDirection: 'column',
                    margin: 'auto',
                }}
            >
                <Box sx={{ padding: '10px', backgroundColor: '#3f51b5', color: 'white' }}>
                    <Typography variant="h5" align="center">Chat</Typography>
                </Box>

                <Box sx={{ flexGrow: 1, overflowY: 'auto', padding: '16px' }}>
                    <List>
                        {messages.map((message, index) => (
                            <ListItem key={index}>
                                <Message message={message}></Message>
                            </ListItem>
                        ))}
                    </List>
                    <div ref={messageEndRef} />
                </Box>

                <Divider />

                <Box sx={{ padding: '10px', display: 'flex', alignItems: 'center' }}>
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
                </Box>
            </Paper>
        </Box>
    );
};

export default ChatBox;
