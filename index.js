import mongoose from 'mongoose';
// TODO: implement in the future
import config from 'config/config';
import { logger } from 'config/logger';
import socketAPI from 'appEvents/socketAPI';
import redisAdapter from 'socket.io-redis';
import app from './app';
import startNgrok from 'utils/ngrok';
import dotenv from 'dotenv';
dotenv.config();
const { initSockets } = require('appEvents/handler');

let server;
mongoose.connect(config.mongoose.url, config.mongoose.options).then(() => {
  logger.info('Connected to MongoDB');
  server = app.listen(config.port, async () => {
    logger.info(`Listening to port ${config.port}`);
    // initialize sockets (if handler exists)
    try {
      if (initSockets && typeof initSockets === 'function') {
        initSockets(server);
      }
    } catch (err) {
      logger.error('initSockets error', err);
    }

    // Start ngrok if enabled (development only)
    try {
      await startNgrok();
    } catch (err) {
      logger.error('Error when starting ngrok', err);
    }
  });
});

const exitHandler = () => {
  logger.info('Shutting down server');
  if (server) {
    server.close();
  }
};
const unexpectedErrorHandler = (error) => {
  logger.error(error);
  exitHandler();
};
process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);
process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  if (server) {
    server.close();
  }
});
