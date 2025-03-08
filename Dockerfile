# Build stage
FROM node:22-alpine AS build

RUN apt-get update && apt-get install -y libc6

WORKDIR .

COPY package*.json . 

RUN npm install

COPY . .

CMD ["node", "bot.js"]
