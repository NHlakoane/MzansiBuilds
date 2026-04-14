# MzansiBuilds - Build in Public Platform

A full-stack web application for South African developers to share projects, collaborate, and celebrate their wins.

## 🚀 Live Demo
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## 🛠️ Tech Stack

### Frontend
- React 18 with Vite
- React Router for navigation
- Context API for state management
- Custom CSS (green/black theme)

### Backend
- Node.js with Express
- PostgreSQL database
- JWT for authentication
- bcrypt for password hashing

## 📦 Installation

### Prerequisites
- Node.js (v16+)
- PostgreSQL (v14+)

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env  # Configure your database credentials
npm run migrate       # Setup database tables
npm run seed         # Seed sample data
npm run dev          # Start development server

# MzansiBuilds

> Build in Public Platform for South African Developers

## Quick Start

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env  # Edit with your DB credentials
npm run migrate
npm run dev