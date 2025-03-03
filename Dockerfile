FROM node:22-slim

EXPOSE 8099
WORKDIR /home/node/app

COPY ./ ./

CMD [ "node", "index.js" ]
