# Use an official Node.js runtime as a parent image
FROM node:20.14.0-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies using npm
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Expose the port on which the app runs
EXPOSE 3000

RUN npm run build
# Command to run the app
CMD ["node", "dist/main"]
