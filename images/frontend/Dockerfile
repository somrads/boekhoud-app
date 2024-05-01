# Use an official Node.js runtime as the base image
FROM node:latest

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install --quiet

# Copy the rest of the application to the working directory
COPY . .

# Expose port 3000 for the React app to listen on
EXPOSE 5000

# This line sets the HOST environment variable
ENV HOST=0.0.0.0

# Start the React app
CMD ["npm", "start"]
