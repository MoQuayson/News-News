# Use an official Node runtime as a parent image
FROM node:18-alpine

# Set the working directory to /app
WORKDIR /app

# Copy the package.json and package-lock.json files to the container
COPY package.json .

# Install the dependencies
RUN npm install

# Copy the rest of the app's files to the container
COPY . .

# Build the app
#RUN npm run build

# Set the environment variable to production
#ENV NODE_ENV=production

# Expose port 3000
EXPOSE 3000

# Start the app
CMD ["npm", "run", "dev"]