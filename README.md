# ZubirGBT 

*ZubirGBT* is a full-stack, containerized local AI platform designed for private, high-performance chat interactions and AI workflows. Powered by open-source LLMs running locally, it ensures total data privacy without relying on third-party cloud APIs.

---

## 🏗️ Architecture & Tech Stack

The system is fully containerized and orchestrated using *Docker Compose*, separating concerns across dedicated microservices:

* *Frontend & Backend Server:* Built with *Node.js* and *Express*, providing an interactive web interface running on port 3000.
* *Local LLM Engine:* Powered by *Ollama*, running local models like Llama 3.2 on port 11434.
* *Database:*
*PostgreSQL* running on port 5432 for robust message logging and persistent chat history.
* *AI Agent:* A dedicated backend service handling agentic workflows and tool execution.

---

## ✨ Features

- 🔒 *100% Private & Local:* All conversation data and AI model execution remain local on your machine.
- 💬 *Persistent History:* Full chat history and logs saved with PostgreSQL integration.
- 🎨 *Visual Generation Integration:* Native capability for prompt detection and image generation.
- 🐳 *Dockerized Setup:* Clean service isolation with zero-downtime deployment using Docker Compose.

---

## 🛠️ Getting Started

### Prerequisites

* [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running.
* [Node.js](https://nodejs.org/) (optional, for local development outside containers).

### Installation & Running

1. *Clone the repository:*
   ```bash
   git clone [https://github.com/Zubir-wr/ZubirGBT.git](https://github.com/Zubir-wr/ZubirGBT.git)
   cd ZubirGBT
