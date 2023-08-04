FROM node:18
WORKDIR /usr/src/app

ARG PORT=3001
ENV PORT=${PORT}

ARG ENV_TEST=default
ENV ENV_TEST=${ENV_TEST}

RUN echo $PORT
RUN echo $ENV_TEST

COPY package*.json ./

COPY . .

RUN npm install

RUN npm run build

EXPOSE $PORT

CMD [ "npm", "start" ]
