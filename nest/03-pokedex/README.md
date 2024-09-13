<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Run dev environment

1. Clone repository
2. Run
   
   ```bash
   $ npm install
   ```
3. Nest CLI installed

   ```bash
   $ npm i -g @nestjs/cli
   ```

4. Run database

   ```bash
   $ docker compose up -d
   ```

5. Clone file ```.env.template``` & rename to ```.env```. 
   
6. Fill in environment variables in ```.env``` file.

7. Run app

   ```bash
   $ npm run start:dev
   ```

8. Rebuilding database with the seed

   ```bash
   $ http://localhost:3000/api/v2/seed
   ```

## Run prod environment

1. Create file `.env.prod`
   
2. Fill in environment variables in ```.env.prod``` file.

3. Create image

   ```bash
   $ docker compose -f docker-compose.prod.yaml --env-file .env.prod up -d
   ```

> [!NOTE]  
> Use `--build` if you want to reconstruct the image, e.g. after changes.
>```bash
>$ docker compose -f docker-compose.prod.yaml --env-file .env.prod up -d --build
>```

## Stack

- MongoDB
- Nest



## Bibliography

- [Mongo connection](https://docs.nestjs.com/techniques/mongodb)
- [HTTP response status codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)
- [Klerith/nest-pokedex repo](https://github.com/Klerith/nest-pokedex/tree/fin-seccion-7)
- [pokeapi](https://pokeapi.co/)
- [joi - schema description language and data validator for JavaScript](https://www.npmjs.com/package/joi)
- [railway - cloud infrastructure deployment platform ](https://railway.app/)
- [Dockerfile & docker-compose.yaml](https://gist.github.com/Klerith/e7861738c93712840ab3a38674843490)
- [Comandos RUN, CMD y ENTRYPOINT en Dockerfile](https://dockertips.com/comandos-run-cmd-y-entrypoint-en-el-dockerfile)
