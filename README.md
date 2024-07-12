# Todo Manager CRUD Backend API using [Nest](https://github.com/nestjs/nest) Framework

<p>This is a RESTful API for managing Todos using NestJS, TypeORM, MySQL, JWT authentication and Swagger documentation. The API supports CRUD (Create, Read, Update, Delete) operations for todos, with user authentication and authorization.</p>

## Table of Contents

- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Features](#features)
- [Project Structure](#project-structure)
- [License](#license)

## Installation

1. Clone the repository:

```bash
# clone repo
$ git clone https://github.com/avijitsarkar86/todo-app-backend-nest

# go inside the local repo
$ cd todo-app-backend-nest
```

2. Install dependencies:

```bash
$ npm install
```

## Configuration

1. Create a `.env` file in the root directory and add the following environment variables:

```bash

# MYSQL
DB_HOST=localhost
DB_PORT=3306
DB_USER=<your mysql database user>
DB_PASS=<mysql database password>
DB_NAME=todo_manager

# JWT
JWT_SECRET=<random secret>
JWT_EXPIRY=<'60m' | '24h' | '1d'>

```

2. Update the `src/app.module.ts` file with your MySQL database configurations if necessary.

## Running the Application

1. Ensure your MySQL server is running and create the database:

```sql
CREATE DATABASE todo_manager;
```

2. Run the NestJS application:

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev
```

The application will be available at http://localhost:3000.

## API Documentation

Swagger documentation is available at http://localhost:3000/todo-api-doc.

## Testing

Run the unit tests using Jest:

```bash
# unit tests
$ npm run test

# test coverage
$ npm run test:cov
```

## Features

- CRUD Operations for Todos: Create, read, update, and delete todos.
- DTOs for performing the input validations
- JWT Authentication: Secure routes with JWT tokens.
- User Management: Register and authenticate users.
- Swagger Documentation: Automatically generated API documentation.
- Unit Testing: Comprehensive unit tests using Jest.

## Project Structure

```lua
[src]
    ├── app.controller.spec.ts
    ├── app.controller.ts
    ├── app.module.ts
    ├── app.service.ts
    ├── main.ts
    └── [resources]
        ├── [auth]
            ├── auth.controller.ts
            ├── auth.module.ts
            ├── auth.service.spec.ts
            ├── auth.service.ts
            ├── [guard]
                └── jwt-auth.guard.ts
            ├── [interfaces]
                ├── jwt-payload.interface.ts
                └── validated-user-res.interface.ts
            └── jwt.strategy.ts
        ├── [todo]
            ├── [dto]
                ├── create-todo.dto.ts
                ├── todo-serialize.dto.ts
                └── update-todo.dto.ts
            ├── [entities]
                └── todo.entity.ts
            ├── todo.controller.spec.ts
            ├── todo.controller.ts
            ├── todo.module.ts
            ├── todo.service.spec.ts
            └── todo.service.ts
        └── [user]
            ├── [dto]
                ├── create-user.dto.ts
                └── login-user.dto.ts
            ├── [entities]
                └── user.entity.ts
            ├── user.controller.ts
            ├── user.module.ts
            ├── user.service.spec.ts
            └── user.service.ts
```

## License

This project is licensed under the MIT licensed.
