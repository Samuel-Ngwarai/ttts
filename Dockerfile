FROM node:12
WORKDIR /usr/src/app

ARG PORT=3001
ENV PORT=${PORT}

COPY package*.json ./

COPY . .

RUN npm install

RUN npm run build

EXPOSE $PORT

CMD [ "npm", "start" ]
