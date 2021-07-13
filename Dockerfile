FROM node:16-alpine

EXPOSE 8099
WORKDIR /home/node/app

COPY ./ ./

CMD [ "npm", "start" ]
