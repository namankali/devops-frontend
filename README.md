## AI DevOps Copilot – Frontend

This is the frontend for an AI-powered DevOps Copilot system that enables real-time monitoring, AI-assisted debugging, and automated incident response.

Built using React (TypeScript) and Material UI, the application provides an interactive dashboard for logs, system metrics, and an AI chat interface capable of analyzing issues and suggesting actions.

##  Features

- 📊 Real-time log monitoring with filtering and search  
- 💬 AI chat interface for debugging and system queries  
- ⚡ Action panel for executing AI-suggested operations (restart/scale services)  
- 📈 Metrics visualization for latency, errors, and system health  
- 🔔 Event-driven updates from GitHub and Docker Hub webhooks  
- 🌙 Developer-friendly UI with responsive and clean design  


## System Context

This frontend interacts with:

- Node.js backend for logs, metrics, and action APIs  
- FastAPI AI service for LLM-based chat and tool execution  
- Redis queues for asynchronous processing  
- PostgreSQL for structured data storage  

The system follows an event-driven architecture powered by webhook integrations.


## Tech Stack

- React (TypeScript)
- Material UI (MUI)
- React Query (TanStack Query)
- Axios
- WebSockets (for real-time updates)


## Highlights

- Combines DevOps observability with AI-driven automation  
- Implements real-world event-driven workflows using webhooks  
- Demonstrates production-level frontend architecture and API integration  
- Designed for scalability, usability, and real-time system interaction  
