# syntax=docker/dockerfile:1.2
ARG NODE_IMAGE=node:18-alpine

FROM ${NODE_IMAGE}
ENV NODE_ENV=production
EXPOSE 8000
RUN mkdir /app
RUN chown node:node /app
WORKDIR /app
COPY --chown=node:node ["package.json", "package-lock.json*", "tsconfig*.json", "./"]
COPY --chown=node:node ["src", "./src"]
RUN npm ci --omit=dev
USER node
CMD [ "npm", "run", "start" ]
