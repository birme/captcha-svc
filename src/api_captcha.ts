import { FastifyPluginCallback } from 'fastify';
import { generateSlug } from 'random-word-slugs';
import SvgCaptcha from 'svg-captcha';

interface CaptchaResponse {
  id: string;
  svg: string;
}
interface VerificationResponse {
  message: string;
}
interface ErrorResponse {
  message: string;
}
type CaptchaGetResponse = CaptchaResponse | ErrorResponse;
type VerifyCaptchaResponse = VerificationResponse | ErrorResponse;

const captchas: Record<string, SvgCaptcha.CaptchaObj> = {};

const apiCaptcha: FastifyPluginCallback = (fastify, opts, next) => {
  fastify.setErrorHandler((error, request, reply) => {
    reply.code(500).send({ message: error.message });
  });

  fastify.get<{ Reply: CaptchaGetResponse }>('/captcha', async (_, reply) => {
    try {
      const captcha = SvgCaptcha.create();
      const id = generateSlug();
      captchas[id] = captcha;
      const b64encoded = Buffer.from(captcha.data).toString('base64');
      console.log(`Captcha ${id}: ${captcha.text}`);
      reply
        .code(200)
        .send({ id, svg: `data:image/svg+xml;base64,${b64encoded}` });
    } catch (err) {
      console.error(err);
      reply.code(500).send({ message: 'Internal server error' });
    }
  });

  fastify.get<{
    Params: { id: string; answer: string };
    Reply: VerifyCaptchaResponse;
  }>('/verify/:id/:answer', async (request, reply) => {
    try {
      const { id, answer } = request.params;
      const captcha = captchas[id];
      if (!captcha) {
        reply.code(404).send({ message: 'Captcha not found' });
        return;
      }
      if (captcha.text === answer) {
        reply.code(200).send({ message: 'Captcha is correct' });
      } else {
        reply.code(400).send({ message: 'Captcha is incorrect' });
      }
    } catch (err) {
      console.error(err);
      reply.code(500).send({ message: 'Internal server error' });
    }
  });
  next();
};

export default apiCaptcha;
