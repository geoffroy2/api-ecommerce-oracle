FROM node:18-alpine

LABEL version="1.0" descritpion="Node image prod"

WORKDIR /appecomme/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD [ "npm","start" ]
