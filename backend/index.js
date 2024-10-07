require('dotenv').config();

const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require("socket.io");

const app = express();

app.use(cors());
app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    },
});

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

const users = {};
const activeUsers = {};
const ADMIN = "Admin";

io.on("connection", (socket) => {
    console.log(' %s sockets connected', io.engine.clientsCount);
    let currentUser = generateRandomUsername();
    console.log('New user', currentUser);
    users[socket.id] = currentUser;
    activeUsers[socket.id] = currentUser;
    io.emit('active_users', Object.values(activeUsers));
    let time = new Date();


    socket.broadcast.emit('new_user', {
        sender: ADMIN,
        time: time,
        message: `${currentUser} joined the chat!`
    });

    socket.emit('welcome_message', {
        username: currentUser,
        sender: ADMIN,
        time: time,
        message: `Welcome! Your username is ${currentUser}.`
    })

    socket.on("send_message", (data) => {
        console.log("Message Received ", data);
        io.emit("receive_message", data);
    });

    socket.on('disconnect', () => {
        console.log("User disconnected!")
        socket.broadcast.emit('user_left', {
            sender: ADMIN,
            time: time,
            message: `${currentUser} has left the chat.`
        });
        delete activeUsers[socket.id];
        io.emit('active_users', Object.values(activeUsers));
    });

    socket.on("connect_error", (err) => { console.log(err.message); });
});

const PORT = 4000;

server.listen(PORT, () => {
    console.log("Server is running on port" + PORT);
});
