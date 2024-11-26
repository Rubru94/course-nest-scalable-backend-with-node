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

# Teslo API

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

4. Clone file ```.env.template``` & rename to ```.env```. 
   
5. Fill in environment variables in ```.env``` file.
   
6. Run database

   ```bash
   $ docker compose up -d
   ```

7. Run app

   ```bash
   $ npm run start:dev
   ```

8. Run seed
   ```
   POST: http://localhost:3000/api/seed
   ```

## Stack

- PostgreSQL
- Nest

## Bibliography

- [Database connection](https://docs.nestjs.com/techniques/database)
- [Teslo-seed-products](https://gist.github.com/Klerith/1fb1b9f758bb0c5b2253dfc94f09e1b6)
- [Typeorm - Eager and Lazy Relations](https://orkhan.gitbook.io/typeorm/docs/eager-and-lazy-relations)
- [Typeorm - Query Builder](https://orkhan.gitbook.io/typeorm/docs/insert-query-builder)
- [Typeorm - Query Runner](https://orkhan.gitbook.io/typeorm/docs/query-runner)
- [Klerith/nest-teslo-shop - Postgres & TypeORM](https://github.com/Klerith/nest-teslo-shop/tree/fin-seccion-10)
- [Klerith/nest-teslo-shop - Relationships TypeORM](https://github.com/Klerith/nest-teslo-shop/tree/fin-seccion-11)
- [Klerith/nest-teslo-shop - File upload](https://github.com/Klerith/nest-teslo-shop/tree/fin-seccion-12)
- [nestjs - File upload](https://docs.nestjs.com/techniques/file-upload)
- [Klerith/nest-teslo-shop - Authentication & authorization](https://github.com/Klerith/nest-teslo-shop/tree/fin-seccion-13)
- [nestjs - Swagger - openapi](https://docs.nestjs.com/openapi/introduction)
- [5 tips for better Swagger docs in NestJS](https://dev.to/antoncodes/5-tips-for-better-swagger-docs-in-nestjs-ng9)
- [Klerith/nest-teslo-shop - Swagger - openapi](https://github.com/Klerith/nest-teslo-shop/tree/fin-seccion-14)
- [nestjs - Websocket Gateways](https://docs.nestjs.com/websockets/gateways)

