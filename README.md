# Setup Instructions

### Requirements

- **NodeJS**: `v20.11.1`

## Database Setup

1. Install Docker if you haven't already.
2. Run the following command to start a PostgreSQL container:
   ```bash
   docker run --name git -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres
   ```

## Project Setup

1.  Run `npm i` in the root directory to install dependencies.
2.  Replace GitHub's personal access token (PAT) in the `.env` file.
3.  Open `main.ts` in the `api` directory.

    - Uncomment line 40 and comment out line 30. This will create the database and the tables.

4.  Run the following command to start the API: `nx serve api`
5.  Once the tables are created, revert the changes in the `main.ts` file.
6.  Open `http://localhost:4000` in the browser. This will open a GraphQL playground.
7.  Create a mutation with the following code:

    ```
    mutation createUser($username: String!) {
      createUser(username: $username) {
        username
        id
      }
    }

    ```

8.  Assign a value to the `username` variable and execute the mutation.
9.  Retrieve the `id` returned by the mutation.
10. Replace the value of `DEFAULT_USER_ID` in `shared/constants/user.ts` with the retrieved `id`.

## Start the Project

1.  Run the following command to start both the UI and API projects in parallel:

    bash

    ```
    nx run-many --parallel --target=serve --projects=ui,api

    ```

2.  Open `http://localhost:4200` in the browser.
3.  Enter a valid GitHub URL in the input field, e.g., `https://github.com/facebook/react`.
