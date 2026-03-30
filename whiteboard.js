
// Check URL for ?room=xyz, otherwise default to 'general'
const urlParams = new URLSearchParams(window.location.search);
const roomName = urlParams.get('room') || 'general';
document.getElementById('roomDisplay').innerText = roomName;

if(!roomName) window.location.href = '/';

// Tell the server we want to join this room
console.log("Client: Target room is", roomName);        

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d'); // HTML 5 Canvas API for drawing
const socket = io(); // initialise socket connection

const colorPicker = document.getElementById('colorPicker'); // get color picker
const sizeSlider = document.getElementById('sizeSlider');   // get size slider

let drawing = false;
let isEraser = false;

// Initialize pen styles
ctx.lineWidth = 2;
ctx.lineCap = 'round';
ctx.lineJoin = 'round';
ctx.strokeStyle = '#000';

// Getting normlaised coordinates (0 to 1) for better cross-device compatibilty
function getCoords(e) {
    const rect = canvas.getBoundingClientRect(); // Get coordinates of canvas, not screen
    return {
        // sending percentages
        x: (e.clientX - rect.left) / canvas.width,
        y: (e.clientY - rect.top) / canvas.height
    };
}

// UI changes when toggling eraser mode
function toggleEraser(){
    isEraser = !isEraser;
    const btn = document.getElementById('eraserBtn');

    btn.innerText = isEraser? "Eraser: ON" : "Eraser: OFF";
    btn.style.background = isEraser ? "#747d8c" : "#2f3542";
}

socket.on('userCount', (count) => {
    document.getElementById('userCount').innerText = count;
});

socket.emit('join', roomName);

// OUTGOING EVENTS 

canvas.onmousedown = (e) => {
    drawing = true;
    const coords = getCoords(e);

    const data = { 
        ...coords,
            type: 'start',
            color: isEraser? "#ffffff" : colorPicker.value,
            width: isEraser ? 20 : sizeSlider.value
        };

    socket.emit('draw', data);
    handleDraw(data);
};

canvas.onmousemove = (e) => {
    if (!drawing) return;
    const coords = getCoords(e);

    const data = {
            ...coords,
            type: 'move',
            color: isEraser? "#ffffff":colorPicker.value,
            width: isEraser ? 20 : sizeSlider.value
            };

    socket.emit('draw', data);
    handleDraw(data);
};

window.onmouseup = () => {
    if (!drawing) return;
    drawing = false;
    const data = { type: 'end' };
    socket.emit('draw', data);
    handleDraw(data);
};

function clearBoard() {
    socket.emit('clear');
}

// INCOMING EVENTS

// Load full history when joining
socket.on('history', (historyData) => {
    console.log("Syncing history...");
    historyData.forEach(event => handleDraw(event));
});

// Listen for new drawing events from others
socket.on('draw', (data) => handleDraw(data));

// Listen for global clear command
socket.on('clear', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});

// CORE RENDERING ENGINE

function handleDraw(data) {
    const x = data.x * canvas.width;
    const y = data.y * canvas.height;   
    const type = data.type;

    if(data.color) ctx.strokeStyle = data.color;
    if(data.width) ctx.lineWidth = data.width;

    if (type === 'start') {
        ctx.beginPath();
        ctx.moveTo(x, y);

    } else if (type === 'move') {
        ctx.lineTo(x, y);
        ctx.stroke();

    } else if (type === 'end') {
        ctx.beginPath(); // Reset state for safety
    }
}