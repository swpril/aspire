# Setup Instructions

### Requirements

- **NodeJS**: `v20.11.1`

## Database Setup

1. Install Docker if you haven't already.

2. Run the following command to start a PostgreSQL container:

```bash

docker run --name git -e POSTGRES_PASSWORD=postgres  -p  5432:5432  -d  postgres

```

## Project Setup

1. Run `npm i` in the root directory to install dependencies.

2. Open `main.ts` in the `api` directory.

3. Uncomment line 38 and comment out line 37. This will create the database and the tables.

4. Run the following command to start the API: `nx serve api`

5. Once the tables are created, revert the changes in the `main.ts` file.

6. Open `http://localhost:4000/graphql` in the browser. This will open a GraphQL playground.

## Start the Project

1. Run the following command to start both the UI and API projects in parallel:

```

nx run-many --parallel --target=serve --projects=ui,api

```

2. Open `http://localhost:4200` in the browser.

3. Login via github.

4. Enter the repository url i.e `https://github.com/facebook/react`

# Project Summary

## Implemented Features

1. **Login via GitHub**: Users can log in using their GitHub credentials.

2. **Repository Tracking**: Users can track repositories by their GitHub URL.

3. **Visual Indicator**: Visual indicators show users if they have seen all the releases of a particular repository.

4. **Refresh Repository and Releases**: Users can refresh the repository and their releases to get the latest updates.

5. **Detailed Release Notes**: Users can view detailed release notes of repository versions.

6. **Mark Version as Seen**: Users have the ability to mark a particular version as seen.

7. **Client-Side Search**: Users can search for repositories by name or description on the client side.

8. **Lazy Loaded Releases**: Repository releases are lazy loaded to improve performance.

9. **Client-Side Caching**: Repository releases are cached on the client side to reduce load times.

10. **Multi-Tab Login/Logout**: If a user logs in or out in one tab, all other tabs will reflect this change by logging in or out as well.

## Areas for Improvement

1. **Server-Side Pagination**: Implement server-side pagination for the repository list and releases to improve loading performance.

2. **Server-Side Rendering (SSR)**: Implement server-side rendering to improve the loading performance of the app.

3. **User Experience (UX)**: Enhance the overall user experience for better usability.

4. **Real-Time Updates**: Implement real-time updates via push notifications for timely updates.

5. **Periodic Data Fetching**: Use CRON jobs to fetch data periodically and keep the information up to date.

6. **Server-Side Sorting/Filtering**: Implement sorting and filtering on the server side to improve efficiency.

7. **Secure JWT Tokens**: Secure JWT tokens via HTTP-only cookies for enhanced security.

8. **Progressive Web App (PWA)**: Convert the application into a Progressive Web App (PWA) to improve performance, offline capabilities, and user experience.
