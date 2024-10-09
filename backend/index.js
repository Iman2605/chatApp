const pool = require('./db_connection');
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require("socket.io");
const messageRoutes = require('./routes/messages');
const cookieParser = require('cookie-parser');
const { serialize, parse } = require("cookie");
require('./db_init');

const app = express();

const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use('/', messageRoutes);

const server = http.createServer(app);

const io = new Server(server, {
    cookie: true,
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true
    }
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
let currentUser;

io.engine.on("initial_headers", (headers, request) => {
    const cookies = request.headers.cookie ? parse(request.headers.cookie) : {};
    console.log("Cookies: " , cookies);
    if (!cookies.username) {
        const newUsername = generateRandomUsername();
        currentUser = newUsername;
        pool.query('INSERT INTO "user" (username) VALUES ($1);', [currentUser], (err) =>  {
            if (err) {
                console.error('Error creating user:', err);
            } else {
                console.log('User added to db:', currentUser);
            }
        });

        headers["set-cookie"] = serialize("username", newUsername, {
            path: '/',
            httpOnly: true,
            sameSite: 'None',
            secure: true,
            maxAge: 7 * 24 * 60 * 60

        });

        io.emit('set_cookie', {username: newUsername});

    } else {
        currentUser = cookies.username;
    }
});

io.on("connection", (socket) => {
    const cookies = socket.handshake.headers.cookie ? parse(socket.handshake.headers.cookie) : {};
    currentUser = cookies.username || currentUser;
    let time = new Date();

    if (!Object.values(activeUsers).includes(currentUser)) {
        activeUsers[socket.id] = currentUser;
    }

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
    });

    socket.on("send_message", (data) => {
        io.emit("receive_message", data);
        console.log('message data ', data);

        pool.query('SELECT user_id FROM "user" WHERE username=$1;', [data.sender], (err, result) => {
            if (err) {
                console.error('Error getting user_id:', err);
            } else {
                console.log(result.rows);
                const sender_id = result.rows[0].user_id;
                pool.query('INSERT INTO message (text, sender, time) VALUES ($1, $2, TO_TIMESTAMP($3, \'HH24:MI\')::TIME);',
                    [data.message, sender_id, data.time], (err) =>  {
                    if (err) {
                        console.error('Error adding message:', err);
                    } else {
                        console.log('Message added');
                    }
                });
            }
        });
    });

    socket.on('disconnect', () => {
        console.log("User disconnected!");
        delete activeUsers[socket.id];
        socket.broadcast.emit('user_left', {
            sender: ADMIN,
            time: time,
            message: `${currentUser} has left the chat.`
        });

        io.emit('active_users', Object.values(activeUsers));
    });

    socket.on("connect_error", (err) => { console.log(err.message); });
});

const PORT = 4000;

server.listen(PORT, () => {
    console.log("Server is running on port " + PORT);
});
