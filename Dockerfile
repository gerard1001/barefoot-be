FROM node:14-alpine3.12

ARG PORT

WORKDIR /src/app

COPY package*.json ./

RUN yarn install

COPY . .

COPY .env.example .env

EXPOSE ${PORT}

CMD ["yarn", "run", "docker"]
