const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

// This array stores every draw event since the server started.
// In production, use Redis or a Database to avoid RAM overflow.
let roomData = {}; 

// Serve (route) the static HTML file when anyone acceses root URL
app.get('/', (req, res) => res.sendFile(__dirname + '/index.html'));

let userCount = 0;
// Fires every time a new user connects to the server via Socket.IO
io.on('connection', (socket) => {

    userCount++;
    io.emit('userCount', userCount) // brodcast number of users to all
    console.log('A user connected. Current number of rooms:', Object.keys(roomData).length);

    socket.on('join', (roomName) => {
        socket.join(roomName);
        socket.currentRoom = roomName;

        if(!roomData[roomName]){
            roomData[roomName] = [];
        }

        // send only this rooms history to user
        socket.emit('history', roomData[roomName]);
        console.log(`User Joined Room: ${roomName}`)
    });

    socket.on('draw', (data) => {
        const room = socket.currentRoom;
        if(room){
            roomData[room].push(data);
            // Brodcast only to people in this room other than drawer himself
            socket.to(room).emit('draw', data);
        }
        else{
            console.log("REJECTED: Drawing received but socket is not in a room yet.");
        }
    });

    socket.on('clear', () => {
        const room = socket.currentRoom;
            if (room) {
                roomData[room] = [];
                io.to(room).emit('clear'); // Tell everyone in the room to clear
            }
    });

    socket.on('disconnect', () => {
        userCount--;
        io.emit('userCount', userCount);
        console.log('User disconnected');
    });
});

const PORT = 3000;
http.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));