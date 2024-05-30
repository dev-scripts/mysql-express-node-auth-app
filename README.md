# Project Setup and Local Run Guide

This guide provides step-by-step guide on setting up and running the "mysql-expense-node-auth-app" project locally on your machine. Please follow the steps outlined below.

Below is a summary of key features and instructions for running the project:

## Features:

### Technology Stack:

1. Express.js and TypeScript for server-side development.
2. TypeORM for database interactions.
3. Passport for authentication strategies.
4. Swagger for API documentation.

### Development Tools:

1. Nodemon for automatic server restart during development.
2. ts-node for running TypeScript files directly.
3. Concurrently for running multiple npm scripts concurrently.
4. Database Migrations:

TypeORM is used for managing database migrations.
Commands for creating, generating, applying, and rolling back migrations are provided.

## Prerequisites

Before getting started, ensure that you have the following installed on your machine:

- Node.js: [Download and Install Node.js](https://nodejs.org/)
- npm (Node Package Manager): Included with Node.js installation

## Project Setup

1. **Clone the Repository:**
   Open a terminal and run the following command to clone the project repository:

   ```bash
   git clone https://github.com/dev-scripts/mysql-expense-node-auth-app.git
   ```

2. **Navigate to the Project Directory:**
   Change into the project directory using the following command:

   ```bash
   cd mysql-expense-node-auth-app
   ```

3. **Install Dependencies:**
   Install project dependencies by running:

   ```bash
   npm install
   ```

## Running the Project Locally

### Development Mode

To run the project in development mode with automatic restart on file changes, execute the following command:

```bash
npm run dev
```

This command uses `nodemon` to watch for changes in the `src` directory and automatically restarts the server.

### Production Mode

To start the project in production mode, use:

```bash
npm start
```

### Swagger Documentation

To generate Swagger documentation, use the following command:

```bash
npm run swagger
```

This command generates Swagger specs based on your TypeScript code.

## Database Migrations

The project includes commands for managing database migrations using TypeORM.

- **Create a Migration:**

  ```bash
  npm run migration:create
  ```

- **Generate a Migration:**

  ```bash
  npm run migration:generate
  ```

- **Run Migrations:**

  ```bash
  npm run migration:up
  ```

- **Rollback Migrations:**

  ```bash
  npm run migration:down
  ```

## Additional Notes

- **Environment Variables:**
  Create a `.env` file in the project root with the necessary environment variables. You can refer to the provided `.env.example` file for guidance.

- **Swagger UI:**
  Access the Swagger UI at `http://localhost:3000/docs` to interact with the API documentation.

- **Concurrent Commands:**
  The `concurrently` package allows you to run multiple npm scripts concurrently. This is utilized in the `npm run dev` command.

---

Now you should have the "mysql-expense-node-auth-app" project up and running locally. If you encounter any issues, please refer to the project documentation or seek assistance from the project's maintainers.

Feel free to customize the content as needed for your specific project.
