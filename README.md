
# Real-Time Collaborative Whiteboard Engine

A high-performance, bi-directional synchronization engine built with **Node.js** and **Socket.io**. This project focuses on solving the core challenges of distributed state management and real-time data consistency in a multi-user environment.

##  Technical Highlights

* **Stateful Synchronization Protocol:** Engineered a custom "Pen-State" event model (Start/Move/End) to manage HTML5 Canvas paths, preventing state desynchronization and "ghost paths" across clients.
* **Server-Side Event Buffering:** Implemented a history persistence layer to ensure that late-joining users receive a seamless state replay of all existing drawing data.
* **Coordinate Normalization:** Developed logic to scale coordinates relative to viewport dimensions (0.0 to 1.0), ensuring cross-browser rendering consistency regardless of screen resolution.
* **Full-Duplex Communication:** Leveraged WebSockets to achieve sub-100ms latency, far outperforming traditional HTTP polling methods in high-concurrency scenarios.

---

##  Architecture

The system follows an **Event-Driven Architecture**:

1. **Client A** triggers a mouse event.
2. **Normalization Logic** converts raw pixels to relative percentages.
3. **Socket.io Client** emits the data payload to the server.
4. **Node.js Server** receives the payload, appends it to the **History Buffer**, and broadcasts it to all other connected clients.
5. **Client B** receives the broadcast and executes the **Rendering Engine** to update the canvas locally.

---

## Tech Stack

* **Backend:** Node.js, Express
* **Real-Time Engine:** Socket.io (WebSockets)
* **Frontend:** JavaScript (ES6+), HTML5 Canvas API, CSS3

---

## How to Run

1. **Clone the repo:**
```bash
git clone https://github.com/srzhub/whiteboard.git

```


2. **Install dependencies:**
```bash
npm install

```


3. **Start the server:**
```bash
npm start

```


4. **Open in Browser:** Visit `http://localhost:3000`. Open multiple tabs to test real-time synchronization.

---

##  Future Roadmap (Scalability)

* **Persistence:** Integrate **Redis** as a message broker and state store to scale horizontally across multiple server instances.
* **Conflict Resolution:** Implement **CRDTs (Conflict-free Replicated Data Types)** or Operational Transformation for complex object manipulation.
* **Optimization:** Implement **Binary Serialization (Protobufs)** to reduce network payload size by ~60% compared to JSON.
