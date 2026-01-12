FROM node:16-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

ENV DOCKER=true

EXPOSE 8080

CMD ["npm", "start"]