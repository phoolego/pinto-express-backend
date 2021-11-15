FROM node:16.0.0-alpine
USER root
RUN npm config set unsafe-perm true
RUN npm install -g nodemon
RUN mkdir -p /home/node/app/node_modules && chown -R root:root /home/node/app && mkdir -p /app/uploads
WORKDIR /app
RUN apk update && apk add --no-cache tzdata
COPY package*.json ./
# USER node
RUN npm install
COPY . .
EXPOSE 3939

CMD [ "node", "index.js" ]
