FROM node:lts-alpine as build-stage
RUN mkdir -p /app
WORKDIR /app
COPY package*.json ./
COPY tsconfig*.json ./
COPY src ./src
RUN npm i
RUN npm run build

EXPOSE 3001
CMD ["node", "dist/main.js"]