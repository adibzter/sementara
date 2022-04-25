# Use the official lightweight Node.js 13.12.0-alpine image.
# https://hub.docker.com/_/node
FROM node:18.0-alpine

# Create and change to the app directory.
WORKDIR .

# Copy application dependency manifests to the container image.
# A wildcard is used to ensure copying both package.json AND package-lock.json (when available).
# Copying this first prevents re-running npm install on every code change.
COPY package*.json ./

# Install production dependencies.
# If you add a package-lock.json, speed your build by switching to 'npm ci'.
# RUN npm ci --only=production
RUN npm install --only=production

# Copy local code to the container image.
COPY . ./

# Setup client side
WORKDIR ./client
# RUN npm ci --only=production --silent && npm run build
RUN npm install --only=production --silent && npm run build

WORKDIR ..

# Run the web service on container startup.
CMD [ "npm", "start" ]
