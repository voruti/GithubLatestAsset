FROM node:24.22.2-slim@sha256:c86ecead9e55a5210ac1727de38a4ca840bf03dcaf34dc9749addbf383b1920c

EXPOSE 8099
WORKDIR /home/node/app

COPY ./ ./

CMD [ "node", "index.js" ]
