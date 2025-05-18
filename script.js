document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const openChatbotBtn = document.getElementById('open-chatbot');
    const closeBtn = document.querySelector('.close-btn');
    const chatbotModal = document.querySelector('.chatbot-modal');
    const messageInput = document.querySelector('.message-input textarea');
    const sendButton = document.querySelector('.send-button');
    const chatMessages = document.getElementById('chat-messages');
    
    // API Configuration
    const API_KEY = "AIzaSyBgrbRW8-VCZ6V9M-KaRsRvS5oCCZPyNbY";
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;
    
    // Open Chatbot Modal
    openChatbotBtn.addEventListener('click', () => {
        chatbotModal.classList.add('active');
        document.querySelector('.landing-page').style.display = 'none';
    });
    
    // Close Chatbot Modal
    closeBtn.addEventListener('click', () => {
        chatbotModal.classList.remove('active');
        document.querySelector('.landing-page').style.display = 'block';
    });
    
    // Auto-resize textarea
    messageInput.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
    });
    
    // Handle sending messages
    function handleSendMessage() {
        const message = messageInput.value.trim();
        if (!message) return;
        
        // Add user message to chat
        addMessage(message, 'user-message');
        messageInput.value = '';
        messageInput.style.height = 'auto';
        
        // Show "typing" indicator
        const typingIndicator = document.createElement('div');
        typingIndicator.className = 'message-bubble ai-message typing';
        typingIndicator.innerHTML = '<div class="typing-dots"><span></span><span></span><span></span></div>';
        chatMessages.appendChild(typingIndicator);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        // Generate AI response
        generateAIResponse(message)
            .then(response => {
                // Remove typing indicator
                chatMessages.removeChild(typingIndicator);
                // Add AI response
                addMessage(response, 'ai-message');
            })
            .catch(error => {
                console.error('Error:', error);
                chatMessages.removeChild(typingIndicator);
                addMessage("Sorry, I'm having trouble responding. Please try again later.", 'ai-message error');
            });
    }
    
    // Add message to chat
    function addMessage(text, className) {
        const messageElement = document.createElement('div');
        messageElement.className = `message-bubble ${className}`;
        messageElement.innerHTML = `<p>${text}</p>`;
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Generate AI response
    async function generateAIResponse(prompt) {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    role: 'user',
                    parts: [{ text: prompt }]
                }]
            })
        };
        
        const response = await fetch(API_URL, requestOptions);
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error?.message || 'Failed to get response');
        }
        
        return data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g, '$1');
    }
    
    // Event Listeners
    sendButton.addEventListener('click', handleSendMessage);
    
    messageInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    });
    
    // Close modal when clicking outside
    chatbotModal.addEventListener('click', function(e) {
        if (e.target === chatbotModal) {
            chatbotModal.classList.remove('active');
            document.querySelector('.landing-page').style.display = 'block';
        }
    });
});