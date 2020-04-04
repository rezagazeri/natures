const dotEnv = require('dotenv');

dotEnv.config({
  path: './config.env'
});
process.on('uncaughtException', err => {
  console.log(err.name, err.message);
  process.exit(1);
});
const app = require('./app');
const {
  DBconnection
} = require('./DB/config');

DBconnection();

const port = process.env.PORT || 4000;
const server = app.listen(port, () => {
  console.log('hello from server');
});

process.on('unhandledRejection', err => {
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});