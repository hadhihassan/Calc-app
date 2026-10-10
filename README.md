# Calculator & Action Management System 

A full-stack calculation and user activity tracking application built with **Node.js, Express, MongoDB Atlas, and React (Vite + Tailwind CSS)**. The application features user authentication (JWT via HTTP-only cookies and Bearer tokens), multi-operand arithmetic calculations, computation history tracking, resilient error handling, and robust input validation.

---

## Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Architecture](#-project-architecture)
- [Prerequisites](#-prerequisites)
- [Quick Start & Setup Guide](#-quick-start--setup-guide)
  - [1. Backend Setup](#1-backend-setup)
  - [2. Frontend Setup](#2-frontend-setup)
- [Environment Variables](#-environment-variables)
- [API Reference](#-api-reference)
  - [Health Check](#health-check)
  - [Authentication Endpoints](#authentication-endpoints)
  - [Action & Calculation Endpoints](#action--calculation-endpoints)
- [Developer Guide: How to Create Professional README Files](#-developer-guide-how-to-create-professional-readme-files)
- [Edge Cases Solved in the Backend (Calculator & Logic)](#-edge-cases-solved-in-the-backend-calculator--logic)

---

## Features

- **Multi-Operand Arithmetic Engine**: Performs addition (`+`), subtraction (`-`), multiplication (`*`), and division (`/`) on an arbitrary list of numbers sequentially.
- **Dual Input Flexibility**: Accepts both comma-separated strings (`"10, 20, 5"`) and raw numeric/string arrays (`[10, 20, 5]`).
- **Flexible Field Aliases**: Supports `operation` / `actions` / `operator` and `numbers` / `payload` for seamless client-server backwards compatibility.
- **Authentication & Security**: Secure user signup and signin using `bcryptjs` password hashing and `jsonwebtoken`. Tokens are transmitted via secure HTTP-only cookies or `Bearer` tokens in the `Authorization` header.
- **Computation History**: Persists user calculation history in MongoDB Atlas with timestamps, full expressions, and execution status (`ok`).
- **Graceful Database Degradation**: The calculator continues to process calculations and return results even if MongoDB is momentarily pending or disconnected.
- **Client & Server Zod Validation**: Identifies malformed inputs, whitespace, invalid characters, and pinpoint-specific positions before calculations execute.
- **Modern UI**: Clean, dark-mode design with live input parsing badges, one-click copy, and instant validation feedback.

---

## Tech Stack

### Backend (`/server`)
- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js 5
- **Database**: MongoDB Atlas with Mongoose ODM
- **Validation**: Zod
- **Authentication**: JWT (`jsonwebtoken`) & `bcryptjs`
- **Utilities**: `cookie-parser`, `cors`, `dotenv`

### Frontend (`/frontend`)
- **Build Tool**: Vite 8
- **Framework**: React 19
- **Styling**: Tailwind CSS 4
- **Icons**: Lucide React
- **Validation**: Zod client schemas

---

## Project Architecture

```plaintext
├── README.md                  # Root project documentation
├── server/                    # Backend API
│   ├── config/
│   │   └── db.js              # MongoDB Atlas connection handler
│   ├── controllers/
│   │   ├── actions.controller.js  # Calculator logic & history retrieval
│   │   └── auth.controller.js     # User registration, login, logout, me
│   ├── middlewares/
│   │   ├── asyncHandler.middleware.js # Express async wrapper
│   │   ├── auth.middleware.js         # JWT verification (Cookie & Header)
│   │   ├── error.middleware.js        # Centralized error formatter
│   │   └── validate.middleware.js     # Zod request body validator
│   ├── models/
│   │   ├── History.js         # Calculation history schema
│   │   └── User.js            # User credentials schema
│   ├── routes/
│   │   ├── auth.routes.js     # /auth and /api/auth routes
│   │   └── index.js           # /actions and /api/actions routes
│   ├── utils/
│   │   ├── ApiError.js        # Standardized HTTP error class
│   │   ├── asyncHandler.js    # Async helper utility
│   │   └── auth.util.js       # JWT creation & cookie handling
│   ├── validators/
│   │   ├── actions.validator.js   # Calculation input transformation & rules
│   │   └── auth.validator.js      # Auth request validation schemas
│   ├── .env.example           # Server environment template
│   ├── package.json           # Server dependencies & scripts
│   └── server.js              # Express app bootstrap & middleware configuration
│
└── frontend/                  # React Single Page Application
    ├── src/
    │   ├── components/
    │   │   ├── ui/            # Card, Button, Input primitives
    │   │   ├── AuthCard.jsx   # Register / Login modal component
    │   │   ├── Calculator.jsx # Main calculator interface
    │   │   ├── HistoryList.jsx# Calculation history list
    │   │   ├── Navbar.jsx     # Header navigation & auth controls
    │   │   └── Toast.jsx      # Feedback notifications
    │   ├── validators/
    │   │   └── schemas.js     # Client-side Zod validation schemas
    │   ├── App.jsx            # Application root
    │   └── main.jsx           # React DOM mount point
    ├── vite.config.js         # Vite configuration with backend reverse proxy
    └── package.json           # Frontend dependencies & scripts
```

---

## Prerequisites

Before running this project, ensure you have the following installed:
- **Node.js**: `v18.0.0` or higher (Verify with `node -v`)
- **npm**: `v9.0.0` or higher (Verify with `npm -v`)
- **MongoDB Atlas Database**: A free MongoDB Atlas cluster connection URI (or local MongoDB).

---

## Quick Start & Setup Guide

### 0. Clone the Repository
```bash
git clone https://github.com/hadhihassan/Calc-app.git
cd Calc-app
```

### 1. Backend Setup

1. Open your terminal and navigate to the `server` directory:
   ```bash
   cd server
   ```

2. Install backend dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   - Copy `.env.example` to create a `.env` file:
     ```bash
     cp .env.example .env
     ```
   - Edit the `.env` file with your configuration:
     ```env
     PORT=3000
     MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/calculator_db?retryWrites=true&w=majority
     JWT_SECRET=your_super_secret_jwt_key_here
     CLIENT_URL=http://localhost:5173
     NODE_ENV=development
     ```

4. Start the backend development server:
   ```bash
   npm run dev
   ```
   *The server will start on `http://localhost:3000` with hot-reload enabled via Nodemon.*

---

### 2. Frontend Setup

1. Open a new terminal and navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```

2. Install frontend dependencies:
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The frontend will launch at `http://localhost:5173`.*

> **Note on Proxies:** The frontend Vite configuration is already configured to proxy `/auth`, `/actions`, and `/health` requests directly to `http://localhost:3000`, eliminating CORS issues during development.

---

## Environment Variables

The backend requires the following environment variables in `server/.env`:

| Variable | Required | Default | Description |
| :--- | :---: | :--- | :--- |
| `PORT` | Optional | `3000` | The port the Express HTTP server binds to. |
| `MONGO_URI` | Yes | — | MongoDB Atlas connection string (including user credentials and database name). |
| `JWT_SECRET` | Yes | fallback secret | Secret key used to sign and verify JSON Web Tokens. |
| `CLIENT_URL` | Optional | `http://localhost:5173` | The trusted frontend origin allowed by CORS. |
| `NODE_ENV` | Optional | `development` | Environment mode (`development` or `production`). |

---

## API Reference

All requests and responses use `application/json`.

### Health Check

#### `GET /health`
Checks if the server is up and responsive.
- **Response `200 OK`**:
  ```json
  {
    "status": "ok",
    "message": "Calculator API is healthy"
  }
  ```

---

### Authentication Endpoints

#### `POST /auth/register` (or `/api/auth/register`)
Creates a new user account and sets a JWT cookie.
- **Request Body**:
  ```json
  {
    "name": "Jane Doe",
    "email": "jane@example.com",
    "password": "secretPassword123"
  }
  ```
- **Response `201 Created`**:
  ```json
  {
    "statusCode": 201,
    "message": "Account created successfully",
    "user": {
      "id": "67073b64c8d76...",
      "name": "Jane Doe",
      "email": "jane@example.com"
    }
  }
  ```

#### `POST /auth/login` (or `/api/auth/login`)
Authenticates existing credentials and sets the authentication cookie.
- **Request Body**:
  ```json
  {
    "email": "jane@example.com",
    "password": "secretPassword123"
  }
  ```
- **Response `200 OK`**:
  ```json
  {
    "statusCode": 200,
    "message": "Logged in successfully",
    "user": {
      "id": "67073b64c8d76...",
      "name": "Jane Doe",
      "email": "jane@example.com"
    }
  }
  ```

#### `POST /auth/logout` (or `/api/auth/logout`)
Clears the HTTP-only authorization cookie.
- **Response `200 OK`**:
  ```json
  {
    "statusCode": 200,
    "message": "Logged out successfully."
  }
  ```

#### `GET /auth/me` (or `/api/auth/me`)
Retrieves the profile of the currently logged-in user. Requires authentication.
- **Response `200 OK`**:
  ```json
  {
    "statusCode": 200,
    "user": {
      "id": "67073b64c8d76...",
      "name": "Jane Doe",
      "email": "jane@example.com"
    }
  }
  ```

---

### Action & Calculation Endpoints

#### `POST /actions` (or `/api/actions`)
Executes an arithmetic operation on a set of numbers and logs history for authenticated users.

- **Headers**:
  - `Content-Type: application/json`
  - `Authorization: Bearer <token>` *(Optional if cookie is present; authentication required to record history)*

- **Request Body Options**:
  ```json
  {
    "operation": "+",
    "numbers": [10, 20, 30]
  }
  ```
  *Alternatively, accepting comma-separated strings or legacy property keys:*
  ```json
  {
    "operation": "/",
    "numbers": "100, 2, 5"
  }
  ```
  ```json
  {
    "actions": "*",
    "payload": [3, 4, 2]
  }
  ```

- **Supported Operations**:
  - `+` (Addition)
  - `-` (Subtraction)
  - `*` (Multiplication)
  - `/` (Division)

- **Response `200 OK`**:
  ```json
  {
    "statusCode": 200,
    "message": "Success",
    "data": {
      "result": 60,
      "operation": "+",
      "numbers": [10, 20, 30],
      "expression": "10 + 20 + 30 = 60",
      "status": "ok",
      "historyId": "67073e82a991...",
      "createdAt": "2026-10-10T12:45:00.000Z"
    }
  }
  ```

- **Sample Error Response `400 Bad Request`**:
  ```json
  {
    "statusCode": 400,
    "message": "Division by zero is not allowed.",
    "errors": [
      {
        "code": "custom",
        "message": "Division by zero is not allowed.",
        "path": []
      }
    ]
  }
  ```

#### `GET /actions/history` (or `/api/actions/history`)
Fetches the last 100 calculations performed by the authenticated user.
- **Response `200 OK`**:
  ```json
  {
    "statusCode": 200,
    "message": "History fetched successfully",
    "count": 1,
    "data": [
      {
        "_id": "67073e82a991...",
        "userId": "67073b64c8d76...",
        "operation": "+",
        "numbers": [10, 20, 30],
        "expression": "10 + 20 + 30 = 60",
        "result": 60,
        "status": "ok",
        "createdAt": "2026-10-10T12:45:00.000Z"
      }
    ]
  }
  ```

---

## Expression Edge Cases


| # | Case | Example | Result |
|---|------|---------|--------|
| 1 | Operator precedence (`*` and `/` before `+` and `-`) | `10 + 5 * 2` | `20` |
| 2 | Two operators in a row | `5 ++ 3`, `5 * / 2` | Rejected |
| 3 | Ends with an operator | `5 +` | Rejected |
| 4 | Starts with an operator | `* 5` | Rejected |
| 4 | Starts with a minus (negative number) | `-5 + 3` | `-2` |
| 5 | Negative number after an operator | `5 * -3` | `-15` |
| 5 | Negative number after an operator | `5 - -3` | `8` |
| 6 | Two numbers with no operator | `5 3` | Rejected |
| 6 | Invalid number format | `1.2.3` | Rejected |
| 7 | Division by zero (checked during evaluation) | `10 / 0` | Rejected |
| 8 | Invalid characters (only digits, `.`, `+ - * /` and spaces allowed) | `abc`, `2 ^ 3` | Rejected |
| 8 | `eval()` is never used (security risk) | - | - |
| 9 | Spaces are ignored | `10+5*2` and `10 + 5 * 2` | Both give `20` |