let isVoiceActive = false;
let recognition = null;
const synth = window.speechSynthesis;
let isSpeaking = false;
let chatHistory = [];

if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
        if (isSpeaking) return;

        const transcript = event.results[0][0].transcript.trim();
        if (transcript) {
            appendMessage('user', transcript);
            sendToAI(transcript);
        }
    };

    recognition.onend = () => {
        if (isVoiceActive && !isSpeaking) {
            setTimeout(() => {
                if (isVoiceActive && !isSpeaking) {
                    try { recognition.start(); } catch(e) {}
                }
            }, 300);
        }
    };

    recognition.onerror = () => {
        if (isVoiceActive && !isSpeaking) {
            setTimeout(() => { try { recognition.start(); } catch(e) {} }, 1000);
        }
    };
}

function toggleVoiceInput() {
    const micBtn = document.getElementById('mic-btn');
    if (!recognition) return alert('Speech recognition is not supported in this browser.');

    if (!isVoiceActive) {
        isVoiceActive = true;
        isSpeaking = false;
        micBtn.classList.add('recording');
        micBtn.innerText = '🔴 Live Conversation';
        startListening();
    } else {
        isVoiceActive = false;
        isSpeaking = false;
        micBtn.classList.remove('recording');
        micBtn.innerText = '🎙️ Start Voice Call';
        try { recognition.stop(); } catch(e) {}
        synth.cancel();
    }
}

function startListening() {
    if (isVoiceActive && !isSpeaking) {
        try { recognition.start(); } catch(e) {}
    }
}

async function sendToAI(text) {
    isSpeaking = true;
    try { recognition.stop(); } catch(e) {}

    const botMsg = appendMessage('bot', 'Thinking...');

    try {
        const res = await fetch('/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                prompt: text,
                history: chatHistory
            })
        });
        
        const data = await res.json();
        const responseText = data.response || data.reply || data.result || "I didn't catch that.";
        
        chatHistory.push({ role: 'user', content: text });
        chatHistory.push({ role: 'assistant', content: responseText });

        if (chatHistory.length > 10) {
            chatHistory = chatHistory.slice(-10);
        }

        const cleanText = responseText.replace(/[*_#`]/g, '').trim();
        botMsg.innerText = cleanText;

        if (isVoiceActive) {
            speakResponse(cleanText);
        } else {
            isSpeaking = false;
        }

    } catch (err) {
        botMsg.innerText = "Connection issue.";
        if (isVoiceActive) speakResponse("Sorry, connection issue.");
        isSpeaking = false;
    }
}

function speakResponse(text) {
    synth.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    
    utterance.lang = /[\u0600-\u06FF]/.test(text) ? 'ar-SA' : 'en-US';
    utterance.rate = 1.0;

    utterance.onstart = () => {
        isSpeaking = true;
        try { recognition.stop(); } catch(e) {}
    };

    utterance.onend = () => {
        setTimeout(() => {
            isSpeaking = false;
            if (isVoiceActive) {
                startListening();
            }
        }, 500);
    };

    utterance.onerror = () => {
        isSpeaking = false;
        if (isVoiceActive) startListening();
    };

    synth.speak(utterance);
}

function appendMessage(sender, text) {
    const chatFlow = document.getElementById('chat-flow');
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${sender}`;
    msgDiv.innerText = text;
    chatFlow.appendChild(msgDiv);
    chatFlow.scrollTop = chatFlow.scrollHeight;
    return msgDiv;
}

function handleKeyPress(e) {
    if (e.key === 'Enter') {
        const input = document.getElementById('user-input');
        if (input.value.trim()) {
            const text = input.value.trim();
            appendMessage('user', text);
            sendToAI(text);
            input.value = '';
        }
    }
}
