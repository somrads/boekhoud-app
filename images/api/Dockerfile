# Use an official Node.js runtime as the base image
FROM node:latest

# Set the working directory in the container
WORKDIR /usr/app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install --quiet

# Copy the rest of your application code
COPY ./ ./

# Run Knex migrations using the npm script and then start the application
CMD ["sh", "-c", "npm run migrate && npm start"]
