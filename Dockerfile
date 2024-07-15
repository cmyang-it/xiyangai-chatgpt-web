# build front-end
FROM node:18-alpine AS frontend

WORKDIR /app

COPY ./package.json /app
COPY ./package-lock.json /app

RUN npm install

COPY . /app

RUN npm run build

# build backend
FROM node:18-alpine as backend

WORKDIR /app

COPY /service/package.json /app
COPY /service/package-lock.json /app

RUN npm install

COPY /service /app

RUN npm run build

# service
FROM node:18-alpine

WORKDIR /app

COPY /service/package.json /app
COPY /service/package-lock.json /app

RUN npm install --production && rm -rf /root/.npm  /usr/local/share/.cache /tmp/*

COPY /service /app

COPY --from=frontend /app/dist /app/public

COPY --from=backend /app/build /app/build

EXPOSE 3002

CMD ["npm", "run", "prod"]
