FROM node:lts-alpine as build-stage
RUN mkdir -p /app
WORKDIR /app
COPY package*.json ./
COPY tsconfig*.json ./
COPY vite.config*.ts ./
COPY src ./src
COPY index.html ./
RUN npm i -f
RUN npm run build

FROM nginx:stable-alpine as production-stage
EXPOSE 80
COPY nginx.conf /etc/nginx/conf.d/default.conf
RUN rm -rf /usr/share/nginx/html/*
COPY --from=build-stage /app/dist /usr/share/nginx/html
CMD ["nginx", "-g", "daemon off;"]