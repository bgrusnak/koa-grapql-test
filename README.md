# Koa-Docker-PG-GraphQL API test

This is the test example of dockerized Node/Koa + PostgresQL + GraphQL backend

## Running the project

#### Install dependencies
```bash
$ npm i
```

#### Copy environment variables

The project makes use of the `dotenv` project to specify and share environment variables.

```bash
$ make env # or cp dev.env .env
``` 

#### Makefile
The project uses a Makefile. This hopefully helps you type less `npm run *` and feels more natural.

#### Docker up and running

```bash
$ make docker  
```

#### Docker up in background mode

```bash
$ make docker-start 
```
#### Stop docker working in background mode

```bash
$ make docker-stop
```
#### Restart docker working in background mode

```bash
$ make docker-restart
```

## Configuration

The project makes use of `dotenv`. All environment variables are validated at runtime through `server/config.js`. That module uses `Joi` to do some runtime validation on variables, and can stop the process from running if the environment isn't configured correctly.

The following command copies environment variables.

```bash
$ cp dev.env .env
```
 
