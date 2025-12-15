# Warehouse Core

An application built in a [Monorepo](https://www.atlassian.com/git/tutorials/monorepos) architecture for the warehouse portal system. This project can contain multiple services and shared packages that work together to provide comprehensive warehouse management functionality.

## What's inside?

This monorepo includes the following packages/apps:

    .
    ├── apps
    │   ├── warehouse-api             # Warehouse core API.
    │   └── <microservices>           # NestJS app (https://nestjs.com).
    └── packages
        ├── @wcore/azure-auth         # Authentication library
        ├── @wcore/eslint-config      # `eslint` configurations (includes `prettier`)
        ├── @wcore/jest-config        # `jest` configurations
        ├── @wcore/typescript-config  # `tsconfig.json`s used throughout the monorepo
        └── @wcore/<share-libraries>  # Shared `NestJS` resources.

Each package and application are 100% [TypeScript](https://www.typescriptlang.org/) safe.

### Utilities

This monorepo is built using [Turborepo](https://turborepo.com) and has some additional tools:

- [NestJS](https://nestjs.com) for Node.js server-side application framework
- [TypeScript](https://www.typescriptlang.org/) for static type-safety
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting
- [Jest](https://prettier.io) for testing

### Run with Docker Compose

The easiest way to run the entire application stack is using Docker Compose:

```bash
# Start all services (PostgreSQL, Redis, and the warehouse-api app)
docker compose --env-file ./apps/warehouse-api/.env up -d

# View logs
docker compose logs -f

# Stop all services
docker compose down

# Rebuild and start services
docker compose --env-file ./apps/warehouse-api/.env up -d --build
```

The Docker Compose setup includes:

- **PostgreSQL database** with the warehouse schema
- **Redis server** for caching and session management
- **Warehouse API** service

Make sure you have the `.env` file configured in the `apps/warehouse-api` folder before running Docker Compose.

### Development Setup

#### Pre-requisites

1. Node.js v22+ installed
2. PostgreSQL installed/dockerized

#### Setup PostgreSQL database

1. Create warehouse schema on PostgreSQL
2. Create/Copy over .env file inside apps/warehouse-api folder
3. Update .env file to use your local DATABASE_URL (e.g. postgres://postgres:mysecretpassword@127.0.0.1:5432/warehouse?connection_limit=5)

#### Important development environment setup before you clone the repo in Windows

```bash
git config --global core.autocrlf false

git clone https://github.com/pcs-wireless/warehouse-core.git

# If you want to turn on global autocrlf afterwards run this
git config --global core.autocrlf true
cd '<YOUR_DIRECTORY>/warehouse-core'
git config core.autocrlf false
```

#### Install [pnpm](https://pnpm.io/installation)

```bash
# Install using npm
npm install -g pnpm@latest-10

# Setup to allow installation of global packages (restart terminal afterwards)
pnpm setup

# Go to repository folder
cd '<YOUR_DIRECTORY>/warehouse-core'

# Install dependencies
pnpm install

# Deploy prisma schema to PostgreSQL database
cd apps/warehouse-api
pnpm run prisma:migrate
```

#### Setup MS-SQL database

_NOTE: This is for the IMEI Commas module since we connect to a separate MS-SQL db for that_

1. Create a local MS-SQL docker container using the following command:

```bash
docker run --name imei-commas-db -e "ACCEPT_EULA=Y" -e "MSSQL_SA_PASSWORD=YourStrongPassword123!" -p 1433:1433 -d mcr.microsoft.com/mssql/server:2022-latest
```

2. Connect to the db using Azure Data Studio (or any SQL client you want) and run the queries in the `imei-commas-db.sql` file located in the `.dbscripts` folder

3. Add the following to the .env file inside `apps/warehouse-api`:

```
MSSQL_USER=sa
MSSQL_PASSWORD=YourStrongPassword123!
MSSQL_HOST=localhost
MSSQL_DATABASE=testdb
```

#### Setup local Redis server (temp.)

_NOTE: This may not be needed once we have a dev/staging redis server_

1. Create a local Redis docker container using the following command:

```bash
docker run --name warehouse-redis -d -p 6379:6379 redis
```

2. Add the following to the .env file inside `apps/warehouse-api`:

```
REDIS_URL=redis://localhost:6379
```

#### Swagger API Documentation

To view the Swagger docs, run the warehouse-api using this command

```bash
pnpm run dev
```

Then go to the localhost API URL which depends on your port in .env file
(e.g. http://localhost:3143/api)

Request authorization is bypassed if in your .env file, you have the following:

```
NODE_ENV=development
BYPASS_AUTH=true
BYPASS_USER={"oid":"123",...}
```

### Commands

This `Turborepo` already configured useful commands for all your apps and packages.

#### Build

```bash
# Will build all the app & packages with the supported `build` script.
pnpm run build

# ℹ️ If you plan to only build apps individually,
# Please make sure you've built the packages first.
```

#### Develop

```bash
# Will run the development server for all the app & packages with the supported `dev` script.
pnpm run dev
```

#### Test

```bash
# Will launch a test suites for all the app & packages with the supported `test` script.
pnpm run test

# You can launch e2e testes with `test:e2e`
pnpm run test:e2e

# See `@repo/jest-config` to customize the behavior.
```

#### Lint

```bash
# Will lint all the app & packages with the supported `lint` script.
# See `@repo/eslint-config` to customize the behavior.
pnpm run lint
```

#### Format

```bash
# Will format all the supported `.ts,.js,json,.tsx,.jsx` files.
# See `@repo/eslint-config/prettier-base.js` to customize the behavior.
pnpm format
```

<!-- ### Remote Caching

> [!TIP]
> Vercel Remote Cache is free for all plans. Get started today at [vercel.com](https://vercel.com/signup?/signup?utm_source=remote-cache-sdk&utm_campaign=free_remote_cache).

Turborepo can use a technique known as [Remote Caching](https://turborepo.com/docs/core-concepts/remote-caching) to share cache artifacts across machines, enabling you to share build caches with your team and CI/CD pipelines.

By default, Turborepo will cache locally. To enable Remote Caching you will need an account with Vercel. If you don't have an account you can [create one](https://vercel.com/signup?utm_source=turborepo-examples), then enter the following commands:

```bash
npx turbo login
```

This will authenticate the Turborepo CLI with your [Vercel account](https://vercel.com/docs/concepts/personal-accounts/overview).

Next, you can link your Turborepo to your Remote Cache by running the following command from the root of your Turborepo:

```bash
npx turbo link
``` -->

## Useful Links

Learn more about the power of Turborepo:

- [Tasks](https://turborepo.com/docs/crafting-your-repository/running-tasks)
- [Caching](https://turborepo.com/docs/crafting-your-repository/caching)
- [Remote Caching](https://turborepo.com/docs/core-concepts/remote-caching)
- [Filtering](https://turborepo.com/docs/crafting-your-repository/running-tasks#using-filters)
- [Configuration Options](https://turborepo.com/docs/reference/configuration)
- [CLI Usage](https://turborepo.com/docs/reference/command-line-reference)
