# Use a Node.js base image
FROM node:14

# Set the working directory in the container
WORKDIR /app

# Copy `package.json` and `package-lock.json` from `frontend`
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code from `frontend`
COPY . .

# Expose the frontend port
EXPOSE 3000

# Start the React app
CMD ["npm", "start"]
