FROM node:alpine as build
WORKDIR /app
COPY package*.json .
RUN npm install
COPY ./ ./
EXPOSE 4200
CMD ["node_modules/@angular/cli/bin/ng", "serve", "--host", "0.0.0.0"]