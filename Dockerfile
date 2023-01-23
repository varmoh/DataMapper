FROM node:19

ENV NODE_ENV development
WORKDIR /workspace/app/

COPY js js
COPY views views
COPY package.json .
COPY server.js .

RUN npm i -g npm@latest
RUN npm install
RUN npm start