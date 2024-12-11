# Base Image
FROM node:lts-bookworm-slim

# Create app directory where everything needed for the app will be stored
WORKDIR /app

# Copy package.json to the app directory
COPY package.json /app

# Install dependencies
RUN npm install

# Copy the rest of the files
COPY index.js /app
COPY webshop.db /app

# Expose the port the app runs on 
EXPOSE 3000

# Command to run the app
CMD ["node","index.js"]