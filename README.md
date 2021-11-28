#pinto-express-backend

## How to run this project

### Prerequisite

You need to have Docker and Node.js installed in your computer. Also, you need to have docker-compose in order to run the project.

### Set up .env file

create .env file from .env.example
```
$ cp .env.example .env
```
edit BASE_URL to base url of your backend service to use as  a url for images 
```bash
vim .env

#BASE_URL={url}
```
#### Run the Docker

```sh
$ docker-compose up -d --build
```

#### Verify that docker containers are running

```sh
$ docker ps
```

You should see something like this

```sh
CONTAINER ID   IMAGE     COMMAND                  CREATED          STATUS          PORTS                              NAMES
f5749cb60a9b   nodejs    "docker-entrypoint.s…"   22 seconds ago   Up 20 seconds   0.0.0.0:3000->3000/tcp, 3939/tcp   pinto-express-backend
```
#### Try running it on postman

```
https://www.postman.com/collections/074345b8c06c1fe932f8
```

#### Running application

```
$ npm install
$ nodemon server.js
```

#### How to see log

When thing goes wrong, please try to investigate by seeing container logs.

log should visible in console when running nodemon server.js

### How to deploy

On dev server

clone project from https://github.com/phoolego/pinto-express-backend

then start Docker container of this project
```bash
$ cd pinto-express-backend
$ cp .env.example .env
$ docker-compose up -d --build
```

update container

```bash
$ git pull
$ docker-compose up -d --build
```

#### Created By

Phoo Phuritat Chatyalak (2021-11-28)