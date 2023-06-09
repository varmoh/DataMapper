# DataMapper

Testing handlebars and javascript functionality.

## Docker

To run the application using docker run:

```
docker-compose up -d
```

## Handlebars

Handlebars files go to `views` directory.

Example on how to access handlebars in browser:

```
http://localhost:3000/hbs/my/restful/url/myFile
```

## Javascript

Javascript files go to `js` directory.

Example on how to access javascript files in browser:

```
http://localhost:3000/js/my/restful/url/myScript
```

_Note!_ URL must not end with `.js` extension.

## Running on M1 machines

Build using this Dockerfile when running on M1 machines

```
FROM node:19-alpine

RUN apk add --no-cache chromium
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

ENV NODE_ENV development
WORKDIR /workspace/app/

COPY js js
COPY views views
COPY package.json .
COPY server.js .

RUN npm i -g npm@latest
RUN npm install
ENTRYPOINT ["npm","start"]
```
