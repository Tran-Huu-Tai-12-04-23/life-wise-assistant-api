# Use an official Node.js runtime as a parent image
FROM node:14

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies using npm
RUN npm install

# Rebuild native modules (specifically bcrypt) to match the Docker environment
RUN npm rebuild bcrypt --build-from-source

# Copy the rest of the application code to the working directory
COPY . .

# Expose the port on which the app runs
EXPOSE 3000

# Command to run the app
CMD ["node", "dist/main"]
