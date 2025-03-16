const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Store chat history
let chatHistory = [];

io.on("connection", (socket) => {
    console.log("A user connected");

    // Send stored chat history to the new user when they first connect
    socket.emit("chatHistory", chatHistory);

    // Listen for a 'requestChatHistory' event from the client
    socket.on("requestChatHistory", () => {
        // Send the chat history back to the client
        socket.emit("chatHistory", chatHistory);
    });

    // Listen for a new chat message from the client
    socket.on("chatMessage", (chatData) => {
        chatHistory.push(chatData); // Store the new message in chat history
        io.emit("chatMessage", chatData); // Broadcast the message to all users
    });

    // Handle user disconnect
    socket.on("disconnect", () => {
        console.log("A user disconnected");
    });
});

const PORT = 3000;
server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
