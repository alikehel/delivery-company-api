##############################################
#### FISRT STAGE: BUILD THE APPLICATION ######
##############################################

# Use the official Node.js 20 image as a base
FROM node:20.8.0 AS build

# Environment variables
ARG DATABASE_URL_POSTGRESQL_PROD

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./
COPY yarn.lock ./

# Copy yarnrc file
COPY .yarnrc.yml ./

# Install corepack
RUN npm install -g corepack@0.24.1
RUN corepack enable && corepack prepare yarn@stable --activate && yarn set version 4.0.2

# Install dependencies, including 'puppeteer'
RUN yarn install --check-cache

# Copy the rest of your application's code into the container
COPY . .

# Prisma
# COPY --from=deps /app/node_modules ./node_modules
# COPY src/database/schema.prisma ./prisma/
# RUN npx prisma generate

# Build project
RUN yarn run build

##############################################
#### SECOND STAGE: RUN THE APPLICATION #######
##############################################

# Use the official Node.js 20 image as a base
FROM node:20.8.0

# Set environment variables to optimize the container
ENV NODE_ENV production
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true
ENV PUPPETEER_EXECUTABLE_PATH "/usr/bin/google-chrome-stable"

# Install necessary dependencies for Puppeteer's Chrome
# These dependencies are required to run Puppeteer/Chrome in a headless environment
RUN apt-get update && \
    apt-get install -y wget gnupg2 ca-certificates apt-transport-https software-properties-common && \
    wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - && \
    sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' && \
    apt-get update && \
    apt-get install -y google-chrome-stable --no-install-recommends && \
    rm -rf /var/lib/apt/lists/* && \
    apt-get clean

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./
COPY yarn.lock ./

# Copy yarnrc file
COPY .yarnrc.yml ./

# Copy the rest of your application's code into the container
COPY --from=build /app/build ./build

# Copy static files
COPY static ./static

# Install corepack
RUN npm install -g corepack@0.24.1
RUN corepack enable && corepack prepare yarn@stable --activate && yarn set version 4.0.2

# Install dependencies, including 'puppeteer'
RUN yarn install --check-cache

# Prisma
# COPY prisma ./prisma
COPY --from=build /app/node_modules/.prisma/client ./node_modules/.prisma/client

# Expose the port your app runs on
EXPOSE 3000
EXPOSE 7700

# Specify the command to run your app
CMD ["yarn", "run", "start"]
