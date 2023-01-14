import { buildApp } from './app/app';

const server = buildApp();

server.listen(
  {
    port: 5000,
    host: '0.0.0.0',
  },
  (err) => {
    if (err) {
      server.log.error(err);
      process.exit(1);
    }
  }
);
