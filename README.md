# Al Barq API

Backend I built for Al Barq, a courier and shipping company in Iraq, from October 2023 to September 2024. It replaced the company's earlier PHP system and served its React web dashboard and its mobile app.

## Features

-   REST API for companies, branches, warehouses, locations, clients, stores, employees and orders.
-   PostgreSQL through Prisma (36 models), with JWT login and permissions per role, from company manager to delivery agent.
-   Orders with 12 statuses and a timeline, plus rule-based automatic status updates per branch and governorate on an hourly cron job.
-   Reports per company, client, branch, warehouse, delivery agent and governorate, rendered as PDFs with Puppeteer and Handlebars, and order receipts with barcodes and QR codes.
-   Firebase push notifications, image uploads to S3-compatible storage, and Swagger docs generated from the routes.

## Technology Stack

-   Node.js, Express and TypeScript
-   PostgreSQL with Prisma
-   Zod for validation, JWT and bcrypt for authentication, Helmet and CORS
-   Swagger (swagger-autogen) for API docs
-   Puppeteer and Handlebars for PDFs
-   Firebase Admin for push notifications
-   Biome for linting and formatting
-   Docker for deployment

## Getting Started

### Prerequisites

-   [PostgreSQL](https://www.postgresql.org/)
-   [Node.js](https://nodejs.org/en/)
-   [Yarn](https://yarnpkg.com/)

### Installation Steps

1. Clone the repository:

```
git clone https://github.com/alikehel/delivery-company-api.git
cd delivery-company-api
```

2. Install dependencies:

```
yarn
```

3. Copy `.env.example` to `.env` and fill in the values for your setup:

```
PORT=
NODE_ENV=""
JWT_SECRET=""
JWT_EXPIRES_IN=""
SECRET=""
DATABASE_URL=""
AWS_S3_BUCKET=""
AWS_PROFILE=""
AWS_REGION=""
AWS_ACCESS_KEY_ID=""
AWS_SECRET_ACCESS_KEY=""
```

4. Start PostgreSQL and create the database named in `DATABASE_URL`.

5. Apply the migrations and generate the Prisma client:

```
yarn prisma:deploy
yarn prisma:generate
```

6. Start the development server:

```
yarn dev
```

The API runs on `http://localhost:3000`, or on the port set in `PORT`.
