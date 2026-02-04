# 1. Use Node.js version 20
FROM node:20-alpine

# 2. Set the working directory inside the container
WORKDIR /usr/src/app

# 3. Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# 4. Copy the rest of your source code
COPY . .

# 5. The port your app runs on
EXPOSE 3001

# 6. Command to start the service
CMD ["node", "src/app.js"]