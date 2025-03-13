# Full-Stack Task Management Application

A scalable task management application built with Next.js, NestJS, MongoDB, and Redux Toolkit.

## Project Overview

This application allows users to manage tasks through CRUD operations with the following features:

- Create, read, update, and delete tasks
- Filter tasks by status
- Search tasks by title/description
- Pagination for better performance
- Responsive UI for all device sizes

## Tech Stack

### Frontend
- Next.js (React framework)
- Redux Toolkit (State management)
- TypeScript
- Axios (API client)
- Tailwind CSS (Styling)

### Backend
- NestJS (Node.js framework)
- MongoDB with Mongoose
- TypeScript
- Jest (Testing)

## Project Structure

```
task-management/
├── frontend/          # Next.js application
├── backend/           # NestJS application
└── README.md          # Project documentation
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local installation or MongoDB Atlas account)

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env` file in the backend directory with the following content:
   ```
   MONGODB_URI=mongodb://localhost:27017/task-management
   PORT=3001
   ```
   (Update the MongoDB URI as needed for your environment)

4. Start the backend server:
   ```bash
   npm run start:dev
   # or
   yarn start:dev
   ```

   The backend server will start at http://localhost:3001

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env.local` file in the frontend directory with the following content:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:3001
   ```

4. Start the frontend development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

   The frontend will be available at http://localhost:3000

## Running Tests

### Backend Tests

```bash
cd backend
npm run test
# or
yarn test
```

### Frontend Tests

```bash
cd frontend
npm run test
# or
yarn test
```

## Docker Setup (Optional)

### Using Docker Compose

1. Create a `docker-compose.yml` file in the root directory:

```yaml
version: '3'
services:
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://backend:3001
    depends_on:
      - backend
    volumes:
      - ./frontend:/app
      - /app/node_modules

  backend:
    build: ./backend
    ports:
      - "3001:3001"
    environment:
      - MONGODB_URI=mongodb://mongo:27017/task-management
    depends_on:
      - mongo
    volumes:
      - ./backend:/app
      - /app/node_modules

  mongo:
    image: mongo:latest
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db

volumes:
  mongodb_data:
```

2. Run with Docker Compose:
```bash
docker-compose up
```

## Deployment

### Backend Deployment

The NestJS backend can be deployed to platforms like:
- Heroku
- AWS Elastic Beanstalk
- Digital Ocean App Platform
- Any platform supporting Node.js apps

### Frontend Deployment

The Next.js frontend can be deployed to:
- Vercel (recommended for Next.js)
- Netlify
- GitHub Pages
- Any static site hosting platform

Remember to update the environment variables to point to your deployed backend API.

## Project Features

1. **Home Page**: Displays a list of all tasks with pagination, search, and filtering options
2. **Task Detail Page**: Shows detailed information about a selected task
3. **Create Task Page**: Form to create a new task
4. **Edit Task Page**: Form to edit an existing task

## License

MIT
