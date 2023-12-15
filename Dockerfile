# Step 1: Define the base image
FROM node:18-alpine

# Step 2: Set the working directory
WORKDIR /job-visualiser/

# Step 3 and 4: Copy package.json and package-lock.json
COPY package*.json ./

# Step 5: Install dependencies
RUN npm install

# Step 6: Copy the rest of the application
COPY public/ /job-visualiser/public/
COPY src/ /job-visualiser/src/
COPY vite.config.ts /job-visualiser/
COPY tsconfig.json /job-visualiser/
COPY tsconfig.node.json /job-visualiser/
COPY index.html /job-visualiser/

# Step 7: Build the application
RUN npm run build

# Step 8: Install serve
RUN npm install -g serve

# Step 9: Expose the port
EXPOSE 3000

# Step 10: Define the command to run the application
CMD [ "serve", "-s", "dist" ]