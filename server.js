const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

let messages = [
    { id: 1, text: "Hello, World!", timestamp: new Date().toISOString() },
    { id: 2, text: "Welcome to Claude Hello World App!", timestamp: new Date().toISOString() }
];

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/api/messages', (req, res) => {
    res.json(messages);
});

app.post('/api/messages', (req, res) => {
    const { text } = req.body;
    
    if (!text || text.trim() === '') {
        return res.status(400).json({ error: 'Message text is required' });
    }
    
    const newMessage = {
        id: messages.length + 1,
        text: text.trim(),
        timestamp: new Date().toISOString()
    };
    
    messages.push(newMessage);
    res.status(201).json(newMessage);
});

app.delete('/api/messages/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const messageIndex = messages.findIndex(msg => msg.id === id);
    
    if (messageIndex === -1) {
        return res.status(404).json({ error: 'Message not found' });
    }
    
    messages.splice(messageIndex, 1);
    res.json({ message: 'Message deleted successfully' });
});

app.get('/api/status', (req, res) => {
    res.json({ 
        status: 'running', 
        timestamp: new Date().toISOString(),
        totalMessages: messages.length
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log('API endpoints:');
    console.log('  GET /api/messages - Get all messages');
    console.log('  POST /api/messages - Add new message');
    console.log('  DELETE /api/messages/:id - Delete message');
    console.log('  GET /api/status - Server status');
});