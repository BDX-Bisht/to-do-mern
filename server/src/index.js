import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';
import { connectDB } from './config/db.js';
import { errorHandler, notFoundHandler } from './middleware/errorMiddleware.js';
import taskRoutes from './routes/taskRoutes.js';

const app = express();
const port = Number(process.env.PORT) || 5000;

const allowedOrigins = (process.env.CLIENT_ORIGIN || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins.length > 0 ? allowedOrigins : true,
  })
);
app.use(express.json());

function sendStatusText(_req, res) {
  const dbReady = mongoose.connection.readyState === 1;
  const dbStatus = dbReady ? 'connected' : 'disconnected';
  res
    .type('text/plain')
    .send(`Project backend is working fine! (MongoDB: ${dbStatus})`);
}

app.get('/', sendStatusText);
app.get('/test', sendStatusText);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/tasks', taskRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

async function startServer() {
  await connectDB();
  app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

export default app;

