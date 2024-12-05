# Use an official Node.js runtime as a parent image
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to install dependencies
COPY package.json package-lock.json ./

# Install all dependencies
RUN npm install

# Copy the rest of the application source code to the container
COPY . .

# Expose port 3000 for the React development server
EXPOSE 3000

# Start the React development server
CMD ["npm", "start"]
