const express = require('express');
const path = require('path');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// PostgreSQL connection pool configuration
const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgres://user:password@ai-project-db:5432/chatdb'
});

// Retry DB connection until PostgreSQL is completely ready
async function initDB(retries = 10, delay = 3000) {
    while (retries > 0) {
        try {
            await pool.query(`
                CREATE TABLE IF NOT EXISTS messages (
                    id SERIAL PRIMARY KEY,
                    role VARCHAR(20) NOT NULL,
                    content TEXT NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            `);
            console.log('PostgreSQL database initialized successfully.');
            return;
        } catch (err) {
            console.log(`Database not ready yet. Retrying in 3 seconds... (${retries} retries left)`);
            retries -= 1;
            await new Promise(res => setTimeout(res, delay));
        }
    }
    console.error('Could not connect to PostgreSQL database.');
}
initDB();

// Helper function to detect image generation requests
function isImageRequest(prompt) {
    const keywords = ['draw', 'image', 'photo', 'picture', 'generate image', 'illustration', 'sketch', 'paint'];
    const lowerPrompt = prompt.toLowerCase();
    return keywords.some(keyword => lowerPrompt.includes(keyword));
}

// Helper function to generate Pollinations AI image URL
function generateImageUrl(prompt) {
    const cleanPrompt = encodeURIComponent(prompt);
    return `https://image.pollinations.ai/prompt/${cleanPrompt}?width=1024&height=1024&nologo=true`;
}

app.post('/api/generate', async (req, res) => {
    const { prompt } = req.body;

    if (!prompt) {
        return res.status(400).json({ error: 'Prompt is required' });
    }

    try {
        let replyText = "";

        // 1. Check if the user is requesting an image
        if (isImageRequest(prompt)) {
            const imageUrl = generateImageUrl(prompt);
            replyText = `Here is your generated image:\n![Generated Image](${imageUrl})`;
        } else {
            // 2. Fetch recent conversation history from PostgreSQL for standard text prompts
            const historyRes = await pool.query(
                'SELECT role, content FROM messages ORDER BY id DESC LIMIT 10'
            );
            const history = historyRes.rows.reverse();

            let messages = [
                { 
                    role: 'system', 
                    content: 'You are a helpful and intelligent AI assistant. Keep responses natural, direct, concise, and clear.' 
                },
                ...history,
                { role: 'user', content: prompt }
            ];

            // Send request to Ollama
            const response = await fetch('http://ollama:11434/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: 'llama3.2',
                    messages: messages,
                    stream: false
                })
            });

            if (!response.ok) {
                throw new Error(`Ollama API error: ${response.statusText}`);
            }

            const data = await response.json();

            if (data.message && data.message.content) {
                replyText = data.message.content;
            } else if (data.response) {
                replyText = data.response;
            } else {
                replyText = "Sorry, I received an empty response from the AI model.";
            }
        }

        // 3. Save both User prompt and AI response to PostgreSQL
        await pool.query('INSERT INTO messages (role, content) VALUES ($1, $2)', ['user', prompt]);
        await pool.query('INSERT INTO messages (role, content) VALUES ($1, $2)', ['assistant', replyText]);

        res.json({ response: replyText });

    } catch (error) {
        console.error('Error in /api/generate:', error.message);
        res.status(500).json({ error: 'Failed to process request.' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});