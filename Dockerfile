# Build stage
FROM node:22-alpine AS build

RUN apk update && apk add --no-cache libc6-compat

WORKDIR .

COPY package*.json . 

RUN npm install

COPY . .

CMD ["node", "bot.js"]
