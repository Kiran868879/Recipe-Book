# Recipe Book

A full-stack recipe management application built with React on the client and Express.js with MongoDB on the server.

## Features

- User registration and login
- JWT-based authentication
- Recipe creation, update, and deletion
- Category-based recipe organization
- Responsive frontend built with React + Vite
- REST API backend with Express and MongoDB

## Tech Stack

### Frontend
- React
- Vite
- React Router DOM
- Axios

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT authentication
- CORS and dotenv

## Project Structure

```bash
Empolyee/
├── client/
│   ├── src/
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── README.md
└── .git/
```

## Prerequisites

Before running the project, make sure you have:

- Node.js installed
- MongoDB running locally or a MongoDB Atlas connection string
- npm installed

## Installation

### 1. Clone the project

```bash
git clone <your-repository-url>
cd Empolyee
```

### 2. Install backend dependencies

```bash
cd server
npm install
```

### 3. Install frontend dependencies

```bash
cd ../client
npm install
```

### 4. Configure environment variables

Create a `.env` file in the `server` folder by copying the example:

```bash
cd ../server
copy .env.example .env
```

Update the values in `.env`:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/recipe-book
JWT_SECRET=your_super_secret_jwt_key
CLIENT_URL=http://localhost:5173
```

## Running the Application

### Start the backend

```bash
cd server
npm run dev
```

The backend will run on:

```text
http://localhost:5000
```

### Start the frontend

Open a new terminal and run:

```bash
cd client
npm run dev
```

The frontend will run on:

```text
http://localhost:5173
```

## API Endpoints

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/profile` (protected)

### Categories
- `GET /api/categories`
- `POST /api/categories`
- `PUT /api/categories/:id`
- `DELETE /api/categories/:id`

### Recipes
- `GET /api/recipes`
- `POST /api/recipes`
- `GET /api/recipes/:id`
- `PUT /api/recipes/:id`
- `DELETE /api/recipes/:id`

## Notes

- The backend uses CORS to allow requests from the frontend URL configured in `CLIENT_URL`.
- The app expects MongoDB to be available before the server starts.
- If you want to run the backend in production mode:

```bash
cd server
npm start
```

## License

This project is for educational and personal use.
