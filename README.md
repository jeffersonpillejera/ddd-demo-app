# E-commerce Core

A microservice built in a [Monorepo](https://www.atlassian.com/git/tutorials/monorepos). This project can contain multiple services and shared packages that work together to provide comprehensive ecommerce management functionality.

## What's inside?

This monorepo includes the following packages/apps:

    .
    ├── apps
    │   ├── customer                  # customer service API.
    │   └── <microservices>           # NestJS app (https://nestjs.com).
    └── packages
        ├── @ecore/eslint-config      # `eslint` configurations (includes `prettier`)
        ├── @ecore/jest-config        # `jest` configurations
        ├── @ecore/typescript-config  # `tsconfig.json`s used throughout the monorepo
        └── @ecore/<share-libraries>  # Shared `NestJS` resources.

Each package and application are 100% [TypeScript](https://www.typescriptlang.org/) safe.

### Utilities

This monorepo is built using [Turborepo](https://turborepo.com) and has some additional tools:

- [NestJS](https://nestjs.com) for Node.js server-side application framework
- [TypeScript](https://www.typescriptlang.org/) for static type-safety
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting
- [Jest](https://prettier.io) for testing

## Useful Links

Learn more about the power of Turborepo:

- [Tasks](https://turborepo.com/docs/crafting-your-repository/running-tasks)
- [Caching](https://turborepo.com/docs/crafting-your-repository/caching)
- [Remote Caching](https://turborepo.com/docs/core-concepts/remote-caching)
- [Filtering](https://turborepo.com/docs/crafting-your-repository/running-tasks#using-filters)
- [Configuration Options](https://turborepo.com/docs/reference/configuration)
- [CLI Usage](https://turborepo.com/docs/reference/command-line-reference)
