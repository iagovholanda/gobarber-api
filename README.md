<h1 align="center">
<br>
  <img src="https://images.vexels.com/media/users/3/130997/isolated/preview/64ec043e6b3d119f5ea79ba54a03b1bf-hipster-rolou-bigode-2-by-vexels.png" alt="GoBarber" width="180">
<br>
<br>
GoBarber API
</h1>

<p align="center">An API for barber appointment and scheduling.</p>


<hr />

## Features

A Node.js API built with Express and all the latest tools and best practices in development!

- ☑️ **Express** — A web framework for Node
- ☑️ **Sequelize** — SQL dialect ORM for Node.js
- ☑️ **MongoDB** — document-based database
- ☑️ **Redis** — key-value data model
- ☑️ **Yup** - Object schema validation
- ☑️ **Sentry** - cross-platform application monitoring
- ☑️ **Nodemailer** - Send e-mails with Node.JS
- ☑️ **Lint** — ESlint/Prettier/Editor Config

## Dependencies

- [Node.js](https://nodejs.org/en/) 8.0.0 ou >
- [Yarn](https://yarnpkg.com/pt-BR/docs/install)
- [Docker](https://www.docker.com/)

## Docker Containers

The following Docker images were used for building the application.

- `docker run --name redisbarber -p 6379:6379 -d -t redis:alpine`;
- `docker run --name mongobarber -p 27017:27017 -d -t mongo`;
- `docker run --name database -e POSTGRES_PASSWORD=docker -p 5433:5432 -d postgres`;

## Starting application

1. Clone this repo using `https://github.com/iagovholanda/gobarber-api.git`
2. Move to the appropriate directory: `cd gobarber-api`.<br />
3. Run `yarn` to install dependencies.<br />
4. Copy the `.env.example` file and rename it to `.env`.<br/>
5. Add all the values for the environment variables.<br/>
6. Run `yarn start` and `yarn queue` to run the servers at `http://localhost:3333`.
