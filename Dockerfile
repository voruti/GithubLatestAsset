FROM node:17-alpine

EXPOSE 8099
WORKDIR /home/node/app

COPY ./ ./

CMD [ "node", "index.js" ]
