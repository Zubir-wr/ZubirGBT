#Project Steps

Phase 1: Environment Setup & Prerequisites
​Install Core Tools:
​Install Docker Desktop and enable Virtualization features in your system BIOS.
​Install Git for version control and repository management.
​Install Node.js and PostgreSQL for local development.
​Storage Management:
​Clean up the C drive and remove unused heavy applications (such as Anaconda) to ensure the Docker Engine runs smoothly without disk space errors.
​🏗️ Phase 2: Project Development & Architecture
​Setting Up Structure and Files:
​Create the core project structure and write the server.js file for the Node.js / Express application.
​Set up frontend files (index.html and CSS) to provide an interactive and smooth chat interface.
​Database & AI Engine Integration:
​Connect the backend server to PostgreSQL for storing chat logs and message history.
​Integrate with the Ollama engine running locally on port 11434 to power local LLMs (like Llama 3.2).
​Containerization (Docker & Compose):
​Create a Dockerfile to containerize the Node.js application.
​Set up the docker-compose.yml file to orchestrate all services (frontend, database, and Ollama) into a unified environment.
​Configure the .gitignore file to exclude heavy files and system directories from being pushed to GitHub.
​🚀 Phase 3: Pushing to GitHub
1- Initialize Local Git Repository:
git init
git add .
git commit -m "Initial commit: ZubirGBT clean project code"
2- Link to Remote Repository:
git branch -M main
git remote add origin https://github.com/Zubir-wr/ZubirGBT.git
3- Push Code to GitHub:
git push -u origin main
4- Add Documentation:

Create and commit a README.md file on GitHub detailing the project architecture, features, and step-by-step instructions.

Phase 4: Running and Testing the Project
1- Start Containers via Docker Compose:
docker compose up -d
Access the Interface and Test:

2- Open your web browser and navigate to http://localhost:3000.

Send queries to test the local AI model's responses and verify persistent chat history.

<img width="1892" height="906" alt="Screenshot 2026-10-20 064057" src="https://github.com/user-attachments/assets/89d355e9-b153-4718-ada6-1c4b146d2845" />
<img width="1718" height="908" alt="Screenshot 2026-10-20 064356" src="https://github.com/user-attachments/assets/887760c8-c152-4250-bf11-d85e00c6ce6f" />
<img width="1845" height="807" alt="Screenshot 2026-10-20 064425" src="https://github.com/user-attachments/assets/a7aeda3c-9ced-4c68-ba21-35a3318385d1" />




