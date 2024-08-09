FROM node:alpine3.15

ENV SERVER_HOSTNAME=localhost
ENV SERVER_PORT=8080
ENV SSL_MODE=false
ENV PG_HOST=localhost
ENV PG_DATABASE=postgres
ENV PG_USERNAME=postgres
ENV PG_PASSWORD=ciefD8mf421!
ENV PG_PORT=5432

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY . .
RUN npm ci
RUN npm run compile

EXPOSE 8080
CMD [ "npm", "run", "start-prod" ]
