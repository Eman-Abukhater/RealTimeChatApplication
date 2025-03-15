// import modules
const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const path = require('path');

// initialize express app
const app = express();
const server = http.createServer(app);
const io = new Server(server);

// set static folder
app.use(express.static(path.join(__dirname, 'public')));


// socket.io connection
io.on("connection", (socket) => {
    console.log("A user connected");

    socket.on("chatMessage", (chatData) => {
        io.emit("chatMessage", chatData); // Send message to everyone
    });

    socket.on("disconnect", () => {
        console.log("A user disconnected");
    });
});


// set port
const PORT = 3000;

// start server
server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));


