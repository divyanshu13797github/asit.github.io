document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const elements = {
        icon: document.getElementById('chatbot-icon'),
        window: document.getElementById('chatbot-window'),
        close: document.getElementById('chatbot-close'),
        messages: document.getElementById('chatbot-messages'),
        input: document.getElementById('user-input'),
        sendBtn: document.getElementById('send-button')
    };

    // Check if all elements exist
    if (!elements.icon || !elements.window || !elements.close || 
        !elements.messages || !elements.input || !elements.sendBtn) {
        console.error("One or more chatbot elements not found!");
        return;
    }

    // User data and state
    const userData = {
        name: '',
        mobile: ''
    };
    let currentStep = 'name'; // name -> mobile -> normal

    // EmailJS configuration
    const emailConfig = {
        serviceId: 'service_wxb71i4', // Replace with your service ID
        templateId: 'template_yhuthkv', // Replace with your template ID
        recipient: 'asitedutech@gmail.com'
    };

    // Chat configuration
    const chatConfig = {
        questions: [
            "What courses do you offer?",
            "How to apply for admission?",
            "What is the fee structure?",
            "Do you have hostel facilities?",
            "What are the eligibility criteria?",
            "Is the institute government recognized?",
            "What are the class timings?",
            "Do you provide placement assistance?",
            "What is the course duration?",
            "Do you offer online classes?"
        ],
        responses: {
            "courses": "We offer:\n- BSc in Computer Science\n- MBA\n- BCA\n- B.Com\n- PGDCA\n- 'O'Level\nand other specialized courses",
            "apply": "You can apply by visiting our campus admission office with required documents",
            "fee": "Fee structure:\n- 'O' Level: ₹6000/+ Exam Fee per semester\n- ADCA: ₹5000+ Exam Fee per semester\n- BCA: ₹20,000+Exam Fee per semester",
            "hostel": "Currently we don't have hostel facilities for students",
            "eligibility": "Eligibility varies by course:\n- For UG courses: 10+2 pass\n- For PG courses: Graduation\n- For diploma courses: 10th pass",
            "recognition": "Yes, we are recognized by:\n- National Institute of Electronics & IT (NIELIT)\n- Rajiv Gandhi Computer Saksharta Mission\n- Swami Vivekanand Subharti University",
            "timings": "Regular batches:\nMorning: 8AM-12PM\nEvening: 4PM-8PM\nWeekend batches also available",
            "placement": "We provide 100% placement assistance with:\n- Resume building\n- Interview preparation\n- Campus recruitment drives",
            "duration": "Course duration:\n- Diploma courses: 6-12 months\n- UG courses: 3 years\n- PG courses: 2 years",
            "online": "We offer hybrid learning options with:\n- Live online classes\n- Recorded lectures\n- Online doubt clearing sessions",
            "default": "For more information, please contact our office at +91-7398081633 or visit our website"
        }
    };

    // Event listeners
    elements.icon.addEventListener('click', openChat);
    elements.close.addEventListener('click', closeChat);
    elements.sendBtn.addEventListener('click', sendMessage);
    elements.input.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') sendMessage();
    });

    function openChat() {
        elements.window.style.display = 'flex';
        if (elements.messages.children.length === 0) {
            setTimeout(() => {
                addBotMessage("Welcome to ASIT Institute! Please enter your name:");
            }, 300);
        }
    }

    function closeChat() {
        elements.window.style.display = 'none';
    }

    function sendMessage() {
        const message = elements.input.value.trim();
        if (!message) return;

        addUserMessage(message);
        elements.input.value = '';
        showTypingIndicator();

        setTimeout(() => {
            removeTypingIndicator();
            processMessage(message);
        }, 1000);
    }

    function processMessage(message) {
        switch(currentStep) {
            case 'name':
                userData.name = message;
                currentStep = 'mobile';
                addBotMessage(`Thank you, ${userData.name}. Please share your WhatsApp number:`);
                break;

            case 'mobile':
                if (/^[0-9]{10}$/.test(message)) {
                    userData.mobile = message;
                    sendUserData();
                    addBotMessage("Thank you! How can I help you today?");
                    showQuickQuestions();
                    currentStep = 'normal';
                } else {
                    addBotMessage("Please enter a valid 10-digit WhatsApp number:");
                }
                break;

            default:
                respondToMessage(message);
        }
    }

    async function sendUserData() {
        try {
            await emailjs.send(emailConfig.serviceId, emailConfig.templateId, {
                to_email: emailConfig.recipient,
                from_name: userData.name,
                mobile: userData.mobile,
                message: "New admission inquiry from chatbot"
            });
            console.log("User data sent successfully");
        } catch (error) {
            console.error("Failed to send user data:", error);
        }
    }

    function respondToMessage(message) {
        const lowerMsg = message.toLowerCase();
        let response = chatConfig.responses.default;

        if (lowerMsg.includes("course")) response = chatConfig.responses.courses;
        else if (lowerMsg.includes("apply")) response = chatConfig.responses.apply;
        else if (lowerMsg.includes("fee")) response = chatConfig.responses.fee;
        else if (lowerMsg.includes("hostel")) response = chatConfig.responses.hostel;
        else if (lowerMsg.includes("eligib")) response = chatConfig.responses.eligibility;
        else if (lowerMsg.includes("recogn")) response = chatConfig.responses.recognition;
        else if (lowerMsg.includes("timing") || lowerMsg.includes("schedule")) response = chatConfig.responses.timings;
        else if (lowerMsg.includes("placement") || lowerMsg.includes("job")) response = chatConfig.responses.placement;
        else if (lowerMsg.includes("duration") || lowerMsg.includes("length")) response = chatConfig.responses.duration;
        else if (lowerMsg.includes("online") || lowerMsg.includes("distance")) response = chatConfig.responses.online;

        addBotMessage(response);
        showQuickQuestions();
    }

    function showTypingIndicator() {
        const indicator = document.createElement('div');
        indicator.className = 'message bot-message typing-indicator';
        indicator.id = 'typing-indicator';
        indicator.innerHTML = `
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        `;
        elements.messages.appendChild(indicator);
        scrollToBottom();
    }

    function removeTypingIndicator() {
        const indicator = document.getElementById('typing-indicator');
        if (indicator) indicator.remove();
    }

    function addUserMessage(text) {
        const msgDiv = document.createElement('div');
        msgDiv.className = 'message user-message';
        msgDiv.textContent = text;
        elements.messages.appendChild(msgDiv);
        scrollToBottom();
    }

    function addBotMessage(text) {
        const msgDiv = document.createElement('div');
        msgDiv.className = 'message bot-message';
        msgDiv.innerHTML = text.replace(/\n/g, '<br>');
        elements.messages.appendChild(msgDiv);
        scrollToBottom();
    }

    function showQuickQuestions() {
        const existing = document.querySelector('.quick-questions');
        if (existing) existing.remove();

        const container = document.createElement('div');
        container.className = 'quick-questions';

        chatConfig.questions.forEach(question => {
            const btn = document.createElement('div');
            btn.className = 'quick-question';
            btn.textContent = question;
            btn.addEventListener('click', () => {
                elements.input.value = question;
                sendMessage();
            });
            container.appendChild(btn);
        });

        elements.messages.appendChild(container);
        scrollToBottom();
    }

    function scrollToBottom() {
        elements.messages.scrollTop = elements.messages.scrollHeight;
    }
});