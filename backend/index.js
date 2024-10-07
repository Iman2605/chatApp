require('dotenv').config();

const pool = require('./db_connection')
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

const activeUsers = {};
const ADMIN = "Admin";

io.on("connection", (socket) => {
    let time = new Date();
    let currentUser = generateRandomUsername();
    activeUsers[socket.id] = currentUser;

    console.log(' %s sockets connected', io.engine.clientsCount);
    console.log('New user', currentUser);

    pool.query('INSERT INTO "user" (username) VALUES ($1);', [currentUser], (err) =>  {
        if (err) {
            console.error('Error creating user:', err);
        } else {
            console.log('User created:', currentUser);
        }
    });

    io.emit('active_users', Object.values(activeUsers));

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
        io.emit("receive_message", data);


        pool.query('SELECT user_id FROM "user" where username=$1;', [data.sender], (err, result) => {
            if(err) {
                console.error('Error getting user_id;', err)
            } else {
                const sender_id = result.rows[0].user_id;
                pool.query('INSERT INTO message (text, sender, time) VALUES ($1, $2, $3);', [data.message, sender_id, data.time], (err) =>  {
                    if (err) {
                        console.error('Error adding message:', err);
                    } else {
                        console.log('Message added');
                    }
                });
            }
        })

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
    console.log("Server is running on port " + PORT);
});
