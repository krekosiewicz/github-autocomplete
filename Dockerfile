# Stage 1: Build the React application
FROM node:18-alpine as builder

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

# Install dependencies
RUN npm install --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Build the React application
RUN npm run build

# Stage 2: Serve the application using Nginx
FROM nginx:alpine

# Copy the build output to the Nginx HTML directory
COPY --from=builder /usr/src/app/build /usr/share/nginx/html

# Copy custom Nginx configuration if necessary
COPY nginx.conf /etc/nginx/nginx.conf

# Expose the port Nginx will serve on
EXPOSE 80

# Command to run Nginx
CMD ["nginx", "-g", "daemon off;"]
