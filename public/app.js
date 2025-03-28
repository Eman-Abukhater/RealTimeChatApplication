// Initialize socket.io-client
const socket = io();

// Ask for username
let username = localStorage.getItem("username") || prompt("Enter your username:");
localStorage.setItem("username", username);

// Load previous messages from localStorage
const messagesDiv = document.getElementById("messages");
let chatHistory = JSON.parse(localStorage.getItem("chatHistory")) || [];
chatHistory.forEach(displayMessage);

// Request chat history from the server when connecting
socket.emit("requestChatHistory");

// Listen for chat history from the server
socket.on("chatHistory", (chatHistory) => {
    messagesDiv.innerHTML = ""; // Clear current messages
    chatHistory.forEach(displayMessage); // Show chat history
});

// Wait for the server to assign a room ID
socket.on("assignRoom", (roomId) => {
    socket.emit("joinRoom", roomId); // Join the assigned room
    console.log(`Joined room: ${roomId}`);
});

// Send chat message
document.getElementById("send-btn").addEventListener("click", sendMessage);
document.getElementById("message").addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMessage();
});

function sendMessage() {
    const messageInput = document.getElementById("message");
    const message = messageInput.value.trim();
    
    if (message) {
        const chatData = { username, message };
        socket.emit("chatMessage", chatData); // Send message to server
        messageInput.value = "";
    }
}

// Receive chat message
socket.on("chatMessage", (chatData) => {
    displayMessage(chatData);
    chatHistory.push(chatData);
    localStorage.setItem("chatHistory", JSON.stringify(chatHistory));
});

// Display chat message
function displayMessage({ username: sender, message }) {
    const msgElement = document.createElement("div");
    msgElement.classList.add("message");

    if (sender === username) {
        msgElement.classList.add("sent"); // Message from the current user
    } else {
        msgElement.classList.add("received"); // Message from another user
    }

    msgElement.innerHTML = `<strong>${sender}:</strong> ${message}`;
    messagesDiv.appendChild(msgElement);

    // Auto-scroll to latest message
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}
