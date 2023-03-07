FROM node:lts-alpine as build-stage
RUN mkdir -p /app
WORKDIR /app
COPY package*.json ./
COPY tsconfig*.json ./
COPY src ./src
RUN npm i
RUN npm run build


RUN --mount=type=secret,id=SECRETKEY \
  --mount=type=secret,id=EXPIRESIN \
   export SECRETKEY=$(cat /run/secrets/SECRETKEY) && \
   export EXPIRESIN=$(cat /run/secrets/EXPIRESIN) && \
EXPOSE 3001
CMD ["node", "dist/main.js"]
