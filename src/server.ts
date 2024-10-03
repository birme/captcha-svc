import fastify from 'fastify';
import cors from '@fastify/cors';
import apiCaptcha from './api_captcha';

async function main() {
  const server = fastify({ ignoreTrailingSlash: true });
  server.register(cors);

  server.get<{ Reply: { message: string } }>('/', async (_, reply) => {
    reply.send({ message: 'Hello, world!' });
  });
  server.register(apiCaptcha);

  const PORT = process.env.PORT ? Number(process.env.PORT) : 8000;

  server.listen({ port: PORT, host: '0.0.0.0' }, (err, address) => {
    if (err) {
      throw err;
    }
    console.log(`Server listening on ${address}`);
  });
}

export default main();
