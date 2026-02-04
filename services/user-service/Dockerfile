# Use Node 20
FROM node:20-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy package files and install
COPY package*.json ./
RUN npm install

# Copy all user-service source code
COPY . .

# Expose the User Service port
EXPOSE 3002

# Run the app
CMD ["node", "src/app.js"]