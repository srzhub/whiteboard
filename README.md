# Collaborative Whiteboard Engine

A real-time, multi-user drawing application designed to handle concurrent strokes across varying screen resolutions. This project explores the implementation of WebSockets for low-latency data synchronization and the challenges of maintaining distributed state in a web environment.

---

## Core Features

* **Multi-Tenant Room Logic:** Utilizes URL parameters to partition users into specific sessions. This ensures that drawing data is isolated to relevant peers, preventing global network congestion.
* **Resolution-Independent Coordinates:** Implemented coordinate normalization by converting raw mouse pixels into relative percentages (0.0 to 1.0). This allows a stroke made on a high-resolution monitor to render accurately on a smaller mobile or laptop screen.
* **State Reconstruction (History Replay):** The server maintains an in-memory buffer of all drawing events. When a new user joins an existing room, the server emits the full history, allowing the client to reconstruct the current board state immediately.
* **Path State Management:** Uses a Start-Move-End event model to control the HTML5 Canvas state machine. This prevents "ghost paths"—accidental lines connecting separate strokes—by explicitly resetting paths during the mouse-up event.

---

## Technical Implementation

### Bi-directional Communication
The application leverages **Socket.io** to establish a persistent WebSocket connection. Unlike standard HTTP requests, which incur overhead from repeated headers and TCP handshakes, WebSockets allow for a continuous stream of coordinate data with minimal latency.

### The Rendering Engine
The frontend treats the Canvas API as a state-driven system. 
1. **Capture:** Detects mouse movement and normalizes coordinates.
2. **Emission:** Sends a JSON payload containing coordinates, stroke color, and brush width.
3. **Broadcast:** The server relays this data to all other clients in the room using a broadcast method that excludes the sender to prevent redundant local rendering.

---

## Architecture

1. **Client A** triggers a drawing event.
2. **Normalization Logic** scales the coordinates.
3. **Socket.io** emits the payload to the Node.js backend.
4. **Server** validates the room ID, appends the data to the room's history, and broadcasts the update.
5. **Client B** receives the event and executes the drawing logic to update the local canvas.

---

## Tech Stack

* **Backend:** Node.js, Express
* **Communication:** Socket.io (WebSockets)
* **Frontend:** Vanilla JavaScript (ES6+), HTML5 Canvas API, CSS3

---

## Development Roadmap

* **Redis Integration:** Transition from in-memory object storage to a Redis-backed cache. This will allow the application to persist data across server restarts and scale horizontally across multiple instances.
* **Network Throttling:** Implement a client-side throttle to limit event emission to 60 frames per second, reducing server load during high-frequency drawing.
* **Conflict Resolution:** Researching the implementation of CRDTs (Conflict-free Replicated Data Types) for more complex object manipulations and undo/redo functionality.

---

## Setup and Installation

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Run the Server:**
   ```bash
   node server.js
   ```

3. **Access the Application:**
   Open `http://localhost:3000` in multiple browser tabs to test real-time collaboration.

