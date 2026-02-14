const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

// This array stores every draw event since the server started.
// SDE Note: In production, use Redis or a Database to avoid RAM overflow.
let history = []; 

app.get('/', (req, res) => res.sendFile(__dirname + '/index.html'));

io.on('connection', (socket) => {
    console.log('A user connected. Current history size:', history.length);

    // 1. Immediate Sync: Send the current state to the user who just joined
    socket.emit('history', history);

    socket.on('draw', (data) => {
        // 2. Save event to history so future joiners see it
        history.push(data); 
        // 3. Broadcast to all other active users
        socket.broadcast.emit('draw', data);
    });

    socket.on('clear', () => {
        history = []; // Wipe the server-side history
        io.emit('clear'); // Tell EVERYONE (including sender) to clear screens
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

const PORT = 3000;
http.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));