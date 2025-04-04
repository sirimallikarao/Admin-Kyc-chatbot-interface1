// Admin configuration
const ADMIN_PASSWORD = 'obsidiantech123';
let isAuthenticated = false;
let isPaused = false;
let isHistoryVisible = false;

// Chat history
let chatHistory = [];

// Login function
function login() {
    const password = document.getElementById('adminPassword').value;
    if (password === ADMIN_PASSWORD) {
        isAuthenticated = true;
        document.getElementById('loginOverlay').style.display = 'none';
        addBotMessage('Welcome, admin! How can I assist you today?');
    } else {
        alert('Incorrect password. Please try again.');
    }
}

// Toggle history panel
function toggleHistory() {
    const historyPanel = document.getElementById('historyPanel');
    const chatContainer = document.getElementById('chatContainer');
    const historyToggle = document.getElementById('historyToggle');
    isHistoryVisible = !isHistoryVisible;
    
    if (isHistoryVisible) {
        historyPanel.classList.add('visible');
        chatContainer.classList.add('expanded');
        historyToggle.classList.add('active');
    } else {
        historyPanel.classList.remove('visible');
        chatContainer.classList.remove('expanded');
        historyToggle.classList.remove('active');
    }
}

// Toggle pause
function togglePause() {
    isPaused = !isPaused;
    const pauseButton = document.getElementById('pauseButton');
    pauseButton.textContent = isPaused ? '▶️' : '⏸️';
    addBotMessage(isPaused ? 'Chat paused' : 'Chat resumed');
}

// Add message to chat
function addMessage(message, isUser = false) {
    if (!isAuthenticated) return;
    
    const messagesContainer = document.getElementById('chatMessages');
    const messageElement = document.createElement('div');
    messageElement.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
    messageElement.textContent = message;
    messagesContainer.appendChild(messageElement);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    // Add to history
    if (isUser) {
        const historyItem = {
            message,
            timestamp: new Date().toLocaleTimeString()
        };
        chatHistory.push(historyItem);
        updateHistory();
    }
}

// Add bot message
function addBotMessage(message) {
    addMessage(message, false);
}

// Add user message
function addUserMessage(message) {
    addMessage(message, true);
}

// Update history panel
function updateHistory() {
    const historyPanel = document.getElementById('historyPanel');
    const historyHTML = chatHistory
        .map(item => `
            <div class="history-item" onclick="loadHistoryItem('${item.message}')">
                <div>${item.message}</div>
                <small>${item.timestamp}</small>
            </div>
        `)
        .join('');
    
    // Keep the title and add new history items
    historyPanel.innerHTML = `
        <h2 style="margin-bottom: 1rem;">Chat History</h2>
        ${historyHTML}
    `;
}

// Load history item
function loadHistoryItem(message) {
    document.getElementById('userInput').value = message;
}

// Send message
function sendMessage() {
    if (!isAuthenticated || isPaused) return;

    const input = document.getElementById('userInput');
    const message = input.value.trim();
    
    if (message) {
        addUserMessage(message);
        input.value = '';
        
        // Simulate bot response
        setTimeout(() => {
            const botResponse = `I received your message: "${message}". This is a simulated response.`;
            addBotMessage(botResponse);
        }, 1000);
    }
}

// Handle enter key
document.getElementById('userInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

// Initialize webhook (you can customize this based on your needs)
const webhook = {
    url: 'YOUR_WEBHOOK_URL',
    send: async (data) => {
        try {
            const response = await fetch(webhook.url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            return response.json();
        } catch (error) {
            console.error('Webhook error:', error);
        }
    }
};