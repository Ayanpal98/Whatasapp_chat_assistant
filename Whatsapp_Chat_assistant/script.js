// 1. UI Elements
const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');

// 2. State Management (LocalStorage for Memory)
let userSession = {
    userName: localStorage.getItem('chat_user_name') || null,
};

// 3. Helper: Time-based Greeting
function getGreeting() {
    const hours = new Date().getHours();
    if (hours < 12) return "Good morning";
    if (hours < 18) return "Good afternoon";
    return "Good evening";
}

// 4. Focused Knowledge Base
const knowledgeBase = [
    {
        keywords: ["pricing", "cost", "price"],
        response: () => "💰 Our Basic plan is free, and Pro is $19/mo. Both include 24/7 support!"
    },
    {
        keywords: ["services", "offer", "do", "help"],
        response: () => "🛠 We offer Web Development, UI/UX Design, and Mobile App creation."
    },
    {
        keywords: ["hours", "time", "open", "available"],
        response: () => "🕒 Our digital assistant is here 24/7. Office hours are Mon-Fri, 9am-6pm."
    },
    {
        keywords: ["hi", "hello", "hey"],
        response: () => userSession.userName
            ? `Welcome back, ${userSession.userName}! How can I assist you?`
            : `Hello! I'm your assistant. What's your name?`
    },
    {
        keywords: ["my name is", "call me", "i am"],
        response: (input) => {
            const words = input.trim().split(" ");
            const name = words[words.length - 1];
            userSession.userName = name;
            localStorage.setItem('chat_user_name', name);
            return `Nice to meet you, ${name}! Memory updated. ✅`;
        }
    }
];

// 5. Appending Messages with Ticks and Time
function appendMessage(text, type) {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('message', type);

    const now = new Date();
    const timeString = now.getHours().toString().padStart(2, '0') + ":" +
                       now.getMinutes().toString().padStart(2, '0');

    // Ticks: Blue for outgoing, Gray for incoming
    const ticksHtml = '<span class="ticks">✓✓</span>';

    msgDiv.innerHTML = `
        <div class="msg-container">
            <span class="text">${text}</span>
            <div class="status-meta">
                <span class="timestamp">${timeString}</span>
                ${ticksHtml}
            </div>
        </div>
    `;

    chatBox.appendChild(msgDiv);
    chatBox.scrollTo({ top: chatBox.scrollHeight, behavior: 'smooth' });
    return msgDiv;
}

// 6. Response Logic
function getBotResponse(text) {
    const input = text.toLowerCase().trim();

    if (input.includes("my name is") || input.includes("call me")) {
        return knowledgeBase.find(k => k.keywords.includes("my name is")).response(text);
    }

    for (let entry of knowledgeBase) {
        if (entry.keywords.some(k => input.includes(k))) {
            return typeof entry.response === "function" ? entry.response() : entry.response;
        }
    }

    return "I'm designed to help with <b>Pricing</b>, <b>Services</b>, or <b>Hours</b>. Use the buttons below!";
}

// 7. Event Handlers
function handleMessage() {
    const text = userInput.value.trim();
    if (text === "") return;

    appendMessage(text, 'outgoing');
    userInput.value = "";

    const typing = appendMessage("...", "incoming");

    setTimeout(() => {
        typing.remove();
        const response = getBotResponse(text);
        appendMessage(response, 'incoming');
    }, 800);
}

function quickAction(text) {
    userInput.value = text;
    handleMessage();
}

// 8. Listeners
sendButton.addEventListener('click', handleMessage);
userInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') handleMessage(); });

// 9. Initialization (One-Liner)
window.onload = () => {
    chatBox.innerHTML = "";
    setTimeout(() => {
        const msg = userSession.userName
            ? `Welcome back, <b>${userSession.userName}</b>! ${getGreeting()}. How can I help with our <b>Services</b>, <b>Pricing</b>, or <b>Hours</b>?`
            : `Hello! ${getGreeting()}. I am your assistant. Tell me your name or ask about <b>Services</b>, <b>Pricing</b>, or <b>Hours</b>.`;
        appendMessage(msg, 'incoming');
    }, 500);
};