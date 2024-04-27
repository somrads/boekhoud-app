# Use an official Node.js runtime as the base image
FROM node:latest

WORKDIR /usr/app

COPY package*.json .

RUN npm install --quiet

COPY ./ ./

CMD ["npm", "start"] 