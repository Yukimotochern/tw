import pino from 'pino';
import pinoCaller from 'pino-caller';

export const logger = pinoCaller(
  pino({
    transport: {
      target: 'pino-pretty',
      options: {
        ignore:
          'pid,hostname,time,caller,responseTime,req.hostname,req.remoteAddress,req.remotePort,req.headers.host,req.headers.user-agent,req.headers.accept,req.headers.cache-control,req.headers.postman-token,req.headers.accept-encoding,req.headers.connection',
      },
    },
    serializers: {
      req(request) {
        return {
          query: `${request.method}: ${request.url}`,
          headers: request.headers,
          hostname: request.hostname,
          remoteAddress: request.ip,
          remotePort: request.socket.remotePort,
        };
      },
    },
    formatters: {
      log(ob) {
        if (typeof ob['caller'] !== 'string') return ob;
        let logLocation = ob['caller'];
        if (logLocation.includes('node_module')) return ob;
        logLocation = ['Object.<anonymous>', 'Object.handler'].reduce(
          (pre, curr) => pre.replace(curr, '').trim(),
          logLocation
        );

        return {
          ...ob,
          logLocation,
        };
      },
    },
  }),
  {
    relativeTo: __dirname,
  }
);
