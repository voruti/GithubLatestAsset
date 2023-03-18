FROM node:19

EXPOSE 8099
WORKDIR /home/node/app

COPY ./ ./

CMD [ "node", "index.js" ]
