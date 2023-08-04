FROM node:18
WORKDIR /usr/src/app

ARG PORT=3001
ENV PORT=${PORT}

ARG ENV_TEST=default
ENV ENV_TEST=${ENV_TEST}

ARG SENTRY_AUTH_TOKEN=defaultsentry
ENV SENTRY_AUTH_TOKEN=${SENTRY_AUTH_TOKEN}

RUN echo $PORT
RUN echo $ENV_TEST
RUN echo $SENTRY_AUTH_TOKEN

COPY package*.json ./

COPY . .

RUN npm install

RUN npm run build

EXPOSE $PORT

CMD [ "npm", "start" ]
