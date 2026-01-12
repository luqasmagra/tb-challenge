# TB Code Challenge

Full Stack application consisting of a REST API (Node.js + Express) and a Frontend client (React + Bootstrap + Redux).

## Project Structure

```
toolbox-challenge/
├── api/                    # Backend API (Node 14)
│   ├── src/
│   │   ├── controllers/
│   │   ├── errors/
│   │   ├── services/
│   │   ├── routes/
│   │   └── middlewares/
│   ├── test/
│   ├── Dockerfile
│   └── package.json
├── client/                 # React Client (Node 16)
│   ├── src/
│   │   ├── components/
│   │   ├── store/          # Redux
│   │   ├── services/
│   │   └── hooks/
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml
└── README.md
```

## Quick Start with Docker

The easiest way to run the entire app:

```bash
docker-compose up --build
```

This will start:

- API at http://localhost:3000
- Client at http://localhost:8080

## Manual Setup

### API (Backend)

```bash
cd api
npm install
npm start       # Start server on port 3000
npm run dev     # Watch mode
npm test        # Run tests
npm run lint    # Check StandardJS
```

**Endpoints:**

- `GET /files/data` - Get all files data formatted
- `GET /files/data?fileName=file1.csv` - Filter by file name
- `GET /files/list` - Get available files list
- `GET /health` - Health check

### Client

```bash
cd client
npm install
npm start       # Start server on port 8080
npm run build   # Build for production
npm run lint    # Check StandardJS
```

## Stack

### API

- [x] Node.js 14
- [x] Express.js
- [x] JavaScript ES6+
- [x] Mocha + Chai tests
- [x] StandardJS linting

### Frontend

- [x] Node.js 16
- [x] React
- [x] Webpack
- [x] Redux

### Global

- [x] Docker / Docker Compose

## Author

Lucas - Full Stack Developer
