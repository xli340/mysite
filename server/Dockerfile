# server/Dockerfile
# Use the official Node.js image as the base image
FROM node:16

# set environment
ENV PORT=4000
ENV PASSWORD="password"
ENV DATABASE="yelp"
ENV DATABASE_PORT=5432

# set working directory
WORKDIR /app

# Copy package.json and package-lock.json to working directory
COPY package*.json ./

# install dependencies
RUN npm install

# Copy the server's code to the working directory
COPY . ./

RUN npm run build

# Expose the port the server listens on
EXPOSE 4000

# start the server
CMD [ "npm", "start" ]
