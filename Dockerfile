FROM node:16.14.2

WORKDIR /home/app

COPY package.json ./

RUN yarn

COPY . .

CMD yarn start