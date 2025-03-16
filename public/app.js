// Initialize socket.io-client
const socket = io();

// Ask for username
let username = localStorage.getItem("username") || prompt("Enter your username:");
localStorage.setItem("username", username);

// Load previous messages from localStorage
const messagesDiv = document.getElementById("messages");
let chatHistory = JSON.parse(localStorage.getItem("chatHistory")) || [];
chatHistory.forEach(displayMessage);

// Generate a unique room ID for this session
let roomId = "room-" + Date.now(); 

// Request chat history from the server when connecting
socket.emit("requestChatHistory");

// Listen for chat history from the server
socket.on("chatHistory", (chatHistory) => {
    messagesDiv.innerHTML = ""; // Clear current messages
    chatHistory.forEach(displayMessage); // Show chat history
});

// Join the room
// Join the user to the unique room after generating a room ID
socket.emit("joinRoom", roomId);

document.getElementById("send-btn").addEventListener("click", sendMessage);
document.getElementById("message").addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMessage();
});

// Send chat message
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
        // Message from the current user
        msgElement.classList.add("sent");
    } else {
        // Message from another user
        msgElement.classList.add("received");
    }

    msgElement.innerHTML = `<strong>${sender}:</strong> ${message}`;
    messagesDiv.appendChild(msgElement);

    // Auto-scroll to latest message
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}
