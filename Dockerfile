FROM node:18-alpine

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app
COPY package*.json ./
COPY ./ ./

RUN npm install

RUN npm run build

EXPOSE 3000

CMD [ "npm", "run", "start" ]