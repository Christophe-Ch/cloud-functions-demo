FROM node:alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY ./ ./
RUN npm run build:ssr

FROM node:alpine
WORKDIR /app
COPY --from=build /app/dist/ ./dist/
EXPOSE 4000
ENTRYPOINT ["node", "/app/dist/arrival-times-app/server/main.js"]