Cabal Barefoot Nomad Backend Development

[![Reviewed by Hound](https://img.shields.io/badge/Reviewed_by-Hound-8E64B0.svg)](https://houndci.com)[![CircleCI](https://circleci.com/gh/atlp-rwanda/cabal-bn-be/tree/dev.svg?style=svg)](https://circleci.com/gh/atlp-rwanda/cabal-bn-be/tree/dev)[![Coverage Status](https://coveralls.io/repos/github/atlp-rwanda/cabal-bn-be/badge.svg?branch=dev)](https://coveralls.io/github/atlp-rwanda/cabal-bn-be?branch=dev)




---
## Project Setup
---

### Start Up
* Clone [this](https://github.com/atlp-rwanda/cabal-bn-be.git) repository
* Make sure that you have node.js and npm installed on your machine. For more information refer to [node js installation guide](https://nodejs.org/en/download/package-manager/)
* Install `yarn` package by running `npm install -g yarn` script to be able to install project dependencies.
* To install project packages run `yarn install`.

### Dotenv setup
  * Create ``` .env ``` in project root directory
  * Open ``` .env.example ```  file to to get project environment variables.
  * Copy all keys from the ``` .env.example ```  file to ``` .env ``` file and add values to corresponding keys. These can be obtained from the project administrator.

### Sequelize ORM Setup

1. **Configuring** `.env`
     - Download and install [pgAdmin](https://www.postgresql.org/download/)
     - Create two databases, one for testing and another for development.
     - Copy  `DATABASE_DEV_URL=postgres://your_db_user:your_password@127.0.0.1:5432/your_dev_db_name` and `DATABASE_TEST_URL=postgres://your_db_user:your_password@127.0.0.1:5432/your_test_db_name` URLs from ```.env.example``` to ```.env```
     - Edit them with your real database user, password and database name.

2. **Running Migrations**
     - Run ``` yarn dbmigrate ``` in terminal to fire up migration

3. **To Undo Migrations**
     - Run ``` yarn migrate:undo``` to undo all migrations
4. **To Reset Migrations**
     - Run ```yarn migrate:reset``` to reset all migrations.

5. **Running Seeds**
     - Run `yarn seeding` to seed all
 
You can run all those scripts with a single script ```yarn dbmigrate:all```

### Running server
- Run `yarn dev` to run server locally

### Running tests
- Run `yarn test` to run tests

### API Production Link
[Production Link](https://barefoot-backend-development.herokuapp.com/)

### API Documentation
- Local:

  `http://localhost:{port}/api-docs/`
  
   Replace `{port}` with the port specified in `.env` file. 
    Example `http://localhost:5000/api-docs/`
   
- Remote:

  [Swagger Documentation](https://barefoot-backend-development.herokuapp.com/api-docs)
