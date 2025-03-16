const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const path = require('path');
const { v4: uuidv4 } = require('uuid'); // Import uuid for unique room IDs

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Store chat history
let chatHistory = [];

io.on("connection", (socket) => {
    console.log("A user connected");

    // Generate a unique room ID for this pair of users (this can be customized)
    let roomId = uuidv4(); // Create a unique room ID for each user pair

    // Store the user's socket in the room
    socket.join(roomId);
    console.log(`User joined room: ${roomId}`);

    // Send stored chat history to the new user when they first connect
    socket.emit("chatHistory", chatHistory);

    // Listen for a 'chatMessage' event from the client
    socket.on("chatMessage", (chatData) => {
        console.log('Message received: ', chatData);

        // Add the new message to the chat history
        chatHistory.push(chatData);

        // Emit the message only to the specific room
        io.to(roomId).emit("chatMessage", chatData); // Send message to the room
    });

    // Handle user disconnect
    socket.on("disconnect", () => {
        console.log("A user disconnected");
    });
});

const PORT = 3001;
server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
