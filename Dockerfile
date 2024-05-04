FROM node:20.10-alpine

WORKDIR /usr/src/app

COPY package*.json ./


COPY . .

# RUN npm install --f

EXPOSE 3000

CMD [ "node","app.js" ]